// app/api/extras/[id]/route.js
import Extra from "@/models/Extra";
import { itemRoutes } from "@/lib/crud";
import { extraSchema, extraUpdate } from "@/lib/validation";

const h = itemRoutes({
  model: Extra, tag: "extras", permission: "content:write",
  createSchema: extraSchema, updateSchema: extraUpdate, keyField: "id",
  publicSelect: "-createdAt -updatedAt",
});
const wrap = (fn) => async (req, { params }) => fn(req, { params: params.then(({ id }) => ({ key: id })) });
export const GET = wrap(h.GET);
export const PUT = wrap(h.PUT);
export const DELETE = wrap(h.DELETE);
