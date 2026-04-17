import { Suspense, useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import FighterJetWireframe from "./FighterJetWireframe";
import GlobeWireframe from "./GlobeWireframe";
import GearsWireframe from "./GearsWireframe";
import HypercubeWireframe from "./HypercubeWireframe";
import TerminatorWireframe from "./TerminatorWireframe";

interface WireframeCanvasProps {
  activePhase: number | null;
}

/**
 * Scene component inside the R3F Canvas.
 * Smoothly interpolates opacity for each phase wireframe.
 */
const WireframeScene = ({ activePhase }: WireframeCanvasProps) => {
  const ACTIVE_OPACITY = 0.65;
  const BASE_OPACITY = 0.0;
  const FADE_SPEED = 4.0;

  const [opacities, setOpacities] = useState([BASE_OPACITY, BASE_OPACITY, BASE_OPACITY, BASE_OPACITY, BASE_OPACITY]);
  const opRef = useRef([BASE_OPACITY, BASE_OPACITY, BASE_OPACITY, BASE_OPACITY, BASE_OPACITY]);

  useFrame((_, delta) => {
    let changed = false;
    const next = [...opRef.current];

    for (let i = 0; i < 5; i++) {
      // If this phase is active, aim for ACTIVE_OPACITY, otherwise BASE_OPACITY
      const target = activePhase === i + 1 ? ACTIVE_OPACITY : BASE_OPACITY;
      const current = next[i];
      
      if (Math.abs(current - target) > 0.001) {
        const diff = target - current;
        // Use a slightly smoother step or lerp
        const step = diff * Math.min(1, FADE_SPEED * delta);
        next[i] = current + step;
        changed = true;
      } else if (current !== target) {
        next[i] = target;
        changed = true;
      }
    }

    if (changed) {
      opRef.current = next;
      setOpacities(next);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <FighterJetWireframe opacity={opacities[0]} />
      <GlobeWireframe opacity={opacities[1]} />
      <GearsWireframe opacity={opacities[2]} />
      <HypercubeWireframe opacity={opacities[3]} />
      <TerminatorWireframe opacity={opacities[4]} />
    </>
  );
};

const WireframeCanvas = ({ activePhase }: WireframeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  // Force pointer-events:none on the actual <canvas> element inside R3F
  useEffect(() => {
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.pointerEvents = "none";
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ pointerEvents: "none", zIndex: 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        camera={{ position: [0, 1.5, 10], fov: 45 }}
        style={{ background: "transparent", pointerEvents: "none" }}
        gl={{ alpha: true, antialias: true }}
        eventSource={undefined as unknown as HTMLElement}
        eventPrefix="offset"
      >
        <Suspense fallback={null}>
          <WireframeScene activePhase={activePhase} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WireframeCanvas;
