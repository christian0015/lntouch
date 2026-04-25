// src/engine/3d/ParticleSystem.jsx
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleSystem - Système de particules avancé
 * Supporte: couleurs multiples, taille aléatoire, followCursor, animations
 */
export default function ParticleSystem({
  id,
  position = [0, 0, 0],
  count = 1000,
  size = { min: 0.05, max: 1.2 },
  colors = ["#FFFFFF"],
  transparency = 0.5,
  shape = "sphere",
  radius = 5,
  followCursor = false,
  cursorStrength = 0.1,
  animations = [],
  speed = 0.1,
  opacity = 1,
  blending = "normal",
  onClick,
  isSelected,
  ...props
}) {
  const pointsRef = useRef();
  const initialPositions = useRef([]);
  const cursorPosition = useRef(new THREE.Vector3());
  const clock = useRef(new THREE.Clock());

  // Générer les positions initiales et les couleurs
  const { positions, colors: colorsArray, sizes } = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);

    // Préparer les couleurs
    const colorObjects = colors.map(c => new THREE.Color(c));
    initialPositions.current = [];

    for (let i = 0; i < count; i++) {
      // Position selon la forme
      let x, y, z;
      
      switch (shape) {
        case "sphere":
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = radius * (0.5 + Math.random() * 0.5);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          break;
        
        case "box":
          x = (Math.random() - 0.5) * radius * 2;
          y = (Math.random() - 0.5) * radius * 2;
          z = (Math.random() - 0.5) * radius * 2;
          break;
        
        case "ring":
          const angle = Math.random() * Math.PI * 2;
          const rad = radius * (0.8 + Math.random() * 0.4);
          x = Math.cos(angle) * rad;
          y = Math.sin(angle) * rad;
          z = (Math.random() - 0.5) * radius * 0.5;
          break;
        
        case "disc":
          const a = Math.random() * Math.PI * 2;
          const r2 = radius * Math.sqrt(Math.random());
          x = Math.cos(a) * r2;
          y = Math.sin(a) * r2;
          z = 0;
          break;
        
        default:
          x = (Math.random() - 0.5) * radius * 2;
          y = (Math.random() - 0.5) * radius * 2;
          z = (Math.random() - 0.5) * radius * 2;
      }

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      // Sauvegarder pour followCursor
      initialPositions.current.push(new THREE.Vector3(x, y, z));

      // Couleur aléatoire
      const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
      colArray[i * 3] = color.r;
      colArray[i * 3 + 1] = color.g;
      colArray[i * 3 + 2] = color.b;

      // Taille aléatoire
      if (typeof size === "number") {
        sizeArray[i] = size;
      } else {
        sizeArray[i] = size.min + Math.random() * (size.max - size.min);
      }
    }

    return { positions: posArray, colors: colArray, sizes: sizeArray };
  }, [count, shape, radius, colors, size]);

  // Animation frame
  useFrame((state) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const delta = clock.current.getDelta();
    const elapsedTime = state.clock.elapsedTime;

    // Follow cursor
    if (followCursor) {
      const mouse = state.mouse;
      cursorPosition.current.lerp(
        new THREE.Vector3(mouse.x * 3, -mouse.y * 3, 0),
        cursorStrength * delta * 30
      );
    }

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Position de base
      const basePos = initialPositions.current[i];
      
      // Ajouter cursor si actif
      let targetX = basePos.x;
      let targetY = basePos.y;
      let targetZ = basePos.z;

      if (followCursor) {
        targetX += cursorPosition.current.x;
        targetY += cursorPosition.current.y;
        targetZ += cursorPosition.current.z;
      }

      // Ajouter animations
      if (animations.includes("float")) {
        targetX += Math.sin(elapsedTime * 2 + i) * 0.02;
        targetY += Math.cos(elapsedTime * 2 + i) * 0.02;
        targetZ += Math.sin(elapsedTime * 1.5 + i) * 0.02;
      }

      if (animations.includes("spin")) {
        const angle = elapsedTime * 0.5;
        targetX += Math.sin(angle + i) * 0.1;
        targetY += Math.cos(angle + i) * 0.1;
      }

      if (animations.includes("pulse")) {
        const pulse = Math.sin(elapsedTime * 3 + i) * 0.1;
        targetX += pulse;
        targetY += pulse;
      }

      // Interpolation douce
      positions[ix] += (targetX - positions[ix]) * speed * delta * 30;
      positions[iy] += (targetY - positions[iy]) * speed * delta * 30;
      positions[iz] += (targetZ - positions[iz]) * speed * delta * 30;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  // Configuration du blending
  const blendingMode = {
    normal: THREE.NormalBlending,
    additive: THREE.AdditiveBlending,
    subtractive: THREE.SubtractiveBlending,
    multiply: THREE.MultiplyBlending
  }[blending] || THREE.NormalBlending;

  // Gestionnaire de clic
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <points 
      ref={pointsRef} 
      position={position} 
      frustumCulled={false}
      onClick={handleClick}
      userData={{ id, type: "ParticleSystem" }}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colorsArray.length / 3}
          array={colorsArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      
      {/* <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z) * ${opacity};
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            
            // Forme de la particule
            float alpha = ${transparency};
            
            // Effet de glow
            float glow = pow(1.0 - r, 2.0);
            vec3 finalColor = vColor + vec3(0.3) * glow;
            
            gl_FragColor = vec4(finalColor, alpha * glow);
          }
        `}
        blending={blendingMode}
        depthWrite={false}
        transparent
      /> */}
      {/* <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            float dist = length(mvPosition.xyz);
            gl_PointSize = size * (300.0 / dist);
            
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;

            float glow = pow(1.0 - r, 2.0);
            gl_FragColor = vec4(vColor * glow, ${transparency});
          }
        `}
        blending={blendingMode}
        depthWrite={false}
        transparent
      /> */}
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;

          varying vec3 vColor;
          varying float vDepth;

          void main() {
            vColor = color;

            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float dist = length(mvPosition.xyz);
            vDepth = dist;

            // Clamp pour éviter tailles infinies
            float safeDist = max(dist, 0.1);
            gl_PointSize = size * (300.0 / safeDist);

            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vDepth;

          void main() {
            vec2 uv = gl_PointCoord * 2.0 - 1.0;
            float r = dot(uv, uv);

            if (r > 1.0) discard;

            // Glow radial doux
            float glow = smoothstep(1.0, 0.0, r);

            // Atténuation avec la profondeur (cinématographique)
            float depthFade = clamp(1.0 - vDepth * 0.02, 0.0, 1.0);

            vec3 finalColor = vColor * glow;
            float alpha = ${transparency} * glow * depthFade;

            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        blending={blendingMode}
        depthWrite={false}
        depthTest={true}
        transparent
      />
    </points>
  );
}