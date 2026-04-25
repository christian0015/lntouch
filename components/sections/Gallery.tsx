"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ShinyText from "../Texts/ShinyText";
import BlurText from "../Texts/BlurText";
import { COIFFURES, type Coiffure } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ─── Construction des styles à partir de COIFFURES ─────────────────────────
// Sélectionne 8 coiffures spécifiques pour la galerie, avec size "large" pour certaines
const STYLES = COIFFURES.filter((c) =>
  [
    "knotless-braids-medium",
    "knotless-braids-large",
    "boho-braids-short",
    "boho-braids-long",
    "fulani-braids",
    "fulani-crochet",
    "braided-ponytail",
    "french-curl",
  ].includes(c.slug)
).map((c, idx) => ({
  id: c.slug,
  name: c.name,
  variant: c.variant,
  tagline: c.tagline,
  desc: c.description.split(".")[0] + ".", // Première phrase seulement
  duration: c.duration,
  hold: c.hold,
  image: c.images[0],
  instagram: c.instagram,
  slug: c.slug,
  accent: c.accent,
  // size "large" pour certaines coiffures (même logique que l'original)
  size: ["knotless-braids-medium", "boho-braids-long", "french-curl"].includes(c.slug) ? "large" : "normal",
}));

// ─── Card Component ───────────────────────────────────────────────────────────
function StyleCard({ style, index }: { style: typeof STYLES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 60, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        delay: (index % 3) * 0.12,
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [index]);

  const handleMouseEnter = () => {
    setHovered(true);
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1.07, duration: 0.7, ease: "power2.out" });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: "power2.inOut" });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "2px",
        overflow: "hidden",
        cursor: "pointer",
        gridRow: style.size === "large" ? "span 2" : "span 1",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04),
          0 8px 32px rgba(0,0,0,0.6),
          inset 0 1px 0 rgba(255,255,255,0.06)
        `,
        backdropFilter: "blur(2px)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
        ...(hovered && {
          border: `1px solid ${style.accent}44`,
          boxShadow: `
            0 0 0 1px ${style.accent}22,
            0 16px 48px rgba(0,0,0,0.8),
            0 0 60px ${style.accent}12,
            inset 0 1px 0 rgba(255,255,255,0.08)
          `,
        }),
      }}
    >
      {/* Image */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img
          ref={imgRef}
          src={style.image}
          alt={`${style.name} ${style.variant} - LN Touch`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transformOrigin: "center",
            filter: hovered ? "blur(3px) brightness(0.5)" : "brightness(0.65)",
            transition: "filter 0.5s ease",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              to top,
              rgba(0,0,0,0.95) 0%,
              rgba(0,0,0,0.5) 40%,
              rgba(0,0,0,0.1) 70%,
              transparent 100%
            )`,
          }}
        />
        {/* Accent color tint on hover */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${style.accent}18 0%, transparent 70%)`,
            opacity: 0,
          }}
        />
      </div>

      {/* Geometric corner bracket */}
      <svg
        aria-hidden
        style={{ position: "absolute", top: 14, left: 14, zIndex: 5 }}
        width="20" height="20" viewBox="0 0 20 20" fill="none"
      >
        <path d="M8 1L1 1L1 8" stroke={`${style.accent}88`} strokeWidth="1.2" fill="none" />
      </svg>
      <svg
        aria-hidden
        style={{ position: "absolute", top: 14, right: 14, zIndex: 5 }}
        width="20" height="20" viewBox="0 0 20 20" fill="none"
      >
        <path d="M12 1L19 1L19 8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" />
      </svg>

      {/* Index */}
      <span
        style={{
          position: "absolute",
          top: "1rem",
          right: "2.6rem",
          fontFamily: "'Space Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.2)",
          zIndex: 5,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Bottom content (always visible) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
          zIndex: 5,
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.4s ease",
        }}
      >
        {/* Variant pill */}
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            border: `1px solid ${style.accent}55`,
            borderRadius: "2px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.22em",
            color: style.accent,
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        >
          {style.variant}
        </span>

        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.2rem, 1.8vw, 1.55rem)",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 0.35rem",
            lineHeight: 1.15,
          }}
        >
          {style.name}
        </h3>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(0.82rem, 1vw, 0.95rem)",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {style.tagline}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            marginTop: "0.8rem",
          }}
        >
          {[
            { label: "Durée", value: style.duration },
            { label: "Tenue", value: style.hold },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "7.5px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.22)",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: style.accent,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover overlay: desc + CTAs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          textAlign: "center",
          gap: "1rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7,
            maxWidth: "260px",
            marginBottom: "0.5rem",
          }}
        >
          {style.desc}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={`/coiffures/${style.slug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 20px",
              background: "#ffffff",
              color: "#000000",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "opacity 0.2s ease",
            }}
          >
            En savoir plus
          </a>
          <a
            href={style.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 20px",
              background: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              transition: "border-color 0.2s ease",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Voir le réel
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header reveal
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );
    }
    // Line expand
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "linear-gradient(160deg, #0a0a0a 0%, #0d0d0d 50%, #100808 100%)",
        padding: "7rem 0 8rem",
        overflow: "hidden",
      }}
    >
      {/* ── Geometric SVG overlay ───────────────────────────────────────── */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, opacity: 0.6 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <line x1="0" y1="200" x2="400" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="1000" y1="150" x2="600" y2="0" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        <line x1="0" y1="800" x2="300" y2="1000" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        <line x1="1000" y1="700" x2="700" y2="1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="0" y1="500" x2="1000" y2="500" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="4 12" />
        <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="4 12" />
        <path d="M -100 300 Q 300 100 700 350 Q 900 480 1100 300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        <path d="M -100 700 Q 200 900 600 680 Q 800 580 1100 750" stroke="rgba(255,255,255,0.025)" strokeWidth="1" fill="none" />
        <polyline
          points="998,0 992,40 998,80 992,120 998,160 992,200 998,240 992,280 998,320 992,360 998,400 992,440 998,480 992,520 998,560 992,600 998,640 992,680 998,720 992,760 998,800 992,840 998,880 992,920 998,1000"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          fill="none"
        />
        <path d="M 20 52 L 20 20 L 52 20" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
        <path d="M 980 948 L 980 980 L 948 980" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
        <rect x="494" y="14" width="12" height="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" transform="rotate(45 500 20)" />
      </svg>

      {/* ── Floating labels ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
          03&nbsp;/&nbsp;07
        </span>
      </div>
      <div style={{ position: "absolute", top: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.08)" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
          Nos Styles
        </span>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.08)" }} />
      </div>
      <div style={{ position: "absolute", top: "1.75rem", right: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.14)", textTransform: "uppercase" }}>
          Gallery
        </span>
      </div>

      {/* Vertical side label */}
      <div
        className="hidden md:block"
        style={{ position: "absolute", bottom: "4rem", left: "1.75rem", zIndex: 10, pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.11)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "block",
          }}
        >
          Knotless · Boho · Fulani · Curl
        </span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          marginBottom: "4rem",
        }}
      >
        <div
          data-reveal
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ height: "1px", width: "36px", background: "rgba(255,255,255,0.14)" }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9.5px",
              letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            Styles · Inspirations · Résultats
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div data-reveal>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Chaque style,
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.35)",
                }}
              >
                une identité.
              </span>
            </h2>
          </div>

          <div data-reveal style={{ maxWidth: "320px" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
                margin: "0 0 1.2rem",
              }}
            >
              De la tresse africaine aux boucles libres — chaque technique est maîtrisée, chaque résultat est une déclaration.
            </p>
            <a
              href="/coiffures"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              Voir tous les styles
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Expanding line */}
        <div
          ref={lineRef}
          style={{
            height: "1px",
            background: "linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
            marginTop: "3rem",
          }}
        />
      </div>

      {/* ── Scroll velocity strip ───────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          overflow: "hidden",
          marginBottom: "3.5rem",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          padding: "0.6rem 0",
        }}
      >
        <div
          className="gallery-ticker"
          style={{
            display: "flex",
            gap: "3rem",
            whiteSpace: "nowrap",
            animation: "galleryTicker 20s linear infinite",
          }}
        >
          {[...Array(3)].map((_, i) =>
            ["Knotless Braids", "Boho Braids", "Fulani Braids", "Braided Ponytail", "French Curl", "LN Touch"].map((t) => (
              <span
                key={`${i}-${t}`}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.13)",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {t}
                <span style={{ marginLeft: "3rem", color: "rgba(255,255,255,0.07)" }}>◇</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "300px",
            gap: "1px",
          }}
        >
          {STYLES.map((style, i) => (
            <StyleCard key={style.id} style={style} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "4rem auto 0",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <BlurText
            text="Vous ne trouvez pas votre style ?"
            animateBy="words"
            direction="top"
            className="gallery-question"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.5)",
            }}
          />
        </div>
        <a
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 32px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#ffffff",
            fontFamily: "'Space Mono', monospace",
            fontSize: "9.5px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: "2px",
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          Consultation personnalisée
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes galleryTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-auto-rows: 260px !important;
          }
          .gallery-grid > div[style*="span 2"] {
            grid-row: span 1 !important;
          }
        }
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}