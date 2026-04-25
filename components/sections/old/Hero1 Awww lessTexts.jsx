"use client";

import { useRef, useEffect } from "react";
import Image from 'next/image'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Scene3D from "../3d/Scene3D";
import ShinyText from "../Texts/ShinyText";
import ScrollVelocity from "../Texts/ScrollVelocity";
import CircularText from "../Texts/CircularText";

gsap.registerPlugin(ScrollTrigger);

// ─── Keyframes & fonts injectés une seule fois ───────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');

  @keyframes scrollLine {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(200%); }
  }
  @keyframes pulseGold {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const subtitles = [
  "Précision · Élégance · Style",
  "Confiance · Personnalité · Beauté",
  "Tradition africaine · Modernité",
];

export default function Hero() {
  const sectionRef  = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef      = useRef(null);

  // ─── Injection globale des styles ──────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("hero-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "hero-global-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  // ─── Animation subtitle GSAP ScrollTrigger ─────────────────────────────────
  useEffect(() => {
    let currentIndex = -1;

    const splitText = (text) =>
      text
        .split("")
        .map(
          (c) =>
            `<span class="char" style="display:inline-block">${
              c === " " ? "&nbsp;" : c
            }</span>`
        )
        .join("");

    const animateText = (text) => {
      const el = subtitleRef.current;
      if (!el) return;
      el.innerHTML = splitText(text);
      gsap.fromTo(
        el.querySelectorAll(".char"),
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.022,
          duration: 0.65,
          ease: "power3.out",
        }
      );
    };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${subtitles.length * 420}`,
      scrub: 1,
      pin: true,
      onUpdate: (self) => {
        const idx = Math.min(
          subtitles.length - 1,
          Math.floor(self.progress * subtitles.length * 0.999)
        );
        if (idx !== currentIndex) {
          currentIndex = idx;
          animateText(subtitles[idx]);
        }
      },
    });

    // Entrée initiale du bouton
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );

    animateText(subtitles[0]);
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* ── 3D Background (intact) ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Scene3D />
      </div>

      {/* ── Vignette overlay ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          AWWWARDS FLOATING LABELS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Top-left : index de section ───────────────────────────────────── */}
      <div
        className="absolute top-8 left-8 z-20 pointer-events-none"
        style={{ animation: "fadeInUp 1s ease 0.3s both" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
          }}
        >
          01 &nbsp;/&nbsp; 07
        </span>
      </div>

      {/* ── Top-right : badge live ─────────────────────────────────────────── */}
      <div
        className="absolute top-8 right-8 z-20 pointer-events-none flex items-center gap-2"
        style={{ animation: "fadeInUp 1s ease 0.4s both" }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#D4AF37",
            animation: "pulseGold 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 2
          }}
        >
          Salon Premium — Kinshasa 
          <div style={{ position: 'relative', width: '13px', height: '0px' }}>
            <Image
              src="/images/drapeau-republique-democratique-du-congo.png"
              alt="Drapeau de la République Démocratique du Congo"
              width={626}
              height={417}
              priority // Optionnel : à utiliser si l'image est en haut de page (LCP)
              style={{ objectFit: 'cover', marginTop:-5 }}
            />
          </div>
        </span>
      </div>

      {/* ── Left : texte vertical ─────────────────────────────────────────── */}
      <div
        className="absolute left-7 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block"
        style={{ animation: "fadeInUp 1.2s ease 0.6s both" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "block",
          }}
        >
          Lntouch — Est. 2020 — Afro Style
        </span>
      </div>

      {/* ── Right : scroll indicator textuel ─────────────────────────────── */}
      <div className="absolute right-7 bottom-20 z-20 pointer-events-none hidden md:flex flex-col items-center gap-3">
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        {/* Ligne animée */}
        <div
          style={{
            width: "1px",
            height: "56px",
            background: "rgba(255,255,255,0.12)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
              background: "#D4AF37",
              animation: "scrollLine 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ── Bottom-left : texte circulaire ────────────────────────────────── */}
      <div
        className="absolute bottom-14 left-8 z-20 pointer-events-none hidden lg:block"
        style={{ opacity: 0.45 }}
      >
        <CircularText
          text="LNTOUCH • BEAUTÉ • STYLE • TRESSES • "
          onHover="slowDown"
          spinDuration={14}
          style={{ width: "84px", height: "84px", fontSize: "8.5px" }}
        />
      </div>

      {/* ── Angle bas-droit : coordonnées ─────────────────────────────────── */}
      <div
        className="absolute bottom-14 right-8 z-20 pointer-events-none hidden md:block"
        style={{ textAlign: "right" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.18)",
            display: "block",
          }}
        >
          48°51'N 2°21'E
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.18)",
            display: "block",
          }}
        >
          Paris, France
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTENU PRINCIPAL
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">

        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-5"
          style={{ animation: "fadeInUp 0.9s ease 0.2s both" }}
        >
          <div style={{ height: "1px", width: "36px", background: "rgba(212,175,55,0.55)" }} />
          <ShinyText
            text="Tresses Africaines Modernes"
            speed={3}
            color="rgba(212,175,55,0.8)"
            shineColor="#fff8dc"
            spread={90}
            direction="left"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          />
          <div style={{ height: "1px", width: "36px", background: "rgba(212,175,55,0.55)" }} />
        </div>

        {/* Titre principal */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(5rem, 14vw, 10.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            background: "linear-gradient(135deg, #ffffff 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "fadeInUp 1s ease 0.35s both",
          }}
        >
          Beauté
        </h1>

        {/* Subtitle animé — bien visible maintenant */}
        <h2
          ref={subtitleRef}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.15rem, 2.8vw, 1.85rem)",
            fontWeight: 600,
            fontStyle: "italic",
            letterSpacing: "0.14em",
            color: "#ffffff",
            textShadow: "0 0 48px rgba(212,175,55,0.45)",
            minHeight: "2.4rem",
            marginTop: "1rem",
          }}
        />

        {/* Séparateur ornemental */}
        <div
          className="flex items-center gap-4 mt-5"
          style={{ animation: "fadeInUp 1s ease 0.55s both" }}
        >
          <div style={{ height: "1px", width: "48px", background: "rgba(255,255,255,0.15)" }} />
          <div
            style={{
              width: "7px",
              height: "7px",
              transform: "rotate(45deg)",
              background: "#D4AF37",
              opacity: 0.8,
            }}
          />
          <div style={{ height: "1px", width: "48px", background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* CTA */}
        <button
          ref={btnRef}
          className="pointer-events-auto group relative overflow-hidden"
          style={{
            marginTop: "2rem",
            padding: "15px 44px",
            border: "1px solid rgba(212,175,55,0.45)",
            background: "transparent",
            color: "white",
            letterSpacing: "0.22em",
            fontSize: "12px",
            fontFamily: "'Space Mono', monospace",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "border-color 0.3s ease, color 0.3s ease",
            opacity: 0, // géré par GSAP
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,175,55,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)";
          }}
        >
          <span className="relative z-10">Réserver ma séance</span>
          {/* Hover fill */}
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-0"
            style={{
              background: "rgba(212,175,55,0.12)",
              transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TICKER BAS DE PAGE
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "10px 0",
        }}
      >
        <ScrollVelocity
          texts={[
            "BOX BRAIDS · FULANI BRAIDS · KNOTLESS · CORNROWS · GODDESS BRAIDS · LNTOUCH",
          ]}
          velocity={35}
          className="uppercase"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
          }}
        />
      </div>
    </section>
  );
}