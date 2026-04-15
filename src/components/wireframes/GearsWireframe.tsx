import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GearsWireframeProps {
  opacity: number;
}

/**
 * Creates a gear-shaped wireframe geometry
 */
function createGearGeometry(
  innerRadius: number,
  outerRadius: number,
  teeth: number,
  thickness: number
): THREE.BufferGeometry {
  const vertices: number[] = [];
  const toothDepth = outerRadius - innerRadius;

  const addLine = (
    a: [number, number, number],
    b: [number, number, number]
  ) => {
    vertices.push(...a, ...b);
  };

  // Generate gear profile for front and back face
  const allFacePoints: [number, number, number][][] = [[], []];

  for (let face = 0; face < 2; face++) {
    const z = face === 0 ? thickness / 2 : -thickness / 2;
    const profilePoints = allFacePoints[face];

    for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        const toothStart = angle + (0.1 / teeth) * Math.PI * 2;
        const toothEnd = angle + (0.4 / teeth) * Math.PI * 2;
        const gapStart = angle + (0.5 / teeth) * Math.PI * 2;
        const gapEnd = nextAngle;

        profilePoints.push([innerRadius * Math.cos(toothStart), innerRadius * Math.sin(toothStart), z]);
        profilePoints.push([outerRadius * Math.cos(toothStart), outerRadius * Math.sin(toothStart), z]);
        profilePoints.push([outerRadius * Math.cos(toothEnd), outerRadius * Math.sin(toothEnd), z]);
        profilePoints.push([innerRadius * Math.cos(toothEnd), innerRadius * Math.sin(toothEnd), z]);
        profilePoints.push([innerRadius * Math.cos(gapStart), innerRadius * Math.sin(gapStart), z]);
        profilePoints.push([innerRadius * Math.cos(gapEnd), innerRadius * Math.sin(gapEnd), z]);
    }

    // Connect consecutive profile points
    for (let i = 0; i < profilePoints.length - 1; i++) {
      addLine(profilePoints[i], profilePoints[i + 1]);
    }
    if (profilePoints.length > 0) {
      addLine(profilePoints[profilePoints.length - 1], profilePoints[0]);
    }
  }

  // Connect front and back faces with axial lines (Synced Indexing)
  const frontPoints = allFacePoints[0];
  const backPoints = allFacePoints[1];
  for (let i = 0; i < frontPoints.length; i++) {
    addLine(frontPoints[i], backPoints[i]);
  }

  // Center hub circle (front and back)
  const hubRadius = innerRadius * 0.4;
  const hubSegs = 16;
  for (let face = 0; face < 2; face++) {
    const z = face === 0 ? thickness / 2 : -thickness / 2;
    for (let i = 0; i < hubSegs; i++) {
      const a1 = (i / hubSegs) * Math.PI * 2;
      const a2 = ((i + 1) / hubSegs) * Math.PI * 2;
      addLine(
        [hubRadius * Math.cos(a1), hubRadius * Math.sin(a1), z],
        [hubRadius * Math.cos(a2), hubRadius * Math.sin(a2), z]
      );
    }
    // Spokes
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      addLine(
        [hubRadius * Math.cos(a), hubRadius * Math.sin(a), z],
        [innerRadius * Math.cos(a), innerRadius * Math.sin(a), z]
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return geometry;
}

const GearsWireframe = ({ opacity }: GearsWireframeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const gear3Ref = useRef<THREE.Group>(null);

  const gear1Geo = useMemo(() => createGearGeometry(1.2, 1.8, 12, 0.5), []);
  const gear2Geo = useMemo(() => createGearGeometry(0.8, 1.2, 8, 0.5), []);
  const gear3Geo = useMemo(() => createGearGeometry(0.5, 0.8, 6, 0.4), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Counter-rotating gears
    if (gear1Ref.current) gear1Ref.current.rotation.z = t * 0.3;
    if (gear2Ref.current) gear2Ref.current.rotation.z = -t * 0.3 * (12 / 8); // gear ratio
    if (gear3Ref.current) gear3Ref.current.rotation.z = t * 0.3 * (12 / 6);

    // Overall group gentle float
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.1 - 0.2;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
  });

  const matProps = {
    color: "#00d4ff",
    transparent: true,
    opacity,
    linewidth: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  } as const;

  return (
    <group ref={groupRef}>
      {/* Main gear */}
      <group ref={gear1Ref} position={[0, 0, 0]}>
        <lineSegments geometry={gear1Geo}>
          <lineBasicMaterial {...matProps} opacity={opacity * 0.4} />
        </lineSegments>
      </group>

      {/* Second gear (offset and meshing) */}
      <group ref={gear2Ref} position={[2.8, 0.5, 0.2]}>
        <lineSegments geometry={gear2Geo}>
          <lineBasicMaterial {...matProps} opacity={opacity * 0.3} />
        </lineSegments>
      </group>

      {/* Third small gear */}
      <group ref={gear3Ref} position={[-2.0, -1.5, -0.3]}>
        <lineSegments geometry={gear3Geo}>
          <lineBasicMaterial {...matProps} opacity={opacity * 0.25} />
        </lineSegments>
      </group>
    </group>
  );
};

export default GearsWireframe;
