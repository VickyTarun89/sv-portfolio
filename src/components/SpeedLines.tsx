import { useRef, useMemo, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, PerspectiveCamera, Edges } from "@react-three/drei";
import * as THREE from "three";

// Reusable Monolith component
function Monolith({ position, size, scrollY, isCeiling = false }: { position: [number, number, number]; size: [number, number, number]; scrollY: number; isCeiling?: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame(() => {
    if (!ref.current) return;
    const scrollFactor = scrollY * 0.02;
    const offset = Math.sin(scrollFactor + position[0]) * 2;
    ref.current.position.y = isCeiling ? position[1] - offset : position[1] + offset;
    ref.current.scale.y = 1 + Math.abs(Math.sin(scrollFactor * 0.5)) * 0.5;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#0B0B0F" transparent opacity={0.6} />
        <Edges threshold={15} color="#00D4FF" />
      </mesh>
    </group>
  );
}

// Bidirectional Traffic Streak
function CarStreak({ id, lane, initialZ, color = "#00D4FF" }: { id: number, lane: number, initialZ: number, color?: string }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.5 + Math.random() * 0.8, []);
  const direction = lane > 0 ? 1 : -1;
  const streakLength = useMemo(() => 5 + Math.random() * 10, []);

  useFrame(() => {
    if (!ref.current) return;
    // Move along Z axis
    ref.current.position.z += speed * direction;
    // Recycle
    if (direction === 1 && ref.current.position.z > 50) ref.current.position.z = -100;
    if (direction === -1 && ref.current.position.z < -100) ref.current.position.z = 50;
  });

  return (
    <group ref={ref} position={[lane, -9.8, initialZ]}>
      <Line
        points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -streakLength * direction)]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.8}
      />
    </group>
  );
}

function GridCity({ scrollY, isMobile }: { scrollY: number, isMobile: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const buildingCount = isMobile ? 15 : 45;
  const trafficCount = isMobile ? 4 : 12;

  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < buildingCount; i++) {
      const x = (Math.random() - 0.5) * 60;
      const h = 5 + Math.random() * 15;
      const z = (Math.random() - 0.5) * 80 - 20;
      // Floor buildings
      b.push({ position: [x, -10, z] as [number, number, number], size: [3 + Math.random() * 2, h, 3 + Math.random() * 2] as [number, number, number], isCeiling: false });
      // Ceiling buildings
      b.push({ position: [x, 15, z] as [number, number, number], size: [3 + Math.random() * 2, h, 3 + Math.random() * 2] as [number, number, number], isCeiling: true });
    }
    return b;
  }, [buildingCount]);

  const traffic = useMemo(() => {
    const t = [];
    const lanes = [-15, -8, 8, 15]; // Fixed lanes for "roads"
    for (let i = 0; i < trafficCount; i++) {
        t.push({
            id: i,
            lane: lanes[Math.floor(Math.random() * lanes.length)] + (Math.random() - 0.5) * 2,
            initialZ: (Math.random() - 0.5) * 150
        });
    }
    return t;
  }, [trafficCount]);

  useFrame((state) => {
    if (!ref.current) return;
    const { mouse } = state;
    // Expanded cinematic tilt for more pronounced 3D effect
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, (mouse.y * Math.PI) / 25, 0.02);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 25, 0.02);
    ref.current.position.z = (state.clock.elapsedTime * 0.3) % 10;
  });

  return (
    <group ref={ref}>
      {buildings.map((b, i) => <Monolith key={i} {...b} scrollY={scrollY} />)}
      {traffic.map((t) => <CarStreak key={t.id} {...t} />)}
      
      {/* Dynamic Road Floor */}
      <gridHelper args={[200, 20, "#00D4FF", "#00D4FF"]} position={[0, -10, 0]} transparent opacity={0.15} />
      <gridHelper args={[200, 20, "#00D4FF", "#00D4FF"]} position={[0, 15, 0]} transparent opacity={0.05} />
      
      {/* Road Markers */}
      <Line points={[new THREE.Vector3(-15, -9.9, -100), new THREE.Vector3(-15, -9.9, 100)]} color="#00D4FF" opacity={0.2} transparent lineWidth={1} />
      <Line points={[new THREE.Vector3(-8, -9.9, -100), new THREE.Vector3(-8, -9.9, 100)]} color="#00D4FF" opacity={0.2} transparent lineWidth={1} />
      <Line points={[new THREE.Vector3(8, -9.9, -100), new THREE.Vector3(8, -9.9, 100)]} color="#00D4FF" opacity={0.2} transparent lineWidth={1} />
      <Line points={[new THREE.Vector3(15, -9.9, -100), new THREE.Vector3(15, -9.9, 100)]} color="#00D4FF" opacity={0.2} transparent lineWidth={1} />
    </group>
  );
}

function ClickSurge({ trigger }: { trigger: number }) {
  const [surges, setSurges] = useState<any[]>([]);
  useMemo(() => {
    if (trigger === 0) return;
    const id = Date.now();
    setSurges(p => [...p, { id, x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 20 }]);
    setTimeout(() => setSurges(p => p.filter(s => s.id !== id)), 1000);
  }, [trigger]);

  return surges.map(s => <SurgeLine key={s.id} x={s.x} y={s.y} />);
}

function SurgeLine({ x, y }: { x: number, y: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => { if (ref.current) ref.current.position.z += 5; });
  return (
    <group ref={ref} position={[x, y, -100]}>
      <Line points={[new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,100)]} color="#00D4FF" lineWidth={4} transparent opacity={0.8} />
    </group>
  );
}

const SpeedLines = () => {
  const [clickCount, setClickCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#0B0B0F]" onMouseDown={() => setClickCount(c => c + 1)}>
      <Canvas dpr={[1, 1.5]} frameloop={isInView ? "always" : "never"}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={isMobile ? 85 : 60} />
        <color attach="background" args={["#0B0B0F"]} />
        <ambientLight intensity={1.5} />
        <GridCity scrollY={scrollY} isMobile={isMobile} />
        <ClickSurge trigger={clickCount} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0B0B0F_98%)]" />
    </div>
  );
};

export default SpeedLines;
