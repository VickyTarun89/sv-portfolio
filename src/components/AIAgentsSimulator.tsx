import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AIAgentsSimulator: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ─── INIT SCENE ───
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015); // Lighter fog so we can see further out

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300); // Tighter FOV
    camera.position.set(0, 25, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Transparent background
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ─── LIGHTS ───
    const ambientLight = new THREE.AmbientLight(0x303040, 3.0); // Extreme boost ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f3ff, 4.0); // Turbocharged main light
    dirLight.position.set(15, 25, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xff6b00, 3.0); // Boosted orange accent
    dirLight2.position.set(-15, 15, -15);
    scene.add(dirLight2);

    const hemiLight = new THREE.HemisphereLight(0x00f3ff, 0x39ff14, 2.0); // Turbo hemi
    scene.add(hemiLight);

    // ─── MATERIALS CACHE ───
    const matCache: Record<string, THREE.Material> = {};
    function getMat(color: number, opts: any = {}) {
      const key = `${color}_${JSON.stringify(opts)}`;
      if (!matCache[key]) {
        matCache[key] = new THREE.MeshStandardMaterial({ color, ...opts });
      }
      return matCache[key];
    }

    // ─── ENVIRONMENT (DARK NEON) ───
    const NEON = {
      GREEN: 0x39ff14,
      BLUE: 0x00f3ff,
      ORANGE: 0xff6b00,
      PURPLE: 0xb026ff,
      PINK: 0xff00ba,
      DARK_BG: 0x0a0a0f,
      UI_ACCENT: 0x1f1f2e,
    };

    const ENVIRONMENTS = {
      cyber: {
        label: 'Cyber Core',
        color: NEON.BLUE,
        floorColor: 0x0a0a0f,
        zones: [
          { id: 'mainframe', label: 'Mainframe', pos: [-10, 0, -8], size: [6, 3, 6], color: NEON.PURPLE },
          { id: 'nodes', label: 'Processing Nodes', pos: [10, 0, -8], size: [6, 3, 6], color: NEON.GREEN },
          { id: 'data_lake', label: 'Data Lake', pos: [-10, 0, 8], size: [6, 3, 6], color: NEON.BLUE },
          { id: 'archive', label: 'Archive', pos: [10, 0, 8], size: [6, 3, 6], color: NEON.ORANGE },
          { id: 'compiler', label: 'Compiler', pos: [0, 0, -8], size: [5, 3, 5], color: NEON.PINK },
          { id: 'firewall', label: 'Firewall', pos: [0, 0, 8], size: [5, 3, 5], color: 0xff1010 },
          { id: 'gateway', label: 'Gateway', pos: [0, 0, 0], size: [5, 3, 5], color: NEON.BLUE },
        ],
      }
    };

    const envGroup = new THREE.Group();
    scene.add(envGroup);

    // Grid Floor - Made maximum brightness
    const gridHelper = new THREE.GridHelper(80, 80, NEON.GREEN, 0x11ff55);
    gridHelper.position.y = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 1.0;
    scene.add(gridHelper);

    // Dark solid floor - Lighter to reflect light better
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.6, metalness: 0.5 })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Cyberpunk Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.6, metalness: 0.4 });
    const wallThickness = 0.5, wallHeight = 8, roomSize = 76;
    const wallDefs = [
      { pos: [0, wallHeight / 2, -roomSize / 2], size: [roomSize, wallHeight, wallThickness] },
      { pos: [0, wallHeight / 2,  roomSize / 2], size: [roomSize, wallHeight, wallThickness] },
      { pos: [-roomSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, roomSize] },
      { pos: [ roomSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, roomSize] },
    ];
    wallDefs.forEach((w) => {
      const wm = new THREE.Mesh(new THREE.BoxGeometry(...w.size), wallMaterial);
      wm.position.set(...w.pos);
      wm.receiveShadow = true;
      scene.add(wm);
    });

    function buildEnvironment() {
      const env = ENVIRONMENTS.cyber;

      env.zones.forEach((zone) => {
        const [sx, sy, sz] = zone.size;
        const [px, py, pz] = zone.pos;

        // Glowing Pad - Increased opacity & emissive
        const padGeo = new THREE.BoxGeometry(sx, 0.05, sz);
        const padMat = new THREE.MeshStandardMaterial({ 
          color: zone.color, 
          emissive: zone.color,
          emissiveIntensity: 0.6,
          transparent: true, 
          opacity: 0.6
        });
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.set(px, 0.025, pz);
        pad.receiveShadow = true;
        envGroup.add(pad);

        // Holographic borders
        const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(sx, 0.1, sz));
        const borderMat = new THREE.LineBasicMaterial({ color: zone.color, transparent: true, opacity: 1.0 });
        const border = new THREE.LineSegments(borderGeo, borderMat);
        border.position.set(px, 0.05, pz);
        envGroup.add(border);

        // Abstract server nodes
        for (let i = 0; i < 3; i++) {
          const rack = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, Math.random() * 2 + 1.5, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x20202a, roughness: 0.4, metalness: 0.7 })
          );
          rack.position.set(px - 1.5 + i * 1.5, 1, pz - 1);
          rack.castShadow = true;
          envGroup.add(rack);

          // Server lights
          const light = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.05, 0.85),
            new THREE.MeshBasicMaterial({ color: zone.color })
          );
          light.position.set(px - 1.5 + i * 1.5, 1.8, pz - 1);
          envGroup.add(light);
        }
      });
    }
    buildEnvironment();

    // ─── AGENTS CONFIG ───
    const AGENT_DEFS = [
      { id: 'orchestrator', label: 'Orchestrator', color: NEON.GREEN },
      { id: 'researcher', label: 'Researcher', color: NEON.BLUE },
      { id: 'processor', label: 'Processor', color: NEON.PURPLE },
      { id: 'validator', label: 'Validator', color: NEON.ORANGE },
    ];

    const scenarioPath = ['mainframe', 'compiler', 'nodes', 'gateway', 'data_lake', 'archive', 'firewall'];
    
    const SCENARIO = [
      { agent: 'orchestrator', path: [...scenarioPath].sort(() => 0.5 - Math.random()) },
      { agent: 'researcher', path: [...scenarioPath].sort(() => 0.5 - Math.random()) },
      { agent: 'processor', path: [...scenarioPath].sort(() => 0.5 - Math.random()) },
      { agent: 'validator', path: [...scenarioPath].sort(() => 0.5 - Math.random()) },
    ];

    // ─── CREATING AGENT MODEL ───
    function createAgentModel(agentColor: number) {
      const group = new THREE.Group();
      // Maximum emissive for agents
      const emissiveOpt = { emissive: agentColor, emissiveIntensity: 3.5 };

      // Core body (floating crystal/bot) -> Made slightly larger to pop more
      const bodyGeo = new THREE.OctahedronGeometry(0.8, 0);
      const bodyMat = getMat(0x444455, { metalness: 0.8, roughness: 0.2 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 1.5, 0);
      body.castShadow = true;
      group.add(body);

      // Inner glowing core
      const coreGeo = new THREE.OctahedronGeometry(0.4, 0);
      const coreMat = getMat(agentColor, emissiveOpt);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, 1.5, 0);
      group.add(core);

      // Orbiting rings
      const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 24);
      const ring = new THREE.Mesh(ringGeo, getMat(agentColor, emissiveOpt));
      ring.position.set(0, 1.5, 0);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      return { group, body, ring };
    }

    // ─── AGENT STATE ───
    const agents: any[] = [];
    const agentMeshes: Record<string, THREE.Group> = {};
    const pathTraces: Record<string, THREE.Line> = {};

    function getZonePos(zoneId: string) {
      const z = ENVIRONMENTS.cyber.zones.find(z => z.id === zoneId);
      return z ? new THREE.Vector3(z.pos[0], 0, z.pos[2]) : new THREE.Vector3(0, 0, 0);
    }

    function initAgents() {
      SCENARIO.forEach((s, i) => {
        const def = AGENT_DEFS.find(a => a.id === s.agent)!;
        const startPos = getZonePos(s.path[0]);

        const { group, body, ring } = createAgentModel(def.color);
        group.position.copy(startPos);
        scene.add(group);
        agentMeshes[def.id] = group;

        // Path trace line
        const traceGeo = new THREE.BufferGeometry();
        const traceMat = new THREE.LineBasicMaterial({
          color: def.color,
          transparent: true,
          opacity: 0.8, // Brighter trace lines
          linewidth: 3,
        });
        const traceLine = new THREE.Line(traceGeo, traceMat);
        scene.add(traceLine);
        pathTraces[def.id] = traceLine;

        agents.push({
          id: def.id,
          def,
          scenario: s,
          pathIndex: 0,
          currentPos: startPos.clone(),
          tracePoints: [new THREE.Vector3(startPos.x, 0.1, startPos.z)],
          started: false,
          visiting: false,
          visitTimer: 0,
          delayStart: i * 2,
          body,
          ring
        });
      });
    }

    initAgents();

    function updatePathTrace(agent: any) {
      const trace = pathTraces[agent.id];
      if (!trace) return;
      const pts = agent.tracePoints;
      const positions = new Float32Array(pts.length * 3);
      pts.forEach((p: THREE.Vector3, i: number) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      trace.geometry.dispose();
      trace.geometry = new THREE.BufferGeometry();
      trace.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }

    // ─── ANIMATION LOOP ───
    const clock = new THREE.Clock();
    let simTime = 0;
    const AGENT_SPEED = 4.0;
    let animationFrameId: number;

    // Cinematic orbit variables
    let autoOrbitAngle = Math.PI / 4;
    
    // Increased radius (furthur away -> smaller)
    const ORBIT_RADIUS = 55; 

    function animate() {
      const dt = clock.getDelta();
      simTime += dt;

      // Cinematic camera movement
      autoOrbitAngle += dt * 0.05; // Slow rotation
      camera.position.x = Math.sin(autoOrbitAngle) * ORBIT_RADIUS;
      camera.position.z = Math.cos(autoOrbitAngle) * ORBIT_RADIUS;
      // Increased height for a more top-down angle, making it appear higher up on the screen and smaller overall
      camera.position.y = 35 + Math.sin(simTime * 0.2) * 5; 
      
      // Look slightly behind the center so the entire grid shifts 'up' on the screen visually
      camera.lookAt(0, 0, -8);

      agents.forEach(agent => {
        // Idle animations for the model geometry
        if (agent.body) {
          agent.body.rotation.y += dt;
          agent.body.rotation.x += dt * 0.5;
          agent.ring.rotation.x = Math.PI / 2 + Math.sin(simTime * 2 + agent.delayStart) * 0.2;
          agent.ring.rotation.y += dt * 2;
        }

        if (!agent.started) {
          if (simTime >= agent.delayStart) agent.started = true;
          return;
        }

        if (agent.visiting) {
          agent.visitTimer -= dt;
          if (agent.visitTimer <= 0) {
            agent.visiting = false;
            agent.pathIndex = (agent.pathIndex + 1) % agent.scenario.path.length;
          }
          return;
        }

        const targetZone = agent.scenario.path[agent.pathIndex];
        const targetPos = getZonePos(targetZone);
        const dir = new THREE.Vector3().subVectors(targetPos, agent.currentPos);
        dir.y = 0;
        const dist = dir.length();

        if (dist < 0.2) {
          agent.currentPos.copy(targetPos);
          agent.visiting = true;
          agent.visitTimer = 2.0;
        } else {
          dir.normalize();
          const step = Math.min(AGENT_SPEED * dt, dist);
          agent.currentPos.add(dir.multiplyScalar(step));
        }

        // Apply position
        const mesh = agentMeshes[agent.id];
        if (mesh) {
          mesh.position.x = agent.currentPos.x;
          mesh.position.z = agent.currentPos.z;
          // Bobbing movement
          mesh.position.y = Math.sin(simTime * 5 + agent.delayStart) * 0.3;
        }

        // Trace path update
        const lastPt = agent.tracePoints[agent.tracePoints.length - 1];
        if (lastPt.distanceTo(new THREE.Vector3(agent.currentPos.x, 0.1, agent.currentPos.z)) > 0.5) {
          agent.tracePoints.push(new THREE.Vector3(agent.currentPos.x, 0.1, agent.currentPos.z));
          if (agent.tracePoints.length > 40) {
            agent.tracePoints.shift();
          }
          updatePathTrace(agent);
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // ─── RESIZE LOGIC ───
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ─── CLEANUP ───
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Recursive disposal
      scene.traverse((object: any) => {
        if (!object.isMesh && !object.isLine) return;
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.isMaterial) {
            cleanMaterial(object.material);
          } else {
            for (const material of object.material) cleanMaterial(material);
          }
        }
      });
      
      const cleanMaterial = (mat: any) => {
        mat.dispose();
        if (mat.map) mat.map.dispose();
        if (mat.lightMap) mat.lightMap.dispose();
        if (mat.bumpMap) mat.bumpMap.dispose();
        if (mat.normalMap) mat.normalMap.dispose();
        if (mat.specularMap) mat.specularMap.dispose();
        if (mat.envMap) mat.envMap.dispose();
      };

      renderer.dispose();
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
         mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 overflow-hidden bg-transparent pointer-events-none"
    />
  );
};

export default AIAgentsSimulator;
