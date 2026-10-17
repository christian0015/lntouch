// components/admin/AdminShell.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export interface NavItem { href: string; label: string }

export default function AdminShell({ navItems, user, children }: {
  navItems: NavItem[]; user: { name: string; role: string }; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le tiroir à chaque changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // Échap pour fermer + blocage du scroll de la page quand le tiroir est ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div className="adm-shell">
      {/* Bouton burger : enfant direct de .adm-shell (hors du <aside>, qui est caché par défaut), fixé à droite */}
      <button type="button" className="adm-burger" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}
        onClick={() => setOpen((o) => !o)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open
            ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
        </svg>
      </button>

      {/* Clic en dehors du menu = fermeture */}
      <div className={`adm-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden />

      <aside className={`adm-side ${open ? "open" : ""}`}>
        <p className="adm-brand">LN Touch · Admin</p>

        <nav className="adm-nav">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
        </nav>

        <div className="adm-me">
          <div>{user.name}</div>
          <div className="adm-muted">{user.role}</div>
          <div style={{ marginTop: 10 }}><LogoutButton /></div>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
