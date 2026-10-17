// app/admin/(panel)/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { can, ROLE_LABELS, type Permission } from "@/lib/auth/permissions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic"; // l'admin n'est jamais mis en cache

const NAV: { href: string; label: string; perm?: Permission }[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/reservations", label: "Réservations", perm: "reservations:manage" },
  { href: "/admin/availabilities", label: "Disponibilités", perm: "availability:manage" },
  { href: "/admin/hairstyles", label: "Coiffures", perm: "content:write" },
  { href: "/admin/extras", label: "Options (extras)", perm: "content:write" },
  { href: "/admin/testimonials", label: "Témoignages", perm: "content:write" },
  { href: "/admin/social", label: "Publications (réseaux)", perm: "content:write" },
  { href: "/admin/faq", label: "FAQ", perm: "content:write" },
  { href: "/admin/settings", label: "Salon & fondatrice", perm: "settings:write" },
  { href: "/admin/team", label: "Équipe & rôles", perm: "users:manage" },
  { href: "/admin/account", label: "Mon compte" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const navItems = NAV.filter((n) => !n.perm || can(user.role, n.perm));
  return (
    <AdminShell navItems={navItems} user={{ name: user.name, role: ROLE_LABELS[user.role] }}>
      {children}
    </AdminShell>
  );
}
