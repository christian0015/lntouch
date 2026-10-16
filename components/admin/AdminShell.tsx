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
      {/* Barre du haut — visible uniquement sur mobile */}
      <header className="adm-topbar">
        <button type="button" className="adm-burger" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="adm-topbar-title">LN Touch · Admin</span>
      </header>

      <div className={`adm-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden />

      {/* Barre latérale (bureau) / tiroir (mobile) */}
      <aside className={`adm-side ${open ? "open" : ""}`} aria-label="Navigation de l'administration">
        <div className="adm-drawer-head">
          <span className="adm-topbar-title">LN Touch · Admin</span>
          <button type="button" className="adm-drawer-close" aria-label="Fermer le menu" onClick={() => setOpen(false)}>✕</button>
        </div>
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
          <div className="adm-muted" style={{ fontSize: 12, marginBottom: 10 }}>{user.role}</div>
          <LogoutButton />
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
