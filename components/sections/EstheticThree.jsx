"use client";

import { useEffect, useRef } from "react";

const STYLES = `
  @keyframes floatThree {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%     { transform: translateY(-10px) rotate(2deg); }
    66%     { transform: translateY(5px) rotate(-1deg); }
  }
  @keyframes warmPulse {
    0%,100% { opacity: 0.15; filter: blur(8px); }
    50%     { opacity: 0.4; filter: blur(12px); }
  }
  @keyframes grainMove {
    0%   { transform: translateX(0) translateY(0); }
    100% { transform: translateX(100%) translateY(100%); }
  }
`;

export default function EstheticThree({ isHovered = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("esthetic-three-styles")) return;
    const tag = document.createElement("style");
    tag.id = "esthetic-three-styles";
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);

    // Grain texture animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrain = () => {
      if (!ctx || !canvas) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grain = Math.random() * 30;
        data[i] = 120 + grain;     // R
        data[i + 1] = 70 + grain;  // G
        data[i + 2] = 50 + grain;  // B
        data[i + 3] = 20 + Math.random() * 20; // Alpha
      }
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(drawGrain);
    };

    drawGrain();

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
        background: "linear-gradient(145deg, #1a0f0a 0%, #2d1a10 25%, #1f120a 60%, #2a150c 100%)",
        overflow: "hidden",
      }}
    >
      {/* Canvas grain texture */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isHovered ? 0.5 : 0.25,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Formes organiques flottantes */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          animation: "floatThree 8s ease-in-out infinite",
        }}
      >
        <svg width="55" height="55" viewBox="0 0 55 55" fill="none">
          <path d="M27.5,5 C40,5 50,15 50,27.5 C50,40 40,50 27.5,50 C15,50 5,40 5,27.5 C5,15 15,5 27.5,5Z" stroke="rgba(200, 140, 100, 0.2)" strokeWidth="1" fill="rgba(200, 140, 100, 0.03)" />
          <path d="M27.5,12 C36,12 43,19 43,27.5 C43,36 36,43 27.5,43 C19,43 12,36 12,27.5 C12,19 19,12 27.5,12Z" stroke="rgba(200, 140, 100, 0.1)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "30%",
          right: "10%",
          animation: "floatThree 10s ease-in-out infinite 1s",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <polygon points="20,3 35,35 5,35" stroke="rgba(210, 140, 90, 0.18)" strokeWidth="1" fill="rgba(210, 140, 90, 0.04)" />
          <polygon points="20,10 28,32 12,32" stroke="rgba(210, 140, 90, 0.08)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          animation: "floatThree 7s ease-in-out infinite 2s",
        }}
      >
        <svg width="30" height="60" viewBox="0 0 30 60" fill="none">
          <path d="M15,0 C15,20 0,30 0,45 C0,55 5,60 15,60 C25,60 30,55 30,45 C30,30 15,20 15,0Z" stroke="rgba(190, 130, 80, 0.15)" strokeWidth="1" fill="rgba(190, 130, 80, 0.03)" />
        </svg>
      </div>

      {/* Motif tresse aux couleurs chaudes */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          right: "20%",
          top: "50%",
          transform: "translateY(-50%)",
          height: "45%",
          opacity: isHovered ? 0.45 : 0.22,
          transition: "opacity 0.4s ease",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 250 160" preserveAspectRatio="none">
          {/* Tresse entrelacée */}
          <g opacity="0.7">
            <path d="M10,80 C40,55 60,105 90,80 C120,55 140,105 170,80 C200,55 220,105 250,80" stroke="rgba(210, 140, 90, 0.25)" strokeWidth="2" fill="none" />
            <path d="M10,90 C40,65 60,115 90,90 C120,65 140,115 170,90 C200,65 220,115 250,90" stroke="rgba(200, 120, 70, 0.18)" strokeWidth="2" fill="none" />
            <path d="M10,70 C40,95 60,45 90,70 C120,95 140,45 170,70 C200,95 220,45 250,70" stroke="rgba(220, 160, 110, 0.15)" strokeWidth="1.5" fill="none" />
          </g>
          {/* Nœuds décoratifs */}
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
            const x = t * 250;
            return (
              <g key={i}>
                <circle cx={x} cy="80" r="3" fill="rgba(210, 140, 90, 0.3)" />
                <circle cx={x} cy="80" r="6" stroke="rgba(210, 140, 90, 0.15)" strokeWidth="0.5" fill="none" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Lueur chaude pulsante */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "50%",
          width: "180px",
          height: "180px",
          marginLeft: "-90px",
          marginTop: "-90px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(210, 140, 90, 0.1) 0%, rgba(210, 140, 90, 0.02) 60%, transparent 100%)",
          animation: "warmPulse 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Lignes fines horizontales */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background: "linear-gradient(to top, rgba(30, 15, 8, 0.5) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}