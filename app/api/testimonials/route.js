// app/api/testimonials/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Testimonial from "@/models/Testimonial";

// GET /api/testimonials?active=true&limit=6
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "50"));

    const filter = {};
    if (active !== null) filter.active = active !== "false";

    const testimonials = await Testimonial.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(testimonials);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/testimonials
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
