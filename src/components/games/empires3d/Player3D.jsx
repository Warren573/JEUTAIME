// Pions des joueurs en 3D
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cone, Text } from '@react-three/drei';

export default function Player3D({ player, position, isActive, boardLength }) {
  const groupRef = useRef();
  const radius = 10;
  const angleStep = (Math.PI * 2) / boardLength;
  const angle = position * angleStep - Math.PI / 2;

  const x = Math.cos(angle) * (radius - 2);
  const z = Math.sin(angle) * (radius - 2);

  // Animation du joueur actif
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1.8;
      groupRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={groupRef} position={[x, 1.8, z]}>
      {/* Corps du pion (sphère) */}
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial
          color={player.color}
          emissive={player.color}
          emissiveIntensity={isActive ? 0.8 : 0.3}
          metalness={0.6}
          roughness={0.2}
        />
      </Sphere>

      {/* Chapeau/Couronne */}
      <Cone args={[0.3, 0.5, 6]} position={[0, 0.5, 0]}>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={isActive ? 1 : 0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </Cone>

      {/* Initiale du joueur */}
      <Text
        position={[0, 0, 0.45]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.name[0]}
      </Text>

      {/* Halo pour joueur actif */}
      {isActive && (
        <Sphere args={[0.6, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={player.color}
            emissive={player.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* Indicateur de mana */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.mana} 💎
      </Text>
    </group>
  );
}
