// app/api/upload/sign/route.js
// Signature d'un envoi DIRECT navigateur → Cloudinary. Le fichier ne transite pas par Vercel
// (limite ~4,5 Mo des fonctions) : indispensable pour photos de téléphone, GIF et vidéos.
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { ApiError, handle, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { can } from "@/lib/auth/permissions";
import { limitOrThrow } from "@/lib/rateLimit";
import cloudinary from "@/lib/cloudinary";

const schema = z.object({
  scope: z.enum(["hairstyles", "testimonials", "founder", "social"]),
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/).optional(),
  kind: z.enum(["image", "video"]),
}).strict();

const FORMATS = { image: "jpg,jpeg,png,webp,gif", video: "mp4,webm" };

export const POST = handle(async (req) => {
  const me = await authorize(req);
  if (!can(me.role, "content:write") && !can(me.role, "settings:write")) throw new ApiError(403, "Accès refusé");
  await limitOrThrow(`upload:${me.id}`, 120, 3600);
  const { scope, slug, kind } = await readJson(req, schema);

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    throw new ApiError(500, "Cloudinary n'est pas configuré");
  }
  const folder = `lntouch/${scope}${slug ? `/${slug}` : ""}`;
  const publicId = `${kind}-${Date.now()}-${randomBytes(3).toString("hex")}`;
  const timestamp = Math.round(Date.now() / 1000);
  const allowed_formats = FORMATS[kind];

  // Seuls ces paramètres sont signés : le navigateur ne peut ni changer de dossier ni de format.
  const signature = cloudinary.utils.api_sign_request({ allowed_formats, folder, public_id: publicId, timestamp }, apiSecret);

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp, folder, publicId, allowedFormats: allowed_formats, signature, resourceType: kind,
  }, { headers: NO_STORE });
});
