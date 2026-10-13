// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { ApiError, assertSameOrigin, clientIp, handle, readJson, NO_STORE } from "@/lib/api";
import { limitOrThrow } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { verifyPassword, dummyVerify } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation";

export const POST = handle(async (req) => {
  assertSameOrigin(req);
  const ip = clientIp(req);
  const { email, password } = await readJson(req, loginSchema);

  // Anti brute-force : par IP ET par compte.
  await limitOrThrow(`login:ip:${ip}`, 20, 900, "Trop de tentatives. Réessayez dans quelques minutes.");
  await limitOrThrow(`login:email:${email}`, 6, 900, "Trop de tentatives pour ce compte. Réessayez dans quelques minutes.");

  await connectToDatabase();
  const user = await User.findOne({ email }).select("+passwordHash");
  const valid = user && user.active ? await verifyPassword(password, user.passwordHash) : (await dummyVerify(), false);
  if (!valid) throw new ApiError(401, "Email ou mot de passe incorrect");

  user.lastLoginAt = new Date();
  await user.save();

  const token = await createSession(String(user._id), { ip, userAgent: req.headers.get("user-agent") || "" });
  await setSessionCookie(token);
  return NextResponse.json(
    { user: { id: String(user._id), email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword } },
    { headers: NO_STORE }
  );
});
