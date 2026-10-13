// app/api/availabilities/bulk/route.js
// Génère des créneaux sur une période : { from, to, weekdays:[2,3,4,5,6], slots:[...] }  (0 = dimanche)
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, handle, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import Availability from "@/models/Availability";
import { dateISO, timeHHMM } from "@/lib/validation";
import { addDaysISO } from "@/lib/dates";
import { invalidate } from "@/lib/cache";

const schema = z.object({
  from: dateISO, to: dateISO,
  weekdays: z.array(z.number().int().min(0).max(6)).min(1),
  slots: z.array(timeHHMM).min(1).max(48),
  mode: z.enum(["replace", "merge"]).default("merge"),
}).strict();

export const POST = handle(async (req) => {
  await authorize(req, "availability:manage");
  const { from, to, weekdays, slots, mode } = await readJson(req, schema);
  if (to < from) throw new ApiError(400, "Période invalide");

  const ops = [];
  const sorted = [...new Set(slots)].sort();
  for (let d = from, i = 0; d <= to; d = addDaysISO(d, 1), i++) {
    if (i > 190) throw new ApiError(400, "Période limitée à 190 jours");
    const wd = new Date(`${d}T12:00:00Z`).getUTCDay();
    if (!weekdays.includes(wd)) continue;
    ops.push({
      updateOne: {
        filter: { date: d },
        update: mode === "replace"
          ? { $set: { date: d, slots: sorted } }
          : { $setOnInsert: { date: d }, $addToSet: { slots: { $each: sorted } } },
        upsert: true,
      },
    });
  }
  await connectToDatabase();
  if (ops.length) await Availability.bulkWrite(ops);
  invalidate("availabilities");
  return NextResponse.json({ days: ops.length }, { headers: NO_STORE });
});
