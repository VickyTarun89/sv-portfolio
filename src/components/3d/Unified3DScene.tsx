import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera, Edges } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

// Reusable Monolith component for GridCity
function Monolith({ position, size, isCeiling = false, opacity, color }: { position: [number, number, number]; size: [number, number, number]; isCeiling?: boolean; opacity: number; color: THREE.Color }) {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (!ref.current || opacity <= 0.01) return;
    const time = state.clock.getElapsedTime();
    const offset = Math.sin(time + position[0]) * 1.5;
    ref.current.position.y = isCeiling ? position[1] - offset : position[1] + offset;
    ref.current.scale.y = 1 + Math.abs(Math.sin(time * 0.25)) * 0.3;

    // Direct WebGL material color update via ref (no React re-renders)
    ref.current.traverse((child) => {
      if (child instanceof THREE.LineSegments && child.material) {
        (child.material as THREE.LineBasicMaterial).color.copy(color);
      }
    });
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#0B0B0F" transparent opacity={opacity * 0.6} />
        <Edges threshold={15} color="#00D4FF" />
      </mesh>
    </group>
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

  // City Buildings Generation
  const buildingCount = isMobile ? 12 : 32;
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < buildingCount; i++) {
      const x = (Math.random() - 0.5) * 55;
      const h = 6 + Math.random() * 14;
      const z = (Math.random() - 0.5) * 80 - 10;
      b.push({ position: [x, -10, z] as [number, number, number], size: [3 + Math.random() * 2, h, 3 + Math.random() * 2] as [number, number, number], isCeiling: false });
      b.push({ position: [x, 15, z] as [number, number, number], size: [3 + Math.random() * 2, h, 3 + Math.random() * 2] as [number, number, number], isCeiling: true });
    }
    return b;
  }, [buildingCount]);

  // Traffic Generation
  const trafficCount = isMobile ? 4 : 10;
  const traffic = useMemo(() => {
    const t = [];
    const lanes = [-15, -8, 8, 15];
    for (let i = 0; i < trafficCount; i++) {
      t.push({
        id: i,
        lane: lanes[Math.floor(Math.random() * lanes.length)] + (Math.random() - 0.5) * 1.5,
        initialZ: (Math.random() - 0.5) * 160
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
            <Monolith key={i} {...b} opacity={cityOpacity} color={activeColor} />
          ))}
          {traffic.map((t) => (
            <CarStreak key={t.id} {...t} opacity={cityOpacity} color={activeColor} />
          ))}
          
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
