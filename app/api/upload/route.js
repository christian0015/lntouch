// app/api/upload/route.js
// Suppression d'un média Cloudinary abandonné (l'envoi se fait en direct : voir /api/upload/sign).
import { NextResponse } from "next/server";
import { ApiError, handle, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { can } from "@/lib/auth/permissions";
import cloudinary from "@/lib/cloudinary";

// DELETE ?publicId=lntouch/…&type=image|video  (limité au dossier lntouch/)
export const DELETE = handle(async (req) => {
  const me = await authorize(req);
  if (!can(me.role, "content:write") && !can(me.role, "settings:write")) throw new ApiError(403, "Accès refusé");
  const sp = new URL(req.url).searchParams;
  const publicId = sp.get("publicId") || "";
  if (!/^lntouch\/[a-zA-Z0-9/_-]+$/.test(publicId)) throw new ApiError(400, "publicId invalide");
  await cloudinary.uploader.destroy(publicId, { resource_type: sp.get("type") === "video" ? "video" : "image" });
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
