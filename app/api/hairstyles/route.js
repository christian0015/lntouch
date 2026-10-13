// app/api/hairstyles/route.js
import { NextResponse } from "next/server";
import Hairstyle from "@/models/Hairstyle";
import { collectionRoutes } from "@/lib/crud";
import { CDN_CACHE, NO_STORE, handle, plain } from "@/lib/api";
import { can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongoose";
import { hairstyleSchema, hairstyleUpdate } from "@/lib/validation";

const h = collectionRoutes({
  model: Hairstyle, tag: "hairstyles", permission: "content:write",
  createSchema: hairstyleSchema, updateSchema: hairstyleUpdate, keyField: "slug",
});

// GET /api/hairstyles?page=1&limit=12  → { hairstyles, pagination }  (public : actives seulement ; ?all=1 réservé à l'équipe)
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(sp.get("limit") || "12", 10) || 12));
  const user = sp.get("all") === "1" ? await getCurrentUser() : null;
  const all = !!user && can(user.role, "content:write");
  const filter = all ? {} : { active: true };

  await connectToDatabase();
  let q = Hairstyle.find(filter).sort({ order: 1, createdAt: 1 }).skip((page - 1) * limit).limit(limit);
  if (!all) q = q.select("-imagePublicIds -createdAt -updatedAt");
  const [docs, total] = await Promise.all([q.lean(), Hairstyle.countDocuments(filter)]);

  return NextResponse.json(
    { hairstyles: plain(docs), pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } },
    { headers: all ? NO_STORE : CDN_CACHE }
  );
});

// POST protégé (content:write)
export const POST = h.POST;
