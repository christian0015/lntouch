// lib/auth/guard.ts
// Contrôle d'accès : une seule source de vérité pour les API et les pages admin.
import "server-only";
import { redirect } from "next/navigation";
import { ApiError, assertSameOrigin } from "@/lib/api";
import { can, type Permission } from "@/lib/auth/permissions";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";

/**
 * API : vérifie session + permission (+ CSRF sur les méthodes mutantes).
 * Lève ApiError 401/403 ; à utiliser dans `handle(...)`.
 */
export async function authorize(req: Request, permission?: Permission): Promise<SessionUser> {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) assertSameOrigin(req);
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "Non authentifié");
  if (permission && !can(user.role, permission)) throw new ApiError(403, "Accès refusé");
  return user;
}

/** Pages admin (Server Components) : redirige si non connecté, 403 si permission manquante. */
export async function requirePage(
  permission?: Permission,
  opts: { allowMustChange?: boolean } = {}
): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.mustChangePassword && !opts.allowMustChange) redirect("/admin/account?force=1");
  if (permission && !can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}
