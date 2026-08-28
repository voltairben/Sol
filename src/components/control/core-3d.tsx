"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

function SpinningCore() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.25;
    ref.current.rotation.y += dt * 0.4;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1.15, 0]} />
      <meshStandardMaterial
        color="#00F0FF"
        emissive="#00F0FF"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

export function Core3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      className="rounded-[2px]"
    >
      <color attach="background" args={["#0B0F19"]} />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 4, 5]}
        angle={0.45}
        penumbra={0.7}
        intensity={45}
        color="#FF6B35"
      />
      <SpinningCore />
    </Canvas>
  );
}
