import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

// Deterministic PRNG so the scene looks identical on every visit
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Wireframe globe with arcing data connections — represents global SaaS reach
function DataGlobe({
  opacity,
  color,
  isMobile,
  spinRef,
  descentRef,
}: {
  opacity: number;
  color: THREE.Color;
  isMobile: boolean;
  spinRef: React.MutableRefObject<number>;
  descentRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.LineSegments>(null!);
  const dotsRef = useRef<THREE.Points>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const radius = isMobile ? 7 : 10;
  const arcCount = isMobile ? 7 : 14;
  const dotCount = isMobile ? 80 : 180;

  // Surface dots distributed via Fibonacci sphere
  const dotPositions = useMemo(() => {
    const arr = new Float32Array(dotCount * 3);
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr[i * 3] = Math.cos(theta) * r * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return arr;
  }, [dotCount]);

  // Pre-computed arc geometries — great-circle paths between random surface points
  const arcs = useMemo(() => {
    const rand = mulberry32(7);
    const list: { points: THREE.Vector3[]; speed: number; phase: number }[] = [];
    for (let i = 0; i < arcCount; i++) {
      const a = new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5
      ).normalize().multiplyScalar(radius);
      const b = new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5
      ).normalize().multiplyScalar(radius);
      const mid = a.clone().add(b).normalize().multiplyScalar(radius * 1.55);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      list.push({
        points: curve.getPoints(32),
        speed: 0.4 + rand() * 0.6,
        phase: rand() * Math.PI * 2,
      });
    }
    return list;
  }, [arcCount]);

  const sphereGeometry = useMemo(() => {
    const g = new THREE.SphereGeometry(radius, isMobile ? 18 : 28, isMobile ? 12 : 18);
    return new THREE.EdgesGeometry(g);
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!groupRef.current || opacity <= 0.01) return;
    // Spin speeds up while the Journey section is in view
    const spin = 0.12 + Math.min(1, Math.max(0, spinRef.current)) * 0.7;
    groupRef.current.rotation.y += delta * spin;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;

    // Sink toward the grid floor across the Builds section. Base y is 1; the grid
    // floor sits at y = -10, so dropping ~16 units settles the globe at its edge.
    const descent = Math.min(1, Math.max(0, descentRef.current));
    groupRef.current.position.y = 1 - descent * 16;

    if (sphereRef.current) {
      const mat = sphereRef.current.material as THREE.LineBasicMaterial;
      mat.color.copy(color);
      mat.opacity = opacity * 0.55;
    }
    if (dotsRef.current) {
      const mat = dotsRef.current.material as THREE.PointsMaterial;
      mat.color.copy(color);
      mat.opacity = opacity * 0.9;
    }
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.color.copy(color);
      mat.opacity = opacity * 0.06;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 1, -4]}>
      <mesh ref={haloRef}>
        <sphereGeometry args={[radius * 1.08, 24, 16]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.06} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <lineSegments ref={sphereRef} geometry={sphereGeometry}>
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.55} />
      </lineSegments>
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} transparent opacity={opacity * 0.8} depthWrite={false} sizeAttenuation />
      </points>
      {arcs.map((arc, i) => (
        <DataArc key={i} points={arc.points} opacity={opacity} color={color} speed={arc.speed} phase={arc.phase} />
      ))}
    </group>
  );
}

