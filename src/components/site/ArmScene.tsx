import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/*
  A small digital twin for the hero: a six-axis-style arm, an overhead depth
  camera and a tub of parts, running the same loop the real cell runs —
  look, choose the highest clear part, pick, carry, place. Procedural geometry
  only (no model downloads), analytic IK, paused when off screen.
*/

const SHOULDER_Y = 0.55;
const L1 = 1.15;
const L2 = 1.0;
const TOOL = 0.38;
const SAFE_Y = 1.05;

const TUB = new THREE.Vector3(1.55, 0, -0.35);
const PLACE = new THREE.Vector3(-0.35, 0, 1.55);
const CAM_POS = new THREE.Vector3(1.55, 2.35, -0.35);

const PART_SPOTS: [number, number][] = [
  [-0.22, -0.16],
  [0.2, -0.1],
  [-0.08, 0.2],
  [0.24, 0.22],
];

const ORANGE = "#ff5a1f";
const CYAN = "#38c6ff";

type Phase = "look" | "approach" | "descend" | "grip" | "lift" | "carry" | "lower" | "release" | "retreat";

const SEQUENCE: { phase: Phase; dur: number }[] = [
  { phase: "look", dur: 1.1 },
  { phase: "approach", dur: 1.0 },
  { phase: "descend", dur: 0.6 },
  { phase: "grip", dur: 0.35 },
  { phase: "lift", dur: 0.55 },
  { phase: "carry", dur: 1.3 },
  { phase: "lower", dur: 0.5 },
  { phase: "release", dur: 0.3 },
  { phase: "retreat", dur: 0.5 },
];
const CYCLE = SEQUENCE.reduce((s, p) => s + p.dur, 0);

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function solveIK(target: THREE.Vector3) {
  const yaw = Math.atan2(target.z, target.x);
  const r = Math.hypot(target.x, target.z);
  const dx = r;
  const dy = target.y + TOOL - SHOULDER_Y;
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1e-3);
  const cos2 = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const q2 = -Math.acos(THREE.MathUtils.clamp(cos2, -1, 1));
  const q1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
  const q3 = -Math.PI / 2 - q1 - q2;
  return { yaw, q1, q2, q3 };
}

function partWorld(i: number) {
  const [x, z] = PART_SPOTS[i];
  return new THREE.Vector3(TUB.x + x, 0.12, TUB.z + z);
}

function placeWorld(slot: number) {
  return new THREE.Vector3(PLACE.x + (slot % 2) * 0.22 - 0.11, 0.12, PLACE.z + Math.floor(slot / 2) * 0.22 - 0.11);
}

function phaseAt(t: number) {
  let acc = 0;
  for (const s of SEQUENCE) {
    if (t < acc + s.dur) return { phase: s.phase, k: (t - acc) / s.dur };
    acc += s.dur;
  }
  return { phase: "retreat" as Phase, k: 1 };
}

function toolTarget(phase: Phase, k: number, from: THREE.Vector3, to: THREE.Vector3, home: THREE.Vector3) {
  const e = ease(k);
  const fromHigh = new THREE.Vector3(from.x, SAFE_Y, from.z);
  const toHigh = new THREE.Vector3(to.x, SAFE_Y, to.z);
  const v = new THREE.Vector3();
  switch (phase) {
    case "look":
      return v.copy(home);
    case "approach":
      return v.lerpVectors(home, fromHigh, e);
    case "descend":
      return v.lerpVectors(fromHigh, from, e);
    case "grip":
      return v.copy(from);
    case "lift":
      return v.lerpVectors(from, fromHigh, e);
    case "carry": {
      // swing around the base on an arc rather than cutting through it
      const a0 = Math.atan2(fromHigh.z, fromHigh.x);
      const a1 = Math.atan2(toHigh.z, toHigh.x);
      const r0 = Math.hypot(fromHigh.x, fromHigh.z);
      const r1 = Math.hypot(toHigh.x, toHigh.z);
      const a = a0 + (a1 - a0) * e;
      const r = r0 + (r1 - r0) * e;
      return v.set(Math.cos(a) * r, SAFE_Y + Math.sin(Math.PI * e) * 0.15, Math.sin(a) * r);
    }
    case "lower":
      return v.lerpVectors(toHigh, new THREE.Vector3(to.x, to.y + 0.06, to.z), e);
    case "release":
      return v.set(to.x, to.y + 0.06, to.z);
    case "retreat":
      return v.lerpVectors(new THREE.Vector3(to.x, to.y + 0.06, to.z), home, e);
  }
}

