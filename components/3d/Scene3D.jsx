"use client";

import { useEffect, useRef, useState } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

  @keyframes sc3d-float1 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-18px) rotate(3deg); }
    66%      { transform: translateY(-8px) rotate(-2deg); }
  }
  @keyframes sc3d-float2 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    40%      { transform: translateY(-12px) rotate(-4deg); }
    70%      { transform: translateY(-22px) rotate(2deg); }
  }
  @keyframes sc3d-float3 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    25%      { transform: translateY(-8px) rotate(1.5deg); }
    75%      { transform: translateY(-20px) rotate(-3deg); }
  }
  @keyframes sc3d-particle-drift {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-120px) translateX(20px) scale(0.4); opacity: 0; }
  }
  @keyframes sc3d-shimmer {
    0%,100% { opacity: 0.3; }
    50%      { opacity: 0.9; }
  }
  @keyframes sc3d-braid-move {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -200; }
  }
  @keyframes sc3d-pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes sc3d-rotate-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes sc3d-glow-text {
    0%,100% { text-shadow: 0 0 40px rgba(212,175,55,0.3); }
    50%      { text-shadow: 0 0 80px rgba(212,175,55,0.7), 0 0 120px rgba(212,175,55,0.3); }
  }
`;

// ─── Particules légères ────────────────────────────────────────────────────────
function Particles({ count = 28 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${20 + Math.random() * 70}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${3 + Math.random() * 5}s`,
      size: Math.random() > 0.7 ? 3 : 2,
      gold: Math.random() > 0.6,
    }))
  ).current;

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.gold ? "#D4AF37" : "rgba(255,255,255,0.6)",
            animation: `sc3d-particle-drift ${p.duration} ease-in-out ${p.delay} infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </>
  );
}

// ─── SVG tresse centrale (braid pattern animé) ─────────────────────────────────
function BraidSVG({ isMobile }) {
  const w = isMobile ? 200 : 320;
  const h = isMobile ? 280 : 420;
  const cx = w / 2;

  // Courbes sinusoïdales alternées simulant une tresse
  const buildBraid = (offsetX, color, opacity, animDelay) => {
    const pts = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = h * t;
      const x = cx + offsetX * Math.sin(t * Math.PI * 6);
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return (
      <path
        key={`${color}-${animDelay}`}
        d={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={isMobile ? "3" : "4"}
        opacity={opacity}
        strokeLinecap="round"
        strokeDasharray="6 3"
        style={{ animation: `sc3d-braid-move 3s linear ${animDelay} infinite` }}
      />
    );
  };

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        filter: "drop-shadow(0 0 30px rgba(212,175,55,0.25))",
      }}
    >
      {/* Brin gauche — blanc */}
      {buildBraid(-22, "rgba(255,255,255,0.35)", 0.6, "0s")}
      {/* Brin centre — or */}
      {buildBraid(0, "#D4AF37", 0.8, "-1s")}
      {/* Brin droit — blanc */}
      {buildBraid(22, "rgba(255,255,255,0.35)", 0.6, "-2s")}

      {/* Nœuds décoratifs aux croisements */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => {
        const y = h * t;
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={y}
              r={isMobile ? 4 : 5}
              fill="#D4AF37"
              opacity="0.7"
              style={{ animation: `sc3d-shimmer ${1.5 + i * 0.2}s ease-in-out ${i * 0.3}s infinite` }}
            />
            <circle cx={cx} cy={y} r={isMobile ? 8 : 10} fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3"/>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Géométries flottantes ─────────────────────────────────────────────────────
function FloatingShapes({ isMobile }) {
  const scale = isMobile ? 0.6 : 1;
  const shapes = [
    // Losange haut-gauche
    {
      style: { top: "15%", left: "8%", animation: "sc3d-float1 7s ease-in-out infinite" },
      svg: (
        <svg width={50 * scale} height={50 * scale} viewBox="0 0 50 50" fill="none">
          <polygon points="25,2 48,25 25,48 2,25" stroke="rgba(212,175,55,0.55)" strokeWidth="1" fill="rgba(212,175,55,0.06)"/>
          <polygon points="25,8 42,25 25,42 8,25" stroke="rgba(212,175,55,0.3)" strokeWidth="0.5"/>
        </svg>
      )
    },
    // Triangle haut-droite
    {
      style: { top: "18%", right: "10%", animation: "sc3d-float2 8.5s ease-in-out 1s infinite" },
      svg: (
        <svg width={44 * scale} height={44 * scale} viewBox="0 0 44 44" fill="none">
          <polygon points="22,3 41,38 3,38" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="rgba(255,255,255,0.04)"/>
        </svg>
      )
    },
    // Carré bas-gauche
    {
      style: { bottom: "22%", left: "6%", animation: "sc3d-float3 6s ease-in-out 2s infinite" },
      svg: (
        <svg width={36 * scale} height={36 * scale} viewBox="0 0 36 36" fill="none">
          <rect x="2" y="2" width="32" height="32" stroke="rgba(212,175,55,0.4)" strokeWidth="1" transform="rotate(15 18 18)" fill="rgba(212,175,55,0.05)"/>
          <rect x="8" y="8" width="20" height="20" stroke="rgba(212,175,55,0.25)" strokeWidth="0.5" transform="rotate(15 18 18)"/>
        </svg>
      )
    },
    // Hexagone bas-droite
    {
      style: { bottom: "20%", right: "8%", animation: "sc3d-float1 9s ease-in-out 0.5s infinite" },
      svg: (
        <svg width={46 * scale} height={46 * scale} viewBox="0 0 46 46" fill="none">
          <polygon points="23,2 41,12 41,34 23,44 5,34 5,12" stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="rgba(255,255,255,0.03)"/>
          <polygon points="23,8 36,15 36,31 23,38 10,31 10,15" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        </svg>
      )
    },
    // Cercle centre-gauche
    {
      style: { top: "48%", left: "4%", animation: "sc3d-float2 7.5s ease-in-out 3s infinite" },
      svg: (
        <svg width={30 * scale} height={30 * scale} viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="13" stroke="rgba(212,175,55,0.35)" strokeWidth="1" fill="rgba(212,175,55,0.05)" strokeDasharray="3 3"/>
          <circle cx="15" cy="15" r="5" fill="rgba(212,175,55,0.2)"/>
        </svg>
      )
    },
  ];

  return (
    <>
      {shapes.map((s, i) => (
        <div key={i} style={{ position: "absolute", ...s.style, zIndex: 4 }}>
          {s.svg}
        </div>
      ))}
    </>
  );
}

// ─── Anneau rotatif décoratif ──────────────────────────────────────────────────
function RotatingRing({ isMobile }) {
  const size = isMobile ? 260 : 420;
  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      animation: "sc3d-rotate-slow 40s linear infinite",
      zIndex: 1,
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke="rgba(212,175,55,0.1)"
          strokeWidth="1"
          strokeDasharray="8 16"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 14}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
          strokeDasharray="2 20"
        />
        {/* Petits losanges sur le cercle */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r = size / 2 - 2;
          const x = size / 2 + r * Math.cos(rad);
          const y = size / 2 + r * Math.sin(rad);
          return (
            <rect key={i} x={x - 3} y={y - 3} width="6" height="6"
              fill="#D4AF37" opacity="0.5"
              transform={`rotate(45 ${x} ${y})`}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Pulse rings ──────────────────────────────────────────────────────────────
function PulseRings() {
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${120 * i}px`,
            height: `${120 * i}px`,
            marginLeft: `-${60 * i}px`,
            marginTop: `-${60 * i}px`,
            borderRadius: "50%",
            border: "1px solid rgba(212,175,55,0.12)",
            animation: `sc3d-pulse-ring ${2 + i}s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Texte LN TOUCH avec effet doré ───────────────────────────────────────────
function GoldenText({ isMobile }) {
  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 10,
      textAlign: "center",
      pointerEvents: "none",
      marginTop: isMobile ? "-20px" : "-30px",
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: isMobile ? "4.5rem" : "8rem",
        fontWeight: 900,
        letterSpacing: "-0.02em",
        lineHeight: 0.9,
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #D4AF37 50%, rgba(255,255,255,0.85) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "sc3d-glow-text 3s ease-in-out infinite",
      }}>
        LN<br/>TOUCH
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    // Affichage immédiat — pas de délai
    setLoaded(true);

    if (document.getElementById("sc3d-styles")) return;
    const tag = document.createElement("style");
    tag.id = "sc3d-styles";
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "black",
        overflow: "hidden",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Fond dégradé subtil */}
      <div style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.06) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.03) 0%, transparent 50%)",
        zIndex: 0,
      }}/>

      {/* Grille fine */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      {/* Composants visuels */}
      <PulseRings/>
      <RotatingRing isMobile={isMobile}/>
      <FloatingShapes isMobile={isMobile}/>
      <BraidSVG isMobile={isMobile}/>
      <GoldenText isMobile={isMobile}/>
      <Particles count={isMobile ? 16 : 28}/>
    </div>
  );
}