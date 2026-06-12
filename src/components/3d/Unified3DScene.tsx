import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

// Deterministic PRNG so the skyline looks identical on every visit
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Procedural "lit windows" texture shared by all towers
function createWindowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#080d16";
  ctx.fillRect(0, 0, 64, 128);

  const rand = mulberry32(1337);
  for (let y = 8; y < 118; y += 10) {
    for (let x = 7; x < 54; x += 9) {
      const r = rand();
      if (r > 0.55) {
        // mostly cyan windows, occasional warm orange one
        ctx.fillStyle =
          r > 0.93
            ? "rgba(255, 150, 50, 0.85)"
            : `rgba(80, 215, 255, ${0.25 + rand() * 0.4})`;
        ctx.fillRect(x, y, 4, 5);
      }
    }
  }
  // faint contour frame so every face keeps a hint of the Tron silhouette
  ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, 62, 126);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Rounded neon tower with lit windows
function Monolith({
  position,
  size,
  isCeiling = false,
  opacity,
  color,
  texture,
  phase,
}: {
  position: [number, number, number];
  size: [number, number, number];
  isCeiling?: boolean;
  opacity: number;
  color: THREE.Color;
  texture: THREE.Texture;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame((state) => {
    if (!ref.current || opacity <= 0.01) return;
    const time = state.clock.getElapsedTime();
    const offset = Math.sin(time + position[0]) * 1.5;
    ref.current.position.y = isCeiling ? position[1] - offset : position[1] + offset;
    ref.current.scale.y = 1 + Math.abs(Math.sin(time * 0.25)) * 0.3;

    if (matRef.current) {
      // gentle per-tower brightness pulse; texture keeps its own cyan/orange
      matRef.current.opacity = opacity * (0.85 + Math.sin(time * 0.9 + phase) * 0.15);
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={size} radius={0.32} smoothness={3}>
        <meshBasicMaterial
          ref={matRef}
          map={texture}
          transparent
          opacity={opacity * 0.8}
          toneMapped={false}
        />
      </RoundedBox>
    </group>
  );
}

// Drifting light particles — fireflies over the city
function CityParticles({
  opacity,
  color,
  isMobile,
}: {
  opacity: number;
  color: THREE.Color;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Points>(null!);
  const count = isMobile ? 140 : 280;

  const positions = useMemo(() => {
    const rand = mulberry32(2024);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 80;
      arr[i * 3 + 1] = -10 + rand() * 28;
      arr[i * 3 + 2] = (rand() - 0.5) * 90 - 5;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current || opacity <= 0.01) return;
    ref.current.rotation.y += delta * 0.012;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.color.copy(color);
    mat.opacity = opacity * (0.45 + Math.sin(state.clock.elapsedTime * 0.7) * 0.15);
  });

  if (opacity <= 0.01) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.22} transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// traffic streak component for GridCity
function CarStreak({ lane, initialZ, opacity, color }: { lane: number, initialZ: number; opacity: number; color: THREE.Color }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.6 + Math.random() * 0.8, []);
  const direction = lane > 0 ? 1 : -1;
  const streakLength = useMemo(() => 6 + Math.random() * 12, []);

  useFrame(() => {
    if (!ref.current || opacity <= 0.01) return;
    ref.current.position.z += speed * direction;
    if (direction === 1 && ref.current.position.z > 80) ref.current.position.z = -120;
    if (direction === -1 && ref.current.position.z < -120) ref.current.position.z = 80;

    // Direct WebGL material color update via ref
    ref.current.traverse((child) => {
      if ((child as any).material && (child as any).material.color) {
        (child as any).material.color.copy(color);
      }
    });
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={ref} position={[lane, -9.8, initialZ]}>
      <Line
        points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -streakLength * direction)]}
        color="#00D4FF"
        lineWidth={2}
        transparent
        opacity={opacity * 0.8}
      />
    </group>
  );
}