const Gear = ({ color = "#9aa3ad" }: { color?: string }) => {
  const teeth = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), []);
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.045, 24]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} />
      </mesh>
      {teeth.map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.088, 0, Math.sin(a) * 0.088]} rotation={[0, -a, 0]} castShadow>
          <boxGeometry args={[0.04, 0.045, 0.035]} />
          <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};

const Tub = ({ at, w, d, color }: { at: THREE.Vector3; w: number; d: number; color: string }) => {
  const h = 0.16;
  const t = 0.025;
  return (
    <group position={[at.x, 0, at.z]}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {[
        [0, h / 2, d / 2, w, t],
        [0, h / 2, -d / 2, w, t],
      ].map(([x, y, z, sx, sz], i) => (
        <mesh key={`a${i}`} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[sx, h, sz]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      {[
        [w / 2, h / 2, 0],
        [-w / 2, h / 2, 0],
      ].map(([x, y, z], i) => (
        <mesh key={`b${i}`} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[t, h, d]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const Cell = ({ animate }: { animate: boolean }) => {
  const yawRef = useRef<THREE.Group>(null);
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);
  const wristRef = useRef<THREE.Group>(null);
  const fingerL = useRef<THREE.Mesh>(null);
  const fingerR = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Object3D>(null);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const clock = useRef(0);
  const home = useMemo(() => new THREE.Vector3(0.9, SAFE_Y + 0.15, 0.6), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    // cap the step so a backgrounded tab resumes mid-motion rather than jumping cycles
    if (animate) clock.current += Math.min(dt, 0.25);
    const total = clock.current;
    const cycleIdx = Math.floor(total / CYCLE);
    const t = total - cycleIdx * CYCLE;
    const pickIdx = cycleIdx % PART_SPOTS.length;
    const { phase, k } = phaseAt(animate ? t : 0.2);

    const from = partWorld(pickIdx);
    const to = placeWorld(pickIdx);
    const target = toolTarget(phase, k, from, to, home);
    const { yaw, q1, q2, q3 } = solveIK(target);

    if (yawRef.current) yawRef.current.rotation.y = -yaw;
    if (shoulderRef.current) shoulderRef.current.rotation.z = q1;
    if (elbowRef.current) elbowRef.current.rotation.z = q2;
    if (wristRef.current) wristRef.current.rotation.z = q3;

    const closed =
      phase === "grip" ? k : phase === "release" ? 1 - k : ["lift", "carry", "lower"].includes(phase) ? 1 : 0;
    const gap = 0.075 - closed * 0.03;
    if (fingerL.current) fingerL.current.position.z = gap;
    if (fingerR.current) fingerR.current.position.z = -gap;

    // parts: picked ones already placed, current one rides the tool while held
    const held = ["lift", "carry", "lower"].includes(phase) || (phase === "grip" && k > 0.6);
    const placed = ["release", "retreat"].includes(phase);
    partRefs.current.forEach((g, i) => {
      if (!g) return;
      const done = i < pickIdx || (i === pickIdx && placed);
      if (i === pickIdx && held && tipRef.current) {
        tipRef.current.getWorldPosition(tmp);
        g.position.set(tmp.x, tmp.y - 0.02, tmp.z);
      } else if (done) {
        g.position.copy(placeWorld(i));
      } else {
        g.position.copy(partWorld(i));
      }
    });

    // vision cues: a scan sweep while looking, a ring on the chosen part until it is gripped
    const looking = phase === "look";
    if (scanRef.current) {
      scanRef.current.visible = looking;
      scanRef.current.position.z = TUB.z - 0.42 + k * 0.84;
    }
    if (beamMat.current) beamMat.current.opacity = looking ? 0.1 : 0.035;
    if (ringRef.current) {
      const show = ["look", "approach", "descend"].includes(phase) && (phase !== "look" || k > 0.55);
      ringRef.current.visible = show;
      ringRef.current.position.set(from.x, 0.03, from.z);
      const s = 1 + Math.sin(total * 6) * 0.06;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const metal = <meshStandardMaterial color="#e7eaee" metalness={0.35} roughness={0.32} />;
  const dark = <meshStandardMaterial color="#1b2027" metalness={0.5} roughness={0.45} />;
  const accent = <meshStandardMaterial color={ORANGE} metalness={0.2} roughness={0.4} />;

  return (
    <group>
      {/* base + arm */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.24, 40]} />
        {dark}
      </mesh>
      <group ref={yawRef}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 0.22, 40]} />
          {metal}
        </mesh>
        <mesh position={[0, 0.465, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 40]} />
          {accent}
        </mesh>
        <group ref={shoulderRef} position={[0, SHOULDER_Y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.34, 32]} />
            {dark}
          </mesh>
          <mesh position={[L1 / 2, 0, 0]} castShadow>
            <boxGeometry args={[L1, 0.2, 0.2]} />
            {metal}
          </mesh>
          <group ref={elbowRef} position={[L1, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.27, 32]} />
              {dark}
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.135, 0.012, 8, 40]} />
              {accent}
            </mesh>
            <mesh position={[L2 / 2, 0, 0]} castShadow>
              <boxGeometry args={[L2, 0.15, 0.15]} />
              {metal}
            </mesh>
            <group ref={wristRef} position={[L2, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.085, 0.085, 0.19, 24]} />
                {dark}
              </mesh>
              <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.07, 0.16, 24]} />
                {metal}
              </mesh>
              <mesh position={[0.235, 0, 0]} castShadow>
                <boxGeometry args={[0.05, 0.08, 0.22]} />
                {dark}
              </mesh>
              <mesh ref={fingerL} position={[0.31, 0, 0.075]} castShadow>
                <boxGeometry args={[0.13, 0.05, 0.022]} />
                {accent}
              </mesh>
              <mesh ref={fingerR} position={[0.31, 0, -0.075]} castShadow>
                <boxGeometry args={[0.13, 0.05, 0.022]} />
                {accent}
              </mesh>
              <object3D ref={tipRef} position={[TOOL, 0, 0]} />
            </group>
          </group>
        </group>
      </group>

      {/* overhead depth camera on its stand */}
      <mesh position={[CAM_POS.x + 0.95, CAM_POS.y / 2, CAM_POS.z]} castShadow>
        <boxGeometry args={[0.07, CAM_POS.y, 0.07]} />
        {dark}
      </mesh>
      <mesh position={[CAM_POS.x + 0.48, CAM_POS.y + 0.04, CAM_POS.z]} castShadow>
        <boxGeometry args={[0.98, 0.05, 0.05]} />
        {dark}
      </mesh>
      <mesh position={[CAM_POS.x, CAM_POS.y, CAM_POS.z]} castShadow>
        <boxGeometry args={[0.12, 0.05, 0.3]} />
        <meshStandardMaterial color="#0d1014" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[CAM_POS.x, CAM_POS.y / 2 + 0.02, CAM_POS.z]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.62, CAM_POS.y - 0.05, 4, 1, true]} />
        <meshBasicMaterial ref={beamMat} color={CYAN} transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={scanRef} position={[TUB.x, 0.18, TUB.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.012]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.14, 40]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.95} />
      </mesh>

      {/* tub of parts and the place tray */}
      <Tub at={TUB} w={0.95} d={0.85} color="#a14a2b" />
      <Tub at={PLACE} w={0.6} d={0.6} color="#2b3440" />
      {PART_SPOTS.map((_, i) => (
        <group key={i} ref={(el) => (partRefs.current[i] = el)} position={partWorld(i)}>
          <Gear />
        </group>
      ))}
    </group>
  );
};

