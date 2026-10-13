// lib/rateLimit.ts
// Limiteur persistant (MongoDB + index TTL) — partagé entre toutes les instances/serverless.
// Utilisé pour les endpoints sensibles (login, mot de passe oublié, réservation).
import { connectToDatabase } from "@/lib/mongoose";
import RateLimit from "@/models/RateLimit";
import { ApiError } from "@/lib/api";

export interface RateResult { ok: boolean; remaining: number; retryAfter: number }

export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateResult> {
  await connectToDatabase();
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSec * 1000);

  let doc = await RateLimit.findOneAndUpdate(
    { key, resetAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true }
  ).lean();

  if (!doc) {
    try {
      doc = await RateLimit.findOneAndUpdate(
        { key },
        { $set: { count: 1, resetAt } },
        { upsert: true, new: true }
      ).lean();
    } catch {
      // Course sur l'upsert (clé unique) : on retombe sur l'incrément.
      doc = await RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true }).lean();
    }
  }

  const count = doc?.count ?? 1;
  const retryAfter = Math.max(1, Math.ceil(((doc?.resetAt ?? resetAt).getTime() - Date.now()) / 1000));
  return { ok: count <= limit, remaining: Math.max(0, limit - count), retryAfter };
}

/** Lève une 429 si la limite est dépassée. */
export async function limitOrThrow(
  key: string, limit: number, windowSec: number,
  message = "Trop de tentatives. Réessayez plus tard."
) {
  const r = await rateLimit(key, limit, windowSec);
  if (!r.ok) throw new ApiError(429, message, { "Retry-After": String(r.retryAfter) });
  return r;
}
