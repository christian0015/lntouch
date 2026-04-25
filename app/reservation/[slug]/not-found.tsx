"use client";

// app/reservation/[slug]/not-found.tsx

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { COIFFURES } from "@/lib/data";

// Pick 3 random coiffures to suggest for reservation
const SUGGESTIONS = [...COIFFURES].sort(() => Math.random() - 0.5).slice(0, 3);

export default function ReservationNotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchRef    = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Stagger entry
    gsap.fromTo(
      containerRef.current.querySelectorAll("[data-in]"),
      { opacity: 0, y: 24, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.1,
      }
    );

    // Glitch loop on "404"
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    if (glitchRef.current) {
      tl.to(glitchRef.current, { skewX: 8, x: 4,  duration: 0.06 })
        .to(glitchRef.current, { skewX: -5, x: -3, duration: 0.06 })
        .to(glitchRef.current, { skewX: 0, x: 0,  duration: 0.05 })
        .to(glitchRef.current, { opacity: 0.4, duration: 0.04 })
        .to(glitchRef.current, { opacity: 1, duration: 0.04 });
    }

    return () => tl.kill();
  }, []);

  return (
    <main
      style={{
        background: "linear-gradient(160deg, #090909 0%, #0b0b0b 60%, #0f0808 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric SVG background */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <path d="M 18 52 L 18 18 L 52 18" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        <path d="M 982 948 L 982 982 L 948 982" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
        <line x1="0" y1="0" x2="1000" y2="1000" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="1000" y1="0" x2="0" y2="1000" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
        <circle cx="500" cy="500" r="320" stroke="rgba(255,255,255,0.025)" strokeWidth="1" fill="none" />
        <circle cx="500" cy="500" r="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        <rect x="494" y="14" width="12" height="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" transform="rotate(45 500 20)" />
        <rect x="494" y="974" width="12" height="12" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" transform="rotate(45 500 980)" />
        {/* Zigzag left */}
        <polyline
          points="3,0 9,50 3,100 9,150 3,200 9,250 3,300 9,350 3,400 9,450 3,500 9,550 3,600 9,650 3,700 9,750 3,800 9,850 3,900 9,950 3,1000"
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none"
        />
        {/* Additional geometric element for reservation context */}
        <path d="M 700 100 L 750 150 L 700 200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        <path d="M 800 800 L 850 750 L 900 800" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
      </svg>

      {/* Nav link */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem 2rem",
          background: "rgba(9,9,9,0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          zIndex: 50,
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
          }}
        >
          LN Touch
        </Link>
        <Link
          href="/reservation"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.35)",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          ← Réserver directement
        </Link>
      </nav>

      {/* Main content */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "680px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* 404 Glitch number */}
        <div data-in style={{ marginBottom: "1.5rem" }}>
          <span
            ref={glitchRef}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(6rem, 18vw, 12rem)",
              fontWeight: 700,
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)",
              lineHeight: 1,
              display: "inline-block",
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            404
          </span>
        </div>

        {/* Section label */}
        <div data-in style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.25rem" }}>
          <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
            Style non trouvé
          </span>
          <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Title */}
        <h1
          data-in
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            margin: "0 0 1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Cette réservation n'existe
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>pas encore dans notre agenda.</em>
        </h1>

        {/* Body */}
        <p
          data-in
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.85,
            margin: "0 0 2.5rem",
          }}
        >
          Le style que vous essayez de réserver n'existe pas ou l'URL est incorrecte.
          <br />
          Pas de panique — vous pouvez réserver directement ci-dessous.
        </p>

        {/* Primary CTAs */}
        <div data-in style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <Link
            href="/reservation"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 30px",
              background: "#ffffff",
              color: "#000000",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            Réserver une séance
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M0 4H10M6 1L10 4L6 7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
          <Link
            href="/coiffures"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 30px",
              background: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.14)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            Voir tous les styles
          </Link>
        </div>

        {/* Separator */}
        <div data-in style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
            Suggestions pour vous
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Random suggestions - cliquables vers leur page de réservation */}
        <div
          data-in
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
          className="nf-suggestions"
        >
          {SUGGESTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/reservation/${c.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  borderRadius: "2px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.3s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                  <img
                    src={c.images[0]}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "brightness(0.5)",
                      transition: "transform 0.4s ease, filter 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
                      (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.7)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.5)";
                    }}
                  />
                </div>
                <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.65)",
                      marginBottom: "3px",
                      lineHeight: 1.3,
                    }}
                  >
                    {c.name} {c.variant}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "7px",
                      letterSpacing: "0.16em",
                      color: c.accent,
                    }}
                  >
                    {c.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick help section */}
        <div data-in style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "1rem" }}>
            <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
              Besoin d'aide ?
            </span>
            <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.05)" }} />
          </div>
          <a
            href="https://wa.me/243856270030?text=Bonjour%20LN%20Touch%20!%20J%27ai%20un%20probl%C3%A8me%20avec%20la%20r%C3%A9servation%20en%20ligne."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "2px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contacter le salon
          </a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Space+Mono&display=swap');
        @media (max-width: 480px) {
          .nf-suggestions { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}