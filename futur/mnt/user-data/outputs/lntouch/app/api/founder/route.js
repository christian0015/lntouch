// app/api/founder/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Founder from "@/models/Founder";

// GET /api/founder — retourne le premier (et unique) document
export async function GET() {
  try {
    await connectToDatabase();
    const founder = await Founder.findOne().lean();
    if (!founder) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(founder);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/founder — upsert du singleton
export async function PUT(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Récupère l'_id existant pour cibler le bon document
    const existing = await Founder.findOne().select("_id").lean();

    let founder;
    if (existing) {
      founder = await Founder.findByIdAndUpdate(existing._id, body, {
        new: true,
        runValidators: true,
      }).lean();
    } else {
      founder = await Founder.create(body);
    }

    return NextResponse.json(founder);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
