// app/api/auth/password/route.js
import { NextResponse } from "next/server";
import { ApiError, handle, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { limitOrThrow } from "@/lib/rateLimit";
import { changePasswordSchema } from "@/lib/validation";

// POST — change le mot de passe ET déconnecte tous les autres appareils.
export const POST = handle(async (req) => {
  const me = await authorize(req);
  await limitOrThrow(`pwd:${me.id}`, 6, 900);
  const { currentPassword, newPassword } = await readJson(req, changePasswordSchema);
  await connectToDatabase();
  const user = await User.findById(me.id).select("+passwordHash");
  if (!(await verifyPassword(currentPassword, user.passwordHash))) throw new ApiError(403, "Mot de passe actuel incorrect");
  if (currentPassword === newPassword) throw new ApiError(400, "Le nouveau mot de passe doit être différent");
  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();
  await Session.deleteMany({ userId: user._id, _id: { $ne: me.sessionId } });
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
