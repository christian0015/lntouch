// app/api/hairstyles/[slug]/route.js
import Hairstyle from "@/models/Hairstyle";
import { itemRoutes } from "@/lib/crud";
import { hairstyleSchema, hairstyleUpdate } from "@/lib/validation";
import { deleteImage } from "@/lib/cloudinary";

const h = itemRoutes({
  model: Hairstyle, tag: "hairstyles", permission: "content:write",
  createSchema: hairstyleSchema, updateSchema: hairstyleUpdate, keyField: "slug",
  publicSelect: "-imagePublicIds -createdAt -updatedAt",
  // Nettoyage Cloudinary : images retirées / coiffure supprimée.
  afterUpdate: async (before, after) => {
    const removed = (before.imagePublicIds || []).filter((id) => !(after.imagePublicIds || []).includes(id));
    await Promise.all(removed.map(deleteImage));
  },
  afterDelete: async (doc) => { await Promise.all((doc.imagePublicIds || []).map(deleteImage)); },
});

// La fabrique lit le paramètre sous le nom "key" : on mappe [slug] → key.
const wrap = (fn) => async (req, { params }) => fn(req, { params: params.then(({ slug }) => ({ key: slug })) });
export const GET = wrap(h.GET);
export const PUT = wrap(h.PUT);
export const DELETE = wrap(h.DELETE);
