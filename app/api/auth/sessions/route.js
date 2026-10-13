// app/api/auth/sessions/route.js
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { ApiError, handle, plain, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import Session from "@/models/Session";
import { hashToken, setSessionCookie } from "@/lib/auth/session";

// GET — mes sessions actives
export const GET = handle(async (req) => {
  const me = await authorize(req);
  await connectToDatabase();
  const list = await Session.find({ userId: me.id, expiresAt: { $gt: new Date() } }).sort({ lastSeenAt: -1 }).select("-tokenHash").lean();
  return NextResponse.json(plain(list).map((s) => ({ ...s, current: s._id === me.sessionId })), { headers: NO_STORE });
});

// DELETE ?id=<sessionId> | ?others=1 — révoquer une session ou toutes les autres
export const DELETE = handle(async (req) => {
  const me = await authorize(req);
  const sp = new URL(req.url).searchParams;
  await connectToDatabase();
  if (sp.get("others") === "1") {
    const r = await Session.deleteMany({ userId: me.id, _id: { $ne: me.sessionId } });
    return NextResponse.json({ revoked: r.deletedCount }, { headers: NO_STORE });
  }
  const id = sp.get("id");
  if (!id || !mongoose.isValidObjectId(id)) throw new ApiError(400, "id requis");
  await Session.deleteOne({ _id: id, userId: me.id });
  return NextResponse.json({ revoked: 1 }, { headers: NO_STORE });
});

// POST — rotation du jeton de la session courante (nouveau cookie, ancien jeton invalide)
export const POST = handle(async (req) => {
  const me = await authorize(req);
  await connectToDatabase();
  const token = randomBytes(32).toString("base64url");
  await Session.updateOne({ _id: me.sessionId, userId: me.id }, { tokenHash: hashToken(token), lastSeenAt: new Date() });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});
