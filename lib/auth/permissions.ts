// lib/auth/permissions.ts
// Rôles & permissions — sûr côté client et serveur.

export const ROLES = ["owner", "manager", "editor", "reception"] as const;
export type Role = (typeof ROLES)[number];

export type Permission =
  | "content:write"        // coiffures, extras, FAQ, témoignages
  | "settings:write"       // infos salon + fondatrice
  | "reservations:manage"  // voir / confirmer / annuler les réservations
  | "availability:manage"  // créneaux du calendrier
  | "users:manage";        // équipe & rôles

const MATRIX: Record<Role, readonly Permission[]> = {
  owner:     ["content:write", "settings:write", "reservations:manage", "availability:manage", "users:manage"],
  manager:   ["content:write", "settings:write", "reservations:manage", "availability:manage"],
  editor:    ["content:write"],
  reception: ["reservations:manage", "availability:manage"],
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propriétaire",
  manager: "Gérante",
  editor: "Éditrice (contenu)",
  reception: "Réception",
};

export function can(role: Role | undefined | null, permission: Permission): boolean {
  return !!role && MATRIX[role]?.includes(permission);
}
