"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Float from "./elements/Float";
import Letter from "./elements/Letter";
import ParticleSystem from "./elements/ParticleSystem";
import { easing } from "maath";

// Dans ton composant Scene3D
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

export default function Scene3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 12], fov: 45 }}
      style={{ background: "black" }}
    >
      <CameraRig />
      {/* <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} /> */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* <Environment preset="warehouse" /> */}

      {/* Particules subtiles */}
      <ParticleSystem
        position={[0, 0, -10]}
        count={isMobile ? 2000 : 1500}
        radius={20}
        shape="sphere"
        colors={["#FFD6D6", "#F5F5F5", "#f8e1a1"]}
        animations={["float", "spin"]}
        blending="additive"
      />

      {/* Lettres flottantes */}
      <Float position={[2.5, 0, -8]} speed={0.8} floatIntensity={0.4}>
        {/* <Letter char="LN TOUCH" position={[-1, 0, 0]} size={ isMobile ? 6: 20} sandbox="turtle" /> */}
        {/* <Letter char="l n  touch" position={[-1, 0, 0]} size={ isMobile ? 6: 20} sandbox="turtle" /> */}
        {/* <Letter char="LN touch" position={[-1, 0, 0]} size={ isMobile ? 6: 20} sandbox="turtle" /> */}
        <Letter char="L N  TOUCH" position={ isMobile ? [-1.5, 1.5, 1] : [-1, 1, 0]} size={ isMobile ? 3 : 10} sandbox="turtle" />
        {/* <Letter char="LNTOUCH" position={[-1, 0, 0]} sandbox="basic" /> */}
        {/* <Letter char="N" position={[0, 0, 0]} sandbox="turtle" />
        <Letter char="X" position={[3, 0, 0]} sandbox="pingpong" /> */}
        {/* <Letter char="TOUCH" position={[4, 0, 0]} sandbox="shoe" /> */}
      </Float>
    </Canvas>
  );
}

// Camera rig pour suivi léger du pointer
function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [-1 + (state.pointer.x * state.viewport.width) / 3, 1 + state.pointer.y, 5.5],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
}