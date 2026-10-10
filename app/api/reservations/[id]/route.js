// app/api/reservations/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Reservation from "@/models/Reservation";

export async function GET(_, { params }) {
  try {
    await connectToDatabase();
    const r = await Reservation.findById(params.id).lean();
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(r);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — principalement pour changer le status (confirmed / cancelled)
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const r = await Reservation.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(r);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    const deleted = await Reservation.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
