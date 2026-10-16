// app/api/reservations/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ApiError, handle, readJson, plain, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import Reservation from "@/models/Reservation";
import Hairstyle from "@/models/Hairstyle";
import Extra from "@/models/Extra";
import Availability from "@/models/Availability";
import { reservationUpdate } from "@/lib/validation";
import { todayISO } from "@/lib/dates";
import { invalidate } from "@/lib/cache";
import { sendMail } from "@/lib/mail/send";
import { siteUrl } from "@/lib/mail/transport";
import { clientStatus } from "@/lib/mail/templates";

async function load(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, "Introuvable");
  await connectToDatabase();
  const r = await Reservation.findById(id).select("+viewToken");
  if (!r) throw new ApiError(404, "Introuvable");
  return r;
}

export const GET = handle(async (req, { params }) => {
  await authorize(req, "reservations:manage");
  const r = await load((await params).id);
  const o = r.toObject(); delete o.viewToken;
  return NextResponse.json(plain(o), { headers: NO_STORE });
});

// PUT — statut (pending/confirmed/cancelled) et note interne. Gère le créneau et prévient le client par email.
export const PUT = handle(async (req, { params }) => {
  await authorize(req, "reservations:manage");
  const r = await load((await params).id);
  const patch = await readJson(req, reservationUpdate);
  const prev = r.status;

  if (patch.status && patch.status !== prev) {
    if (patch.status === "cancelled") {
      if (r.date >= todayISO()) {
        await Availability.updateOne({ date: r.date }, { $addToSet: { slots: r.time } }, { upsert: true });
        invalidate("availabilities");
      }
    } else if (prev === "cancelled") {
      // Réactivation : le créneau doit encore être libre.
      const claimed = await Availability.findOneAndUpdate({ date: r.date, slots: r.time }, { $pull: { slots: r.time } });
      if (!claimed && r.date >= todayISO()) {
        // Créneau déjà repris ou fermé : on laisse passer seulement s'il n'existe aucune autre résa active dessus.
        const clash = await Reservation.exists({ _id: { $ne: r._id }, date: r.date, time: r.time, status: { $ne: "cancelled" } });
        if (clash) throw new ApiError(409, "Ce créneau est déjà occupé par une autre réservation.");
      }
      invalidate("availabilities");
    }
    r.status = patch.status;
  }
  if (patch.adminNote !== undefined) r.adminNote = patch.adminNote;
  await r.save();

  if (patch.status && patch.status !== prev && r.email && ["confirmed", "cancelled"].includes(patch.status)) {
    const [style, extras] = await Promise.all([
      Hairstyle.findOne({ slug: r.hairstyleSlug }).select("name variant").lean(),
      Extra.find({ id: { $in: r.extras } }).select("label").lean(),
    ]);
    await sendMail(r.email, clientStatus({
      ref: r.ref, styleName: style ? `${style.name} ${style.variant}` : r.hairstyleSlug,
      date: r.date, time: r.time, extras: extras.map((e) => e.label), customNote: r.customNote,
      clientName: r.clientName, gender: r.gender,
      trackUrl: `${siteUrl()}/suivi/${r.viewToken}`,
    }, patch.status));
  }

  const o = r.toObject(); delete o.viewToken;
  return NextResponse.json(plain(o), { headers: NO_STORE });
});

export const DELETE = handle(async (req, { params }) => {
  await authorize(req, "reservations:manage");
  const r = await load((await params).id);
  if (r.status !== "cancelled" && r.date >= todayISO()) {
    await Availability.updateOne({ date: r.date }, { $addToSet: { slots: r.time } }, { upsert: true });
    invalidate("availabilities");
  }
  await r.deleteOne();
  return NextResponse.json({ deleted: true }, { headers: NO_STORE });
});
