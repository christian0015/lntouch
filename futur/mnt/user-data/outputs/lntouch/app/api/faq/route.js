// app/api/faq/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Faq from "@/models/Faq";

// GET /api/faq?active=true&category=réservation
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const active   = searchParams.get("active");
    const category = searchParams.get("category");

    const filter = {};
    if (active !== null)   filter.active   = active !== "false";
    if (category)          filter.category = category;

    const items = await Faq.find(filter).sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/faq
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const item = await Faq.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
