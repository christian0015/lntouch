"use client";

import { useEffect, useRef } from "react";

const STYLES = `
  @keyframes floatOne {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%     { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes shimmerOne {
    0%,100% { opacity: 0.15; }
    50%     { opacity: 0.5; }
  }
  @keyframes pulseGlowOne {
    0%,100% { opacity: 0.2; transform: scale(1); }
    50%     { opacity: 0.5; transform: scale(1.1); }
  }
  @keyframes waveMove {
    0%   { transform: translateX(-10px); }
    100% { transform: translateX(10px); }
  }
  @keyframes starTwinkle {
    0%,100% { opacity: 0.1; transform: scale(1); }
    50%     { opacity: 0.6; transform: scale(1.3); }
  }
`;

export default function EstheticOne({ isHovered = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("esthetic-one-styles")) return;
    const tag = document.createElement("style");
    tag.id = "esthetic-one-styles";
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);

    // Canvas animation setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle system
    class Particle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.reset();
      }
      reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.blinkSpeed = Math.random() * 0.02 + 0.01;
        this.blinkPhase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha = 0.15 + Math.sin(Date.now() * this.blinkSpeed + this.blinkPhase) * 0.1;
        if (this.x < 0) this.x = this.w;
        if (this.x > this.w) this.x = 0;
        if (this.y < 0) this.y = this.h;
        if (this.y > this.h) this.y = 0;
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      if (!canvas) return;
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a1628 0%, #0d1a30 40%, #0f1420 100%)",
        overflow: "hidden",
      }}
    >
      {/* Canvas pour particules dynamiques */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Formes géométriques flottantes */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          animation: "floatOne 6s ease-in-out infinite",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="rgba(100, 180, 255, 0.3)" strokeWidth="1" />
          <circle cx="20" cy="20" r="12" stroke="rgba(100, 180, 255, 0.15)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="4" fill="rgba(100, 180, 255, 0.2)" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "15%",
          animation: "floatOne 8s ease-in-out infinite 1s",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <polygon points="15,2 28,23 2,23" stroke="rgba(80, 160, 240, 0.25)" strokeWidth="1" fill="rgba(80, 160, 240, 0.03)" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "20%",
          animation: "floatOne 7s ease-in-out infinite 0.5s",
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect x="5" y="5" width="40" height="40" stroke="rgba(100, 180, 255, 0.2)" strokeWidth="1" transform="rotate(15 25 25)" />
          <rect x="12" y="12" width="26" height="26" stroke="rgba(100, 180, 255, 0.1)" strokeWidth="0.5" transform="rotate(15 25 25)" />
        </svg>
      </div>

      {/* Motif ondulé en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "repeating-linear-gradient(45deg, rgba(80, 160, 240, 0.03) 0px, rgba(80, 160, 240, 0.03) 2px, transparent 2px, transparent 8px)",
        }}
      />

      {/* Motif tresse minimal au centre */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "40%",
          opacity: isHovered ? 0.4 : 0.2,
          transition: "opacity 0.4s ease",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 150" preserveAspectRatio="none">
          <path d="M20,75 Q50,50 80,75 T140,75 T200,75" stroke="rgba(100, 180, 255, 0.3)" strokeWidth="1.5" fill="none" />
          <path d="M20,85 Q50,110 80,85 T140,85 T200,85" stroke="rgba(100, 180, 255, 0.2)" strokeWidth="1.5" fill="none" />
          <path d="M0,20 L200,20" stroke="rgba(100, 180, 255, 0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M0,130 L200,130" stroke="rgba(100, 180, 255, 0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Lumière pulsante au centre */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "150px",
          height: "150px",
          marginLeft: "-75px",
          marginTop: "-75px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(100, 180, 255, 0.08) 0%, transparent 70%)",
          animation: "pulseGlowOne 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}