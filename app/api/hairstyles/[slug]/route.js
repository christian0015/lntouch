// app/api/hairstyles/[slug]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Hairstyle from "@/models/Hairstyle";

// GET /api/hairstyles/:slug
export async function GET(_, { params }) {
  try {
    await connectToDatabase();
    const hairstyle = await Hairstyle.findOne({ slug: params.slug }).lean();
    if (!hairstyle) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hairstyle);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/hairstyles/:slug
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const hairstyle = await Hairstyle.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    ).lean();
    if (!hairstyle) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hairstyle);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/hairstyles/:slug
export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    const deleted = await Hairstyle.findOneAndDelete({ slug: params.slug });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