// Pull the camera back on narrow (portrait) canvases so the whole cell stays in frame.
const CAM_BASE = new THREE.Vector3(1.6, 3.2, 5.6);
const LOOK_AT = new THREE.Vector3(0.75, 0.7, 0.25);

const CameraRig = () => {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const pull = THREE.MathUtils.clamp(1.05 / aspect, 1, 1.6);
    camera.position.copy(LOOK_AT).add(CAM_BASE.clone().sub(LOOK_AT).multiplyScalar(pull));
    camera.lookAt(LOOK_AT);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
};

const ArmScene = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    const el = wrapRef.current;
    const io = el ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 }) : null;
    if (el && io) io.observe(el);
    return () => {
      mq.removeEventListener("change", onChange);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={inView && !reduced ? "always" : "demand"}
        camera={{ position: [CAM_BASE.x, CAM_BASE.y, CAM_BASE.z], fov: 36, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CameraRig />
        <fog attach="fog" args={["#07090c", 9, 20]} />
        <hemisphereLight args={["#dfe9ff", "#0b0d10", 0.55]} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <pointLight position={[-2.5, 1.6, -1.5]} intensity={6} color={ORANGE} distance={6} />
        <pointLight position={[2.5, 2.4, -2]} intensity={5} color={CYAN} distance={6} />
        <Cell animate={!reduced} />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={8} blur={2.2} far={2} />
        <Grid
          position={[0, 0, 0]}
          args={[20, 20]}
          cellSize={0.25}
          cellThickness={0.6}
          cellColor="#1d242d"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#2c3743"
          fadeDistance={11}
          fadeStrength={1.4}
          infiniteGrid
        />
      </Canvas>
    </div>
  );
};

export default ArmScene;
