// app/api/salon/route.js
import Salon from "@/models/Salon";
import { singletonRoutes } from "@/lib/crud";
import { salonSchema } from "@/lib/validation";

const h = singletonRoutes({ model: Salon, tag: "salon", permission: "settings:write", schema: salonSchema });
export const GET = h.GET;
export const PUT = h.PUT;
