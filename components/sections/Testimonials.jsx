// Testimonials.jsx
"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TESTIMONIALS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const GLOBAL_STYLES = `
  @keyframes testimonialFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes testimonialGlow {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 0.8; transform: scale(1.2); }
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

  @media (max-width: 768px) {
    .testimonial-card:hover {
      transform: translateY(-4px);
    }
  }
`;

export default function Testimonials() {
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
        style={{ transition: "all 0.2s ease" }}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ));
  };

  // Données des posts sociaux
  const socialPosts = [
    {
      id: 1,
      type: "instagram",
      embedUrl: "https://www.instagram.com/p/C-EXAMPLE1/embed",
      profileUrl: "https://www.instagram.com/reel/DXkdNKmiPrR/?utm_source=ig_web_button_native_share",
      thumbnail: "/api/placeholder/400/400"
    },
    {
      id: 2,
      type: "instagram",
      embedUrl: "https://www.instagram.com/p/C-EXAMPLE2/embed",
      profileUrl: "https://www.instagram.com/reel/DXPf1-YCL_c/?utm_source=ig_web_button_share_sheet",
      thumbnail: "/api/placeholder/400/400"
    },
    {
      id: 3,
      type: "tiktok",
      embedUrl: "https://www.tiktok.com/embed/v2/1234567890123456789",
      profileUrl: "https://www.tiktok.com/@_leoniiie.t/video/7629065841786490132?is_from_webapp=1&sender_device=pc&web_id=7618903023503427092",
      thumbnail: "/api/placeholder/400/400"
    },
    {
      id: 4,
      type: "instagram",
      embedUrl: "https://www.instagram.com/p/C-EXAMPLE3/embed",
      profileUrl: "https://www.instagram.com/reel/DXSQTw1CP7F/?utm_source=ig_web_button_share_sheet",
      thumbnail: "/api/placeholder/400/400"
    }
  ];

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
      >
        <line x1="0" y1="20%" x2="100%" y2="15%" stroke="rgba(212,175,55,0.03)" strokeWidth="1" />
        <line x1="0" y1="40%" x2="100%" y2="35%" stroke="rgba(212,175,55,0.03)" strokeWidth="1" />
        <line x1="0" y1="60%" x2="100%" y2="55%" stroke="rgba(212,175,55,0.03)" strokeWidth="1" />
        <line x1="0" y1="80%" x2="100%" y2="75%" stroke="rgba(212,175,55,0.03)" strokeWidth="1" />
        <path d="M 40 60 L 40 40 L 60 40" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <path d="M 96% 60 L 96% 40 L 94% 40" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <path d="M 40 94% L 40 96% L 60 96%" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <path d="M 96% 94% L 96% 96% L 94% 96%" stroke="rgba(212,175,55,0.12)" strokeWidth="1" fill="none" />
        <circle cx="8%" cy="15%" r="4" stroke="rgba(212,175,55,0.1)" strokeWidth="1" fill="none" />
        <circle cx="92%" cy="85%" r="6" stroke="rgba(212,175,55,0.1)" strokeWidth="1" fill="none" />
        <circle cx="85%" cy="12%" r="3" stroke="rgba(212,175,55,0.08)" strokeWidth="1" fill="none" />
      </svg>

      <div style={{ position: "relative", zIndex: 5, textAlign: "center", marginBottom: "3rem", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "1.5rem",
            flexWrap: "wrap"
          }}
        >
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.28em",
              color: "#D4AF37",
              textTransform: "uppercase"
            }}
          >
            Preuve sociale
          </span>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
        </div>

        <h2
          ref={headerRef}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            opacity: 0
          }}
        >
          Elles nous font confiance
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "600px",
            margin: "0 auto",
            fontStyle: "italic"
          }}
        >
          +500 clientes satisfaites · Note moyenne 5.0 ⭐
        </p>
      </div>

      {/* Testimonials grid - Centered on mobile */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
          alignItems: "stretch"
        }}
      >
        {TESTIMONIALS.map((testimonial, index) => (
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
              transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            <div
              className="testimonial-glow"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "20px",
                background: "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08), transparent 70%)",
                opacity: 0,
                transition: "opacity 0.5s ease",
                pointerEvents: "none"
              }}
            />

            {/* Quotation mark */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "24px",
                fontSize: "4rem",
                fontFamily: "'Playfair Display', serif",
                color: "rgba(212,175,55,0.08)",
                lineHeight: 1,
                pointerEvents: "none"
              }}
            >
              "
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #D4AF37 0%, #8B6914 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#0a0a0a",
                    boxShadow: "0 4px 15px rgba(212,175,55,0.2)"
                  }}
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      margin: 0,
                      letterSpacing: "-0.3px"
                    }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(212,175,55,0.6)",
                      margin: "4px 0 0",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "3px" }}>
                {renderStars(testimonial.rating)}
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.85)",
                fontStyle: "italic",
                marginBottom: "1.5rem",
                minHeight: "100px"
              }}
            >
              "{testimonial.text}"
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(212,175,55,0.1)",
                paddingTop: "1rem",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#D4AF37",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "rgba(212,175,55,0.08)",
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}
              >
                {testimonial.service}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.05em"
                }}
              >
                {testimonial.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Social Feed Section */}
      <div
        ref={instaRef}
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1200px",
          margin: "5rem auto 0",
          padding: "0 1.5rem"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "2rem",
            flexWrap: "wrap"
          }}
        >
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase"
            }}
          >
            Suivez-nous
          </span>
          <div style={{ height: "1px", width: "48px", background: "rgba(212,175,55,0.3)" }} />
        </div>

        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "2rem"
          }}
        >
          @lntouch_officiel
        </h3>

        {/* Social Posts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
            justifyItems: "center",
            alignItems: "center"
          }}
        >
          {socialPosts.map((post) => (
            <div
              key={post.id}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "350px",
                background: "linear-gradient(135deg, #121212, #0a0a0a)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}
              onClick={() => window.open(post.profileUrl, "_blank")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,175,55,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
              }}
            >
              {/* Iframe embed pour Instagram/TikTok */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1",
                  background: "#1a1a1a",
                  overflow: "hidden"
                }}
              >
                <iframe
                  src={post.embedUrl}
                  title={`${post.type} post ${post.id}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    pointerEvents: "none" // Pour éviter les conflits de clic, on utilise le div parent pour le lien
                  }}
                  allowFullScreen
                  loading="lazy"
                />
                
                {/* Overlay avec le logo du réseau */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(4px)"
                  }}
                >
                  {post.type === "instagram" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C9.5 2 9.2 2 7.7 2.1c-1.5.1-2.5.3-3.4.6-.9.3-1.7.8-2.5 1.6-.8.8-1.3 1.6-1.6 2.5-.3.9-.5 1.9-.6 3.4C2 9.2 2 9.5 2 12s0 2.8.1 4.3c.1 1.5.3 2.5.6 3.4.3.9.8 1.7 1.6 2.5.8.8 1.6 1.3 2.5 1.6.9.3 1.9.5 3.4.6 1.5.1 1.8.1 4.3.1s2.8 0 4.3-.1c1.5-.1 2.5-.3 3.4-.6.9-.3 1.7-.8 2.5-1.6.8-.8 1.3-1.6 1.6-2.5.3-.9.5-1.9.6-3.4.1-1.5.1-1.8.1-4.3s0-2.8-.1-4.3c-.1-1.5-.3-2.5-.6-3.4-.3-.9-.8-1.7-1.6-2.5-.8-.8-1.6-1.3-2.5-1.6-.9-.3-1.9-.5-3.4-.6C14.8 2 14.5 2 12 2zm0 2.5c2.4 0 2.7 0 4.3.1 1.4.1 2.1.3 2.6.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.5.4 1.2.5 2.6.1 1.6.1 1.9.1 4.3s0 2.7-.1 4.3c-.1 1.4-.3 2.1-.5 2.6-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.5.2-1.2.4-2.6.5-1.6.1-1.9.1-4.3.1s-2.7 0-4.3-.1c-1.4-.1-2.1-.3-2.6-.5-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.5-.4-1.2-.5-2.6-.1-1.6-.1-1.9-.1-4.3s0-2.7.1-4.3c.1-1.4.3-2.1.5-2.6.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .5-.2 1.2-.4 2.6-.5 1.6-.1 1.9-.1 4.3-.1z" />
                      <path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.2c-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2 3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2zM17.5 7.5c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3.6-1.3 1.3-1.3 1.3.6 1.3 1.3z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25 4.83 4.83 0 0 1 3.77 4.25zM19.59 6.69a4.83 4.83 0 0 1-3.77-4.25 4.83 4.83 0 0 1 3.77 4.25zM12 2A10 10 0 0 0 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.14-1.27A9.97 9.97 0 0 0 12 22a10 10 0 0 0 10-10c0-5.52-4.48-10-10-10z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div
                style={{
                  padding: "12px",
                  textAlign: "center",
                  borderTop: "1px solid rgba(212,175,55,0.1)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase"
                }}
              >
                Voir sur {post.type === "instagram" ? "Instagram" : "TikTok"} →
              </div>
            </div>
          ))}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.9)";
              e.currentTarget.style.background = "rgba(212,175,55,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Voir plus sur Instagram →
          </a>
        </div>
      </div>

      {/* Floating decoration */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "2%",
          width: "100px",
          height: "100px",
          pointerEvents: "none",
          opacity: 0.3,
          animation: "testimonialFloat 6s ease-in-out infinite"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 6" fill="none" />
          <path d="M50 20 L50 80 M20 50 L80 50" stroke="#D4AF37" strokeWidth="0.8" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "3%",
          width: "70px",
          height: "70px",
          pointerEvents: "none",
          opacity: 0.2,
          animation: "testimonialFloat 7s ease-in-out infinite reverse"
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 5" fill="none" />
        </svg>
      </div>
    </section>
  );
}