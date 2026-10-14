// proxy.ts
// Première ligne de défense (Edge) : limite d'abus par IP (très généreuse : un visiteur indécis peut
// naviguer vite) + redirection douce de /admin si aucun cookie. La VRAIE vérification des sessions
// se fait côté serveur (requirePage / authorize), jamais ici.
// Next 16 : convention `proxy` (ex-middleware). Sur Next 15, renommer en middleware.ts / function middleware.
import { NextResponse, type NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const LIMITS = { page: 240, api: 150, apiWrite: 40 } as const; // requêtes / minute / IP
const hits = new Map<string, { n: number; reset: number }>();

function ipOf(req: NextRequest) {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

function over(key: string, limit: number, now: number): number {
  const e = hits.get(key);
  if (!e || e.reset < now) { hits.set(key, { n: 1, reset: now + WINDOW_MS }); return 0; }
  e.n++;
  return e.n > limit ? Math.ceil((e.reset - now) / 1000) : 0;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const now = Date.now();
  const ip = ipOf(req);

  // Purge opportuniste pour borner la mémoire.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);

  const isApi = pathname.startsWith("/api/");
  const isWrite = isApi && !["GET", "HEAD"].includes(req.method);
  const group = isWrite ? "apiWrite" : isApi ? "api" : "page";
  const retry = over(`${group}:${ip}`, LIMITS[group], now);
  if (retry) {
    return new NextResponse(isApi ? JSON.stringify({ error: "Trop de requêtes" }) : "Trop de requêtes, réessayez dans un instant.", {
      status: 429,
      headers: { "Retry-After": String(retry), "Content-Type": isApi ? "application/json" : "text/plain; charset=utf-8" },
    });
  }

  // Redirection douce vers le login (pas une sécurité, juste de l'UX).
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/forgot") && !pathname.startsWith("/admin/reset")) {
    const has = req.cookies.has("__Host-lnt_session") || req.cookies.has("lnt_session");
    if (!has) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const res = NextResponse.next();
  if (pathname.startsWith("/admin") || isApi) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|gif|woff2?|txt|xml)$).*)"],
};
