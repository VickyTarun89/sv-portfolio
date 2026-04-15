import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HypercubeWireframeProps {
  opacity: number;
}

const HypercubeWireframe = ({ opacity }: HypercubeWireframeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);

  // --- TESSERACT GEOMETRY (BOX WITHIN A BOX) ---
  const { boxGeo, connectionVerts } = useMemo(() => {
    // Standard unit cube for both
    const geo = new THREE.BoxGeometry(1, 1, 1);
    
    // Lines connecting the 8 vertices of inner cube to outer cube
    const verts: number[] = [];
    // box vertices in order: 
    // top-front-right, top-front-left, top-back-right, top-back-left
    // bot-front-right, bot-front-left, bot-back-right, bot-back-left
    // However, BoxGeometry is more complex. Let's use custom vertex math for clarity.
    const cubeVerts = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
    ];

    const innerScale = 1.0;
    const outerScale = 2.2;

    cubeVerts.forEach(v => {
      // Connect inner to outer
      verts.push(v[0] * innerScale, v[1] * innerScale, v[2] * innerScale);
      verts.push(v[0] * outerScale, v[1] * outerScale, v[2] * outerScale);
    });

    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));

    return { boxGeo: geo, connectionVerts: connGeo };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !innerRef.current || !outerRef.current) return;
    const t = state.clock.elapsedTime;

    // Phase 4 "Hustle" Dynamics
    // Scale speed and intensity based on opacity (state transition)
    const speedScale = 0.5 + opacity * 1.5;
    const pulseScale = 1 + Math.sin(t * (2 + opacity * 3)) * (0.1 + opacity * 0.2);

    innerRef.current.rotation.y = -t * 0.8 * speedScale;
    innerRef.current.rotation.z = Math.sin(t * 0.5) * 0.5;
    innerRef.current.scale.setScalar(pulseScale);
    
    outerRef.current.rotation.y = t * 0.3 * speedScale;
    outerRef.current.rotation.x = t * 0.2 * speedScale;

    // Overall group rotation
    groupRef.current.rotation.y = t * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* OUTER FRAME (Neon Cyan) */}
      <group ref={outerRef} scale={2.2}>
        <mesh geometry={boxGeo}>
          <meshBasicMaterial 
            color="#00f2ff" 
            wireframe 
            transparent 
            opacity={opacity * 0.25} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* INNER CORE (Electric Violet) */}
      <group ref={innerRef}>
        <mesh geometry={boxGeo}>
          <meshBasicMaterial 
            color="#bc00ff" 
            wireframe 
            transparent 
            opacity={opacity * 0.4} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Core Glow */}
        <pointLight color="#bc00ff" intensity={opacity * 2} distance={5} />
      </group>

      {/* CONNECTION SPARS (Dual Tone) */}
      <lineSegments geometry={connectionVerts}>
        <lineBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={opacity * 0.2} 
          linewidth={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Vertex Nodes (Solar Amber Data Points) */}
      <points geometry={connectionVerts}>
        <pointsMaterial 
          color="#ffcc00" 
          size={0.15} 
          transparent 
          opacity={opacity * 0.4} 
          sizeAttenuation 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Active "Hustle" Light */}
      <pointLight 
        color="#ffcc00" 
        intensity={opacity * 4} 
        distance={6} 
        position={[Math.sin(Date.now() * 0.001) * 2, 0, Math.cos(Date.now() * 0.001) * 2]} 
      />
    </group>
  );
};

export default HypercubeWireframe;
