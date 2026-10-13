// app/admin/(panel)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { can, ROLE_LABELS, type Permission } from "@/lib/auth/permissions";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic"; // l'admin n'est jamais mis en cache

const NAV: { href: string; label: string; perm?: Permission }[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/reservations", label: "Réservations", perm: "reservations:manage" },
  { href: "/admin/availabilities", label: "Disponibilités", perm: "availability:manage" },
  { href: "/admin/hairstyles", label: "Coiffures", perm: "content:write" },
  { href: "/admin/extras", label: "Options (extras)", perm: "content:write" },
  { href: "/admin/testimonials", label: "Témoignages", perm: "content:write" },
  { href: "/admin/faq", label: "FAQ", perm: "content:write" },
  { href: "/admin/settings", label: "Salon & fondatrice", perm: "settings:write" },
  { href: "/admin/team", label: "Équipe & rôles", perm: "users:manage" },
  { href: "/admin/account", label: "Mon compte" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <p className="adm-brand">LN Touch · Admin</p>
        <nav className="adm-nav">
          {NAV.filter((n) => !n.perm || can(user.role, n.perm)).map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
        </nav>
        <div className="adm-me">
          <div>{user.name}</div>
          <div className="adm-muted">{ROLE_LABELS[user.role]}</div>
          <div style={{ marginTop: 10 }}><LogoutButton /></div>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
