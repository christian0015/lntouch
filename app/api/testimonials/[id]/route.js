// app/api/testimonials/[id]/route.js
import Testimonial from "@/models/Testimonial";
import { itemRoutes } from "@/lib/crud";
import { testimonialSchema, testimonialUpdate } from "@/lib/validation";

const h = itemRoutes({
  model: Testimonial, tag: "testimonials", permission: "content:write",
  createSchema: testimonialSchema, updateSchema: testimonialUpdate, keyField: "_id",
  publicSelect: "-createdAt -updatedAt",
});
const wrap = (fn) => async (req, { params }) => fn(req, { params: params.then(({ id }) => ({ key: id })) });
export const GET = wrap(h.GET);
export const PUT = wrap(h.PUT);
export const DELETE = wrap(h.DELETE);
