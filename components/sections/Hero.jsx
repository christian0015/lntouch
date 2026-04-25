"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Scene3D from "../3d/Scene3D";
import ShinyText from "../Texts/ShinyText";
import ScrollVelocity from "../Texts/ScrollVelocity";
import CircularText from "../Texts/CircularText";
import TextPressure from "../Texts/TextPressure";
import Shuffle from "../Texts/Shuffle";

gsap.registerPlugin(ScrollTrigger);

// ─── Lerp ─────────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ─── Global styles + keyframes ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');

  @keyframes pulseGold {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroPulseRing {
    0%,100% { transform: scale(1);    opacity: 0.18; }
    50%     { transform: scale(1.12); opacity: 0.42; }
  }
  @keyframes heroScrollDot {
    0%   { transform: translateY(0);    opacity: 0.8; }
    80%  { transform: translateY(28px); opacity: 0; }
    100% { transform: translateY(28px); opacity: 0; }
  }
  @keyframes heroChevronBounce {
    0%,100% { transform: translateY(0);   opacity: 0.65; }
    50%     { transform: translateY(5px); opacity: 0.28; }
  }
  @keyframes heroChevronBounceH {
    0%,100% { transform: translateX(0);   opacity: 0.65; }
    50%     { transform: translateX(5px); opacity: 0.28; }
  }
`;

// ─── Shared mono label style ──────────────────────────────────────────────────
const LS = {
  fontFamily: "'Space Mono', monospace",
  fontSize: "10px",
  letterSpacing: "0.25em",
  color: "rgba(255,255,255,0.3)",
  textTransform: "uppercase",
};

export default function Hero() {
  const sectionRef = useRef(null);
  const btnRef = useRef(null);

  // Desktop progress
  const deskFillRef = useRef(null);
  const deskPctRef  = useRef(null);

  // Mobile progress
  const mobFillRef  = useRef(null);
  const mobPctRef   = useRef(null);

  // Scroll hints
  const deskHintRef = useRef(null);
  const mobHintRef  = useRef(null);

  // ── Inject global styles ───────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("hero-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "hero-global-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  // ── Scroll + progress ──────────────────────────────────────────────────────
  useEffect(() => {
    let rawP = 0, smoothP = 0, rafId = null, hintHidden = false;

    const applyProgress = (p) => {
      const pct = Math.round(p * 100);
      const clampedPct = Math.min(100, Math.max(0, pct));

      // Desktop bar + %
      if (deskFillRef.current) deskFillRef.current.style.height = `${Math.min(100, p * 100)}%`;
      if (deskPctRef.current)  deskPctRef.current.textContent   = `${clampedPct}%`;

      // Mobile bar + %
      if (mobFillRef.current) mobFillRef.current.style.width = `${Math.min(100, p * 100)}%`;
      if (mobPctRef.current)  mobPctRef.current.textContent  = `${clampedPct}%`;

      // Fade hints
      if (!hintHidden && p > 0.04) {
        hintHidden = true;
        [deskHintRef.current, mobHintRef.current].forEach((el) => {
          if (!el) return;
          el.style.opacity   = "0";
          el.style.transform = "translateX(-50%) translateY(8px)";
        });
      }
      if (hintHidden && p < 0.01) {
        hintHidden = false;
        [deskHintRef.current, mobHintRef.current].forEach((el) => {
          if (!el) return;
          el.style.opacity   = "1";
          el.style.transform = "translateX(-50%) translateY(0)";
        });
      }
    };

    // Persistent lerp loop
    const loop = () => {
      smoothP = lerp(smoothP, rawP, 0.08);
      applyProgress(smoothP);
      rafId = requestAnimationFrame(loop);
    };
    loop();

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = window.innerHeight;
      let progress = 0;
      
      if (rect.top < 0) {
        progress = Math.min(1, Math.abs(rect.top) / scrollableDistance);
      }
      
      rawP = progress;
    };

    window.addEventListener('scroll', handleScroll);
    
    gsap.fromTo(btnRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden bg-black">

      {/* ── 3D ─────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Scene3D />
      </div>

      {/* ── Vignette ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          TOP LABELS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* 01 / 07 */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none" style={{ animation: "fadeInUp 1s ease 0.3s both" }}>
        <span style={LS}>01 &nbsp;/&nbsp; 07</span>
      </div>

      {/* Shuffle top-center — desktop ─────────────────────────────────────── */}
      <div
        className="hidden lg:block absolute top-8 left-1/2 z-20 pointer-events-none"
        style={{ transform: "translateX(-50%)", animation: "fadeInUp 1s ease 0.45s both" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ height: "1px", width: "18px", background: "rgba(255,255,255,0.1)" }} />
          <Shuffle
            text="AFRO · STYLE · KINSHASA"
            shuffleDirection="right"
            duration={0.28}
            animationMode="evenodd"
            shuffleTimes={2}
            ease="power3.out"
            stagger={0.025}
            loop={true}
            loopDelay={4}
            respectReducedMotion={true}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}
          />
          <div style={{ height: "1px", width: "18px", background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>

      {/* Badge Kinshasa */}
      <div
        className="absolute top-8 right-8 z-20 pointer-events-none flex items-center gap-2"
        style={{ animation: "fadeInUp 1s ease 0.4s both" }}
      >
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#D4AF37", animation: "pulseGold 2s ease-in-out infinite" }} />
        <span style={{ ...LS, display: "flex", alignItems: "center", gap: 2 }}>
          Salon Premium — Kinshasa
          <div style={{ position: "relative", width: "13px", height: "0px" }}>
            <Image src="/images/drapeau-republique-democratique-du-congo.png" alt="Drapeau RDC" width={626} height={417} priority style={{ objectFit: "cover", marginTop: -5 }} />
          </div>
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT — vertical text
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-7 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block"
        style={{ animation: "fadeInUp 1.2s ease 0.6s both" }}
      >
        <span style={{ ...LS, fontSize: "9px", letterSpacing: "0.35em", color: "rgba(255,255,255,0.2)", writingMode: "vertical-rl", transform: "rotate(180deg)", display: "block" }}>
          Lntouch — Est. 2020 — Afro Style
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          RIGHT — progress indicator (desktop)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute right-7 z-20 pointer-events-none flex-col items-center gap-[7px] hidden md:flex"
        style={{ bottom: "5.2rem", animation: "fadeInUp 1.2s ease 0.7s both" }}
      >
        {/* % */}
        <span ref={deskPctRef} style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)" }}>
          0%
        </span>

        {/* SCROLL label */}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase", writingMode: "vertical-rl" }}>
          Scroll
        </span>

        {/* Actual progress line */}
        <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.1)", overflow: "hidden", position: "relative" }}>
          <div ref={deskFillRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "0%", background: "rgba(255,255,255,0.65)" }} />
        </div>

        {/* Pulse dot */}
        <div style={{ width: "4px", height: "4px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)", animation: "heroPulseRing 2.2s ease-in-out infinite" }} />
      </div>

      {/* ── TextPressure right edge — large screens ────────────────────────── */}
      <div
        className="hidden xl:block absolute z-20"
        style={{ right: "0px", top: "30%", width: "28px", height: "130px", pointerEvents: "auto", animation: "fadeInUp 1.4s ease 0.9s both" }}
      >
        <div
          style={{
            width: "130px",
            height: "28px",
            transform: "rotate(-90deg) translateX(-100%)",
            transformOrigin: "top left",
            opacity: 0.17,
            position: "relative",
          }}
        >
          <TextPressure
            text="BEAUTÉ"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic={false}
            textColor="#ffffff"
            strokeColor="#ffffff"
            minFontSize={10}
          />
        </div>
      </div>

      <div
        className="hidden 2xl:block absolute z-20"
        style={{ right: "0px", top: "58%", width: "28px", height: "110px", pointerEvents: "auto", animation: "fadeInUp 1.4s ease 1.0s both" }}
      >
        <div
          style={{
            width: "110px",
            height: "28px",
            transform: "rotate(-90deg) translateX(-100%)",
            transformOrigin: "top left",
            opacity: 0.12,
            position: "relative",
          }}
        >
          <TextPressure
            text="STYLE"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic={false}
            textColor="#ffffff"
            strokeColor="#ffffff"
            minFontSize={10}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM-LEFT — CircularText
      ══════════════════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM-RIGHT — Coordonnées + Shuffle
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-14 right-8 z-20 pointer-events-none hidden md:block"
        style={{ textAlign: "right" }}
      >
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)", display: "block" }}>
          4°19′S 15°19′E
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)", display: "block" }}>
          Kinshasa, RDC
        </span>
        <div style={{ marginTop: "5px" }}>
          <Shuffle
            text="EST. 2020"
            shuffleDirection="left"
            duration={0.3}
            animationMode="evenodd"
            shuffleTimes={2}
            stagger={0.04}
            loop={true}
            loopDelay={5}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.14)", textTransform: "uppercase" }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCROLL HINT — desktop bottom-center (fades on scroll)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={deskHintRef}
        className="hidden md:flex absolute z-20 flex-col items-center gap-[7px] pointer-events-none"
        style={{
          bottom: "6.5rem",
          right: "4%",
          transform: "translateX(-50%, 50%)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          animation: "fadeInUp 1s ease 1.4s both",
        }}
      >
        {/* Glassmorphism pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "5px 14px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase" }}>
            Défiler pour continuer
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M5 1 L5 9 M2.5 6.5 L5 9 L7.5 6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          </svg>
        </div>

        {/* Stacked chevrons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden
              style={{ animation: `heroChevronBounce 1.6s ease-in-out ${i * 0.18}s infinite`, opacity: 0.7 - i * 0.22 }}>
              <path d="M1 1 L6 5 L11 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </svg>
          ))}
        </div>

        {/* Mouse icon */}
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden>
          <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,255,255,0.17)" strokeWidth="1" />
          <circle cx="9" cy="7" r="1.5" fill="rgba(255,255,255,0.55)"
            style={{ animation: "heroScrollDot 1.8s ease-in-out infinite" }} />
        </svg>

        {/* Pulse ring */}
        <div style={{ position: "relative", width: "26px", height: "26px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", animation: "heroPulseRing 2.2s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: "6px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)" }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCROLL HINT — mobile bottom-center (fades on scroll)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={mobHintRef}
        className="md:hidden absolute z-20 flex flex-col items-center gap-[6px] pointer-events-none"
        style={{
          bottom: "6.2rem",
          left: "45%",
          transform: "translateX(-50%)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          animation: "fadeInUp 1s ease 1.4s both",
        }}
      >
        {/* Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "5px 12px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
            Défiler
          </span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M4 1 L4 7 M2 5 L4 7 L6 5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          </svg>
        </div>

        {/* Chevrons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          {[0, 1].map((i) => (
            <svg key={i} width="10" height="5" viewBox="0 0 10 5" fill="none" aria-hidden
              style={{ animation: `heroChevronBounce 1.6s ease-in-out ${i * 0.2}s infinite`, opacity: 0.65 - i * 0.2 }}>
              <path d="M1 1 L5 4 L9 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            </svg>
          ))}
        </div>

        {/* Mouse icon */}
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden>
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(255,255,255,0.17)" strokeWidth="1" />
          <circle cx="8" cy="6" r="1.5" fill="rgba(255,255,255,0.5)"
            style={{ animation: "heroScrollDot 1.8s ease-in-out infinite" }} />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE PROGRESS — bar + % (above ticker)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="md:hidden absolute z-20 pointer-events-none"
        style={{ bottom: "2.5rem", left: "1.5rem", right: "1.5rem" }}
      >
        {/* Bar */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "7px", overflow: "hidden" }}>
          <div ref={mobFillRef} style={{ height: "100%", width: "0%", background: "rgba(255,255,255,0.38)" }} />
        </div>

        {/* Label + % */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
            Scroll Progress
          </span>
          <span ref={mobPctRef} style={{ fontFamily: "'Space Mono', monospace", fontSize: "7.5px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)" }}>
            0%
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5" style={{ animation: "fadeInUp 0.9s ease 0.2s both" }}>
          <div style={{ height: "1px", width: "36px", background: "rgba(212,175,55,0.55)" }} />
          <ShinyText
            text="Tresses Africaines Modernes"
            speed={3}
            color="rgba(212,175,55,0.8)"
            shineColor="#fff8dc"
            spread={90}
            direction="left"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" }}
          />
          <div style={{ height: "1px", width: "36px", background: "rgba(212,175,55,0.55)" }} />
        </div>

        {/* H1 */}
        {/* <h1
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
        </h1> */}

        {/* Fixed subtitle */}
        {/* <h2
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
        >
          Précision · Élégance · Style
        </h2> */}

        {/* Ornamental separator */}
        <div className="flex items-center gap-4 mt-5" style={{ animation: "fadeInUp 1s ease 0.55s both" }}>
          <div style={{ height: "1px", width: "48px", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ width: "7px", height: "7px", transform: "rotate(45deg)", background: "#D4AF37", opacity: 0.8 }} />
          <div style={{ height: "1px", width: "48px", background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* CTA */}
        <a
          ref={btnRef}
          href="/reservation"
          className="pointer-events-auto group relative overflow-hidden"
          style={{
            marginTop: "14rem",
            padding: "15px 44px",
            border: "1px solid rgba(212,175,55,0.45)",
            background: "transparent",
            color: "white",
            letterSpacing: "0.22em",
            fontSize: "12px",
            fontFamily: "'Space Mono', monospace",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "border-color 0.3s ease",
            opacity: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.9)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)"; }}
        >
          <span className="relative z-10">Réserver ma séance</span>
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-0"
            style={{ background: "rgba(212,175,55,0.12)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TICKER — ScrollVelocity (desktop + mobile, toujours visible)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "9px 0" }}
      >
        <ScrollVelocity
          texts={["BOX BRAIDS · FULANI BRAIDS · KNOTLESS · CORNROWS · GODDESS BRAIDS · LNTOUCH"]}
          velocity={35}
          className="uppercase"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(8px, 2.2vw, 10px)",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.22)",
          }}
        />
      </div>
    </section>
  );
}