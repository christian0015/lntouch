"use client";

import { useRef, useEffect } from "react";
import Image from 'next/image'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Content ─────────────────────────────────────────────────────────────────
const STORY = [
  {
    idx: "01",
    title: "Née d'une passion",
    body: "LN Touch est née d'une obsession du détail. Chaque tresse porte en elle des heures de soin et de précision silencieuse.",
  },
  {
    idx: "02",
    title: "Racines africaines",
    body: "Notre art puise dans les traditions millénaires du continent — réinterprétées pour la femme d'aujourd'hui.",
  },
  {
    idx: "03",
    title: "Esthétique moderne",
    body: "Box braids, Fulani, Knotless — chaque style est une déclaration. Une signature qui vous ressemble.",
  },
  {
    idx: "04",
    title: "Votre identité",
    body: "Vous entrez avec une idée. Vous repartez avec une identité. C'est ça, l'expérience LN Touch.",
  },
];

// ─── Global styles (hover effects + font) ────────────────────────────────────
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
`;

// ─── Reusable image card ──────────────────────────────────────────────────────
function ImgCard({ forwardRef, src, alt, label, href, style }) {
  return (
    <div
      ref={forwardRef}
      className="story-img-wrap"
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        height: "70vh",
        overflow: "hidden",
        cursor: "pointer",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image width={300} height={400} src={src} alt={alt} className="story-img-el" />

      {/* Hover overlay */}
      <div
        className="story-img-overlay-inner"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(6,6,10,0.7)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.2rem",
          opacity: 0,
          transition: "opacity 0.45s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
        <a
          href={href}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "9.5px",
            letterSpacing: "0.24em",
            color: "#fff",
            textDecoration: "none",
            textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.32)",
            padding: "10px 24px",
            transition: "border-color 0.3s",
          }}
        >
          Voir la galerie →
        </a>
      </div>

      {/* Corner brackets */}
      <svg
        aria-hidden
        style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d="M0 8 L0 0 L8 0" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </svg>
      <svg
        aria-hidden
        style={{ position: "absolute", bottom: 12, right: 12, pointerEvents: "none" }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d="M20 12 L20 20 L12 20" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Story() {
  const sectionRef   = useRef(null);
  const trackRef     = useRef(null);
  const videoRefs    = useRef([]); // [0..2] desktop strips
  const mobileBgRef  = useRef(null);
  const textRefs     = useRef([]); // [0..3]
  const img1Ref      = useRef(null);
  const img2Ref      = useRef(null);

  // Inject global styles once
  useEffect(() => {
    if (document.getElementById("story-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "story-global-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  // GSAP
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    let rafId = null;

    // ── Helper: drive a video to a normalised local progress 0-1 ──────────
    const driveVideo = (v, localP) => {
      if (!v || !v.duration || v.duration === 0 || v.readyState < 2) return;
      const t = Math.max(0, Math.min(v.duration, localP * v.duration));
      if (Math.abs(v.currentTime - t) > 0.04) v.currentTime = t;
    };

    const mm = gsap.matchMedia();

    // ════════════════════════════════════════════════════════════════════════
    // DESKTOP
    // ════════════════════════════════════════════════════════════════════════
    mm.add("(min-width: 769px)", () => {
      const BH = window.innerHeight;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${BH * 4}`,   // pin for 4× viewport scroll
        scrub: 1.2,
        pin: true,
        onUpdate: (self) => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const p = self.progress; // 0 → 1

            // ── Text track slides up ─────────────────────────────────────
            gsap.set(track, { y: -p * BH * 3 });

            // ── 3 videos scroll-driven (each covers 1/3 of total range) ──
            videoRefs.current.forEach((v, i) => {
              const seg = 1 / 3;
              const lp  = Math.max(0, Math.min(1, (p - i * seg) / seg));
              driveVideo(v, lp);
            });

            // ── Image crossfade at midpoint (texts 2→3) ──────────────────
            const blend = Math.max(0, Math.min(1, (p - 0.44) / 0.12));
            if (img1Ref.current) img1Ref.current.style.opacity = String(1 - blend);
            if (img2Ref.current) img2Ref.current.style.opacity = String(blend);

            // ── Active text highlight ────────────────────────────────────
            const active = Math.min(3, Math.floor(p * 4 + 0.001));
            textRefs.current.forEach((el, i) => {
              if (!el) return;
              el.style.opacity    = i === active ? "1"       : "0.14";
              el.style.filter     = i === active ? "blur(0)" : "blur(1px)";
              el.style.transform  = i === active ? "translateY(0)" : "translateY(6px)";
            });
          });
        },
      });

      // Initial text state
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease";
        el.style.opacity    = i === 0 ? "1" : "0.14";
        el.style.filter     = i === 0 ? "blur(0)" : "blur(1px)";
      });

      return () => {
        st.kill();
        if (rafId) cancelAnimationFrame(rafId);
      };
    });

    // ════════════════════════════════════════════════════════════════════════
    // MOBILE — simple scroll reveals, no pin
    // ════════════════════════════════════════════════════════════════════════
    mm.add("(max-width: 768px)", () => {
      textRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        // Black dominant · subtle teal left · subtle burgundy right
        background:
          "linear-gradient(110deg, #0a1628 0%, #090909 28%, #090909 72%, #180a10 100%)",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          GEOMETRIC SVG OVERLAY (diagonal · arcs · zigzag · brackets)
      ══════════════════════════════════════════════════════════════════ */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 3,
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        {/* Column separators */}
        <line x1="450" y1="0" x2="450" y2="1000" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <line x1="720" y1="0" x2="720" y2="1000" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Horizontal thirds on video side */}
        <line x1="0"   y1="333" x2="450" y2="333" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
        <line x1="0"   y1="666" x2="450" y2="666" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />

        {/* Dashed guide lines on text side */}
        <line x1="450" y1="500" x2="720" y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 9" />

        {/* Diagonal cross (video column) */}
        <line x1="0"   y1="0"    x2="450" y2="1000" stroke="rgba(255,255,255,0.028)" strokeWidth="1" />
        <line x1="450" y1="0"    x2="0"   y2="1000" stroke="rgba(255,255,255,0.02)"  strokeWidth="1" />

        {/* Bezier arc bottom sweep */}
        <path
          d="M 0 800 Q 250 700 450 760 Q 600 810 720 730 Q 860 640 1000 700"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          fill="none"
        />

        {/* Zigzag — right edge */}
        <polyline
          points="
            997,0   990,55   997,110  990,165  997,220  990,275
            997,330 990,385  997,440  990,495  997,550  990,605
            997,660 990,715  997,770  990,825  997,880  990,935  997,1000
          "
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
          fill="none"
        />

        {/* Corner brackets */}
        <path d="M 18 46 L 18 18 L 46 18"  stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
        <path d="M 982 954 L 982 982 L 954 982" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
        <path d="M 18 954 L 18 982 L 46 982"  stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
        <path d="M 982 46 L 982 18 L 954 18"  stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />

        {/* Diamond accents */}
        <rect x="220" y="490" width="10" height="10" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" transform="rotate(45 225 495)" />
        <rect x="968" y="490" width="10" height="10" stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" transform="rotate(45 973 495)" />
        <rect x="450" y="490" width="8"  height="8"  stroke="rgba(255,255,255,0.11)" strokeWidth="1" fill="none" transform="rotate(45 454 494)" />
      </svg>

      {/* ══════════════════════════════════════════════════════════════════
          FLOATING LABELS
      ══════════════════════════════════════════════════════════════════ */}
      {/* Section counter */}
      <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          02&nbsp;/&nbsp;07
        </span>
      </div>

      {/* Center title */}
      <div style={{ position: "absolute", top: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>
          Notre Histoire
        </span>
        <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Right label */}
      <div style={{ position: "absolute", top: "1.75rem", right: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.16)", textTransform: "uppercase" }}>
          Story
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
            color: "rgba(255,255,255,0.13)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "block",
          }}
        >
          Tresses · Art · Identité
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex" style={{ height: "100vh", width: "100%" }}>

        {/* ── Left: 3 video strips ────────────────────────────────────── */}
        <div
          style={{
            width: "45%",
            height: "100vh",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={`/videos/story0${i + 1}_lntouch.mp4`}
                muted
                playsInline
                preload="auto"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Dark overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  // Video 1 = teal tint · Video 3 = rose tint
                  background:
                    i === 0
                      ? "rgba(10,22,40,0.45)"
                      : i === 2
                      ? "rgba(24,8,16,0.45)"
                      : "rgba(0,0,0,0.38)",
                }}
              />
              {/* Index label */}
              <span
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 14,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.18)",
                }}
              >
                0{i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* ── Right: Text track + Image panel ─────────────────────────── */}
        <div style={{ width: "55%", height: "100vh", display: "flex" }}>

          {/* Text sub-column */}
          <div
            style={{
              flex: "0 0 58%",
              height: "100vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div ref={trackRef}>
              {STORY.map((block, i) => (
                <div
                  key={i}
                  style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "6rem 4% 6rem 8%",
                  }}
                >
                  <div
                    ref={(el) => { textRefs.current[i] = el; }}
                    style={{ maxWidth: "380px" }}
                  >
                    {/* Index + line */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "10px",
                          letterSpacing: "0.28em",
                          color: "rgba(255,255,255,0.28)",
                        }}
                      >
                        {block.idx}
                      </span>
                      <div
                        style={{
                          height: "1px",
                          width: "40px",
                          background: "rgba(255,255,255,0.14)",
                        }}
                      />
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(1.85rem, 2.6vw, 2.75rem)",
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.12,
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}
                    >
                      {block.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(1.05rem, 1.3vw, 1.22rem)",
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.56)",
                        marginTop: "1.25rem",
                        lineHeight: 1.85,
                      }}
                    >
                      {block.body}
                    </p>

                    {/* Bracket + brand mark */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "2.2rem",
                      }}
                    >
                      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                        <path d="M6 1L1 1L1 13L6 13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "8.5px",
                          letterSpacing: "0.22em",
                          color: "rgba(255,255,255,0.16)",
                          textTransform: "uppercase",
                        }}
                      >
                        LN Touch
                      </span>
                      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                        <path d="M14 1L19 1L19 13L14 13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image sub-column — 2 images, crossfade at midpoint */}
          <div
            style={{
              flex: "0 0 42%",
              height: "100vh",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <ImgCard
              forwardRef={img1Ref}
              src="/images/fulani_braids.png"
              alt="Tresses artisanales LN Touch"
              label="Tresses artisanales"
              href="/galerie"
              style={{ opacity: 1, transition: "opacity 0.5s ease" }}
            />
            <ImgCard
              forwardRef={img2Ref}
              src="/images/barel_twist.png"
              alt="Style contemporain LN Touch"
              label="Style contemporain"
              href="/galerie"
              style={{ opacity: 0, transition: "opacity 0.5s ease" }}
            />
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden" style={{ position: "relative" }}>

        {/* Background video — translucent, fixed, behind everything */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={mobileBgRef}
          src="/videos/story01_lntouch.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.16,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Gradient reinforcement for readability */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(9,9,9,0.6) 0%, rgba(9,9,9,0.35) 50%, rgba(9,9,9,0.7) 100%)",
          }}
        />

        {/* Text blocks — centered, above video */}
        <div style={{ position: "relative", zIndex: 10 }}>
          {STORY.map((block, i) => (
            <div
              key={i}
              ref={(el) => { textRefs.current[i] = el; }}
              style={{
                minHeight: "100svh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6rem 1.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ maxWidth: "340px" }}>
                {/* Index */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.14)" }} />
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.28em",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {block.idx}
                  </span>
                  <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.14)" }} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {block.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.12rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.58)",
                    marginTop: "1.2rem",
                    lineHeight: 1.85,
                  }}
                >
                  {block.body}
                </p>

                {/* Mini divider */}
                <div
                  style={{
                    height: "1px",
                    width: "36px",
                    background: "rgba(255,255,255,0.16)",
                    margin: "2rem auto 0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Images — below text blocks, z-index < text */}
        <div style={{ position: "relative", zIndex: 5 }}>
          {[
            { src: "/images/fulani_braids.png", alt: "Tresses artisanales", label: "Tresses artisanales", href: "/galerie" },
            { src: "/images/barel_twist.png", alt: "Style contemporain",  label: "Style contemporain",  href: "/galerie" },
          ].map(({ src, alt, label, href }, i) => (
            <div
              key={i}
              className="story-img-wrap"
              style={{
                height: "56vw",
                maxHeight: "420px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="story-img-el" />
              <div
                className="story-img-overlay-inner"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(6,6,10,0.68)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.1rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {label}
                </span>
                <a
                  href={href}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9.5px",
                    letterSpacing: "0.22em",
                    color: "white",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255,255,255,0.3)",
                    padding: "10px 20px",
                  }}
                >
                  Voir la galerie →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}