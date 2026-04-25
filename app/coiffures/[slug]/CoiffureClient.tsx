"use client";

// app/coiffures/[slug]/CoiffureClient.tsx

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { Coiffure } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function waLink(number: string, text: string) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encoded}`;
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function Gallery({ images, name, accent }: { images: string[]; name: string; accent: string }) {
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const switchImage = (i: number) => {
    if (!mainRef.current || i === active) return;
    gsap.to(mainRef.current, {
      opacity: 0,
      scale: 1.02,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActive(i);
        gsap.to(mainRef.current!, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Main image */}
      <div
        style={{
          position: "relative",
          borderRadius: "2px",
          overflow: "hidden",
          aspectRatio: "4/5",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div ref={mainRef} style={{ width: "100%", height: "100%" }}>
          <img
            src={images[active]}
            alt={`${name} — vue ${active + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Gradient overlay bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Corner brackets */}
        <svg aria-hidden style={{ position: "absolute", top: 12, left: 12 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 1L1 1L1 6" stroke={`${accent}99`} strokeWidth="1.2" fill="none" />
        </svg>
        <svg aria-hidden style={{ position: "absolute", bottom: 12, right: 12 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M12 17L17 17L17 12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" />
        </svg>

        {/* Image counter */}
        <span
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnails */}
      <div style={{ display: "flex", gap: "8px" }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => switchImage(i)}
            style={{
              flex: 1,
              aspectRatio: "1",
              borderRadius: "2px",
              overflow: "hidden",
              border: `1px solid ${i === active ? `${accent}88` : "rgba(255,255,255,0.06)"}`,
              padding: 0,
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              background: "transparent",
            }}
          >
            <img
              src={src}
              alt={`${name} miniature ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: i === active ? "brightness(0.9)" : "brightness(0.45)",
                transition: "filter 0.3s ease",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        padding: "12px 18px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "7.5px",
          letterSpacing: "0.26em",
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: accent,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Text block ───────────────────────────────────────────────────────────────

function TextBlock({ icon, title, body }: { icon: string; title: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        paddingTop: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.26em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.85,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────

function RelatedCard({ coiffure }: { coiffure: Coiffure }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/coiffures/${coiffure.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          borderRadius: "2px",
          overflow: "hidden",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
          transition: "border-color 0.3s ease",
        }}
      >
        <div style={{ aspectRatio: "3/2", overflow: "hidden" }}>
          <img
            src={coiffure.images[0]}
            alt={coiffure.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: hovered ? "brightness(0.7)" : "brightness(0.5)",
              transition: "transform 0.5s ease, filter 0.4s ease",
            }}
          />
        </div>
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "2px 8px",
              border: `1px solid ${coiffure.accent}44`,
              borderRadius: "2px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "7.5px",
              letterSpacing: "0.2em",
              color: coiffure.accent,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {coiffure.variant}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1rem",
              fontWeight: 700,
              color: hovered ? "#ffffff" : "rgba(255,255,255,0.7)",
              marginBottom: "4px",
              transition: "color 0.3s ease",
            }}
          >
            {coiffure.name}
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            {coiffure.price}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function CoiffureClient({
  coiffure,
  related,
}: {
  coiffure: Coiffure;
  related: Coiffure[];
}) {
  const heroRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);

  // Entry animations
  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll("[data-hero]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 30, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      }
    );

    // Parallax on hero image
    const img = heroRef.current.querySelector(".hero-bg-img") as HTMLElement | null;
    if (img) {
      gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  const waMessage = `Bonjour LN Touch ! Je suis intéressée par la coiffure ${coiffure.name} ${coiffure.variant} (${coiffure.price}). Pouvez-vous me donner plus d'informations ?`;

  return (
    <main
      style={{
        background: "linear-gradient(160deg, #090909 0%, #0b0b0b 60%, #0f0808 100%)",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      {/* ── Global font import (ensure loaded in layout.tsx too) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,600&family=Space+Mono&display=swap');

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #090909; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        @keyframes slideUp {
          from { opacity:0; transform: translateY(16px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .sticky-cta-bar {
          animation: slideUp 0.5s ease 0.6s both;
        }

        @media (max-width: 768px) {
          .coiffure-layout { flex-direction: column !important; }
          .coiffure-gallery-col { width: 100% !important; position: relative !important; top: 0 !important; }
          .coiffure-content-col { padding: 2rem 1.5rem !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════
          NAV BAR — minimal
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem 2rem",
          background: "rgba(9,9,9,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#ffffff",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          LN Touch
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/coiffures"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8.5px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← Tous les styles
          </Link>
          <a
            href={waLink(coiffure.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 18px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "2px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: "#ffffff",
              textDecoration: "none",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          height: "52vh",
          minHeight: "360px",
          overflow: "hidden",
          marginTop: "0",
          paddingTop: "64px",
        }}
      >
        {/* Parallax background image */}
        <img
          className="hero-bg-img"
          src={coiffure.images[0]}
          alt={coiffure.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "120%",
            objectFit: "cover",
            filter: "brightness(0.35)",
            willChange: "transform",
          }}
        />

        {/* Geometric SVG overlay */}
        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
        >
          <path d="M 18 46 L 18 18 L 46 18" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          <path d="M 982 954 L 982 982 L 954 982" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          <line x1="0" y1="920" x2="1000" y2="1000" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="0" x2="1000" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <rect x="494" y="14" width="12" height="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" transform="rotate(45 500 20)" />
        </svg>

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "3rem",
            background: "linear-gradient(to top, rgba(9,9,9,0.9) 0%, rgba(9,9,9,0.2) 60%, transparent 100%)",
          }}
        >
          {/* Breadcrumb */}
          <div data-hero style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
            <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textDecoration: "none", textTransform: "uppercase" }}>
              LN Touch
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>◇</span>
            <Link href="/coiffures" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textDecoration: "none", textTransform: "uppercase" }}>
              Coiffures
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>◇</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              {coiffure.name}
            </span>
          </div>

          {/* Variant badge */}
          <div data-hero>
            <span
              style={{
                display: "inline-block",
                padding: "3px 12px",
                border: `1px solid ${coiffure.accent}66`,
                borderRadius: "2px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.24em",
                color: coiffure.accent,
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              {coiffure.variant}
            </span>
          </div>

          {/* Title */}
          <h1
            data-hero
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: "0 0 0.6rem",
            }}
          >
            {coiffure.name}
          </h1>

          {/* Tagline */}
          <p
            data-hero
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            {coiffure.tagline}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN BODY — split layout
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="coiffure-layout"
        style={{
          display: "flex",
          gap: 0,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
        }}
      >
        {/* ── Left col: sticky gallery ─────────────────────────────── */}
        <div
          className="coiffure-gallery-col"
          style={{
            width: "42%",
            flexShrink: 0,
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
            paddingTop: "3rem",
            paddingRight: "3rem",
            paddingBottom: "3rem",
          }}
        >
          <Gallery images={coiffure.images} name={coiffure.name} accent={coiffure.accent} />
        </div>

        {/* ── Right col: scrollable content ────────────────────────── */}
        <div
          ref={contentRef}
          className="coiffure-content-col"
          style={{
            flex: 1,
            paddingTop: "3rem",
            paddingBottom: "6rem",
            paddingLeft: "3rem",
            borderLeft: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "8px",
              marginBottom: "2.5rem",
            }}
          >
            <StatPill label="Durée" value={coiffure.duration} accent={coiffure.accent} />
            <StatPill label="Tenue" value={coiffure.hold} accent={coiffure.accent} />
            <StatPill label="Prix" value={coiffure.price} accent={coiffure.accent} />
          </div>

          {/* Ideal for */}
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7.5px",
                letterSpacing: "0.26em",
                color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase",
              }}
            >
              Idéal pour —
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.4)",
                marginLeft: "10px",
              }}
            >
              {coiffure.ideal}
            </span>
          </div>

          {/* Text blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <TextBlock icon="◇" title="La coiffure" body={coiffure.description} />
            <TextBlock icon="△" title="La technique" body={coiffure.technique} />
            <TextBlock icon="○" title="Entretien & durée de vie" body={coiffure.conseil} />
          </div>

          {/* ── CTA BLOCK ─────────────────────────────────────────── */}
          <div
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "2px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Geometric accent */}
            <svg aria-hidden style={{ position: "absolute", top: 10, right: 10 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M12 1L17 1L17 6" stroke={`${coiffure.accent}55`} strokeWidth="1.2" fill="none" />
            </svg>

            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
                fontWeight: 700,
                color: "#ffffff",
                margin: "0 0 0.5rem",
                lineHeight: 1.2,
              }}
            >
              Prête pour votre{" "}
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.65)" }}>
                {coiffure.name}
              </em>{" "}
              ?
            </h3>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.35)",
                margin: "0 0 1.5rem",
                lineHeight: 1.7,
              }}
            >
              Réservez votre séance en ligne ou contactez-nous directement sur WhatsApp — on répond sous 12h.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Primary CTA — Réservation */}
              <Link
                href={`/reservation/${coiffure.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "#ffffff",
                  color: "#000000",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "2px",
                  transition: "opacity 0.2s ease",
                  fontWeight: 400,
                }}
              >
                Réserver ma séance
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M0 4H10M6 1L10 4L6 7" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>

              {/* Secondary CTA — WhatsApp */}
              <a
                href={waLink(coiffure.whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "transparent",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.18)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "2px",
                  transition: "border-color 0.25s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contacter sur WhatsApp
              </a>
            </div>

            {/* Instagram link */}
            <a
              href={coiffure.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginTop: "1.2rem",
                fontFamily: "'Space Mono', monospace",
                fontSize: "7.5px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.22)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              Voir les réels Instagram
            </a>
          </div>

          {/* ── Related styles ────────────────────────────────────── */}
          {related.length > 0 && (
            <div style={{ marginTop: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "8.5px",
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.22)",
                    textTransform: "uppercase",
                  }}
                >
                  Vous aimerez aussi
                </span>
              </div>
              <div
                className="related-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                }}
              >
                {related.map((c) => (
                  <RelatedCard key={c.slug} coiffure={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STICKY BOTTOM CTA BAR (mobile-first conversion layer)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        className="sticky-cta-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: "flex",
          gap: "0",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(9,9,9,0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        <a
          href={waLink(coiffure.whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
            textTransform: "uppercase",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
        <Link
          href={`/reservation/${coiffure.slug}`}
          style={{
            flex: 2,
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#ffffff",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.24em",
            color: "#000000",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          Réserver ma séance ✦
        </Link>
      </div>
    </main>
  );
}