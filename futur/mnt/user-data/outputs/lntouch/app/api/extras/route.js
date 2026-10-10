// app/api/extras/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Extra from "@/models/Extra";

// GET /api/extras?active=true
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    const filter = {};
    if (active !== null) filter.active = active !== "false";

    const extras = await Extra.find(filter).sort({ order: 1 }).lean();
    return NextResponse.json(extras);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/extras
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const extra = await Extra.create(body);
    return NextResponse.json(extra, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
