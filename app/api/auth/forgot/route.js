// app/api/auth/forgot/route.js
import { NextResponse } from "next/server";
import { assertSameOrigin, clientIp, handle, readJson, NO_STORE } from "@/lib/api";
import { limitOrThrow } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { generateCode, hashCode } from "@/lib/auth/codes";
import { sendMail } from "@/lib/mail/send";
import { resetCodeMail } from "@/lib/mail/templates";
import { forgotSchema } from "@/lib/validation";

const MINUTES = 10;

// Réponse identique que le compte existe ou non (anti-énumération d'utilisateurs).
export const POST = handle(async (req) => {
  assertSameOrigin(req);
  const { email } = await readJson(req, forgotSchema);
  await limitOrThrow(`forgot:ip:${clientIp(req)}`, 8, 3600);
  await limitOrThrow(`forgot:email:${email}`, 3, 3600, "Trop de demandes. Réessayez dans une heure.");

  await connectToDatabase();
  const user = await User.findOne({ email, active: true });
  if (user) {
    const code = generateCode();
    user.resetCodeHash = hashCode(String(user._id), code);
    user.resetCodeExpires = new Date(Date.now() + MINUTES * 60_000);
    user.resetCodeAttempts = 0;
    await user.save();
    await sendMail(user.email, resetCodeMail(code, MINUTES));
  }
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
