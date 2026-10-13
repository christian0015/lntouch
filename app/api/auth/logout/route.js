// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { assertSameOrigin, handle, NO_STORE } from "@/lib/api";
import { connectToDatabase } from "@/lib/mongoose";
import Session from "@/models/Session";
import { clearSessionCookie, hashToken, readSessionToken } from "@/lib/auth/session";

export const POST = handle(async (req) => {
  assertSameOrigin(req);
  const token = await readSessionToken();
  if (token) {
    await connectToDatabase();
    await Session.deleteOne({ tokenHash: hashToken(token) });
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
