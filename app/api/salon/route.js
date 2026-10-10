// app/api/salon/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Salon from "@/models/Salon";

// GET /api/salon
export async function GET() {
  try {
    await connectToDatabase();
    const salon = await Salon.findOne().lean();
    if (!salon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(salon);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/salon — upsert du singleton
export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const existing = await Salon.findOne().select("_id").lean();

    let salon;
    if (existing) {
      salon = await Salon.findByIdAndUpdate(existing._id, body, {
        new: true,
        runValidators: true,
      }).lean();
    } else {
      salon = await Salon.create(body);
    }

    return NextResponse.json(salon);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
