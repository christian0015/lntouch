// src/engine/3d/Float.jsx (corrigé)
import React, { useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";

const Float = forwardRef(({
  children,
  position = [0, 0, 0],
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  floatingRange = [1, 1.2],
  rotationRange = [0, Math.PI / 4],
  enabled = true,
  onClick,
  id,
  isSelected,
  ...props
}, ref) => {
  const groupRef = useRef();
  const initialPosition = useRef(null);
  const initialRotation = useRef(null);

  const setRefs = (element) => {
    groupRef.current = element;
    if (ref) {
      if (typeof ref === 'function') ref(element);
      else ref.current = element;
    }
  };

  useFrame((state) => {
    if (!enabled || !groupRef.current) return;

    if (!initialPosition.current) {
      initialPosition.current = groupRef.current.position.clone();
      initialRotation.current = groupRef.current.rotation.clone();
    }

    const time = state.clock.elapsedTime * speed;

    // Animation flottante
    if (floatIntensity > 0) {
      const [minY, maxY] = floatingRange;
      const yOffset = Math.sin(time) * ((maxY - minY) / 2) + (minY + maxY) / 2 - 1;
      groupRef.current.position.y = initialPosition.current.y + yOffset * floatIntensity;
    }

    // Animation de rotation
    if (rotationIntensity > 0) {
      const [minRot, maxRot] = rotationRange;
      const rotX = Math.sin(time * 0.7) * rotationIntensity * 0.1;
      const rotY = Math.sin(time * 0.5) * ((maxRot - minRot) / 2) * rotationIntensity;
      const rotZ = Math.cos(time * 0.8) * rotationIntensity * 0.1;

      groupRef.current.rotation.x = initialRotation.current.x + rotX;
      groupRef.current.rotation.y = initialRotation.current.y + rotY;
      groupRef.current.rotation.z = initialRotation.current.z + rotZ;
    }
  });

  const handleGroupClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(id);
  };

  return (
    <group 
      ref={setRefs} 
      position={position} 
      onClick={handleGroupClick}
      userData={{ id, type: "Float" }}
      {...props}
    >
      {children}
    </group>
  );
});

Float.displayName = "Float";
export default Float;