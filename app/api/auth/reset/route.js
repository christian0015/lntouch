// app/api/auth/reset/route.js
import { NextResponse } from "next/server";
import { ApiError, assertSameOrigin, clientIp, handle, readJson, NO_STORE } from "@/lib/api";
import { limitOrThrow } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";
import { codesMatch, hashCode } from "@/lib/auth/codes";
import { hashPassword } from "@/lib/auth/password";
import { resetSchema } from "@/lib/validation";

const INVALID = "Code invalide ou expiré";

export const POST = handle(async (req) => {
  assertSameOrigin(req);
  const { email, code, password } = await readJson(req, resetSchema);
  await limitOrThrow(`reset:ip:${clientIp(req)}`, 15, 3600);
  await limitOrThrow(`reset:email:${email}`, 10, 3600);

  await connectToDatabase();
  const user = await User.findOne({ email, active: true }).select("+resetCodeHash +resetCodeExpires +resetCodeAttempts");
  if (!user || !user.resetCodeHash || !user.resetCodeExpires || user.resetCodeExpires < new Date()) throw new ApiError(400, INVALID);

  if (user.resetCodeAttempts >= 5) {
    user.resetCodeHash = undefined; user.resetCodeExpires = undefined; user.resetCodeAttempts = 0;
    await user.save();
    throw new ApiError(400, INVALID);
  }
  if (!codesMatch(user.resetCodeHash, hashCode(String(user._id), code))) {
    user.resetCodeAttempts += 1;
    await user.save();
    throw new ApiError(400, INVALID);
  }

  user.passwordHash = await hashPassword(password);
  user.mustChangePassword = false;
  user.resetCodeHash = undefined; user.resetCodeExpires = undefined; user.resetCodeAttempts = 0;
  await user.save();
  await Session.deleteMany({ userId: user._id }); // déconnecte tous les appareils
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
