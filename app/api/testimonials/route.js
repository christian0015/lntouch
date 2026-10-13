// app/api/testimonials/route.js
import Testimonial from "@/models/Testimonial";
import { collectionRoutes } from "@/lib/crud";
import { testimonialSchema, testimonialUpdate } from "@/lib/validation";

const h = collectionRoutes({
  model: Testimonial, tag: "testimonials", permission: "content:write",
  createSchema: testimonialSchema, updateSchema: testimonialUpdate, keyField: "_id",
  sort: { order: 1, createdAt: -1 }, publicSelect: "-createdAt -updatedAt",
});
export const GET = h.GET;
export const POST = h.POST;
