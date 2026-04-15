import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Torus, Sphere, Box, Cylinder } from "@react-three/drei";

interface TerminatorWireframeProps {
  opacity: number;
}

const TerminatorWireframe = ({ opacity }: TerminatorWireframeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Robotic head tracking movement
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.4;
    groupRef.current.rotation.x = -0.1 + Math.sin(t * 0.1) * 0.15;
    
    // Subtle mechanical jitter
    if (Math.random() > 0.95) {
        groupRef.current.position.x = (Math.random() - 0.5) * 0.02;
    } else {
        groupRef.current.position.x = 0;
    }

    // Eye Flickering Effect
    if (eyeRef.current && lightRef.current) {
        const flicker = Math.random() > 0.9 ? 0.4 : 1.0;
        const pulse = 0.7 + Math.sin(t * 15) * 0.3;
        const intensity = flicker * pulse * opacity;
        
        eyeRef.current.scale.setScalar(0.9 + Math.sin(t * 25) * 0.1);
        lightRef.current.intensity = intensity * 6;
        (eyeRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * flicker;
    }
  });

  return (
    <group ref={groupRef} scale={1.6}>
      {/* --- CRANIUM (Upper Skull) --- */}
      <group position={[0, 0.4, 0]} scale={[1, 0.85, 1.1]}>
        <Sphere args={[1, 10, 10]}>
          <meshBasicMaterial 
            color="#00f2ff" 
            wireframe 
            transparent 
            opacity={opacity * 0.4} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      </group>

      {/* --- BROW RIDGE (Heavy Robotic) --- */}
      <group position={[0, 0.35, 0.8]}>
        <Box args={[1.4, 0.2, 0.3]}>
          <meshBasicMaterial 
            color="#00f2ff" 
            wireframe 
            transparent 
            opacity={opacity * 0.3} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Box>
      </group>

      {/* --- EYE SOCKETS & HOUSING --- */}
      <group position={[-0.45, 0.15, 0.75]}>
        <Torus args={[0.22, 0.04, 6, 12]}>
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.3} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Torus>
      </group>
      
      <group position={[0.45, 0.15, 0.75]}>
        <Torus args={[0.22, 0.04, 6, 12]}>
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.3} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Torus>
        
        {/* Animated Red Eye Segment */}
        <mesh ref={eyeRef} position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial 
            color="#ff0000" 
            transparent 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
          <pointLight ref={lightRef} color="#ff0000" distance={4} decay={2} />
        </mesh>
      </group>

      {/* --- NASAL OPENING --- */}
      <group position={[0, -0.1, 0.85]} rotation={[0, 0, Math.PI]}>
         <Cylinder args={[0.1, 0.1, 0.2, 3]}>
            <meshBasicMaterial 
              color="#00f2ff" 
              wireframe 
              transparent 
              opacity={opacity * 0.2} 
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
         </Cylinder>
      </group>

      {/* --- MAXILLA & CHEEKBONES --- */}
      <group position={[-0.6, 0, 0.4]} rotation={[0, 0.4, 0]}>
         <Box args={[0.1, 0.6, 0.8]}>
            <meshBasicMaterial 
              color="#00f2ff" 
              wireframe 
              transparent 
              opacity={opacity * 0.15} 
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
         </Box>
      </group>
      <group position={[0.6, 0, 0.4]} rotation={[0, -0.4, 0]}>
         <Box args={[0.1, 0.6, 0.8]}>
            <meshBasicMaterial 
              color="#00f2ff" 
              wireframe 
              transparent 
              opacity={opacity * 0.15} 
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
         </Box>
      </group>

      {/* --- MANDIBLE (JAW) - TOOTHLESS --- */}
      <group position={[0, -0.6, 0.35]}>
        {/* Jaw Base */}
        <Box args={[1.1, 0.3, 0.7]}>
          <meshBasicMaterial 
            color="#00f2ff" 
            wireframe 
            transparent 
            opacity={opacity * 0.2} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Box>
      </group>

      {/* --- TEMPLE / PNEUMATIC JOINTS --- */}
      <group position={[-0.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <Cylinder args={[0.15, 0.15, 0.2, 8]}>
            <meshBasicMaterial 
              color="#00f2ff" 
              wireframe 
              transparent 
              opacity={opacity * 0.2} 
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
         </Cylinder>
      </group>
      <group position={[0.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <Cylinder args={[0.15, 0.15, 0.2, 8]}>
            <meshBasicMaterial 
              color="#00f2ff" 
              wireframe 
              transparent 
              opacity={opacity * 0.2} 
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
         </Cylinder>
      </group>
    </group>
  );
};

export default TerminatorWireframe;
