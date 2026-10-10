// app/api/extras/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Extra from "@/models/Extra";

export async function GET(_, { params }) {
  try {
    await connectToDatabase();
    const extra = await Extra.findOne({ id: params.id }).lean();
    if (!extra) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(extra);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const extra = await Extra.findOneAndUpdate(
      { id: params.id },
      body,
      { new: true, runValidators: true }
    ).lean();
    if (!extra) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(extra);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectToDatabase();
    const deleted = await Extra.findOneAndDelete({ id: params.id });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
