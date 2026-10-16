// app/api/reservations/route.js
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { ApiError, assertSameOrigin, clientIp, handle, readJson, plain, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { limitOrThrow } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/mongoose";
import Reservation from "@/models/Reservation";
import Hairstyle from "@/models/Hairstyle";
import Extra from "@/models/Extra";
import Availability from "@/models/Availability";
import Salon from "@/models/Salon";
import { reservationCreate } from "@/lib/validation";
import { nowHHMM, todayISO } from "@/lib/dates";
import { invalidate } from "@/lib/cache";
import { sendMail } from "@/lib/mail/send";
import { siteUrl } from "@/lib/mail/transport";
import { clientReceived, salonNewReservation } from "@/lib/mail/templates";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O/1/I

function makeRef() {
  const b = randomBytes(6);
  return "LN-" + Array.from(b, (x) => REF_ALPHABET[x % REF_ALPHABET.length]).join("");
}

// GET /api/reservations?status=pending&date=YYYY-MM-DD&page=1&limit=20 — admin / réception uniquement
export const GET = handle(async (req) => {
  await authorize(req, "reservations:manage");
  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const limit = Math.min(100, parseInt(sp.get("limit") || "20", 10) || 20);
  const filter = {};
  const status = sp.get("status");
  if (status && ["pending", "confirmed", "cancelled"].includes(status)) filter.status = status;
  const date = sp.get("date");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) filter.date = date;

  await connectToDatabase();
  const [reservations, total] = await Promise.all([
    Reservation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Reservation.countDocuments(filter),
  ]);
  return NextResponse.json(
    { reservations: plain(reservations), pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    { headers: NO_STORE }
  );
});

// POST /api/reservations — public (formulaire Process) : limité, validé, créneau réservé de façon atomique
export const POST = handle(async (req) => {
  assertSameOrigin(req);
  const ip = clientIp(req);
  await limitOrThrow(`resa:ip:${ip}`, 10, 3600, "Trop de demandes depuis cette connexion. Réessayez plus tard.");

  const input = await readJson(req, reservationCreate);
  if (!input.email && !input.phone) throw new ApiError(400, "Un email ou un téléphone est requis");
  const contact = (input.email || input.phone).toLowerCase();
  await limitOrThrow(`resa:contact:${contact}`, 5, 86400, "Trop de demandes pour ce contact aujourd'hui.");

  const today = todayISO();
  if (input.date < today || (input.date === today && input.time <= nowHHMM())) {
    throw new ApiError(400, "Ce créneau est déjà passé");
  }

  await connectToDatabase();
  const style = await Hairstyle.findOne({ slug: input.hairstyleSlug, active: true }).select("name variant").lean();
  if (!style) throw new ApiError(400, "Coiffure introuvable");

  const wanted = input.extras ?? [];
  const extras = wanted.length
    ? await Extra.find({ id: { $in: wanted }, active: true }).select("id label").lean()
    : [];

  // Réservation atomique du créneau : si deux personnes cliquent en même temps, une seule gagne.
  const claimed = await Availability.findOneAndUpdate(
    { date: input.date, slots: input.time },
    { $pull: { slots: input.time } }
  ).lean();
  if (!claimed) throw new ApiError(409, "Ce créneau vient d'être pris. Choisissez-en un autre.");

  let reservation;
  try {
    const viewToken = randomBytes(18).toString("base64url");
    for (let attempt = 0; ; attempt++) {
      try {
        reservation = await Reservation.create({
          ref: makeRef(), viewToken,
          hairstyleSlug: input.hairstyleSlug,
          extras: extras.map((e) => e.id),
          customNote: input.customNote || undefined,
          clientName: input.clientName, gender: input.gender,
          date: input.date, time: input.time,
          email: input.email, phone: input.phone,
        });
        break;
      } catch (e) {
        if (e?.code === 11000 && attempt < 3) continue; // collision de ref (rarissime)
        throw e;
      }
    }
  } catch (e) {
    await Availability.updateOne({ date: input.date }, { $addToSet: { slots: input.time } }); // on libère le créneau
    throw e;
  }
  invalidate("availabilities");

  // Emails (n'échouent jamais la réservation)
  const salon = await Salon.findOne().select("name email quartier commune").lean();
  const mailData = {
    ref: reservation.ref,
    styleName: `${style.name} ${style.variant}`,
    date: input.date, time: input.time,
    extras: extras.map((e) => e.label),
    customNote: input.customNote, email: input.email, phone: input.phone,
    clientName: input.clientName, gender: input.gender,
    trackUrl: `${siteUrl()}/suivi/${reservation.viewToken}`,
    salonAddress: salon ? [salon.quartier, salon.commune].filter(Boolean).join(", ") : undefined,
  };
  const notify = (process.env.RESERVATION_NOTIFY_EMAIL || salon?.email || "").split(",").map((s) => s.trim()).filter(Boolean);
  const results = await Promise.allSettled([
    input.email ? sendMail(input.email, clientReceived(mailData)) : Promise.resolve(false),
    notify.length ? sendMail(notify, salonNewReservation(mailData, `${siteUrl()}/admin/reservations`)) : Promise.resolve(false),
  ]);
  const clientMailSent = results[0].status === "fulfilled" && results[0].value === true;

  return NextResponse.json({ ok: true, ref: reservation.ref, emailSent: clientMailSent }, { status: 201, headers: NO_STORE });
});
