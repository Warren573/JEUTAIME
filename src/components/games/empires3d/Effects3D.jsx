// Effets visuels 3D pour Empires d'Étheria
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Effects3D({ dice, phase }) {
  return (
    <>
      {/* Particules magiques flottantes */}
      <MagicParticles />

      {/* Effet de dé */}
      {dice && <DiceEffect value={dice} />}

      {/* Effet de phase */}
      {phase === 'action' && <ActionEffect />}
    </>
  );
}

function MagicParticles({ count = 200 }) {
  const ref = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 6;
      const height = Math.random() * 15 + 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;

      // Animation verticale des particules
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;

        // Réinitialiser si trop haut
        if (positions[i * 3 + 1] > 20) {
          positions[i * 3 + 1] = 2;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function DiceEffect({ value }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 3;
      ref.current.rotation.y = state.clock.elapsedTime * 2;
      ref.current.position.y = 15 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[0, 15, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={1}
        metalness={0.8}
        roughness={0.1}
      />
    </mesh>
  );
}

function ActionEffect() {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusGeometry args={[12, 0.1, 16, 100]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