// Scene rendering controller
function SceneContent({ scrollYProgress, isMobile }: { scrollYProgress: MotionValue<number>; isMobile: boolean }) {
  const scrollRef = useRef(0);
  const gridRef1 = useRef<THREE.GridHelper>(null!);
  const gridRef2 = useRef<THREE.GridHelper>(null!);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      scrollRef.current = latest;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Color objects for dynamic color shifts
  const cyanColor = useMemo(() => new THREE.Color("#00D4FF"), []);
  const greenColor = useMemo(() => new THREE.Color("#00FF41"), []);
  const activeColor = useMemo(() => new THREE.Color("#00D4FF"), []);

  const windowTexture = useMemo(() => createWindowTexture(), []);

  // City Buildings Generation — seeded so the skyline is stable across loads,
  // tighter spread on mobile so the narrow viewport still feels dense
  const buildingCount = isMobile ? 20 : 30;
  const buildings = useMemo(() => {
    const rand = mulberry32(7);
    const halfSpread = isMobile ? 14 : 22;
    const clearing = isMobile ? 6 : 8;
    const b = [];
    for (let i = 0; i < buildingCount; i++) {
      // keep a central boulevard clear so the headline sits on open space
      const side = rand() > 0.5 ? 1 : -1;
      const x = side * (clearing + rand() * halfSpread);
      const h = 6 + rand() * 14;
      // keep towers away from the camera plane (z ~26-30) so none become wall-sized
      const z = (rand() - 0.5) * 70 - 22;
      b.push({ position: [x, -10, z] as [number, number, number], size: [3 + rand() * 2, h, 3 + rand() * 2] as [number, number, number], isCeiling: false, phase: rand() * Math.PI * 2 });
      b.push({ position: [x, 15, z] as [number, number, number], size: [3 + rand() * 2, h, 3 + rand() * 2] as [number, number, number], isCeiling: true, phase: rand() * Math.PI * 2 });
    }
    return b;
  }, [buildingCount, isMobile]);

  // Traffic Generation
  const trafficCount = isMobile ? 4 : 10;
  const traffic = useMemo(() => {
    const rand = mulberry32(99);
    const t = [];
    const lanes = [-15, -8, 8, 15];
    for (let i = 0; i < trafficCount; i++) {
      t.push({
        id: i,
        lane: lanes[Math.floor(rand() * lanes.length)] + (rand() - 0.5) * 1.5,
        initialZ: (rand() - 0.5) * 160
      });
    }
    return t;
  }, [trafficCount]);

  // Opacity calculation for the City elements
  const [cityOpacity, setCityOpacity] = useState(1.0);

  useFrame((state) => {
    const progress = scrollRef.current;
    const { camera, mouse } = state;

    // Transition City Opacity out completely by 0.40 progress
    let currentCityOpacity = 0.0;
    if (progress <= 0.20) {
      currentCityOpacity = 1.0;
    } else if (progress <= 0.40) {
      // Linear fade out between 0.20 and 0.40
      currentCityOpacity = 1.0 - (progress - 0.20) / 0.20;
    } else {
      currentCityOpacity = 0.0;
    }

    setCityOpacity(currentCityOpacity);

    // Calculate dynamic color shift based on scroll progress
    let lerpFactor = 0;
    if (progress > 0.20) {
      lerpFactor = Math.min(1.0, (progress - 0.20) / 0.20);
    }
    activeColor.lerpColors(cyanColor, greenColor, lerpFactor);

    // Update grid helper colors dynamically
    if (gridRef1.current && gridRef1.current.material) {
      (gridRef1.current.material as any).color.copy(activeColor);
    }
    if (gridRef2.current && gridRef2.current.material) {
      (gridRef2.current.material as any).color.copy(activeColor);
    }

    // Camera motion path linking progress to coordinates
    let targetX = 0;
    let targetY = 0;
    let targetZ = 30;
    let targetRotX = 0;
    let targetRotY = 0;

    if (progress <= 0.20) {
      // Phase 1: City View
      targetX = 0;
      targetY = 0;
      targetZ = 30 - progress * 20; // moving in
      targetRotX = 0;
      targetRotY = 0;
    } else if (progress <= 0.40) {
      // Phase 2: Tilt to Sky and fade out
      const p = (progress - 0.20) / 0.20;
      targetX = 0;
      targetY = p * 12; // tilt upwards
      targetZ = 26 - p * 10;
      targetRotX = (p * Math.PI) / 5; // tilt view up
      targetRotY = 0;
    } else {
      // Safe parking state when fully faded out
      targetX = 0;
      targetY = 12;
      targetZ = 16;
      targetRotX = Math.PI / 5;
      targetRotY = 0;
    }

    // Global Interactive Mouse Parallax (Tilting the camera slightly)
    const mouseInfluenceX = (mouse.x * Math.PI) / 32;
    const mouseInfluenceY = (mouse.y * Math.PI) / 32;

    // Smooth camera tracking
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX + mouseInfluenceY, 0.04);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotY - mouseInfluenceX, 0.04);
  });

  return (
    <>
      {cityOpacity > 0.01 && (
        <group>
          {buildings.map((b, i) => (
            <Monolith key={i} {...b} opacity={cityOpacity} color={activeColor} texture={windowTexture} />
          ))}
          {traffic.map((t) => (
            <CarStreak key={t.id} {...t} opacity={cityOpacity} color={activeColor} />
          ))}

          <CityParticles opacity={cityOpacity} color={activeColor} isMobile={isMobile} />

          <gridHelper ref={gridRef1} args={[200, 20, "#00D4FF", "#00D4FF"]} position={[0, -10, 0]} transparent opacity={cityOpacity * 0.15} />
          <gridHelper ref={gridRef2} args={[200, 20, "#00D4FF", "#00D4FF"]} position={[0, 15, 0]} transparent opacity={cityOpacity * 0.05} />
        </group>
      )}
    </>
  );
}

export const Unified3DScene = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0B0B0F]">
      <Canvas dpr={[1, 1.3]} gl={{ alpha: false, antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={isMobile ? 80 : 60} />
        <color attach="background" args={["#0B0B0F"]} />
        <ambientLight intensity={1.5} />
        <SceneContent scrollYProgress={scrollYProgress} isMobile={isMobile} />
      </Canvas>
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0B0B0F_95%)]" />
    </div>
  );
};

export default Unified3DScene;
