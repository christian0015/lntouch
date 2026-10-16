// app/api/founder/route.js
import Founder from "@/models/Founder";
import { singletonRoutes } from "@/lib/crud";
import { founderSchema } from "@/lib/validation";

const h = singletonRoutes({ model: Founder, tag: "founder", permission: "settings:write", schema: founderSchema, imagePublicIdField: "avatarPublicId" });
export const GET = h.GET;
export const PUT = h.PUT;
