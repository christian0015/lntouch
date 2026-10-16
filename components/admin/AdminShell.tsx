// components/admin/AdminShell.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export interface NavItem { href: string; label: string }

export default function AdminShell({ navItems, user, children }: {
  navItems: NavItem[]; user: { name: string; role: string }; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sideRef = useRef<HTMLElement>(null);

  // Fermer le menu au changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // Fermer en cliquant en dehors
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (sideRef.current && !sideRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <div className="adm-shell">
      <aside ref={sideRef} className={`adm-side ${open ? "adm-nav-mobile-open" : ""}`}>
        {/* Desktop : marque toujours visible */}
        <p className="adm-brand" style={{ margin: "0 0 12px" }}>LN Touch · Admin</p>

        {/* Toggle mobile */}
        <button className="adm-mobile-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          <span>{open ? "Fermer" : "Menu"}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>

        {/* Nav links */}
        <nav className="adm-nav">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""}>
              {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
        </nav>

        {/* Infos utilisateur */}
        <div className="adm-me">
          <div style={{ flex: 1 }}>
            <div>{user.name}</div>
            <div className="adm-muted" style={{ fontSize: 12 }}>{user.role}</div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
