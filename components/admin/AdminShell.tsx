// components/admin/AdminShell.tsx
"use client";
import { useState, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export interface NavItem { href: string; label: string }

const GOLD = "#c9a97a";

export default function AdminShell({ navItems, user, children }: {
  navItems: NavItem[]; user: { name: string; role: string }; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();

  // Détection mobile en JS : le burger ne dépend d'aucune règle CSS pour s'afficher.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const apply = () => { setMobile(mq.matches); if (!mq.matches) setOpen(false); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Ferme le tiroir à chaque changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // Échap + blocage du scroll quand le tiroir est ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const barStyle: CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, height: 60, zIndex: 70,
    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px",
    background: "rgba(10,10,10,0.94)", borderBottom: "1px solid #262626", backdropFilter: "blur(10px)",
  };
  const burgerStyle: CSSProperties = {
    position: "fixed", top: 8, right: 12, zIndex: 80, width: 44, height: 44,
    display: "grid", placeItems: "center", cursor: "pointer", padding: 0,
    background: "#161616", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 10,
  };
  const drawerStyle: CSSProperties = {
    position: "fixed", top: 0, right: 0, bottom: 0, left: "auto", zIndex: 60,
    width: "min(300px, 86vw)", height: "100dvh", overflowY: "auto", padding: "76px 16px 24px",
    transform: open ? "translateX(0)" : "translateX(105%)", transition: "transform .28s ease",
    borderRight: "none", borderLeft: "1px solid #262626", boxShadow: open ? "0 0 60px rgba(0,0,0,.7)" : "none",
  };

  return (
    <div className="adm-shell" style={mobile ? { display: "block" } : undefined}>
      {mobile && (
        <>
          {/* Barre fixe en haut + bouton burger FIXE à droite */}
          <header style={barStyle}>
            <span style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: GOLD }}>LN Touch · Admin</span>
          </header>
          <button type="button" style={burgerStyle} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}
            onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
          {/* Voile sombre : un clic ferme le tiroir */}
          <div onClick={() => setOpen(false)} aria-hidden
            style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(0,0,0,.6)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .25s" }} />
        </>
      )}

      {/* Barre latérale (bureau) / tiroir à droite (mobile) */}
      <aside className="adm-side" style={mobile ? drawerStyle : undefined} aria-label="Navigation de l'administration" aria-hidden={mobile && !open}>
        {!mobile && <p className="adm-brand">LN Touch · Admin</p>}

        <nav className="adm-nav">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""} tabIndex={mobile && !open ? -1 : 0}
              onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener" tabIndex={mobile && !open ? -1 : 0}>Voir le site ↗</a>
        </nav>

        <div className="adm-me">
          <div>{user.name}</div>
          <div className="adm-muted" style={{ fontSize: 12, marginBottom: 10 }}>{user.role}</div>
          <LogoutButton />
        </div>
      </aside>

      <main className="adm-main" style={mobile ? { paddingTop: 80 } : undefined}>{children}</main>
    </div>
  );
}
