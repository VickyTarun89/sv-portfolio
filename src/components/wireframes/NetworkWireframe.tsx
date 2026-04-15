import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NetworkWireframeProps {
  opacity: number;
}

// Seeded random for deterministic positions
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const NetworkWireframe = ({ opacity }: NetworkWireframeProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const { nodePositions, edgeGeometry, nodeGeo } = useMemo(() => {
    const rand = seededRandom(42);
    const nodeCount = 35;
    const positions: THREE.Vector3[] = [];

    // Generate node positions in a sphere
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(2 * rand() - 1);
      const theta = rand() * Math.PI * 2;
      const r = 1.5 + rand() * 1.5;
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    // Create edges between nearby nodes
    const edgeVerts: number[] = [];
    const connectionThreshold = 2.2;
    for (let i = 0; i < nodeCount; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodeCount; j++) {
        if (connections >= 3) break; // Max 3 connections per node
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < connectionThreshold) {
          edgeVerts.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          );
          connections++;
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(edgeVerts, 3)
    );

    // Node dots
    const nodePositionArray: number[] = [];
    positions.forEach((p) => {
      nodePositionArray.push(p.x, p.y, p.z);
    });
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(nodePositionArray, 3)
    );

    return {
      nodePositions: positions,
      edgeGeometry: edgeGeo,
      nodeGeo: nGeo,
    };
  }, []);

  // Hub nodes — larger prominent spheres at a few key positions
  const hubIndices = useMemo(() => [0, 7, 14, 21, 28], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Edge connections */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color="#00d4ff"
          transparent
          opacity={opacity * 0.5}
          linewidth={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* All nodes as dots */}
      <points geometry={nodeGeo}>
        <pointsMaterial
          color="#00d4ff"
          size={0.08}
          transparent
          opacity={opacity * 0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Hub nodes — wireframe spheres */}
      {hubIndices.map((idx) => {
        const pos = nodePositions[idx];
        if (!pos) return null;
        return (
          <mesh key={idx} position={[pos.x, pos.y, pos.z]}>
            <icosahedronGeometry args={[0.15, 1]} />
            <meshBasicMaterial
              color="#00d4ff"
              wireframe
              transparent
              opacity={opacity * 0.7}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default NetworkWireframe;
