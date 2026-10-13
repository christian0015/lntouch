// app/api/extras/route.js
import Extra from "@/models/Extra";
import { collectionRoutes } from "@/lib/crud";
import { extraSchema, extraUpdate } from "@/lib/validation";

const h = collectionRoutes({
  model: Extra, tag: "extras", permission: "content:write",
  createSchema: extraSchema, updateSchema: extraUpdate, keyField: "id", sort: { order: 1 },
  publicSelect: "-createdAt -updatedAt",
});
export const GET = h.GET;
export const POST = h.POST;
