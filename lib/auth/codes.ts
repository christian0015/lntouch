// lib/auth/codes.ts
// Codes de réinitialisation à 6 chiffres (hachés en HMAC avant stockage).
import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return s;
}

export const generateCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
export const hashCode = (userId: string, code: string) =>
  createHmac("sha256", secret()).update(`${userId}:${code}`).digest("hex");

export function codesMatch(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
