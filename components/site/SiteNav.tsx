// components/site/SiteNav.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./site-nav.css";

const ITEMS = [
  { id: "accueil",     label: "Accueil",     n: "01" },
  { id: "story",       label: "Histoire",    n: "02" },
  { id: "styles",      label: "Styles",      n: "03" },
  { id: "reservation", label: "Réserver",    n: "04" },
  { id: "avis",        label: "Avis",        n: "05" },
  { id: "faq",         label: "Questions",   n: "06" },
  { id: "contact",     label: "Contact",     n: "07" },
] as const;

type DockState = "rest" | "scrolling" | "active";

// Sur les pages secondaires, on marque le lien correspondant comme actif.
function sectionForPath(path: string): string | null {
  if (path.startsWith("/coiffures")) return "styles";
  if (path.startsWith("/reservation")) return "reservation";
  return null;
}

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(sectionForPath(pathname) ?? "accueil");
  const [dock, setDock] = useState<DockState>("rest");
  const [hover, setHover] = useState(false);
  const [liquid, setLiquid] = useState(false);
  const [blob, setBlob] = useState<{ left: number; width: number } | null>(null);

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const hoverRef = useRef(false);

  // ── Chromium seulement : backdrop-filter avec filtre SVG (distorsion liquide). Ailleurs : verre dépoli.
  useEffect(() => {
    try { setLiquid(CSS.supports("backdrop-filter", "url(#x)") || CSS.supports("-webkit-backdrop-filter", "url(#x)")); } catch { /* ignore */ }
  }, []);

  // ── Section active selon le scroll (accueil uniquement)
  useEffect(() => {
    if (!isHome) { setActive(sectionForPath(pathname) ?? "accueil"); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string = ITEMS[0].id;
      const line = window.innerHeight * 0.4;
      for (const it of ITEMS) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [isHome, pathname]);

  // ── Opacité "intelligente" : < 50 % pendant le scroll, > 50 % à l'arrêt, retour à ~50 % après 2 s
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;
    let restTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setDock("scrolling");
      clearTimeout(stopTimer); clearTimeout(restTimer);
      stopTimer = setTimeout(() => {
        setDock("active");                                           // scroll arrêté → monte (> 50 %)
        restTimer = setTimeout(() => { if (!hoverRef.current) setDock("rest"); }, 2000); // puis redescend (~50 %)
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(stopTimer); clearTimeout(restTimer); };
  }, []);

  // ── Position de la goutte dorée sous l'élément actif
  const measure = useCallback(() => {
    const el = itemRefs.current[active];
    setBlob(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [active]);
  useLayoutEffect(() => { measure(); }, [measure, liquid]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    if ((document as any).fonts?.ready) (document as any).fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ── Volet mobile : échap + verrouillage du scroll
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prev; };
  }, [open]);

  // ── Défilement doux vers la section quand on est déjà sur l'accueil
  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!isHome) return; // navigation normale vers /#id
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (id === "accueil") window.scrollTo({ top: 0, behavior: "smooth" });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id === "accueil" ? "/" : `/#${id}`);
  };

  return (
    <div className="lt-nav">
      {/* Filtre SVG de distorsion liquide (invisible) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
        <defs>
          <filter id="lt-liquid" x="-5%" y="-30%" width="110%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.010 0.022" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.6" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ───── Bureau : pilule en bas au centre ───── */}
      <nav
        className="lt-dock" aria-label="Navigation principale"
        data-state={dock} data-hover={hover}
        onMouseEnter={() => { hoverRef.current = true; setHover(true); }}
        onMouseLeave={() => { hoverRef.current = false; setHover(false); setDock("active"); setTimeout(() => { if (!hoverRef.current) setDock("rest"); }, 2000); }}
        onFocus={() => { hoverRef.current = true; setHover(true); }}
        onBlur={() => { hoverRef.current = false; setHover(false); }}
      >
        <div className={`lt-glass ${liquid ? "lt-liquid" : ""}`}>
          {blob && <span className="lt-blob" style={{ left: blob.left, width: blob.width }} />}
          {ITEMS.filter((i) => i.id !== "reservation").map((it) => (
            <Link
              key={it.id} href={it.id === "accueil" ? "/" : `/#${it.id}`}
              ref={(el) => { itemRefs.current[it.id] = el; }}
              className="lt-item" aria-current={active === it.id ? "true" : undefined}
              onClick={(e) => go(e, it.id)}
            >
              {it.label}
            </Link>
          ))}
          <Link href="/reservation" className="lt-cta">Réserver</Link>
        </div>
      </nav>

      {/* ───── Mobile : bouton fixe haut-gauche + volet plein écran ───── */}
      <button
        type="button" className="lt-burger" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open} aria-controls="lt-sheet" onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <div id="lt-sheet" className="lt-sheet" data-open={open} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <div className="lt-sheet-label">Menu · LN Touch</div>
        <ul>
          {ITEMS.map((it, i) => (
            <li key={it.id}>
              <Link
                href={it.id === "accueil" ? "/" : `/#${it.id}`}
                aria-current={active === it.id ? "true" : undefined}
                style={{ transitionDelay: open ? `${0.12 + i * 0.06}s` : "0s" }}
                tabIndex={open ? 0 : -1}
                onClick={(e) => go(e, it.id)}
              >
                <small>{it.n}</small>{it.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="lt-sheet-foot">
          <Link href="/reservation" className="lt-sheet-cta" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            Réserver ma séance
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M0 4H10M6 1L10 4L6 7" stroke="currentColor" strokeWidth="1.2" /></svg>
          </Link>
          <p className="lt-sheet-note">Tresses africaines modernes · Kinshasa</p>
        </div>
      </div>
    </div>
  );
}
