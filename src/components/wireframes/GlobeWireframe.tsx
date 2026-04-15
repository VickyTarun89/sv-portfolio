import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlobeWireframeProps {
  opacity: number;
}

const GlobeWireframe = ({ opacity }: GlobeWireframeProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // --- GEOMETRY MEMOIZATION (Static) ---
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(2.5, 24, 16), []);
  
  const latitudeGeos = useMemo(() => {
    const latitudes = [-1.5, -0.75, 0, 0.75, 1.5];
    return latitudes.map((y) => {
      const radius = Math.sqrt(2.5 * 2.5 - y * y);
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  const meridianGeos = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 64; j++) {
        const phi = (j / 64) * Math.PI * 2;
        const x = 2.55 * Math.sin(phi) * Math.cos(angle);
        const z = 2.55 * Math.sin(phi) * Math.sin(angle);
        const y = 2.55 * Math.cos(phi);
        points.push(new THREE.Vector3(x, y, z));
      }
      geos.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return geos;
  }, []);

  const orbitGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(3.2 * Math.cos(angle), 0, 3.2 * Math.sin(angle)));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const cityGeo = useMemo(() => {
    const positions: number[] = [];
    const rand = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const r = rand(123);
    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(2 * r() - 1);
      const theta = r() * Math.PI * 2;
      const radius = 2.52;
      positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere wireframe */}
      <mesh geometry={sphereGeo}>
        <meshBasicMaterial 
          color="#00d4ff" 
          wireframe 
          transparent 
          opacity={opacity * 0.25} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Latitude rings */}
      {latitudeGeos.map((geo, i) => (
        <lineLoop key={`lat-${i}`} geometry={geo}>
          <lineBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={opacity * 0.4} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      ))}

      {/* Meridian lines */}
      {meridianGeos.map((geo, i) => (
        <line key={`mer-${i}`} geometry={geo}>
          <lineBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={opacity * 0.3} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}

      {/* Orbital ring */}
      <line geometry={orbitGeo} rotation={[Math.PI * 0.35, 0, Math.PI * 0.1]}>
        <lineBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={opacity * 0.5} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* City dots */}
      <points geometry={cityGeo}>
        <pointsMaterial 
          color="#00d4ff" 
          size={0.06} 
          transparent 
          opacity={opacity * 0.5} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default GlobeWireframe;
