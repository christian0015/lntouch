// app/api/faq/[id]/route.js
import Faq from "@/models/Faq";
import { itemRoutes } from "@/lib/crud";
import { faqSchema, faqUpdate } from "@/lib/validation";

const h = itemRoutes({
  model: Faq, tag: "faq", permission: "content:write",
  createSchema: faqSchema, updateSchema: faqUpdate, keyField: "_id",
  publicSelect: "-createdAt -updatedAt",
});
const wrap = (fn) => async (req, { params }) => fn(req, { params: params.then(({ id }) => ({ key: id })) });
export const GET = wrap(h.GET);
export const PUT = wrap(h.PUT);
export const DELETE = wrap(h.DELETE);
