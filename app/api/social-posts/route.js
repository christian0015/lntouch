// app/api/social-posts/route.js
import SocialPost from "@/models/SocialPost";
import { collectionRoutes } from "@/lib/crud";
import { socialPostSchema, socialPostUpdate } from "@/lib/validation";

const h = collectionRoutes({
  model: SocialPost, tag: "social", permission: "content:write",
  createSchema: socialPostSchema, updateSchema: socialPostUpdate, keyField: "_id",
  publicSelect: "-thumbnailPublicId -createdAt -updatedAt",
});
export const GET = h.GET;
export const POST = h.POST;
