// lib/auth/session.ts
// Sessions opaques côté serveur : le cookie ne contient qu'un jeton aléatoire, la base ne stocke que son hash.
// → révocable à tout moment (changement de mot de passe, "déconnecter les autres appareils", rotation).
import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { connectToDatabase } from "@/lib/mongoose";
import Session from "@/models/Session";
import User from "@/models/User";
import type { Role } from "@/lib/auth/permissions";

const PROD = process.env.NODE_ENV === "production";
// Préfixe __Host- : cookie lié à l'hôte exact, Secure, Path=/ (impossible à écraser depuis un sous-domaine).
export const SESSION_COOKIE = PROD ? "__Host-lnt_session" : "lnt_session";

const IDLE_TTL_MS = 7 * 24 * 3600 * 1000;      // expire après 7 jours d'inactivité
const COOKIE_MAX_AGE_S = 30 * 24 * 3600;

export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  sessionId: string;
  mustChangePassword: boolean;
}

export async function createSession(userId: string, meta: { ip: string; userAgent: string }) {
  await connectToDatabase();
  const token = randomBytes(32).toString("base64url");
  await Session.create({
    userId,
    tokenHash: hashToken(token),
    ip: meta.ip,
    userAgent: meta.userAgent.slice(0, 200),
    expiresAt: new Date(Date.now() + IDLE_TTL_MS),
  });
  return token;
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, secure: PROD, sameSite: "lax", path: "/", maxAge: COOKIE_MAX_AGE_S,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function readSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/** Utilisateur courant (mis en cache pour la durée d'une requête). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await readSessionToken();
  if (!token) return null;
  await connectToDatabase();

  const session: any = await Session.findOne({
    tokenHash: hashToken(token), expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  const user: any = await User.findById(session.userId).lean();
  if (!user || !user.active) return null;

  // Expiration glissante (écriture au plus une fois par heure).
  if (Date.now() - new Date(session.lastSeenAt).getTime() > 3600_000) {
    await Session.updateOne(
      { _id: session._id },
      { lastSeenAt: new Date(), expiresAt: new Date(Date.now() + IDLE_TTL_MS) }
    );
  }

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    sessionId: String(session._id),
    mustChangePassword: !!user.mustChangePassword,
  };
});
