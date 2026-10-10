// app/api/reservations/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Reservation from "@/models/Reservation";

// GET /api/reservations?status=pending&date=2026-05-01&page=1&limit=20
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date   = searchParams.get("date");
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit  = Math.min(100, parseInt(searchParams.get("limit") || "20"));

    const filter = {};
    if (status) filter.status = status;
    if (date)   filter.date   = date;

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Reservation.countDocuments(filter),
    ]);

    return NextResponse.json({
      reservations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/reservations — appelé par Process.tsx à la soumission
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validation minimale
    if (!body.hairstyleSlug || !body.date || !body.time) {
      return NextResponse.json(
        { error: "hairstyleSlug, date et time sont requis" },
        { status: 400 }
      );
    }
    if (!body.email && !body.phone) {
      return NextResponse.json(
        { error: "email ou phone requis" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.create(body);
    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
