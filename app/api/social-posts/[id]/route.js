// app/api/social-posts/[id]/route.js
import SocialPost from "@/models/SocialPost";
import cloudinary from "@/lib/cloudinary";
import { itemRoutes } from "@/lib/crud";
import { socialPostSchema, socialPostUpdate } from "@/lib/validation";

// Supprime l'ancien média Cloudinary (les vidéos exigent resource_type "video")
const destroy = (publicId, type) =>
  publicId ? cloudinary.uploader.destroy(publicId, { resource_type: type === "video" ? "video" : "image" }) : null;

const h = itemRoutes({
  model: SocialPost, tag: "social", permission: "content:write",
  createSchema: socialPostSchema, updateSchema: socialPostUpdate, keyField: "_id",
  publicSelect: "-thumbnailPublicId -createdAt -updatedAt",
  afterUpdate: async (before, after) => {
    if (before.thumbnailPublicId && before.thumbnailPublicId !== after.thumbnailPublicId) {
      await destroy(before.thumbnailPublicId, before.thumbnailType);
    }
  },
  afterDelete: async (doc) => { await destroy(doc.thumbnailPublicId, doc.thumbnailType); },
});
const wrap = (fn) => async (req, { params }) => fn(req, { params: params.then(({ id }) => ({ key: id })) });
export const GET = wrap(h.GET);
export const PUT = wrap(h.PUT);
export const DELETE = wrap(h.DELETE);
