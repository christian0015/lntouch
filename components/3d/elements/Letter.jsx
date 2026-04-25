// src/engine/3d/Letter.jsx

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center, Lightformer, Environment, RenderTexture, MeshTransmissionMaterial, Preload } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

// Sandboxes
import Basic from "./sandboxes/Basic";
import Turtle from "./sandboxes/Turtle";
import PingPong from "./sandboxes/PingPong";
import Shoe from "./sandboxes/Shoe";
import Stencil from "./sandboxes/Stencil";
import Rocket from "./sandboxes/Rocket";

// Mapping simple sandbox
const SANDBOX_MAP = {
  basic: Basic,
  turtle: Turtle,
  pingpong: PingPong,
  shoe: Shoe,
  stencil: Stencil,
  // rocket: Rocket,
};

export default function Letter({
  char = "A",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.125,
  size = 20,
  physics = false,
  physicsProps = {},
  sandbox = "basic",

  // NEW
  shapes = 10,
  spacing = 1,
  colors = {},
  sizeShape = 80,

  children,
}) {
  const main = useRef();
  const contents = useRef();
  const events = useThree((state) => state.events);
  const controls = useThree((state) => state.controls);

  const SandboxComponent = SANDBOX_MAP[sandbox] || Basic;

  useFrame(() => {
    if (contents.current && main.current) {
      contents.current.matrix.copy(main.current.matrixWorld);
    }
  });

  const LetterContent = () => (
    <Center ref={main}>
      <Text3D
        bevelEnabled
        onDoubleClick={(e) => (e.stopPropagation(), controls.fitToBox(main.current, true))}
        // font="/fonts/bold-font/bold.blob"
        // font="/fonts/hippie-mods\Hippie_Mods_Regular.json"
        // font="/fonts/bratsy_script\Bratsy Script Demo_Regular.json"
        font="/fonts/lacheyard_script\Lacheyard Script PERSONAL USE_Regular.json"
        smooth={0}
        scale={scale}
        size={size}
        height={4}
        curveSegments={20}
        bevelThickness={.1}
        bevelSize={0.5}
        bevelOffset={0}
        bevelSegments={5}
      >
        {char}

        <MeshTransmissionMaterial
          clearcoat={1}
          samples={3}
          thickness={40}
          chromaticAberration={0.25}
          anisotropy={0.4}
        >
          <RenderTexture
            attach="buffer"
            stencilBuffer={false}
            width={512}
            height={512}
            compute={events.compute}
          >
            <group ref={contents} matrixAutoUpdate={false}>

              {children || (
                <SandboxComponent
                  shapes={shapes}
                  spacing={spacing}
                  sizeShape={sizeShape}
                  colors={colors}
                  text={char}
                />
              )}

            </group>

            <Preload all />

          </RenderTexture>
        </MeshTransmissionMaterial>

      </Text3D>

      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
        resolution={1024}
        position={[20,20,20]}
      >
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />

          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={4}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[4, 1, 1]}
            />
          ))}

          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />

        </group>
      </Environment>
    </Center>
  );

  if (physics) {
    return (
      <RigidBody
        position={position}
        rotation={rotation}
        colliders="cuboid"
        restitution={0.1}
        {...physicsProps}
      >
        {LetterContent()}
      </RigidBody>
    );
  }

  return (
    <group position={position} rotation={rotation}>
      {LetterContent()}
    </group>
  );
}