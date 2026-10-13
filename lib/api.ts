// lib/api.ts
// Helpers communs aux Route Handlers : erreurs, validation, IP, CSRF, enveloppe try/catch.
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string, public headers?: Record<string, string>) {
    super(message);
  }
}

export const NO_STORE = { "Cache-Control": "no-store" } as const;
export const CDN_CACHE = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

/** IP du client. Derrière un proxy de confiance (Vercel, Nginx) : x-real-ip / x-forwarded-for. */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

/** Protection CSRF : l'en-tête Origin doit correspondre à l'hôte du site (requêtes mutantes). */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) throw new ApiError(403, "Origine non autorisée");
  let originHost = "";
  try { originHost = new URL(origin).host; } catch { /* ignore */ }
  if (originHost !== host) throw new ApiError(403, "Origine non autorisée");
}

const MAX_BODY_BYTES = 200_000;

export async function readJson<T>(req: Request, schema: ZodType<T>): Promise<T> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) throw new ApiError(413, "Requête trop volumineuse");
  let raw: unknown;
  try { raw = await req.json(); } catch { throw new ApiError(400, "JSON invalide"); }
  return schema.parse(raw);
}

type Ctx = { params: Promise<Record<string, string>> };
type Handler = (req: Request, ctx: Ctx) => Promise<Response>;

/** Enveloppe : convertit toute erreur en réponse JSON propre, sans fuite d'information interne. */
export function handle(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e: any) {
      if (e instanceof ApiError) {
        return NextResponse.json({ error: e.message }, { status: e.status, headers: e.headers });
      }
      if (e instanceof ZodError) {
        return NextResponse.json(
          { error: "Données invalides", issues: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
          { status: 400 }
        );
      }
      if (e?.code === 11000) {
        return NextResponse.json({ error: "Cet élément existe déjà" }, { status: 409 });
      }
      if (e?.name === "ValidationError" || e?.name === "CastError") {
        return NextResponse.json({ error: "Données invalides" }, { status: 400 });
      }
      console.error("[api]", req.method, new URL(req.url).pathname, e);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  };
}

/** JSON plain : ObjectId → string, Date → ISO, retire __v. */
export function plain<T = any>(doc: unknown): T {
  const obj = JSON.parse(JSON.stringify(doc));
  if (obj && typeof obj === "object") delete (obj as any).__v;
  return obj as T;
}
