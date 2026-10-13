// lib/adminData.ts
// Lectures ADMIN (non cachées, incluent les éléments inactifs). À n'appeler qu'après requirePage().
import "server-only";
import { connectToDatabase } from "@/lib/mongoose";
import Hairstyle from "@/models/Hairstyle";
import Extra from "@/models/Extra";
import Faq from "@/models/Faq";
import Testimonial from "@/models/Testimonial";
import Salon from "@/models/Salon";
import Founder from "@/models/Founder";
import Availability from "@/models/Availability";
import Reservation from "@/models/Reservation";
import User from "@/models/User";
import Session from "@/models/Session";
import { plain } from "@/lib/api";

export async function adminList(kind: "hairstyles" | "extras" | "faq" | "testimonials") {
  await connectToDatabase();
  const model: any = { hairstyles: Hairstyle, extras: Extra, faq: Faq, testimonials: Testimonial }[kind];
  return plain<any[]>(await model.find().sort({ order: 1, createdAt: 1 }).lean());
}

export async function adminSingleton(kind: "salon" | "founder") {
  await connectToDatabase();
  const doc = await (kind === "salon" ? Salon : Founder).findOne().lean();
  return doc ? plain<any>(doc) : null;
}

export async function adminAvailabilities(from: string) {
  await connectToDatabase();
  const docs = await Availability.find({ date: { $gte: from } }).sort({ date: 1 }).limit(400).lean();
  return plain<{ date: string; slots: string[] }[]>(docs);
}

export async function adminReservations(opts: { status?: string; page?: number; limit?: number }) {
  await connectToDatabase();
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, opts.limit ?? 25);
  const filter: Record<string, unknown> = {};
  if (opts.status && ["pending", "confirmed", "cancelled"].includes(opts.status)) filter.status = opts.status;
  const [items, total, counts] = await Promise.all([
    Reservation.find(filter).sort({ date: -1, time: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Reservation.countDocuments(filter),
    Reservation.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  return {
    items: plain<any[]>(items), total, page, pages: Math.max(1, Math.ceil(total / limit)),
    counts: Object.fromEntries(counts.map((c: any) => [c._id, c.n])) as Record<string, number>,
  };
}

export async function adminUsers() {
  await connectToDatabase();
  return plain<any[]>(await User.find().sort({ createdAt: 1 }).lean());
}

export async function adminSessions(userId: string) {
  await connectToDatabase();
  return plain<any[]>(await Session.find({ userId, expiresAt: { $gt: new Date() } }).sort({ lastSeenAt: -1 }).select("-tokenHash").lean());
}