// A single animated arc that pulses along its great-circle path
function DataArc({
  points,
  opacity,
  color,
  speed,
  phase,
}: {
  points: THREE.Vector3[];
  opacity: number;
  color: THREE.Color;
  speed: number;
  phase: number;
}) {
  const lineRef = useRef<any>(null);
  const dotRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = (Math.sin(state.clock.elapsedTime * speed + phase) + 1) / 2;
    if (dotRef.current) {
      const idx = Math.floor(t * (points.length - 1));
      const p = points[idx];
      dotRef.current.position.set(p.x, p.y, p.z);
      const mat = dotRef.current.material as THREE.MeshBasicMaterial;
      mat.color.copy(color);
      mat.opacity = opacity;
    }
    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.color.copy(color);
      lineRef.current.material.opacity = opacity * 0.45;
    }
  });

  return (
    <group>
      <Line ref={lineRef} points={points} color="#00D4FF" lineWidth={1} transparent opacity={opacity * 0.45} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Drifting light particles — fireflies floating through the grid tunnel
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
  const count = isMobile ? 90 : 180;

  const positions = useMemo(() => {
    const rand = mulberry32(2024);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 80;
      arr[i * 3 + 1] = -10 + rand() * 26;
      arr[i * 3 + 2] = (rand() - 0.5) * 90 - 5;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current || opacity <= 0.01) return;
    ref.current.rotation.y += delta * 0.01;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.color.copy(color);
    mat.opacity = opacity * (0.35 + Math.sin(state.clock.elapsedTime * 0.7) * 0.12);
  });

  if (opacity <= 0.01) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} transparent opacity={0.4} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// Traffic light streaks gliding along the grid floor
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
function SceneContent({ scrollYProgress, fadeProgress, spinBoost, descentProgress, isMobile }: { scrollYProgress: MotionValue<number>; fadeProgress?: MotionValue<number>; spinBoost?: MotionValue<number>; descentProgress?: MotionValue<number>; isMobile: boolean }) {
  const scrollRef = useRef(0);
  const fadeRef = useRef(0);
  const spinRef = useRef(0);
  const descentRef = useRef(0);
  const gridRef1 = useRef<THREE.GridHelper>(null!);
  const gridRef2 = useRef<THREE.GridHelper>(null!);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      scrollRef.current = latest;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    if (!fadeProgress) return;
    fadeRef.current = fadeProgress.get();
    const unsubscribe = fadeProgress.on("change", (latest) => {
      fadeRef.current = latest;
    });
    return () => unsubscribe();
  }, [fadeProgress]);

  useEffect(() => {
    if (!spinBoost) return;
    spinRef.current = spinBoost.get();
    const unsubscribe = spinBoost.on("change", (latest) => {
      spinRef.current = latest;
    });
    return () => unsubscribe();
  }, [spinBoost]);

  useEffect(() => {
    if (!descentProgress) return;
    descentRef.current = descentProgress.get();
    const unsubscribe = descentProgress.on("change", (latest) => {
      descentRef.current = latest;
    });
    return () => unsubscribe();
  }, [descentProgress]);

  // Color objects for dynamic color shifts
  const cyanColor = useMemo(() => new THREE.Color("#00D4FF"), []);
  const greenColor = useMemo(() => new THREE.Color("#00FF41"), []);
  const activeColor = useMemo(() => new THREE.Color("#00D4FF"), []);

  // Traffic Generation
  const trafficCount = isMobile ? 6 : 14;
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

  // Opacity calculation for the grid scene
  const [cityOpacity, setCityOpacity] = useState(1.0);

  useFrame((state) => {
    const progress = scrollRef.current;
    // fade: 0 = grid/globe fully present (through Hero, Journey, Builds),
    //       1 = fully faded out as the Matrix/agents block takes over.
    const fade = Math.min(1, Math.max(0, fadeRef.current));
    const { camera, mouse } = state;

    // Scene opacity is driven by the fade progress, not raw scroll, so the
    // grid + globe persist through the Journey and Builds sections.
    const currentCityOpacity = 1.0 - fade;
    setCityOpacity(currentCityOpacity);

    // Color shifts cyan -> green as the scene fades out
    activeColor.lerpColors(cyanColor, greenColor, fade);

    // Update grid helper colors dynamically
    if (gridRef1.current && gridRef1.current.material) {
      (gridRef1.current.material as any).color.copy(activeColor);
    }
    if (gridRef2.current && gridRef2.current.material) {
      (gridRef2.current.material as any).color.copy(activeColor);
    }

    // Camera motion path: gentle forward glide through the early sections,
    // then a tilt-to-sky as the scene fades out near the agents block.
    const glide = Math.min(progress, 0.5); // forward drift caps once past halfway
    const targetX = 0;
    const targetY = fade * 12; // tilt upwards on fade-out
    const targetZ = 30 - glide * 28; // gliding forward through the grid tunnel
    const targetRotX = (fade * Math.PI) / 5; // tilt view up on fade-out
    const targetRotY = 0;

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
          {traffic.map((t) => (
            <CarStreak key={t.id} {...t} opacity={cityOpacity} color={activeColor} />
          ))}

          <CityParticles opacity={cityOpacity} color={activeColor} isMobile={isMobile} />

          <DataGlobe opacity={cityOpacity} color={activeColor} isMobile={isMobile} spinRef={spinRef} descentRef={descentRef} />

          <gridHelper ref={gridRef1} args={[200, 40, "#00D4FF", "#00D4FF"]} position={[0, -10, 0]} transparent opacity={cityOpacity * 0.18} />
          <gridHelper ref={gridRef2} args={[200, 40, "#00D4FF", "#00D4FF"]} position={[0, 15, 0]} transparent opacity={cityOpacity * 0.08} />
        </group>
      )}
    </>
  );
}

export const Unified3DScene = ({ scrollYProgress, fadeProgress, spinBoost, descentProgress }: { scrollYProgress: MotionValue<number>; fadeProgress?: MotionValue<number>; spinBoost?: MotionValue<number>; descentProgress?: MotionValue<number> }) => {
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
        <SceneContent scrollYProgress={scrollYProgress} fadeProgress={fadeProgress} spinBoost={spinBoost} descentProgress={descentProgress} isMobile={isMobile} />
      </Canvas>
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0B0B0F_95%)]" />
    </div>
  );
};

export default Unified3DScene;
