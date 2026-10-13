// app/api/faq/route.js
import Faq from "@/models/Faq";
import { collectionRoutes } from "@/lib/crud";
import { faqSchema, faqUpdate } from "@/lib/validation";

const h = collectionRoutes({
  model: Faq, tag: "faq", permission: "content:write",
  createSchema: faqSchema, updateSchema: faqUpdate, keyField: "_id", sort: { order: 1 },
  publicSelect: "-createdAt -updatedAt",
});
export const GET = h.GET;
export const POST = h.POST;
