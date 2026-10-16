// components/sections/Testimonials.jsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GLOBAL_STYLES = `
  @keyframes testimonialFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  .testimonial-card {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .testimonial-card:hover {
    transform: translateY(-8px);
  }
  
  .testimonial-card:hover .testimonial-glow {
    opacity: 0.6;
  }
  
  .rating-star {
    transition: all 0.2s ease;
  }
  
  .testimonial-card:hover .rating-star {
    transform: scale(1.05);
  }

  .social-card-hover {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .social-card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.25);
  }

  .social-card-hover:hover .play-overlay {
    opacity: 1 !important;
    transform: scale(1) !important;
  }

  @media (max-width: 768px) {
    .testimonial-card:hover {
      transform: translateY(-4px);
    }
  }
`;

// Dégradés de repli quand une publication n'a pas de couverture
const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #1f142b 0%, #0a0a0a 100%)",
  "linear-gradient(135deg, #142b27 0%, #0a0a0a 100%)",
  "linear-gradient(135deg, #2b1d14 0%, #0a0a0a 100%)",
  "linear-gradient(135deg, #2b1424 0%, #0a0a0a 100%)",
];
const PLATFORM_LABELS = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", youtube: "YouTube" };

export default function Testimonials({ testimonials = [], socialPosts = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const instaRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("testimonials-styles")) return;
    const tag = document.createElement("style");
    tag.id = "testimonials-styles";
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // La section "Suivez-nous" n'existe que s'il y a des publications
      if (instaRef.current) {
        gsap.fromTo(
          instaRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            scrollTrigger: {
              trigger: instaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="rating-star"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < rating ? "#D4AF37" : "rgba(255,255,255,0.15)"}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ));
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
        overflow: "hidden",
        padding: "120px 0 100px"
      }}
    >
      {/* En-tête */}
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", marginBottom: "3rem", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.28em", color: "#D4AF37", textTransform: "uppercase" }}>
            Preuve sociale
          </span>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
        </div>

        <h2 ref={headerRef} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1rem", opacity: 0 }}>
          Elles nous font confiance
        </h2>

        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto", fontStyle: "italic" }}>
          +500 clientes satisfaites · Note moyenne 5.0 ⭐
        </p>
      </div>

      {/* Cartes Témoignages */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem", justifyItems: "center", alignItems: "stretch" }}>
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="testimonial-card"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "450px",
              background: "linear-gradient(135deg, rgba(15,15,15,0.8) 0%, rgba(8,8,8,0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "20px",
              padding: "1.75rem",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "bold", color: "#0a0a0a" }}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>{testimonial.name}</h4>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(212,175,55,0.6)", margin: "4px 0 0" }}>{testimonial.role}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "3px" }}>{renderStars(testimonial.rating)}</div>
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.85)", fontStyle: "italic", marginBottom: "1.5rem", minHeight: "100px" }}>
              "{testimonial.text}"
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(212,175,55,0.1)", paddingTop: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#D4AF37", background: "rgba(212,175,55,0.08)", padding: "4px 10px", borderRadius: "20px" }}>{testimonial.service}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{testimonial.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Social Feed Section (masquée sans publication) */}
      {socialPosts.length > 0 && (
      <div ref={instaRef} style={{ position: "relative", zIndex: 5, maxWidth: "1200px", margin: "5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
            Suivez-nous
          </span>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 600, color: "#ffffff", textAlign: "center", marginBottom: "2rem" }}>
          @lntouch_officiel
        </h3>

        {/* Grille Social Media */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {socialPosts.map((post, idx) => {
            const isVideo = post.thumbnailType === "video" && !!post.thumbnail;
            const hasImage = !!post.thumbnail && !isVideo; // image ou GIF animé
            return (
              <div
                key={post.id}
                className="social-card-hover"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/5",
                  background: hasImage ? `url(${post.thumbnail}) center/cover no-repeat` : FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length],
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                onClick={() => window.open(post.url, "_blank", "noopener,noreferrer")}
                onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); if (v) v.play().catch(() => {}); }}
                onMouseLeave={(e) => { const v = e.currentTarget.querySelector("video"); if (v) { v.pause(); v.currentTime = 0; } }}
              >
                {/* Couverture vidéo : 1re image affichée, lecture au survol */}
                {isVideo && (
                  <video
                    src={post.thumbnail}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}

                {/* Overlay Sombre pour lisibilité */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)", zIndex: 1 }} />

                {/* Badge supérieur (réseau) */}
                <div style={{ position: "relative", zIndex: 2, padding: "16px", display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {post.platform === "instagram" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    ) : post.platform === "tiktok" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V4h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.33-6.32V9.58a8.16 8.16 0 0 0 4.92 1.67V7.8a4.85 4.85 0 0 1-1-.11z" />
                      </svg>
                    ) : (
                      <span style={{ color: "#D4AF37", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                        {(PLATFORM_LABELS[post.platform] || "•").charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bouton de lecture au survol (Play Icon) */}
                <div className="play-overlay" style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%) scale(0.8)", opacity: 0, transition: "all 0.3s ease", zIndex: 2 }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(212,175,55,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(212,175,55,0.5)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a" style={{ marginLeft: "3px" }}>
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>

                {/* Contenu bas de carte */}
                <div style={{ position: "relative", zIndex: 2, padding: "20px" }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 500, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.4 }}>
                    "{post.caption}"
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "#D4AF37", textTransform: "uppercase" }}>
                    <span>Voir sur {PLATFORM_LABELS[post.platform] || "le réseau"}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href="https://instagram.com/lntouch_officiel"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              border: "1px solid rgba(212,175,55,0.4)",
              background: "transparent",
              color: "white",
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
          >
            Voir plus sur Instagram →
          </a>
        </div>
      </div>
      )}
    </section>
  );
}
