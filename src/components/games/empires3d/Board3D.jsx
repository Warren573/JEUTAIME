// Plateau 3D circulaire pour Empires d'Étheria
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function Board3D({ board, selectedCell }) {
  const groupRef = useRef();

  // Rotation lente du plateau
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const radius = 10; // Rayon du cercle
  const angleStep = (Math.PI * 2) / board.length;

  return (
    <group ref={groupRef}>
      {/* Base du plateau (anneau) */}
      <Cylinder args={[radius + 2, radius + 2, 0.5, 64]} position={[0, -0.3, 0]}>
        <meshStandardMaterial
          color="#1a0a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Anneau lumineux central */}
      <Cylinder args={[radius - 1, radius - 1, 0.1, 64]} position={[0, 0.2, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Cylinder>

      {/* Cases du plateau */}
      {board.map((cell, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const isSelected = selectedCell && selectedCell.id === cell.id;

        return (
          <Cell3D
            key={cell.id}
            cell={cell}
            position={[x, 0, z]}
            rotation={[0, angle + Math.PI / 2, 0]}
            isSelected={isSelected}
          />
        );
      })}

      {/* Logo central */}
      <Text
        position={[0, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#8b5cf6"
      >
        ÉTHERIA
      </Text>
    </group>
  );
}

function Cell3D({ cell, position, rotation, isSelected }) {
  const meshRef = useRef();

  // Animation de sélection
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.5;
    }
  });

  // Couleurs selon le type
  let color = '#2a2a3a';
  let emissiveColor = '#000000';
  let emissiveIntensity = 0;

  if (cell.type === 'city') {
    if (cell.owner !== null) {
      color = '#4a4a5a'; // Ville possédée
      emissiveColor = '#667eea';
      emissiveIntensity = 0.3;
    } else {
      color = '#3a3a4a'; // Ville libre
    }
  } else if (cell.type === 'event') {
    color = '#b45309';
    emissiveColor = '#f59e0b';
    emissiveIntensity = 0.4;
  } else if (cell.type === 'artifact') {
    color = '#7c3aed';
    emissiveColor = '#a78bfa';
    emissiveIntensity = 0.5;
  } else if (cell.type === 'portal') {
    color = '#06b6d4';
    emissiveColor = '#22d3ee';
    emissiveIntensity = 0.6;
  }

  // Icône selon le type
  let icon = '🏰';
  if (cell.type === 'event') icon = '⚡';
  if (cell.type === 'artifact') icon = '🔮';
  if (cell.type === 'portal') icon = '🌀';

  return (
    <group position={position} rotation={rotation}>
      {/* Case */}
      <RoundedBox
        ref={meshRef}
        args={[1.5, 0.8, 0.3]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.5, 0]}
      >
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 1 : emissiveIntensity}
          metalness={0.5}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Icône */}
      <Text
        position={[0, 1.2, 0.2]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Nom de la case (pour les villes) */}
      {cell.type === 'city' && cell.name && (
        <Text
          position={[0, 0.3, 0.2]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {cell.name.split(' ').slice(0, 2).join(' ')}
        </Text>
      )}

      {/* Indicateur de propriétaire */}
      {cell.owner !== null && (
        <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[0, 1.5, 0]}>
          <meshStandardMaterial
            color="#667eea"
            emissive="#667eea"
            emissiveIntensity={0.8}
          />
        </Cylinder>
      )}

      {/* Effet de sélection */}
      {isSelected && (
        <Cylinder args={[0.8, 0.8, 0.05, 32]} position={[0, 0.1, 0]}>
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </Cylinder>
      )}
    </group>
  );
}
