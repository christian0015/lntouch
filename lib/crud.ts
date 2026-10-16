// lib/crud.ts
// Fabrique de Route Handlers CRUD : lecture publique (éléments actifs), écriture protégée,
// validation Zod stricte, invalidation du cache. Évite de dupliquer 8 fois la même logique.
import "server-only";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import type { ZodType } from "zod";
import { ApiError, CDN_CACHE, NO_STORE, handle, plain, readJson } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { can, type Permission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongoose";
import { invalidate, type Tag } from "@/lib/cache";
import { limitOrThrow } from "@/lib/rateLimit";

interface Config {
  model: any;
  tag: Tag;
  permission: Permission;
  createSchema: ZodType<any>;
  updateSchema: ZodType<any>;
  keyField: string;                 // "slug" | "id" | "_id"
  sort?: Record<string, 1 | -1>;
  publicSelect?: string;            // champs masqués au public, ex: "-imagePublicIds"
  afterUpdate?: (before: any, after: any) => Promise<void>;
  afterDelete?: (doc: any) => Promise<void>;
  /** Champ publicId unique (string) à nettoyer quand il change — pour avatar, thumbnailPublicId… */
  imagePublicIdField?: string;
  imageTypeField?: string;
  /** Champ publicId unique (string) à nettoyer quand il change — pour avatar, thumbnailPublicId, etc. */
  imagePublicIdField?: string;
  imageTypeField?: string;  // si le type (image/video) est stocké séparément
}

async function wantsAll(req: Request, permission: Permission) {
  if (new URL(req.url).searchParams.get("all") !== "1") return false;
  const user = await getCurrentUser();
  return !!user && can(user.role, permission);
}

export function collectionRoutes(c: Config) {
  const GET = handle(async (req) => {
    await connectToDatabase();
    const all = await wantsAll(req, c.permission);
    let q = c.model.find(all ? {} : { active: true }).sort(c.sort ?? { order: 1, createdAt: 1 });
    if (!all && c.publicSelect) q = q.select(c.publicSelect);
    const docs = await q.lean();
    return NextResponse.json(plain(docs), { headers: all ? NO_STORE : CDN_CACHE });
  });

  const POST = handle(async (req) => {
    const user = await authorize(req, c.permission);
    await limitOrThrow(`write:${user.id}`, 120, 60);
    const data = await readJson(req, c.createSchema);
    await connectToDatabase();
    const doc = await c.model.create(data);
    invalidate(c.tag);
    return NextResponse.json(plain(doc.toObject()), { status: 201, headers: NO_STORE });
  });

  return { GET, POST };
}

function filterFor(c: Config, key: string) {
  if (c.keyField === "_id") {
    if (!mongoose.isValidObjectId(key)) throw new ApiError(404, "Introuvable");
    return { _id: key };
  }
  return { [c.keyField]: key };
}

export function itemRoutes(c: Config) {
  const GET = handle(async (req, ctx) => {
    const { key } = await ctx.params;
    await connectToDatabase();
    const all = await wantsAll(req, c.permission);
    const filter: any = { ...filterFor(c, key), ...(all ? {} : { active: true }) };
    let q = c.model.findOne(filter);
    if (!all && c.publicSelect) q = q.select(c.publicSelect);
    const doc = await q.lean();
    if (!doc) throw new ApiError(404, "Introuvable");
    return NextResponse.json(plain(doc), { headers: all ? NO_STORE : CDN_CACHE });
  });

  const PUT = handle(async (req, ctx) => {
    const user = await authorize(req, c.permission);
    await limitOrThrow(`write:${user.id}`, 120, 60);
    const { key } = await ctx.params;
    const data = await readJson(req, c.updateSchema);
    await connectToDatabase();
    const filter = filterFor(c, key);
    const needsBefore = !!(c.afterUpdate || c.imagePublicIdField);
    const before: any = needsBefore ? await c.model.findOne(filter).lean() : null;
    const doc = await c.model.findOneAndUpdate(filter, { $set: data }, { new: true, runValidators: true }).lean();
    if (!doc) throw new ApiError(404, "Introuvable");
    // Nettoyage d'un champ publicId unique (avatar, couverture…) quand il a changé
    if (c.imagePublicIdField && before) {
      const oldId = before[c.imagePublicIdField];
      const newId = (doc as any)[c.imagePublicIdField];
      if (oldId && oldId !== newId) {
        const { deleteImage } = await import("@/lib/cloudinary");
        const type = c.imageTypeField ? before[c.imageTypeField] : "image";
        await deleteImage(oldId, type).catch((e: any) => console.error("[crud] deleteImage", e));
      }
    }
    if (c.afterUpdate && before) await c.afterUpdate(before, doc).catch((e) => console.error("[afterUpdate]", e));
    invalidate(c.tag);
    return NextResponse.json(plain(doc), { headers: NO_STORE });
  });

  const DELETE = handle(async (req, ctx) => {
    const user = await authorize(req, c.permission);
    await limitOrThrow(`write:${user.id}`, 120, 60);
    const { key } = await ctx.params;
    await connectToDatabase();
    const doc = await c.model.findOneAndDelete(filterFor(c, key)).lean();
    if (!doc) throw new ApiError(404, "Introuvable");
    if (c.afterDelete) await c.afterDelete(doc).catch((e) => console.error("[afterDelete]", e));
    invalidate(c.tag);
    return NextResponse.json({ deleted: true }, { headers: NO_STORE });
  });

  return { GET, PUT, DELETE };
}

/** Singleton (salon, fondatrice) : GET public, PUT protégé (upsert). */
export function singletonRoutes(opts: {
  model: any; tag: Tag; permission: Permission; schema: ZodType<any>;
  imagePublicIdField?: string; imageTypeField?: string;
}) {
  const GET = handle(async () => {
    await connectToDatabase();
    const doc = await opts.model.findOne().select("-createdAt -updatedAt").lean();
    if (!doc) throw new ApiError(404, "Introuvable");
    return NextResponse.json(plain(doc), { headers: CDN_CACHE });
  });

  const PUT = handle(async (req) => {
    const user = await authorize(req, opts.permission);
    await limitOrThrow(`write:${user.id}`, 120, 60);
    const data = await readJson(req, opts.schema);
    await connectToDatabase();
    const existing = await opts.model.findOne().select("_id").lean();
    // Nettoyage de l'ancienne image si le publicId a changé
    if (opts.imagePublicIdField && existing) {
      const prev: any = await opts.model.findById(existing._id).lean();
      const oldId = prev?.[opts.imagePublicIdField];
      const newId = data[opts.imagePublicIdField];
      if (oldId && newId !== undefined && oldId !== newId) {
        const { deleteImage } = await import("@/lib/cloudinary");
        const type = opts.imageTypeField ? prev?.[opts.imageTypeField] : "image";
        await deleteImage(oldId, type).catch((e: any) => console.error("[singleton] deleteImage", e));
      }
    }
    const doc = existing
      ? await opts.model.findByIdAndUpdate(existing._id, { $set: data }, { new: true, runValidators: true }).lean()
      : (await opts.model.create(data)).toObject();
    invalidate(opts.tag);
    return NextResponse.json(plain(doc), { headers: NO_STORE });
  });

  return { GET, PUT };
}
