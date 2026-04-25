// Footer.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SALON, FOUNDER, DEVELOPER, SOCIAL_LINKS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const contentRef = useRef(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".footer-reveal"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Helper pour obtenir l'icône du réseau social
  const getSocialIcon = (platform) => {
    switch(platform) {
      case 'instagram':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        );
      case 'pinterest':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 20.1a9 9 0 1 1 7.9-1.7M12 16v-4a2 2 0 0 1 4 0v2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #050505 0%, #020202 50%, #000000 100%)",
        overflow: "hidden",
        padding: "80px 0 40px",
        marginTop: "0px"
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1: GEOMETRIC BACKGROUND - RICHE ET COMPLEXE
      ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Pattern de fond avec grille complexe */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.4
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pattern de points */}
          <pattern id="dotPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(212,175,55,0.2)" />
            <circle cx="0" cy="0" r="0.8" fill="rgba(212,175,55,0.15)" />
            <circle cx="40" cy="40" r="0.8" fill="rgba(212,175,55,0.15)" />
          </pattern>
          
          {/* Pattern de lignes diagonales */}
          <pattern id="diagonalLines" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M0 30 L30 0" stroke="rgba(212,175,55,0.08)" strokeWidth="0.5" fill="none" />
            <path d="M-10 30 L20 0" stroke="rgba(212,175,55,0.05)" strokeWidth="0.3" fill="none" />
            <path d="M10 30 L40 0" stroke="rgba(212,175,55,0.05)" strokeWidth="0.3" fill="none" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
        <rect width="100%" height="100%" fill="url(#diagonalLines)" />
      </svg>

      {/* Lignes horizontales parallèles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`h-line-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(i + 1) * 6.66}%`,
            height: "1px",
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(212,175,55,0.${15 + i * 2}) 20%, 
              rgba(212,175,55,0.${15 + i * 2}) 80%, 
              transparent 100%)`,
            pointerEvents: "none",
            zIndex: 0
          }}
        />
      ))}

      {/* Lignes verticales */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`v-line-${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${12.5 * (i + 1)}%`,
            width: "1px",
            background: `linear-gradient(180deg, 
              transparent 0%, 
              rgba(212,175,55,0.1) 30%, 
              rgba(212,175,55,0.1) 70%, 
              transparent 100%)`,
            pointerEvents: "none",
            zIndex: 0
          }}
        />
      ))}

      {/* Cercles concentriques multiples */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.25
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="200" stroke="rgba(212,175,55,0.2)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="150" stroke="rgba(212,175,55,0.25)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="100" stroke="rgba(212,175,55,0.3)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="50" stroke="rgba(212,175,55,0.35)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="25" stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.2
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="rgba(212,175,55,0.15)" strokeWidth="1" strokeDasharray="8 12" fill="none" />
          <circle cx="300" cy="300" r="220" stroke="rgba(212,175,55,0.2)" strokeWidth="1" strokeDasharray="6 10" fill="none" />
          <circle cx="300" cy="300" r="160" stroke="rgba(212,175,55,0.25)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
        </svg>
      </div>

      {/* Triangles flottants */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`triangle-${i}`}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${15 + Math.random() * 25}px`,
            height: `${15 + Math.random() * 25}px`,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.1 + Math.random() * 0.1,
            animation: `floatTriangle ${6 + Math.random() * 4}s ease-in-out infinite`
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <polygon points="50,15 85,85 15,85" stroke="rgba(212,175,55,0.6)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}

      {/* Hexagones */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`hex-${i}`}
          style={{
            position: "absolute",
            left: `${5 + Math.random() * 90}%`,
            bottom: `${10 + Math.random() * 80}%`,
            width: `${25 + Math.random() * 35}px`,
            height: `${25 + Math.random() * 35}px`,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.08,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <polygon points="50,12.5 87.5,31.25 87.5,68.75 50,87.5 12.5,68.75 12.5,31.25" stroke="rgba(212,175,55,0.5)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}

      {/* Croix et carrés */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`cross-${i}`}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: "12px",
            height: "12px",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.1 + Math.random() * 0.1
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
            <path d="M10 0 L10 20 M0 10 L20 10" stroke="rgba(212,175,55,0.6)" strokeWidth="0.8" />
          </svg>
        </div>
      ))}

      {/* ── Floating labels animées ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          zIndex: 10,
          pointerEvents: "none",
          fontFamily: "'Space Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.3em",
          color: "rgba(212,175,55,0.2)",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)"
        }}
      >
        06&nbsp;/&nbsp;07
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem"
        }}
      >
        {/* Top Section with Brand */}
        <div className="footer-reveal" style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              position: "relative",
              marginBottom: "1rem"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "-60px",
                width: "40px",
                height: "1px",
                background: "rgba(212,175,55,0.3)"
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.1em"
              }}
            >
              LN TOUCH
            </span>
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "-60px",
                width: "40px",
                height: "1px",
                background: "rgba(212,175,55,0.3)"
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "500px",
              margin: "0 auto"
            }}
          >
            L'excellence capillaire au service de votre identité
          </p>
        </div>

        {/* Grid principale */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem"
          }}
        >
          {/* Colonne 1: Contact */}
          <div className="footer-reveal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
              <h4
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  margin: 0
                }}
              >
                Contact
              </h4>
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ContactItem
                icon="📞"
                text={SALON.phone}
                href={`tel:${SALON.phone.replace(/\s/g, "")}`}
              />
              <ContactItem
                icon="✉️"
                text={SALON.email}
                href={`mailto:${SALON.email}`}
              />
              <ContactItem
                icon="💬"
                text={`WhatsApp: ${SALON.whatsapp}`}
                href={`https://wa.me/${SALON.whatsapp}`}
              />
              <ContactItem
                icon="📍"
                text={`${SALON.quartier}, ${SALON.commune}`}
                href={SALON.mapLink}
              />
            </div>
          </div>

          {/* Colonne 2: Horaires */}
          <div className="footer-reveal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
              <h4
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  margin: 0
                }}
              >
                Horaires
              </h4>
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <ScheduleItem day="Mardi - Samedi" hours={SALON.hours.mardi_samedi} />
              <ScheduleItem day="Dimanche - Lundi" hours={SALON.hours.dimanche_lundi} isClosed />
              <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <ScheduleItem day="Réservation" hours="24h/24 en ligne" special />
              </div>
            </div>
          </div>

          {/* Colonne 3: Liens rapides */}
          <div className="footer-reveal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
              <h4
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  margin: 0
                }}
              >
                Navigation
              </h4>
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <NavLink href="/" text="Accueil" />
              <NavLink href="/galerie" text="Galerie" />
              <NavLink href="/process" text="Réservation" />
              <NavLink href="/faq" text="FAQ" />
            </div>
          </div>

          {/* Colonne 4: Social & Newsletter */}
          <div className="footer-reveal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
              <h4
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  margin: 0
                }}
              >
                Suivez-nous
              </h4>
              <div style={{ width: "30px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon
                  key={social.platform}
                  platform={social.platform}
                  href={social.href}
                  icon={getSocialIcon(social.platform)}
                />
              ))}
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase"
                }}
              >
                Newsletter
              </p>
              <div style={{ display: "flex", borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
                <input
                  type="email"
                  placeholder="Votre email"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    padding: "10px 0",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.6)",
                    outline: "none"
                  }}
                />
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#D4AF37",
                    cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em"
                  }}
                >
                  S'abonner →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Infos Fondatrice & Développeur */}
        <div
          className="footer-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            padding: "2rem 0",
            borderTop: "1px solid rgba(212,175,55,0.1)",
            borderBottom: "1px solid rgba(212,175,55,0.1)",
            marginBottom: "2rem"
          }}
        >
          <div>
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
              Fondatrice
            </div>
            <h5
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "0.5rem"
              }}
            >
              {FOUNDER.name}
            </h5>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6
              }}
            >
              {FOUNDER.bio}
            </p>
          </div>

          <div>
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
              Développement
            </div>
            <h5
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "0.5rem"
              }}
            >
              {DEVELOPER.studio}
            </h5>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6
              }}
            >
              {DEVELOPER.bio} {DEVELOPER.technologies}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "1rem"
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase"
            }}
          >
            © {year} LN TOUCH — Tous droits réservés
          </div>

          <div style={{ display: "flex", gap: "2rem" }}>
            <a
              href="/mentions-legales"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
            >
              Mentions légales
            </a>
            <a
              href="/cgv"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
            >
              CGV
            </a>
            <a
              href="/politique-confidentialite"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
            >
              Confidentialité
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.15)"
            }}
          >
            <span>✦</span>
            <span>Design Awwwards Premium</span>
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes floatTriangle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }
        
        @keyframes floatLine {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(-5px);
          }
        }
      `}</style>
    </footer>
  );
}

// ─── Composants internes ────────────────────────────────────────────────────

function ContactItem({ icon, text, href }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        transition: "all 0.3s ease",
        padding: "4px 0"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(0px)";
      }}
    >
      <span style={{ fontSize: "16px", opacity: 0.6 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "0.95rem",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.6)",
          transition: "color 0.3s ease"
        }}
      >
        {text}
      </span>
    </a>
  );
}

function ScheduleItem({ day, hours, isClosed, special }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "4px 0"
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          letterSpacing: "0.1em",
          color: isClosed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)"
        }}
      >
        {day}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          color: special ? "#D4AF37" : isClosed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)"
        }}
      >
        {hours}
      </span>
    </div>
  );
}

function NavLink({ href, text }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "0.95rem",
        fontStyle: "italic",
        color: "rgba(255,255,255,0.5)",
        textDecoration: "none",
        transition: "all 0.3s ease",
        padding: "4px 0",
        borderBottom: "1px solid transparent"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#D4AF37";
        e.currentTarget.style.borderBottomColor = "rgba(212,175,55,0.3)";
        e.currentTarget.style.transform = "translateX(5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        e.currentTarget.style.borderBottomColor = "transparent";
        e.currentTarget.style.transform = "translateX(0px)";
      }}
    >
      {text}
    </a>
  );
}

function SocialIcon({ platform, href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: "2px",
        color: "rgba(255,255,255,0.4)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)";
        e.currentTarget.style.color = "#D4AF37";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {icon}
    </a>
  );
}