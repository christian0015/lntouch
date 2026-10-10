// app/api/availabilities/[date]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Availability from "@/models/Availability";

// GET /api/availabilities/:date
export async function GET(_, { params }) {
  try {
    await connectToDatabase();
    const doc = await Availability.findOne({ date: params.date }).lean();
    if (!doc) return NextResponse.json({ date: params.date, slots: [] });
    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/availabilities/:date — remplace les slots
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { slots } = await request.json();
    const doc = await Availability.findOneAndUpdate(
      { date: params.date },
      { slots: slots ?? [] },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/availabilities/:date — supprime le jour entier
export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    await Availability.findOneAndDelete({ date: params.date });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
