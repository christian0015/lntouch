"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import EstheticOne from "./EstheticOne";
import EstheticTwo from "./EstheticTwo";
import EstheticThree from "./EstheticThree";

gsap.registerPlugin(ScrollTrigger);

// ─── Story content ────────────────────────────────────────────────────────────
const STORY = [
  {
    idx: "01",
    title: "Née d'une passion",
    body: "LN Touch est née d'une obsession du détail. Chaque tresse porte en elle des heures de soin et de précision silencieuse.",
    geo: "diamond",
  },
  {
    idx: "02",
    title: "Racines africaines",
    body: "Notre art puise dans les traditions millénaires du continent — réinterprétées pour la femme d'aujourd'hui.",
    geo: "arc",
  },
  {
    idx: "03",
    title: "Esthétique moderne",
    body: "Box braids, Fulani, Knotless — chaque style est une déclaration. Une signature qui vous ressemble.",
    geo: "zigzag",
  },
  {
    idx: "04",
    title: "Votre identité",
    body: "Vous entrez avec une idée. Vous repartez avec une identité. C'est ça, l'expérience LN Touch.",
    geo: "cross",
  },
];

// ─── Per-panel SVG geometry ───────────────────────────────────────────────────
function PanelGeo({ type }) {
  const b = "rgba(255,255,255,0.07)";
  const a = "rgba(255,255,255,0.13)";
  if (type === "diamond")
    return (
      <svg aria-hidden style={{ position: "absolute", top: "13%", right: "8%", pointerEvents: "none" }} width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="5" y="5" width="50" height="50" stroke={b} strokeWidth="1" transform="rotate(45 30 30)" />
        <rect x="15" y="15" width="30" height="30" stroke={a} strokeWidth="1" transform="rotate(45 30 30)" />
        <circle cx="30" cy="30" r="2" fill={a} />
      </svg>
    );
  if (type === "arc")
    return (
      <svg aria-hidden style={{ position: "absolute", bottom: "24%", left: "6%", pointerEvents: "none" }} width="80" height="50" viewBox="0 0 80 50" fill="none">
        <path d="M0 45 Q40 0 80 45" stroke={b} strokeWidth="1" fill="none" />
        <path d="M10 45 Q40 10 70 45" stroke={a} strokeWidth="1" fill="none" />
      </svg>
    );
  if (type === "zigzag")
    return (
      <svg aria-hidden style={{ position: "absolute", top: "16%", left: "5%", pointerEvents: "none" }} width="50" height="70" viewBox="0 0 50 70" fill="none">
        <polyline points="48,0 2,14 48,28 2,42 48,56 2,70" stroke={b} strokeWidth="1" fill="none" />
        <polyline points="38,0 12,10 38,20 12,30 38,40 12,50 38,60 12,70" stroke={a} strokeWidth="1" fill="none" strokeDasharray="2 5" />
      </svg>
    );
  if (type === "cross")
    return (
      <svg aria-hidden style={{ position: "absolute", top: "12%", right: "10%", pointerEvents: "none" }} width="44" height="44" viewBox="0 0 44 44" fill="none">
        <line x1="22" y1="0" x2="22" y2="44" stroke={b} strokeWidth="1" />
        <line x1="0" y1="22" x2="44" y2="22" stroke={b} strokeWidth="1" />
        <rect x="10" y="10" width="24" height="24" stroke={a} strokeWidth="1" />
        <circle cx="22" cy="22" r="3" stroke={a} strokeWidth="1" fill="none" />
      </svg>
    );
  return null;
}

// ─── Global styles + keyframes ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');

  .story-img-wrap:hover .story-img-overlay-inner { opacity: 1 !important; }
  .story-img-wrap:hover .story-img-el            { transform: scale(1.05); filter: blur(4px); }
  .story-img-el {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), filter 0.6s ease;
    display: block;
  }

  @keyframes storyScrollBounce {
    0%   { transform: translateY(0); opacity: 0.7; }
    50%  { transform: translateY(7px); opacity: 0.3; }
    100% { transform: translateY(0); opacity: 0.7; }
  }
  @keyframes storyScrollBounceH {
    0%   { transform: translateX(0); opacity: 0.7; }
    50%  { transform: translateX(7px); opacity: 0.3; }
    100% { transform: translateX(0); opacity: 0.7; }
  }
  @keyframes storyPulse {
    0%,100% { opacity: 0.18; transform: scale(1); }
    50%     { opacity: 0.45; transform: scale(1.08); }
  }
  @keyframes storyFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Desktop esthetic panels (replacing videos) ───────────────────────────────
