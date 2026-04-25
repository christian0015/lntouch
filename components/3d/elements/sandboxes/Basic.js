// src/engine/3d/sandboxes/Basic.jsx

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Basic({
  shapes = 2,
  spacing = 2,
  sizeShape = .8,
  colors = {},
  text = ""
}) {

  const normal = colors.normal || "#ebe2c9";
  const hoverColor = colors.hover || "#ff0000";

  let count = shapes;

  if (shapes === "auto") {
    count = Math.max(1, Math.floor(text.length / 2));
  }

  const objects = new Array(count).fill(0);

  return (
    <group>

      <ambientLight intensity={0.3} />

      <pointLight position={[10, 10, 5]} />
      <pointLight position={[-10, -10, -5]} />

      {objects.map((_, i) => (
        <Box
          key={i}
          index={i}
          normal={normal}
          hoverColor={hoverColor}
          shapes={shapes}
          spacing={spacing}
          sizeShape={sizeShape}
        />
      ))}

    </group>
  );
}

function Box({ index, normal, hoverColor, shapes, spacing, sizeShape }) {

  const ref = useRef();
  const [hovered, setHover] = useState(false);

  const totalWidth = (shapes - 1) * spacing; // largeur totale
  const startX = -totalWidth / 2;           // point de départ pour centrer

  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      ref={ref}
      position={[startX + index * spacing, 0, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >

      <boxGeometry args={[sizeShape, sizeShape, sizeShape]} />

      <meshStandardMaterial
        color={hovered ? hoverColor : normal}
      />

    </mesh>
  );
}