"use client";

// app/coiffures/[slug]/not-found.tsx

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { COIFFURES } from "@/lib/coiffures";

// Pick 3 random coiffures to suggest
const SUGGESTIONS = [...COIFFURES].sort(() => Math.random() - 0.5).slice(0, 3);

export default function CoiffureNotFound() {
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
          href="/coiffures"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.35)",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          ← Explorer les styles
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
            Style introuvable
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
          Cette coiffure nous a
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>échappé des mains.</em>
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
          Le style que vous cherchez n'existe pas ou a changé de nom.
          <br />
          Mais il y en a de magnifiques qui vous attendent juste là.
        </p>

        {/* Primary CTAs */}
        <div data-in style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <Link
            href="/coiffures"
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
            Explorer tous les styles
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M0 4H10M6 1L10 4L6 7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
          <Link
            href="/"
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
            Retour à l'accueil
          </Link>
        </div>

        {/* Separator */}
        <div data-in style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.24em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
            Peut-être ceci ?
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Random suggestions */}
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
              href={`/coiffures/${c.slug}`}
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
                    {c.name}
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