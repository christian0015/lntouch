// app/api/hairstyles/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Hairstyle from "@/models/Hairstyle";

// GET /api/hairstyles?page=1&limit=12&active=true
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const active = searchParams.get("active");

    const filter = {};
    if (active !== null) filter.active = active !== "false";

    const [hairstyles, total] = await Promise.all([
      Hairstyle.find(filter)
        .sort({ order: 1, createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Hairstyle.countDocuments(filter),
    ]);

    return NextResponse.json({
      hairstyles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/hairstyles
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const hairstyle = await Hairstyle.create(body);
    return NextResponse.json(hairstyle, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
