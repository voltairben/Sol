"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, type Mesh, type MeshStandardMaterial } from "three";

const REST = new Color("#00F0FF"); // neon blue
const HOT = new Color("#FF6B35"); // warm persimmon

export interface HitState {
  at: number;
}

function Core({ hit }: { hit: React.RefObject<HitState> }) {
  const mesh = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  const scale = useRef(1);
  const vel = useRef(0);
  const flash = useRef(0); // 1 = hot persimmon, decays to 0 (blue)
  const wave = useRef(1); // 0 → 1 shockwave progress (1 = idle)
  const seen = useRef(0);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;

    m.rotation.x += dt * 0.25;
    m.rotation.y += dt * 0.4;

    // consume a hit
    const at = hit.current?.at ?? 0;
    if (at > seen.current) {
      seen.current = at;
      scale.current = 1.6; // instant tactile expansion
      vel.current = 0;
      flash.current = 1;
      wave.current = 0;
    }

    // spring the scale back to 1 (slight overshoot)
    vel.current += (1 - scale.current) * 0.16;
    vel.current *= 0.72;
    scale.current += vel.current;
    m.scale.setScalar(scale.current);

    // colour bleed hot → rest
    flash.current = Math.max(0, flash.current - dt * 1.4);
    const mat = m.material as MeshStandardMaterial;
    mat.color.lerpColors(REST, HOT, flash.current);
    mat.emissive.lerpColors(REST, HOT, flash.current);
    mat.emissiveIntensity = 0.5 + flash.current * 1.4;

    // shockwave ring
    const r = ring.current;
    if (r) {
      wave.current = Math.min(1, wave.current + dt * 1.9);
      const e = wave.current;
      r.visible = e < 1;
      r.scale.setScalar(0.9 + e * 3);
      (r.material as MeshStandardMaterial).opacity = (1 - e) * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial wireframe color={REST} emissive={REST} />
      </mesh>
      <mesh ref={ring} visible={false}>
        <torusGeometry args={[1, 0.015, 6, 44]} />
        <meshStandardMaterial
          wireframe
          transparent
          opacity={0}
          color={HOT}
          emissive={HOT}
          emissiveIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

export function Core3D({ hitRef }: { hitRef: React.RefObject<HitState> }) {
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
      <Core hit={hitRef} />
    </Canvas>
  );
}
