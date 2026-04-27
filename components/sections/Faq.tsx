// Faq.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FAQ_ITEMS, SALON } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ─── Styles globaux ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes faqFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  
  @keyframes faqGlow {
    0% { opacity: 0.3; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  .faq-item {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .faq-item:hover {
    transform: translateX(8px);
  }
  
  .faq-question {
    transition: all 0.3s ease;
  }
  
  .faq-answer {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

export default function FAQ() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const whatsappRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (document.getElementById("faq-styles")) return;
    const tag = document.createElement("style");
    tag.id = "faq-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  // Animations GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // FAQ items staggered animation
      itemsRef.current.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            delay: i * 0.08,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // WhatsApp section animation
      gsap.fromTo(
        whatsappRef.current,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: whatsappRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleItem = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const handleWhatsAppSubmit = () => {
    if (!message.trim()) return;
    const phoneNumber = SALON.whatsapp;
    const text = encodeURIComponent(`✨ NOUVEAU MESSAGE DEPUIS LN TOUCH ✨\n\n${message}\n\n— Envoyé depuis le site web`);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    setMessage("");
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "linear-gradient(145deg, #0a0a0a 0%, #080808 50%, #0c0a0a 100%)",
        overflow: "hidden",
        padding: "120px 0 100px"
      }}
    >
      {/* ── Geometric SVG Background ───────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        {/* Diagonal lines */}
        <line x1="0" y1="15%" x2="100%" y2="12%" stroke="rgba(212,175,55,0.025)" strokeWidth="1" />
        <line x1="0" y1="35%" x2="100%" y2="32%" stroke="rgba(212,175,55,0.025)" strokeWidth="1" />
        <line x1="0" y1="55%" x2="100%" y2="52%" stroke="rgba(212,175,55,0.025)" strokeWidth="1" />
        <line x1="0" y1="75%" x2="100%" y2="72%" stroke="rgba(212,175,55,0.025)" strokeWidth="1" />
        
        {/* Corner brackets - top left */}
        <path d="M 45 65 L 45 45 L 65 45" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <path d="M 45 935 L 45 955 L 65 955" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <path d="M 955 65 L 955 45 L 935 45" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        
        {/* Central diamond pattern */}
        <rect x="485" y="485" width="30" height="30" stroke="rgba(212,175,55,0.08)" strokeWidth="1" fill="none" transform="rotate(45 500 500)" />
        <rect x="470" y="470" width="60" height="60" stroke="rgba(212,175,55,0.05)" strokeWidth="1" fill="none" transform="rotate(45 500 500)" />
        
        {/* Floating circles */}
        <circle cx="15%" cy="20%" r="8" stroke="rgba(212,175,55,0.08)" strokeWidth="1" fill="none" />
        <circle cx="88%" cy="75%" r="12" stroke="rgba(212,175,55,0.08)" strokeWidth="1" fill="none" />
        <circle cx="92%" cy="15%" r="5" stroke="rgba(212,175,55,0.06)" strokeWidth="1" fill="none" />
        <circle cx="7%" cy="88%" r="10" stroke="rgba(212,175,55,0.06)" strokeWidth="1" fill="none" />
        
        {/* Zigzag line bottom */}
        <polyline
          points="0,980 30,970 60,985 90,975 120,990 150,980 180,995 210,985 240,1000 270,990 300,1005"
          stroke="rgba(212,175,55,0.04)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* ── Floating Labels ───────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
          05&nbsp;/&nbsp;07
        </span>
      </div>
      
      <div style={{ position: "absolute", top: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ height: "1px", width: "28px", background: "rgba(212,175,55,0.2)" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.32em", color: "rgba(212,175,55,0.5)", textTransform: "uppercase" }}>
          Questions
        </span>
        <div style={{ height: "1px", width: "28px", background: "rgba(212,175,55,0.2)" }} />
      </div>
      
      <div style={{ position: "absolute", top: "1.75rem", right: "2rem", zIndex: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
          FAQ
        </span>
      </div>

      {/* ── Vertical side text ───────────────────────────────────────────── */}
      <div
        className="hidden md:block"
        style={{ position: "absolute", bottom: "4rem", left: "1.75rem", zIndex: 10, pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "block",
          }}
        >
          Réservation · Organisation · Services
        </span>
      </div>

      <div
        className="hidden md:block"
        style={{ position: "absolute", bottom: "4rem", right: "1.75rem", zIndex: 10, pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.08)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            display: "block",
          }}
        >
          Support 24/7
        </span>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: "1400px", margin: "0 auto", padding: "0 1.2rem" }} id="faq">
        
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.28em",
                color: "#D4AF37",
                textTransform: "uppercase"
              }}
            >
              Vous avez des questions ?
            </span>
            <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "1rem"
            }}
          >
            On vous répond
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(212,175,55,0.4)" }}>
              en toute transparence.
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
              fontStyle: "italic"
            }}
          >
            Une question ? Une précision ? On est là pour vous guider avant, pendant et après votre expérience.
          </p>
        </div>

        {/* FAQ Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "1.5rem",
            marginBottom: "5rem"
          }}
        >
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="faq-item"
              style={{
                background: "rgba(10,10,10,0.5)",
                backdropFilter: "blur(12px)",
                border: activeId === item.id ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "2px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.4s ease"
              }}
              onClick={() => toggleItem(item.id)}
            >
              {/* Question */}
              <div
                className="faq-question"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "8px",
                      letterSpacing: "0.2em",
                      color: "rgba(212,175,55,0.5)",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem"
                    }}
                  >
                    {item.category}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: activeId === item.id ? "#D4AF37" : "#ffffff",
                      margin: 0,
                      transition: "color 0.3s ease"
                    }}
                  >
                    {item.question}
                  </h3>
                </div>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease",
                    transform: activeId === item.id ? "rotate(45deg)" : "rotate(0deg)"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" stroke="rgba(212,175,55,0.6)" />
                  </svg>
                </div>
              </div>

              {/* Answer */}
              <div
                className="faq-answer"
                style={{
                  maxHeight: activeId === item.id ? "200px" : "0",
                  opacity: activeId === item.id ? 1 : 0,
                  overflow: "hidden",
                  marginTop: activeId === item.id ? "1rem" : "0",
                  transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                    margin: 0,
                    borderLeft: "2px solid rgba(212,175,55,0.3)",
                    paddingLeft: "1rem"
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Section */}
        <div
          ref={whatsappRef}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 100%)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "2px",
            padding: "3rem",
            textAlign: "center",
            position: "relative"
          }}
        >
          {/* Decorative corner */}
          <svg
            style={{ position: "absolute", top: 20, left: 20, opacity: 0.3 }}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M8 24 L8 8 L24 8" stroke="#D4AF37" strokeWidth="1" />
          </svg>
          <svg
            style={{ position: "absolute", bottom: 20, right: 20, opacity: 0.3 }}
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M24 8 L24 24 L8 24" stroke="#D4AF37" strokeWidth="1" />
          </svg>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "1.5rem"
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
                stroke="#25D366"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M8.5 8.5c.3-.8 1.1-1.2 1.9-1.1.2 0 .4.1.5.2.3.3.5.7.6 1.1.1.4.1.8.1 1.2 0 .4-.1.8-.2 1.2-.1.4-.3.8-.5 1.2-.3.4-.5.8-.9 1.1-.3.3-.7.6-1.1.8-.4.2-.8.4-1.2.5-.4.1-.8.2-1.2.2-.4 0-.8 0-1.2-.1-.4-.1-.8-.2-1.2-.3-.4-.2-.8-.4-1.1-.7-.3-.3-.6-.7-.8-1.1-.2-.4-.4-.8-.5-1.2-.1-.4-.2-.8-.2-1.2 0-.4 0-.8.1-1.2.1-.4.2-.8.4-1.2.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8.4-.2.8-.4 1.2-.5.4-.1.8-.2 1.2-.2.4 0 .8 0 1.2.1.4.1.8.2 1.2.3.4.2.8.4 1.1.7.3.3.6.6.8 1 .2.4.4.8.5 1.2.1.4.2.8.2 1.2 0 .4 0 .8-.1 1.2-.1.4-.2.8-.3 1.2-.2.4-.4.8-.7 1.1-.3.3-.6.6-1 .8-.4.2-.8.4-1.2.5-.4.1-.8.2-1.2.2-.4 0-.8 0-1.2-.1-.4-.1-.8-.2-1.2-.4-.4-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.8-1-.2-.4-.4-.8-.5-1.2-.1-.4-.2-.8-.2-1.2 0-.4 0-.8.1-1.2.1-.4.2-.8.4-1.2.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8.4-.2.8-.4 1.2-.5.4-.1.8-.2 1.2-.2.4 0 .8 0 1.2.1.4.1.8.2 1.2.3.4.2.8.4 1.1.7.3.3.6.6.8 1 .2.4.4.8.5 1.2.1.4.2.8.2 1.2 0 .4 0 .8-.1 1.2-.1.4-.2.8-.3 1.2"
                stroke="#25D366"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: "rgba(212,175,55,0.7)",
                textTransform: "uppercase"
              }}
            >
              Besoin d'un conseil ?
            </span>
          </div>

          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "1rem"
            }}
          >
            Une question précise ?
          </h3>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "2rem",
              lineHeight: 1.7
            }}
          >
            Écrivez-nous directement sur WhatsApp. On vous répond sous 2h (ouvrés).
          </p>

          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message ici... (style, disponibilité, prix, etc.)"
              rows={3}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRadius: "2px",
                padding: "14px 18px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.7)",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "1.5rem",
                transition: "border-color 0.3s ease"
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.2)"; }}
            />

            <button
              onClick={handleWhatsAppSubmit}
              disabled={!message.trim()}
              style={{
                width: "100%",
                padding: "14px 28px",
                background: message.trim() ? "rgba(37, 211, 102, 0.15)" : "rgba(255,255,255,0.03)",
                border: message.trim() ? "1px solid rgba(37, 211, 102, 0.4)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                color: message.trim() ? "#25D366" : "rgba(255,255,255,0.2)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: message.trim() ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Envoyer sur WhatsApp
            </button>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.12)",
                marginTop: "1rem",
                textTransform: "uppercase"
              }}
            >
              Réponse sous 2h · 7j/7
            </p>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.08)",
            textTransform: "uppercase"
          }}
        >
          <span>LN TOUCH — PRÉCISION · ÉLÉGANCE · CONFIANCE</span>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: "100px",
          height: "100px",
          pointerEvents: "none",
          opacity: 0.2,
          animation: "faqFloat 8s ease-in-out infinite"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 7" />
          <path d="M50 20 L50 80 M20 50 L80 50" stroke="#D4AF37" strokeWidth="0.8" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "3%",
          width: "60px",
          height: "60px",
          pointerEvents: "none",
          opacity: 0.15,
          animation: "faqFloat 10s ease-in-out infinite reverse"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="25" width="50" height="50" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 6" fill="none" />
        </svg>
      </div>
    </section>
  );
}