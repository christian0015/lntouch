// app/api/availabilities/route.js
import { NextResponse } from "next/server";
import { handle, readJson, plain, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import Availability from "@/models/Availability";
import { availabilitySchema, dateISO } from "@/lib/validation";
import { getAvailabilities } from "@/lib/data";
import { invalidate } from "@/lib/cache";

// GET /api/availabilities?from=YYYY-MM-DD&to=YYYY-MM-DD — public, cache court (créneaux libres uniquement)
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  const from = sp.get("from"), to = sp.get("to");
  const data = await getAvailabilities({
    from: from ? dateISO.parse(from) : undefined,
    to: to ? dateISO.parse(to) : undefined,
  });
  return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" } });
});

// POST /api/availabilities { date, slots } — upsert d'un jour (admin / réception)
export const POST = handle(async (req) => {
  await authorize(req, "availability:manage");
  const { date, slots } = await readJson(req, availabilitySchema);
  await connectToDatabase();
  const doc = await Availability.findOneAndUpdate({ date }, { date, slots }, { upsert: true, new: true, runValidators: true }).lean();
  invalidate("availabilities");
  return NextResponse.json(plain(doc), { status: 201, headers: NO_STORE });
});
