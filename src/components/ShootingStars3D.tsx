import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

interface ShootingStarProps {
  letter: string;
  position: [number, number, number];
  speed: number;
  scale: number;
}

const ShootingStar = ({ letter, position, speed, scale }: ShootingStarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x += speed * delta;
      meshRef.current.position.y += speed * delta * 0.5;
      meshRef.current.rotation.z += delta * 2;

      // Reset position when it goes off screen
      if (meshRef.current.position.x > 20) {
        meshRef.current.position.x = -20;
        meshRef.current.position.y = Math.random() * 10 - 5;
        meshRef.current.position.z = Math.random() * 5 - 2.5;
      }
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={scale}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {letter}
    </Text>
  );
};

const ShootingStars3D = () => {
  const stars = useMemo(() => {
    const letters = ['π', 'α', 'β'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      letter: letters[Math.floor(Math.random() * letters.length)],
      position: [
        Math.random() * 40 - 20,
        Math.random() * 20 - 10,
        Math.random() * 10 - 5,
      ] as [number, number, number],
      speed: Math.random() * 5 + 2,
      scale: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {stars.map((star) => (
          <ShootingStar
            key={star.id}
            letter={star.letter}
            position={star.position}
            speed={star.speed}
            scale={star.scale}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default ShootingStars3D;