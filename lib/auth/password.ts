// lib/auth/password.ts
// Hachage scrypt natif Node (aucune dépendance). Format : scrypt$N$r$p$salt$hash
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const N = 16384, R = 8, P = 1;

function derive(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEYLEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key)
    )
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, saltB64, keyB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const actual = await derive(password, Buffer.from(saltB64, "base64"), +n, +r, +p);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

let dummy: Promise<string> | null = null;
/** Égalise le temps de réponse quand l'email n'existe pas (anti-énumération). */
export async function dummyVerify(): Promise<void> {
  dummy ??= hashPassword("dummy-password-for-timing");
  await verifyPassword("wrong-password", await dummy);
}
