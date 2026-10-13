// app/api/upload/route.js
// Upload d'images vers Cloudinary (POST multipart: file, scope, slug?) — réservé à l'équipe.
import { NextResponse } from "next/server";
import { ApiError, handle, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { can } from "@/lib/auth/permissions";
import { limitOrThrow } from "@/lib/rateLimit";
import cloudinary, { deleteImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const SCOPES = ["hairstyles", "testimonials", "founder"];

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
}

export const POST = handle(async (req) => {
  const me = await authorize(req);
  if (!can(me.role, "content:write") && !can(me.role, "settings:write")) throw new ApiError(403, "Accès refusé");
  await limitOrThrow(`upload:${me.id}`, 60, 3600);

  const form = await req.formData();
  const file = form.get("file");
  const scope = String(form.get("scope") || "");
  const slug = String(form.get("slug") || "").toLowerCase();
  if (!(file instanceof File)) throw new ApiError(400, "Fichier manquant");
  if (!SCOPES.includes(scope)) throw new ApiError(400, "Dossier invalide");
  if (slug && !/^[a-z0-9-]{1,80}$/.test(slug)) throw new ApiError(400, "Slug invalide");
  if (file.size > MAX_BYTES) throw new ApiError(413, "Image trop lourde (5 Mo max)");

  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buf); // on ne fait pas confiance au type déclaré par le navigateur
  if (!mime) throw new ApiError(400, "Format non supporté (JPG, PNG ou WebP)");

  const result = await cloudinary.uploader.upload(`data:${mime};base64,${buf.toString("base64")}`, {
    folder: `lntouch/${scope}${slug ? `/${slug}` : ""}`,
    public_id: `img-${Date.now()}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto:good", fetch_format: "auto" }],
  });
  return NextResponse.json({ url: result.secure_url, publicId: result.public_id }, { status: 201, headers: NO_STORE });
});

// DELETE ?publicId=… — nettoie une image téléversée puis abandonnée (limité au dossier lntouch/)
export const DELETE = handle(async (req) => {
  const me = await authorize(req);
  if (!can(me.role, "content:write") && !can(me.role, "settings:write")) throw new ApiError(403, "Accès refusé");
  const publicId = new URL(req.url).searchParams.get("publicId") || "";
  if (!/^lntouch\/[a-zA-Z0-9/_-]+$/.test(publicId)) throw new ApiError(400, "publicId invalide");
  await deleteImage(publicId);
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
