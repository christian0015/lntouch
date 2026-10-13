// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { ApiError, handle, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { limitOrThrow } from "@/lib/rateLimit";
import { profileSchema } from "@/lib/validation";

export const GET = handle(async (req) => {
  const user = await authorize(req);
  return NextResponse.json({ user }, { headers: NO_STORE });
});

// PATCH — nom / email. Changer l'email exige le mot de passe actuel.
export const PATCH = handle(async (req) => {
  const me = await authorize(req);
  await limitOrThrow(`profile:${me.id}`, 10, 900);
  const patch = await readJson(req, profileSchema);
  await connectToDatabase();
  const user = await User.findById(me.id).select("+passwordHash");
  if (patch.email && patch.email !== user.email) {
    if (!patch.currentPassword || !(await verifyPassword(patch.currentPassword, user.passwordHash))) {
      throw new ApiError(403, "Mot de passe actuel incorrect");
    }
    user.email = patch.email;
  }
  if (patch.name) user.name = patch.name;
  await user.save();
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
