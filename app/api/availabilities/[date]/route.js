// app/api/availabilities/[date]/route.js
import { NextResponse } from "next/server";
import { ApiError, handle, readJson, plain, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import Availability from "@/models/Availability";
import { availabilitySchema, dateISO } from "@/lib/validation";
import { invalidate } from "@/lib/cache";

export const GET = handle(async (_req, { params }) => {
  const date = dateISO.parse((await params).date);
  await connectToDatabase();
  const doc = await Availability.findOne({ date }).lean();
  return NextResponse.json(doc ? plain(doc) : { date, slots: [] }, { headers: { "Cache-Control": "public, s-maxage=15" } });
});

export const PUT = handle(async (req, { params }) => {
  await authorize(req, "availability:manage");
  const date = dateISO.parse((await params).date);
  const { slots } = await readJson(req, availabilitySchema.omit({ date: true }));
  await connectToDatabase();
  const doc = await Availability.findOneAndUpdate({ date }, { date, slots }, { upsert: true, new: true, runValidators: true }).lean();
  invalidate("availabilities");
  return NextResponse.json(plain(doc), { headers: NO_STORE });
});

export const DELETE = handle(async (req, { params }) => {
  await authorize(req, "availability:manage");
  const date = dateISO.parse((await params).date);
  await connectToDatabase();
  const r = await Availability.findOneAndDelete({ date });
  if (!r) throw new ApiError(404, "Introuvable");
  invalidate("availabilities");
  return NextResponse.json({ deleted: true }, { headers: NO_STORE });
});
