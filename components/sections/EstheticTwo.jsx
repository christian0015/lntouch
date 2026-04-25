"use client";

import { useEffect, useRef } from "react";

const STYLES = `
  @keyframes floatTwo {
    0%,100% { transform: translateY(0px) translateX(0px); }
    25%     { transform: translateY(-8px) translateX(5px); }
    75%     { transform: translateY(5px) translateX(-5px); }
  }
  @keyframes lineMove {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -100; }
  }
  @keyframes fadePulse {
    0%,100% { opacity: 0.1; }
    50%     { opacity: 0.35; }
  }
`;

export default function EstheticTwo({ isHovered = false }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("esthetic-two-styles")) return;
    const tag = document.createElement("style");
    tag.id = "esthetic-two-styles";
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(125deg, #0a0a0a 0%, #121212 30%, #0d0d0d 70%, #080808 100%)",
        overflow: "hidden",
      }}
    >
      {/* Grille fine */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isHovered ? 0.15 : 0.08,
          transition: "opacity 0.4s ease",
        }}
      >
        <defs>
          <pattern id="gridTwo" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridTwo)" />
      </svg>

      {/* Lignes diagonales animées */}
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isHovered ? 0.5 : 0.25,
          transition: "opacity 0.4s ease",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={`${i * 60 + 10}`}
            y1="0"
            x2={`${i * 60 - 30}`}
            y2="100%"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
            strokeDasharray="4 6"
            style={{
              animation: `lineMove ${8 + i}s linear infinite`,
            }}
          />
        ))}
      </svg>

      {/* Formes flottantes */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "12%",
          animation: "floatTwo 7s ease-in-out infinite",
        }}
      >
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
          <polygon points="22.5,2 40,35 5,35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
          <polygon points="22.5,10 33,30 12,30" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          animation: "floatTwo 9s ease-in-out infinite 1s",
        }}
      >
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
          <circle cx="17.5" cy="17.5" r="14" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx="17.5" cy="17.5" r="8" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <circle cx="17.5" cy="17.5" r="2" fill="rgba(255,255,255,0.1)" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "25%",
          animation: "floatTwo 6s ease-in-out infinite 2s",
        }}
      >
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
          <rect x="2" y="2" width="21" height="21" stroke="rgba(255,255,255,0.1)" strokeWidth="1" transform="rotate(25 12.5 12.5)" />
        </svg>
      </div>

      {/* Motif tresse graphique */}
      <div
        style={{
          position: "absolute",
          left: "15%",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
          height: "60%",
          opacity: isHovered ? 0.35 : 0.18,
          transition: "opacity 0.4s ease",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
          <g opacity="0.6">
            <path d="M0,100 C50,40 100,160 150,100 C200,40 250,160 300,100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
            <path d="M0,110 C50,170 100,50 150,110 C200,170 250,50 300,110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            <path d="M0,90 C50,150 100,30 150,90 C200,150 250,30 300,90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" strokeDasharray="3 5" />
          </g>
          {/* Points de croisement */}
          {[0.25, 0.5, 0.75].map((t, i) => {
            const x = t * 300;
            return (
              <g key={i}>
                <circle cx={x} cy="100" r="2" fill="rgba(255,255,255,0.2)" />
                <circle cx={x} cy="100" r="5" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Superposition de lignes horizontales */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Pulsation subtile */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "200px",
          height: "200px",
          marginLeft: "-100px",
          marginTop: "-100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          animation: "fadePulse 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}