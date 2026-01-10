import { Canvas } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStarProps {
  letter: string;
  position: [number, number, number];
  speed: number;
  scale: number;
}

const createLetterTexture = (letter: string, size = 128, color = '#fff') => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.floor(size * 0.7)}px system-ui, -apple-system, 'Segoe UI', Roboto`;
  ctx.fillText(letter, size / 2, size / 2 + 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
};

const ShootingStar = ({ letter, position, speed, scale }: ShootingStarProps) => {
  const spriteRef = useRef<THREE.Sprite | null>(null);
  const texture = useMemo(() => createLetterTexture(letter, 256), [letter]);

  useFrame((state, delta) => {
    const mesh = spriteRef.current;
    if (mesh) {
      mesh.position.x += speed * delta;
      mesh.position.y += speed * delta * 0.35;
      mesh.material.rotation = (mesh.material.rotation || 0) + delta * 1.5;

      if (mesh.position.x > 30) {
        mesh.position.x = -30;
        mesh.position.y = Math.random() * 30 - 15;
        mesh.position.z = Math.random() * 20 - 10;
      }
    }
  });

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  return (
    // @ts-ignore three types for sprite props
    <sprite ref={spriteRef} position={position} scale={[scale * 0.6, scale * 0.6, 1]}>
      <spriteMaterial attach="material" map={texture!} transparent />
    </sprite>
  );
};

const ShootingStars3D = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('shootingStarsEnabled') : null;
      return saved ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [mounted, setMounted] = useState(false);
  const [density, setDensity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shootingStarsDensity');
      return saved ? Number(saved) : 15;
    } catch {
      return 15;
    }
  });
  const [speedMul, setSpeedMul] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shootingStarsSpeed');
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });
  const [scaleMul, setScaleMul] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('shootingStarsScale');
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  // Auto-disable on low-end devices or when user prefers reduced motion
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceMemory = (navigator as any).deviceMemory || 0;
    const hw = (navigator as any).hardwareConcurrency || 4;
    const lowEnd = deviceMemory > 0 ? deviceMemory < 2 : hw < 3;
    if (prefersReduced || lowEnd) {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('shootingStarsEnabled', String(enabled));
        localStorage.setItem('shootingStarsDensity', String(density));
        localStorage.setItem('shootingStarsSpeed', String(speedMul));
        localStorage.setItem('shootingStarsScale', String(scaleMul));
      }
    } catch {
      // ignore
    }
  }, [enabled, density, speedMul, scaleMul]);

  const stars = useMemo(() => {
    const letters = ['π', 'α', 'β'];
    const count = Math.max(0, Math.min(80, Math.round(density)));
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      letter: letters[Math.floor(Math.random() * letters.length)],
      position: [
        Math.random() * 60 - 30,
        Math.random() * 30 - 15,
        Math.random() * 20 - 10,
      ] as [number, number, number],
      speed: (Math.random() * 1.5 + 0.5) * speedMul,
      scale: (Math.random() * 1.5 + 0.8) * scaleMul,
    }));
  }, [density, speedMul, scaleMul, mounted]);

  // If not mounted (SSR) or disabled by heuristic, render nothing (no buttons)
  if (!mounted || !enabled) return null;

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <Canvas className="pointer-events-none" camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.45} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
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

      {/* Controls removed from UI to keep animation live and non-interactive */}
    </div>
  );
};

export default ShootingStars3D;