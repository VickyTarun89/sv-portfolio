import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FighterJetWireframeProps {
  opacity: number;
}

const FighterJetWireframe: React.FC<FighterJetWireframeProps> = ({ opacity }) => {
  const meshRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Group>(null);

  // Generate the High-Fidelity Stealth Fighter Geometry
  const { jetMesh, wireframeEdges } = useMemo(() => {
    const vertices: number[] = [];
    const indices: number[] = [];

    /**
     * FUSELAGE STRUCTURE (Z: -5 to 5)
     * We define 8 "ribs" with multiple points to capture the faceted chine and intake lines.
     */
    const ribs = [
      // 0: NOSE TIP
      { z: -5.0, w: 0.0, h: 0.0, offset: 0, points: 1 },
      // 1: RADOME BASE
      { z: -4.2, w: 0.3, h: 0.2, offset: 0.0, points: 6 },
      // 2: FORWARD FUSELAGE / INTAKE START
      { z: -2.8, w: 1.1, h: 0.7, offset: 0.15, points: 8 },
      // 3: MID COCKPIT / INTAKE PEAK (Widest)
      { z: -1.2, w: 1.9, h: 0.9, offset: 0.1, points: 10 },
      // 4: REAR COCKPIT / WING START
      { z: 0.4, w: 1.7, h: 0.65, offset: 0.0, points: 8 },
      // 5: MID FUSELAGE
      { z: 1.8, w: 1.4, h: 0.55, offset: 0.0, points: 8 },
      // 6: ENGINE CASING START
      { z: 3.4, w: 0.9, h: 0.5, offset: 0.0, points: 6 },
      // 7: EXHAUST NOZZLE
      { z: 4.8, w: 0.55, h: 0.55, offset: 0.0, points: 6 },
    ];

    const generateRibPoints = (r: any) => {
      if (r.points === 1) return [[0, 0, r.z]];
      const pts = [];
      const step = (Math.PI * 2) / r.points;
      for (let i = 0; i < r.points; i++) {
        const u = i * step;
        const x = Math.sin(u) * r.w;
        let y = Math.cos(u) * r.h + r.offset;
        // Flatten the bottom slightly for the stealth profile
        if (y < -r.h * 0.4) y = -r.h * 0.4;
        pts.push([x, y, r.z]);
      }
      return pts;
    };

    const allRibPoints: number[][] = [];
    const ribVertexCounts: number[] = [];
    ribs.forEach(r => {
      const pts = generateRibPoints(r);
      allRibPoints.push(...pts);
      ribVertexCounts.push(pts.length);
    });

    allRibPoints.forEach(p => vertices.push(...p));

    // Connect Fuselage Ribs with Triangles
    let vertexOffset = 0;
    for (let i = 0; i < ribs.length - 1; i++) {
      const currCount = ribVertexCounts[i];
      const nextCount = ribVertexCounts[i + 1];

      if (currCount === 1) {
        // Tip to first real rib
        for (let j = 0; j < nextCount; j++) {
          indices.push(vertexOffset);
          indices.push(vertexOffset + 1 + j);
          indices.push(vertexOffset + 1 + ((j + 1) % nextCount));
        }
        vertexOffset += 1;
      } else {
        // Connect two rings
        for (let j = 0; j < currCount; j++) {
          const curr1 = vertexOffset + j;
          const curr2 = vertexOffset + ((j + 1) % currCount);
          
          // Match matching circular segments
          const next1 = vertexOffset + currCount + (j % nextCount);
          const next2 = vertexOffset + currCount + ((j + 1) % nextCount);

          indices.push(curr1, curr2, next1);
          indices.push(curr2, next2, next1);
        }
        vertexOffset += currCount;
      }
    }

    /**
     * WINGS (Faceted Trapezoidal with internal layout)
     */
    const wingY = -0.15;
    const wingStartIdx = vertices.length / 3;
    const wingPoints = [
      // Left Wing
      [-0.8, wingY, -0.6], [-4.0, wingY, 1.4], [-3.7, wingY, 3.2], [-0.8, wingY, 2.6],
      // Right Wing
      [0.8, wingY, -0.6], [4.0, wingY, 1.4], [3.7, wingY, 3.2], [0.8, wingY, 2.6],
    ];
    wingPoints.forEach(v => vertices.push(...v));
    
    // Left Wing Triangles (Faceted)
    indices.push(wingStartIdx, wingStartIdx+1, wingStartIdx+2);
    indices.push(wingStartIdx, wingStartIdx+2, wingStartIdx+3);
    // Right Wing Triangles
    indices.push(wingStartIdx+4, wingStartIdx+5, wingStartIdx+6);
    indices.push(wingStartIdx+4, wingStartIdx+6, wingStartIdx+7);

    /**
     * TAILS (Canted Vertical Fins)
     */
    const tailStartIdx = vertices.length / 3;
    const tailPoints = [
      // Left Canted Fin
      [-0.4, 0.4, 3.2], [-1.4, 1.8, 4.8], [-1.2, 1.8, 5.4], [-0.3, 0.4, 5.0],
      // Right Canted Fin
      [0.4, 0.4, 3.2], [1.4, 1.8, 4.8], [1.2, 1.8, 5.4], [0.3, 0.4, 5.0],
    ];
    tailPoints.forEach(v => vertices.push(...v));

    // Left Tail Triangles
    indices.push(tailStartIdx, tailStartIdx+1, tailStartIdx+2);
    indices.push(tailStartIdx, tailStartIdx+2, tailStartIdx+3);
    // Right Tail Triangles
    indices.push(tailStartIdx+4, tailStartIdx+5, tailStartIdx+6);
    indices.push(tailStartIdx+4, tailStartIdx+6, tailStartIdx+7);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const edgeGeo = new THREE.EdgesGeometry(geo, 12); // Detailed edges

    return { jetMesh: geo, wireframeEdges: edgeGeo };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // AGGRESSIVE FRONT-ON 3/4 VIEW (Default orientation)
      // Rotated 180 (Math.PI) to face camera, then banked/angled
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.1;
      meshRef.current.rotation.x = 0.25 + Math.cos(t * 0.2) * 0.05;
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.08;
      
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.2;
    }
    if (scannerRef.current && meshRef.current) {
      scannerRef.current.rotation.copy(meshRef.current.rotation);
      scannerRef.current.position.copy(meshRef.current.position);
      const scale = 1.03 + Math.sin(state.clock.elapsedTime * 2.5) * 0.015;
      scannerRef.current.scale.set(scale, scale, scale);
    }
  });

  if (opacity <= 0) return null;

  return (
    <group scale={1.3} position={[0, -0.6, 0]}>
      {/* 1. STRUCTURAL MESH (The faceted surface) */}
      <group ref={meshRef}>
        <mesh geometry={jetMesh}>
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.15} 
            wireframe
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        
        {/* 2. DEFINED BLUEPRINT EDGES */}
        <lineSegments geometry={wireframeEdges}>
          <lineBasicMaterial 
            color="#00eeff" 
            transparent 
            opacity={opacity * 0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* 3. ENGINE EXHAUST EFFECT */}
        <mesh position={[0, 0, 4.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.4, 0.6, 16, 1, true]} />
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Interior glow for nozzle */}
        <mesh position={[0, 0, 4.7]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 16]} />
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. OUTER SCANNER DATA LAYER (Dimmer, larger shell) */}
      <group ref={scannerRef}>
        <mesh geometry={jetMesh}>
          <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={opacity * 0.12}
            wireframe
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 5. DYNAMIC POINT LIGHTS FOR DEPTH */}
      <pointLight 
        position={[0, 0.5, -3]} 
        intensity={opacity * 3} 
        color="#00f2ff" 
        distance={4}
      />
      <pointLight 
        position={[0, 0, 5]} 
        intensity={opacity * 4} 
        color="#00eeff" 
        distance={5}
      />
    </group>
  );
};

export default FighterJetWireframe;
