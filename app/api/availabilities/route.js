// app/api/availabilities/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Availability from "@/models/Availability";

// GET /api/availabilities?from=2026-05-01&to=2026-05-31
// Retourne un objet { "2026-05-01": ["10:00","14:00"], ... }
// identique à AVAILABILITIES dans data.ts — aucun composant existant à modifier
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to   = searchParams.get("to");

    const filter = {};
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to)   filter.date.$lte = to;
    }

    const docs = await Availability.find(filter).sort({ date: 1 }).lean();

    // Retourne le même format que AVAILABILITIES (Record<string, string[]>)
    const record = Object.fromEntries(docs.map((d) => [d.date, d.slots]));
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/availabilities
// Body: { date: "2026-05-01", slots: ["09:00", "10:00"] }
// Upsert — crée ou remplace les slots d'un jour
export async function POST(request) {
  try {
    await connectToDatabase();
    const { date, slots } = await request.json();
    if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

    const doc = await Availability.findOneAndUpdate(
      { date },
      { date, slots: slots ?? [] },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