function EstheticPanel({ type, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getEsthetic = () => {
    switch(index) {
      case 0: return <EstheticOne isHovered={isHovered} />;
      case 1: return <EstheticTwo isHovered={isHovered} />;
      // case 2: return <EstheticThree isHovered={isHovered} />;
      default: return null;
    }
  };

  const getBgColor = () => {
    switch(index) {
      case 0: return "rgba(10,22,40,0.35)";
      case 1: return "rgba(0,0,0,0.4)";
      case 2: return "rgba(24,8,16,0.35)";
      default: return "rgba(0,0,0,0.38)";
    }
  };

  const getBorderColor = () => {
    switch(index) {
      case 0: return "rgba(100,150,200,0.2)";
      case 1: return "rgba(80,80,90,0.2)";
      case 2: return "rgba(160,100,110,0.2)";
      default: return "rgba(255,255,255,0.06)";
    }
  };

  return (
    <div 
      style={{ 
        flex: 1, 
        overflow: "hidden", 
        position: "relative", 
        borderBottom: index < 2 ? `1px solid ${getBorderColor()}` : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Esthetic component */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        zIndex: 1,
        transition: "transform 0.5s ease, filter 0.5s ease",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
      }}>
        {getEsthetic()}
      </div>
      
      {/* Overlay sombre avec opacité réduite - plus lumineuse si hover */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          background: getBgColor(),
          transition: "opacity 0.4s ease",
          opacity: isHovered ? 0.2 : 0.6,
          zIndex: 2,
        }} 
      />
      
      {/* Index label */}
      <span 
        style={{ 
          position: "absolute", 
          bottom: 10, 
          left: 14, 
          fontFamily: "'Space Mono', monospace",
          fontSize: "9.5px",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
          zIndex: 3,
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
      >
        0{index + 1}
      </span>
    </div>
  );
}

// ─── Desktop image card ───────────────────────────────────────────────────────
function ImgCard({ forwardRef, src, alt, label, href, style }) {
  return (
    <div
      ref={forwardRef}
      className="story-img-wrap"
      style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        transform: "translateY(-50%)", height: "70vh",
        overflow: "hidden", cursor: "pointer", ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="story-img-el" />
      <div className="story-img-overlay-inner" style={{ position: "absolute", inset: 0, background: "rgba(6,6,10,0.7)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.2rem", opacity: 0, transition: "opacity 0.45s ease" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "rgba(255,255,255,0.82)", letterSpacing: "0.06em" }}>{label}</span>
        <a href={href} style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.24em", color: "#fff", textDecoration: "none", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.32)", padding: "10px 24px" }}>Voir la galerie →</a>
      </div>
      <svg aria-hidden style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M0 8 L0 0 L8 0" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </svg>
      <svg aria-hidden style={{ position: "absolute", bottom: 12, right: 12, pointerEvents: "none" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M20 12 L20 20 L12 20" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Lerp helper ─────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ─── Main component ───────────────────────────────────────────────────────────
export default function Story() {
  // Desktop refs
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const img1Ref     = useRef(null);
  const img2Ref     = useRef(null);
  const textRefs    = useRef([]);
  // Desktop progress indicator
  const deskFillRef  = useRef(null);
  const deskPctRef   = useRef(null);
  const deskHintRef  = useRef(null);

  // Mobile refs
  const mobileSectionRef = useRef(null);
  const mobileTrackRef   = useRef(null);
  const mobileImg1Ref    = useRef(null);
  const mobileImg2Ref    = useRef(null);
  const mobileRulerRef   = useRef(null);
  const mobileRulerPctRef = useRef(null);
  const mobileDotsRef    = useRef([]);
  const mobileHintRef    = useRef(null);

  useEffect(() => {
    if (document.getElementById("story-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "story-global-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    let rafLoopId = null;
    const mm = gsap.matchMedia();

    // ════════════════════════════════════════════════════════════════════
    // DESKTOP — pin enabled to scroll through all 4 texts
    // ════════════════════════════════════════════════════════════════════
    mm.add("(min-width: 769px)", () => {
      const BH = window.innerHeight;
      let rawProgress = 0;
      let smoothProgress = 0;
      let hintHidden = false;

      const applyDesktop = (p) => {
        // ── Text track
        if (trackRef.current) gsap.set(trackRef.current, { y: -p * BH * 3 });

        // ── Images crossfade
        const blend = Math.max(0, Math.min(1, (p - 0.44) / 0.12));
        if (img1Ref.current) img1Ref.current.style.opacity = String(1 - blend);
        if (img2Ref.current) img2Ref.current.style.opacity = String(blend);

        // ── Text highlight
        const floatActive = p * 3;
        textRefs.current.forEach((el, i) => {
          if (!el) return;
          const dist = Math.abs(i - floatActive);
          const op = Math.max(0.12, 1 - dist * 1.4);
          const blur = Math.min(2, dist * 1.6);
          const ty = Math.min(8, dist * 5);
          el.style.opacity   = String(Math.min(1, op));
          el.style.filter    = `blur(${blur.toFixed(1)}px)`;
          el.style.transform = `translateY(${ty.toFixed(1)}px)`;
        });

        // ── Progress indicator
        const pct = Math.round(p * 100);
        if (deskFillRef.current)  deskFillRef.current.style.height = `${p * 100}%`;
        if (deskPctRef.current)   deskPctRef.current.textContent   = `${pct}%`;

        // ── Hide scroll hint after 5%
        if (!hintHidden && p > 0.04 && deskHintRef.current) {
          hintHidden = true;
          deskHintRef.current.style.opacity  = "0";
          deskHintRef.current.style.transform = "translateY(8px)";
        }
        if (hintHidden && p < 0.01 && deskHintRef.current) {
          hintHidden = false;
          deskHintRef.current.style.opacity  = "1";
          deskHintRef.current.style.transform = "translateY(0)";
        }
      };

      const loop = () => {
        smoothProgress = lerp(smoothProgress, rawProgress, 0.072);
        applyDesktop(smoothProgress);
        rafLoopId = requestAnimationFrame(loop);
      };
      loop();

      textRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transition = "opacity 0.15s ease, filter 0.15s ease, transform 0.15s ease";
      });

      // ScrollTrigger with pin enabled to scroll through all 4 text sections
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${BH * 10}`,
        pin: true,
        onUpdate: (self) => { rawProgress = self.progress; },
      });

      return () => {
        st.kill();
        if (rafLoopId) cancelAnimationFrame(rafLoopId);
      };
    });

    // ════════════════════════════════════════════════════════════════════
    // MOBILE — lerp damping, horizontal scroll, progress, hint
    // ════════════════════════════════════════════════════════════════════
    mm.add("(max-width: 768px)", () => {
      const VW = window.innerWidth;
      const totalTravel = VW * 3;
      let rawProgress = 0;
      let smoothProgress = 0;
      let hintHidden = false;

      const applyMobile = (p) => {
        if (mobileTrackRef.current) gsap.set(mobileTrackRef.current, { x: -p * totalTravel });

        const blend = Math.max(0, Math.min(1, (p - 0.42) / 0.16));
        if (mobileImg1Ref.current) mobileImg1Ref.current.style.opacity = String(1 - blend);
        if (mobileImg2Ref.current) mobileImg2Ref.current.style.opacity = String(blend);

        const pct = Math.round(p * 100);
        if (mobileRulerRef.current)    mobileRulerRef.current.style.width = `${p * 100}%`;
        if (mobileRulerPctRef.current) mobileRulerPctRef.current.textContent = `${pct}%`;

        const floatPanel = p * 3;
        const panels = mobileTrackRef.current
          ? mobileTrackRef.current.querySelectorAll(".mobile-panel-text")
          : [];
        panels.forEach((el, i) => {
          const dist = Math.abs(i - floatPanel);
          const op = Math.max(0, 1 - dist * 1.8);
          const ty = Math.min(14, dist * 8);
          const sc = Math.max(0.94, 1 - dist * 0.04);
          el.style.opacity   = String(Math.min(1, op));
          el.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
        });

        const activePanel = Math.min(3, Math.floor(p * 4 + 0.001));
        mobileDotsRef.current.forEach((dot, i) => {
          if (!dot) return;
          dot.style.width      = i === activePanel ? "18px" : "5px";
          dot.style.background = i === activePanel ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)";
        });

        if (!hintHidden && p > 0.04 && mobileHintRef.current) {
          hintHidden = true;
          mobileHintRef.current.style.opacity   = "0";
          mobileHintRef.current.style.transform = "translateX(8px)";
        }
        if (hintHidden && p < 0.01 && mobileHintRef.current) {
          hintHidden = false;
          mobileHintRef.current.style.opacity   = "1";
          mobileHintRef.current.style.transform = "translateX(0)";
        }
      };

      const loop = () => {
        smoothProgress = lerp(smoothProgress, rawProgress, 0.072);
        applyMobile(smoothProgress);
        rafLoopId = requestAnimationFrame(loop);
      };
      loop();

      const panels = mobileTrackRef.current
        ? mobileTrackRef.current.querySelectorAll(".mobile-panel-text")
        : [];
      panels.forEach((el) => {
        el.style.transition = "opacity 0.12s ease, transform 0.12s ease";
      });

      const st = ScrollTrigger.create({
        trigger: mobileSectionRef.current,
        start: "top top",
        end: `+=${totalTravel}`,
        pin: true,
        onUpdate: (self) => { rawProgress = self.progress; },
      });

      return () => {
        st.kill();
        if (rafLoopId) cancelAnimationFrame(rafLoopId);
      };
    });

    return () => mm.revert();
  }, []);

  const L = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "9.5px",
    letterSpacing: "0.28em",
    color: "rgba(255,255,255,0.2)",
    textTransform: "uppercase",
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          DESKTOP
      ════════════════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hidden md:block"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(110deg, #0a1628 0%, #090909 28%, #090909 72%, #180a10 100%)",
        }}
      >
        {/* SVG geometry */}
        <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <line x1="450" y1="0" x2="450" y2="1000" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <line x1="720" y1="0" x2="720" y2="1000" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="333" x2="450" y2="333" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          <line x1="0" y1="666" x2="450" y2="666" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          <line x1="450" y1="500" x2="720" y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 9" />
          <line x1="0" y1="0" x2="450" y2="1000" stroke="rgba(255,255,255,0.028)" strokeWidth="1" />
          <line x1="450" y1="0" x2="0" y2="1000" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <path d="M 0 800 Q 250 700 450 760 Q 600 810 720 730 Q 860 640 1000 700" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <polyline points="997,0 990,55 997,110 990,165 997,220 990,275 997,330 990,385 997,440 990,495 997,550 990,605 997,660 990,715 997,770 990,825 997,880 990,935 997,1000" stroke="rgba(255,255,255,0.045)" strokeWidth="1" fill="none" />
          <path d="M 18 46 L 18 18 L 46 18" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
          <path d="M 982 954 L 982 982 L 954 982" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
          <path d="M 18 954 L 18 982 L 46 982" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
          <path d="M 982 46 L 982 18 L 954 18" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
          <rect x="220" y="490" width="10" height="10" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" transform="rotate(45 225 495)" />
          <rect x="968" y="490" width="10" height="10" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" transform="rotate(45 973 495)" />
          <rect x="450" y="490" width="8" height="8" stroke="rgba(255,255,255,0.11)" strokeWidth="1" fill="none" transform="rotate(45 454 494)" />
        </svg>

        {/* ── Floating labels ─────────────────────────────────────────── */}
        <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
          <span style={L}>02&nbsp;/&nbsp;07</span>
        </div>
        <div style={{ position: "absolute", top: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
          <span style={L}>Notre Histoire</span>
          <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
        </div>
        <div style={{ position: "absolute", top: "1.75rem", right: "3.5rem", zIndex: 10, pointerEvents: "none" }}>
          <span style={L}>Story</span>
        </div>

        {/* ── Vertical side label ─────────────────────────────────────── */}
        <div style={{ position: "absolute", bottom: "4rem", left: "1.75rem", zIndex: 10, pointerEvents: "none" }}>
          <span style={{ ...L, writingMode: "vertical-rl", transform: "rotate(180deg)", display: "block" }}>
            Tresses · Art · Identité
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP PROGRESS INDICATOR — right edge vertical bar
        ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            right: "1.6rem",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          <span
            ref={deskPctRef}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8.5px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.28)",
              minWidth: "28px",
              textAlign: "center",
            }}
          >
            0%
          </span>

          <div
            style={{
              width: "1px",
              height: "110px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              ref={deskFillRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "0%",
                background: "rgba(255,255,255,0.55)",
              }}
            />
          </div>

          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)",
              animation: "storyPulse 2.4s ease-in-out infinite",
            }}
          />

          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7.5px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.16)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              marginTop: "4px",
            }}
          >
            Scroll
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP SCROLL HINT — bottom center, fades on scroll start
        ══════════════════════════════════════════════════════════════ */}
        <div
          ref={deskHintRef}
          style={{
            position: "absolute",
            bottom: "2.4rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            animation: "storyFadeIn 1.2s ease 0.8s both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span style={{ ...L, fontSize: "8.5px" }}>Défiler pour découvrir</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 2 L6 10 M3 7 L6 10 L9 7" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                width="12"
                height="6"
                viewBox="0 0 12 6"
                fill="none"
                aria-hidden
                style={{
                  animation: `storyScrollBounce 1.6s ease-in-out ${i * 0.18}s infinite`,
                  opacity: 0.7 - i * 0.22,
                }}
              >
                <path d="M1 1 L6 5 L11 1" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              </svg>
            ))}
          </div>

          <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden style={{ marginTop: "2px" }}>
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <line x1="9" y1="6" x2="9" y2="11" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: "storyScrollBounce 1.8s ease-in-out infinite" }}
            />
          </svg>

          <div style={{ position: "relative", width: "32px", height: "32px", marginTop: "4px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", animation: "storyPulse 2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: "8px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)" }} />
          </div>
        </div>

        {/* ── Desktop layout ───────────────────────────────────────────── */}
        <div style={{ height: "100vh", width: "100%", display: "flex" }}>
          {/* 3 esthetic panels (replacing videos) */}
          <div style={{ width: "45%", height: "100vh", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {[0, 1, 2].map((i) => (
              <EstheticPanel key={i} index={i} />
            ))}
          </div>

          {/* Text + image column */}
          <div style={{ width: "55%", height: "100vh", display: "flex" }}>
            <div style={{ flex: "0 0 58%", height: "100vh", overflow: "hidden", position: "relative" }}>
              <div ref={trackRef}>
                {STORY.map((block, i) => (
                  <div key={i} style={{ height: "100vh", display: "flex", alignItems: "center", padding: "6rem 4% 6rem 8%" }}>
                    <div ref={(el) => { textRefs.current[i] = el; }} style={{ maxWidth: "380px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                        <span style={L}>{block.idx}</span>
                        <div style={{ height: "1px", width: "40px", background: "rgba(255,255,255,0.14)" }} />
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.85rem, 2.6vw, 2.75rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.12, letterSpacing: "-0.01em", margin: 0 }}>
                        {block.title}
                      </h3>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.56)", marginTop: "1.25rem", lineHeight: 1.85 }}>
                        {block.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2.2rem" }}>
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                          <path d="M6 1L1 1L1 13L6 13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        </svg>
                        <span style={{ ...L, fontSize: "8.5px" }}>LN Touch</span>
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                          <path d="M14 1L19 1L19 13L14 13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "0 0 42%", height: "100vh", position: "relative", overflow: "hidden" }}>
              <ImgCard forwardRef={img1Ref} src="/images/fulani_braids.png" alt="Tresses artisanales LN Touch" label="Tresses artisanales" href="/galerie" style={{ opacity: 1, transition: "opacity 0.5s ease" }} />
              <ImgCard forwardRef={img2Ref} src="/images/fulani_braids.png" alt="Style contemporain LN Touch" label="Style contemporain" href="/galerie" style={{ opacity: 0, transition: "opacity 0.5s ease" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE — horizontal scroll
      ════════════════════════════════════════════════════════════════ */}
      <section
        ref={mobileSectionRef}
        className="md:hidden"
        style={{
          position: "relative",
          overflow: "hidden",
          height: "100svh",
          background: "linear-gradient(160deg, #0a1628 0%, #090909 30%, #090909 70%, #180a10 100%)",
        }}
      >
        {/* Fixed background images */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div ref={mobileImg1Ref} style={{ position: "absolute", inset: 0, opacity: 1, transition: "opacity 0.6s ease" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/story-img-1.jpg" alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
          </div>
          <div ref={mobileImg2Ref} style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.6s ease" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/story-img-2.jpg" alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(9,9,9,0.62) 0%, rgba(9,9,9,0.28) 38%, rgba(9,9,9,0.75) 100%)" }} />
        </div>

        {/* Global mobile SVG geometry */}
        <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 400 896">
          <line x1="0" y1="116" x2="400" y2="116" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="780" x2="400" y2="780" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M 0 78 Q 100 48 200 66 Q 300 84 400 58" stroke="rgba(255,255,255,0.038)" strokeWidth="1" fill="none" />
          <path d="M 0 818 Q 100 842 200 822 Q 300 802 400 832" stroke="rgba(255,255,255,0.038)" strokeWidth="1" fill="none" />
          <path d="M 16 42 L 16 16 L 42 16" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          <path d="M 384 854 L 384 880 L 358 880" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          <path d="M 16 854 L 16 880 L 42 880" stroke="rgba(255,255,255,0.055)" strokeWidth="1" fill="none" />
          <path d="M 384 42 L 384 16 L 358 16" stroke="rgba(255,255,255,0.055)" strokeWidth="1" fill="none" />
          <rect x="194" y="442" width="12" height="12" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" transform="rotate(45 200 448)" />
          <line x1="18" y1="116" x2="18" y2="780" stroke="rgba(255,255,255,0.038)" strokeWidth="1" strokeDasharray="3 8" />
          <line x1="382" y1="116" x2="382" y2="780" stroke="rgba(255,255,255,0.038)" strokeWidth="1" strokeDasharray="3 8" />
          <polyline points="0,3 20,0 40,3 60,0 80,3 100,0 120,3 140,0 160,3 180,0 200,3 220,0 240,3 260,0 280,3 300,0 320,3 340,0 360,3 380,0 400,3" stroke="rgba(255,255,255,0.042)" strokeWidth="1" fill="none" />
          <polyline points="0,893 20,896 40,893 60,896 80,893 100,896 120,893 140,896 160,893 180,896 200,893 220,896 240,893 260,896 280,893 300,896 320,893 340,896 360,893 380,896 400,893" stroke="rgba(255,255,255,0.042)" strokeWidth="1" fill="none" />
          <line x1="0" y1="116" x2="400" y2="780" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
          <line x1="400" y1="116" x2="0" y2="780" stroke="rgba(255,255,255,0.014)" strokeWidth="1" />
        </svg>

        {/* Top labels */}
        <div style={{ position: "absolute", top: "1.4rem", left: "1.5rem", zIndex: 10, pointerEvents: "none" }}>
          <span style={L}>02&nbsp;/&nbsp;07</span>
        </div>
        <div style={{ position: "absolute", top: "1.4rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
          <div style={{ height: "1px", width: "18px", background: "rgba(255,255,255,0.1)" }} />
          <span style={L}>Notre Histoire</span>
          <div style={{ height: "1px", width: "18px", background: "rgba(255,255,255,0.1)" }} />
        </div>
        <div style={{ position: "absolute", top: "1.4rem", right: "1.5rem", zIndex: 10, pointerEvents: "none" }}>
          <span style={L}>Story</span>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE SCROLL HINT — left center, fades on scroll start
        ══════════════════════════════════════════════════════════════ */}
        <div
          ref={mobileHintRef}
          style={{
            position: "absolute",
            left: "1.4rem",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            animation: "storyFadeIn 1.2s ease 1s both",
          }}
        >
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden>
            <rect x="1" y="1" width="26" height="16" rx="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="6" y1="9" x2="11" y2="9" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: "storyScrollBounceH 1.8s ease-in-out infinite" }} />
          </svg>

          <div style={{ display: "flex", gap: "2px" }}>
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                aria-hidden
                style={{
                  animation: `storyScrollBounceH 1.5s ease-in-out ${i * 0.18}s infinite`,
                  opacity: 0.7 - i * 0.22,
                }}
              >
                <path d="M1 1 L5 5 L1 9" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              </svg>
            ))}
          </div>

          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              marginTop: "4px",
            }}
          >
            Scroll
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE PROGRESS — bottom, ruler + percentage
        ══════════════════════════════════════════════════════════════ */}

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div ref={mobileRulerRef} style={{ height: "1px", width: "0%", background: "rgba(255,255,255,0.3)" }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "1.55rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {STORY.map((_, i) => (
            <div
              key={i}
              ref={(el) => { mobileDotsRef.current[i] = el; }}
              style={{
                height: "1px",
                width: i === 0 ? "18px" : "5px",
                background: i === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)",
                transition: "width 0.35s ease, background 0.35s ease",
              }}
            />
          ))}

          <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.1)" }} />

          <span
            ref={mobileRulerPctRef}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            0%
          </span>
        </div>

        {/* Horizontal sliding track */}
        <div
          ref={mobileTrackRef}
          style={{
            position: "absolute",
            top: 0, left: 0,
            height: "100%",
            width: "400vw",
            display: "flex",
            willChange: "transform",
            zIndex: 5,
          }}
        >
          {STORY.map((block, i) => (
            <div
              key={i}
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "0 2.2rem",
              }}
            >
              {/* Per-panel geometry */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
                <PanelGeo type={block.geo} />
              </div>

              {/* Vertical panel index */}
              <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%) rotate(90deg)", fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", pointerEvents: "none" }}>
                {block.idx}
              </span>

              {/* Main text block */}
              <div
                className="mobile-panel-text"
                style={{
                  position: "relative",
                  zIndex: 3,
                  maxWidth: "310px",
                  textAlign: "center",
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.6rem" }}>
                  <div style={{ height: "1px", width: "22px", background: "rgba(255,255,255,0.14)" }} />
                  <span style={L}>{block.idx}</span>
                  <div style={{ height: "1px", width: "22px", background: "rgba(255,255,255,0.14)" }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.9rem, 7.5vw, 2.6rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0 }}>
                  {block.title}
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.06rem", fontStyle: "italic", color: "rgba(255,255,255,0.54)", marginTop: "1.1rem", lineHeight: 1.82 }}>
                  {block.body}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "2rem" }}>
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                    <path d="M5 1L1 1L1 11L5 11" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  </svg>
                  <span style={{ ...L, fontSize: "8px" }}>LN Touch</span>
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                    <path d="M13 1L17 1L17 11L13 11" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Bottom image strip */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "34%", overflow: "hidden", zIndex: 2, pointerEvents: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={i < 2 ? "/images/story-img-1.jpg" : "/images/story-img-2.jpg"}
                  alt="" aria-hidden
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", opacity: 0.3,
                    maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,9,9,0) 0%, rgba(9,9,9,0.88) 100%)" }} />
              </div>

              {/* Separator line at image boundary */}
              <div style={{ position: "absolute", bottom: "34%", left: "1.5rem", right: "1.5rem", height: "1px", background: "rgba(255,255,255,0.06)", zIndex: 4, pointerEvents: "none" }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}