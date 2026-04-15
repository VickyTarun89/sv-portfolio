import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.Fog(0x050510, 50, 100);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 25, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 5;
controls.maxDistance = 60;
controls.maxPolarAngle = Math.PI / 2.05;

// ─── POST PROCESSING ───
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  0.4,    // strength (toned down so labels stay readable)
  0.3,    // radius
  0.85    // threshold (higher = only very bright things glow)
);

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);

// ─── LIGHTS ───
const ambientLight = new THREE.AmbientLight(0x0a0a20, 0.4);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e0, 0.4);
dirLight.name = 'dirLight';
dirLight.position.set(20, 35, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.left = -35;
dirLight.shadow.camera.right = 35;
dirLight.shadow.camera.top = 35;
dirLight.shadow.camera.bottom = -35;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xd0e8ff, 0.6);
dirLight2.name = 'dirLight2';
dirLight2.position.set(-15, 20, -10);
scene.add(dirLight2);

const hemiLight = new THREE.HemisphereLight(0xe8f4ff, 0xc8d8c0, 0.7);
hemiLight.name = 'hemiLight';
scene.add(hemiLight);

// ─── MATERIALS CACHE ───
const matCache = {};
function getMat(color, opts = {}) {
  const key = `${color}_${JSON.stringify(opts)}`;
  if (!matCache[key]) {
    matCache[key] = new THREE.MeshStandardMaterial({ color, ...opts });
  }
  return matCache[key];
}

// ─── ENVIRONMENT CONFIG ───
const ENVIRONMENTS = {
  banking: {
    label: 'Cyber Core',
    color: 0x00ffcc,
    floorColor: 0x050510,
    zones: [
      { id: 'llm_room', label: 'Neural Net', pos: [-10, 0, -8], size: [6, 3, 6], color: 0xff00ff, icon: '🧠', core: true },
      { id: 'ai_apps', label: 'AI Nodes', pos: [10, 0, -8], size: [6, 3, 6], color: 0x00ffff, icon: '🤖', core: true },
      { id: 'smart_tables', label: 'Data Hub', pos: [-10, 0, 8], size: [6, 3, 6], color: 0x00ffcc, icon: '📊', core: true },
      { id: 'file_storage', label: 'Secure Storage', pos: [10, 0, 8], size: [6, 3, 6], color: 0xff6600, icon: '🗄️', core: true },
      { id: 'loan_processing', label: 'Processing', pos: [0, 0, -8], size: [5, 3, 5], color: 0x00aaff, icon: '⚡' },
      { id: 'fraud_detection', label: 'Security Firewall', pos: [0, 0, 8], size: [5, 3, 5], color: 0xff0033, icon: '🛡️' },
      { id: 'kyc_desk', label: 'Auth Gateway', pos: [0, 0, 0], size: [5, 3, 5], color: 0xcc00ff, icon: '🔑' },
    ],
  },
  recruitment: {
    label: 'Data Sync',
    color: 0xff00ff,
    floorColor: 0x050510,
    zones: [
      { id: 'llm_room', label: 'Neural Net', pos: [-10, 0, -8], size: [6, 3, 6], color: 0xff00ff, icon: '🧠', core: true },
      { id: 'ai_apps', label: 'AI Nodes', pos: [10, 0, -8], size: [6, 3, 6], color: 0x00ffff, icon: '🤖', core: true },
      { id: 'smart_tables', label: 'Data Hub', pos: [-10, 0, 8], size: [6, 3, 6], color: 0x00ffcc, icon: '📊', core: true },
      { id: 'file_storage', label: 'Secure Storage', pos: [10, 0, 8], size: [6, 3, 6], color: 0xff6600, icon: '🗄️', core: true },
      { id: 'resume_screen', label: 'Packet Sorting', pos: [0, 0, -8], size: [5, 3, 5], color: 0x00aaff, icon: '📦' },
      { id: 'interview_room', label: 'Comm Link', pos: [0, 0, 8], size: [5, 3, 5], color: 0x00ffcc, icon: '📡' },
      { id: 'offer_desk', label: 'Finalizing', pos: [0, 0, 0], size: [5, 3, 5], color: 0xffaa00, icon: '💾' },
    ],
  },
  construction: {
    label: 'Construction',
    color: 0xff8800,
    floorColor: 0x050510,
    zones: [
      { id: 'llm_room', label: 'Blueprint Room', pos: [-10, 0, -8], size: [6, 3, 6], color: 0x2288ff, icon: '📐', core: true },
      { id: 'ai_apps', label: 'Safety HQ', pos: [10, 0, -8], size: [6, 3, 6], color: 0xff4444, icon: '🦺', core: true },
      { id: 'smart_tables', label: 'Equipment Yard', pos: [-10, 0, 8], size: [6, 3, 6], color: 0xffaa00, icon: '🏗️', core: true },
      { id: 'file_storage', label: 'Materials Store', pos: [10, 0, 8], size: [6, 3, 6], color: 0x88cc44, icon: '🧱', core: true },
      { id: 'foundation_site', label: 'Foundation Site', pos: [0, 0, -8], size: [5, 3, 5], color: 0xcc8833, icon: '⚒️' },
      { id: 'inspection_bay', label: 'Inspection Bay', pos: [0, 0, 8], size: [5, 3, 5], color: 0x44ddff, icon: '🔍' },
      { id: 'site_office', label: 'Site Office', pos: [0, 0, 0], size: [5, 3, 5], color: 0xdddddd, icon: '🏢' },
    ],
  },
};

let currentEnv = 'banking';
const envGroup = new THREE.Group();
envGroup.name = 'envGroup';
scene.add(envGroup);

// ─── FLOOR ───
// Removed tiled floor as per user request for a cleaner grid-only look.
const TILE_SIZE = 2;
const TILE_COUNT = 25;

// Subtle grid lines on top
const gridHelper = new THREE.GridHelper(50, 50, 0x00ffff, 0x00ffff);
gridHelper.name = 'gridHelper';
gridHelper.position.y = 0.01;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.7;
scene.add(gridHelper);

// Perimeter walls
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.8 });
const wallThickness = 0.4, wallHeight = 4, roomSize = 50;
const wallDefs = [
  { pos: [0, wallHeight / 2, -roomSize / 2], size: [roomSize, wallHeight, wallThickness] },
  { pos: [0, wallHeight / 2,  roomSize / 2], size: [roomSize, wallHeight, wallThickness] },
  { pos: [-roomSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, roomSize] },
  { pos: [ roomSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, roomSize] },
];
wallDefs.forEach((w, wi) => {
  const wm = new THREE.Mesh(new THREE.BoxGeometry(...w.size), wallMaterial);
  wm.name = `perimWall_${wi}`;
  wm.position.set(...w.pos);
  wm.receiveShadow = true;
  wm.castShadow = false;
  scene.add(wm);
});

// Ceiling (faint)
// Ceiling (removed for dark-room look)

// Ceiling light fixtures
const fixtureGeo = new THREE.BoxGeometry(0.8, 0.08, 0.8);
const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x00ccff, emissiveIntensity: 2.0 });
const fixturePositions = [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, 0], [-8, 0], [8, 0], [0, -8], [0, 8]];
fixturePositions.forEach(([fx, fz], fi) => {
  const fix = new THREE.Mesh(fixtureGeo, fixtureMat);
  fix.name = `fixture_${fi}`;
  fix.position.set(fx, wallHeight - 0.05, fz);
  scene.add(fix);
  // Point light per fixture (low intensity to avoid overdrive)
  const ptLight = new THREE.PointLight(0xfff8e0, 0.5, 12);
  ptLight.name = `ptLight_${fi}`;
  ptLight.position.set(fx, wallHeight - 0.3, fz);
  scene.add(ptLight);
});

// ─── ZONE LABEL SPRITES ───
function createTextSprite(text, icon, bgColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Solid dark background for maximum readability
  ctx.fillStyle = '#0a0a18';
  ctx.globalAlpha = 1.0;
  ctx.roundRect(8, 8, 1008, 240, 24);
  ctx.fill();

  // Colored border using zone color
  const hexColor = `#${new THREE.Color(bgColor).getHexString()}`;
  ctx.strokeStyle = hexColor;
  ctx.lineWidth = 6;
  ctx.roundRect(8, 8, 1008, 240, 24);
  ctx.stroke();

  // White text for contrast
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${text}`, 512, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(6, 1.5, 1);
  return sprite;
}

// ─── BUILD ENVIRONMENT ───
function buildEnvironment(envKey) {
  while (envGroup.children.length) {
    const c = envGroup.children[0];
    envGroup.remove(c);
    c.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); });
  }

  const env = ENVIRONMENTS[envKey];
  const bgColor = env.floorColor;
  scene.background = new THREE.Color(bgColor);
  scene.fog.color.set(bgColor);

  env.zones.forEach((zone, i) => {
    const [sx, sy, sz] = zone.size;
    const [px, py, pz] = zone.pos;

    // Floor pads removed as per user request for a flat grid base.

    // Low partition walls (solid, opaque, like real office cubicle dividers)
    // Low partition walls (solid, opaque)
    const partH = 1.25;
    const partMat = new THREE.MeshStandardMaterial({ color: 0x020205, roughness: 0.8, metalness: 0.2 });
    const accentMat = new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.2, metalness: 0.8, emissive: zone.color, emissiveIntensity: 0.5 });
    const hw = sx / 2, hd = sz / 2;

    // Four walls — leave a gap on one side (front -Z) for entry
    const wallDefs2 = [
      { size: [sx, partH, 0.12], offset: [0, 0, -hd] },   // front (with gap — we'll use half panels)
      { size: [sx, partH, 0.12], offset: [0, 0,  hd] },   // back
      { size: [0.12, partH, sz], offset: [-hw, 0, 0] },   // left
      { size: [0.12, partH, sz], offset: [ hw, 0, 0] },   // right
    ];
    wallDefs2.forEach((wd, wi) => {
      const wg = new THREE.BoxGeometry(...wd.size);
      const wm = new THREE.Mesh(wg, partMat);
      wm.name = `cubWall_${zone.id}_${wi}`;
      wm.position.set(px + wd.offset[0], partH / 2, pz + wd.offset[1]);
      wm.castShadow = true;
      wm.receiveShadow = true;
      envGroup.add(wm);
      // Colored top cap strip
      const capGeo = new THREE.BoxGeometry(wd.size[0] + 0.02, 0.08, wd.size[2] + 0.02);
      const cap = new THREE.Mesh(capGeo, accentMat);
      cap.name = `cubCap_${zone.id}_${wi}`;
      cap.position.set(px + wd.offset[0], partH + 0.04, pz + wd.offset[1]);
      envGroup.add(cap);
    });

    // Corner pillars (structural, metallic)
    const corners = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
    corners.forEach((c, ci) => {
      const pillarGeo = new THREE.BoxGeometry(0.14, sy, 0.14);
      const pillarMat = new THREE.MeshStandardMaterial({ color: zone.color, metalness: 0.6, roughness: 0.3, emissive: zone.color, emissiveIntensity: 1.2 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.name = `pillar_${zone.id}_${ci}`;
      pillar.position.set(px + c[0], sy / 2, pz + c[1]);
      pillar.castShadow = true;
      envGroup.add(pillar);
    });

    // Furniture
    // ── Shared desk builder helper ──
    function addDesk(nx, nz, label, col = 0xffffff) {
      // Desk surface
      const deskSurf = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.06, 0.85),
        new THREE.MeshStandardMaterial({ color: 0x020205, roughness: 0.8, metalness: 0.3 })
      );
      deskSurf.name = `deskSurf_${label}`;
      deskSurf.position.set(nx, 0.76, nz);
      deskSurf.castShadow = true;
      deskSurf.receiveShadow = true;
      envGroup.add(deskSurf);
      // Desk body (panel)
      const deskBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.7, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.9 })
      );
      deskBody.name = `deskBody_${label}`;
      deskBody.position.set(nx, 0.38, nz + 0.4);
      envGroup.add(deskBody);
      // Legs
      const legMat2 = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.7, roughness: 0.3 });
      const legG = new THREE.CylinderGeometry(0.04, 0.04, 0.74, 8);
      [[-0.58, -0.35], [0.58, -0.35], [-0.58, 0.35], [0.58, 0.35]].forEach((lp, li) => {
        const leg = new THREE.Mesh(legG, legMat2);
        leg.name = `deskLeg_${label}_${li}`;
        leg.position.set(nx + lp[0], 0.37, nz + lp[1]);
        envGroup.add(leg);
      });
      // Monitor
      const monBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.04, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.6 })
      );
      monBase.name = `monBase_${label}`;
      monBase.position.set(nx, 0.81, nz - 0.1);
      envGroup.add(monBase);
      const monStem = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.28, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.6 })
      );
      monStem.name = `monStem_${label}`;
      monStem.position.set(nx, 0.95, nz - 0.1);
      envGroup.add(monStem);
      const monScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.44, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x111122, emissive: col, emissiveIntensity: 0.6, roughness: 0.2 })
      );
      monScreen.name = `monScreen_${label}`;
      monScreen.position.set(nx, 1.14, nz - 0.1);
      envGroup.add(monScreen);
      // Keyboard
      const kbd = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.02, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.9 })
      );
      kbd.name = `kbd_${label}`;
      kbd.position.set(nx, 0.79, nz + 0.15);
      envGroup.add(kbd);
    }

    if (zone.id === 'llm_room') {
      // Server rack units
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.4, metalness: 0.7 });
      const rackLightMat = new THREE.MeshStandardMaterial({ color: 0x6c3483, emissive: 0x9b59b6, emissiveIntensity: 1.2 });
      for (let si = 0; si < 3; si++) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.1, 0.55), rackMat);
        rack.name = `rack_${zone.id}_${si}`;
        rack.position.set(px - 1.5 + si * 1.5, 1.05, pz);
        rack.castShadow = true;
        envGroup.add(rack);
        // LED strips on rack
        for (let ri = 0; ri < 5; ri++) {
          const led = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.02), rackLightMat);
          led.name = `led_${zone.id}_${si}_${ri}`;
          led.position.set(px - 1.5 + si * 1.5, 0.3 + ri * 0.35, pz - 0.29);
          envGroup.add(led);
        }
        // Rack door frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.12, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x2c2c3c, roughness: 0.3, metalness: 0.9 }));
        frame.name = `rackFrame_${si}`;
        frame.position.set(px - 1.5 + si * 1.5, 1.05, pz - 0.28);
        envGroup.add(frame);
      }
      // LLM console desk
      addDesk(px, pz + 2, `llm_console`, 0x9b59b6);
    } else if (zone.id === 'smart_tables') {
      // Large interactive smart table
      const tblTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.06, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x0a1628, emissive: 0x28b463, emissiveIntensity: 0.35, roughness: 0.2, metalness: 0.5 })
      );
      tblTop.name = `smartTop_${zone.id}`;
      tblTop.position.set(px, 0.82, pz);
      tblTop.castShadow = true;
      envGroup.add(tblTop);
      // Grid lines on table surface
      const tblEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 0.07, 1.4)),
        new THREE.LineBasicMaterial({ color: 0x2ecc71 })
      );
      tblEdge.name = `smartEdge_${zone.id}`;
      tblEdge.position.set(px, 0.82, pz);
      envGroup.add(tblEdge);
      // Table legs
      const tLegMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, metalness: 0.8, roughness: 0.2 });
      [[-1.0, -0.55], [1.0, -0.55], [-1.0, 0.55], [1.0, 0.55]].forEach((lp, li) => {
        const tl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8), tLegMat);
        tl.name = `smartLeg_${zone.id}_${li}`;
        tl.position.set(px + lp[0], 0.4, pz + lp[1]);
        envGroup.add(tl);
      });
      // Two regular desks beside it
      addDesk(px - 1.8, pz - 1.5, `smart_side0`, 0x27ae60);
      addDesk(px + 1.8, pz - 1.5, `smart_side1`, 0x27ae60);
    } else if (zone.id === 'file_storage') {
      // Filing cabinet set
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x0a0a15, roughness: 0.8, metalness: 0.4 });
      const cabAccent = new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.4, metalness: 0.5 });
      for (let ci = 0; ci < 3; ci++) {
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.55), cabMat);
        cab.name = `cab_${zone.id}_${ci}`;
        cab.position.set(px - 1.2 + ci * 1.2, 0.8, pz - 1.2);
        cab.castShadow = true;
        envGroup.add(cab);
        // Drawer handles
        for (let dr = 0; dr < 3; dr++) {
          const handle = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.06), cabAccent);
          handle.name = `handle_${zone.id}_${ci}_${dr}`;
          handle.position.set(px - 1.2 + ci * 1.2, 0.35 + dr * 0.45, pz - 1.2 - 0.29);
          envGroup.add(handle);
        }
        // Top label strip
        const label2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.02), cabAccent);
        label2.name = `cabLabel_${ci}`;
        label2.position.set(px - 1.2 + ci * 1.2, 1.62, pz - 1.2 - 0.28);
        envGroup.add(label2);
      }
      // Desk for retrieval
      addDesk(px + 0.3, pz + 1.2, `file_desk`, 0xe67e22);
    } else if (zone.id === 'ai_apps') {
      // Four proper desks with computers
      for (let di = 0; di < 4; di++) {
        addDesk(
          px - 1.4 + (di % 2) * 2.8,
          pz - 1.0 + Math.floor(di / 2) * 2.2,
          `aiDesk_${di}`,
          0x2980b9
        );
      }
    } else {
      // Generic variable-zone desks
      for (let di = 0; di < 2; di++) {
        addDesk(px - 0.9 + di * 1.8, pz, `genDesk_${zone.id}_${di}`, zone.color);
      }
      // Small whiteboard on back wall
      // Holographic display on back wall
      const wb = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.9, 0.05),
        new THREE.MeshStandardMaterial({
          color: zone.color,
          transparent: true,
          opacity: 0.4,
          emissive: zone.color,
          emissiveIntensity: 1.5,
          side: THREE.DoubleSide
        })
      );
      wb.name = `wb_${zone.id}`;
      wb.position.set(px, 1.3, pz - sz / 2 + 0.15);
      envGroup.add(wb);
      const wbFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.46, 0.96, 0.04),
        new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.5, metalness: 0.3 })
      );
      wbFrame.name = `wbFrame_${zone.id}`;
      wbFrame.position.set(px, 1.3, pz - sz / 2 + 0.12);
      envGroup.add(wbFrame);
    }

    // Label
    const label = createTextSprite(zone.label, zone.icon, zone.color);
    label.name = `label_${zone.id}`;
    label.position.set(px, sy + 1, pz);
    envGroup.add(label);
  });
}

buildEnvironment(currentEnv);

// ─── LEGO CHARACTER BUILDER ───
function createLegoCharacter(agentColor, name) {
  const group = new THREE.Group();
  group.name = `lego_${name}`;
  const c = new THREE.Color(agentColor);
  const darker = c.clone().multiplyScalar(0.6);

  // Legs
  const legGeo = new THREE.BoxGeometry(0.22, 0.45, 0.25);
  const legMat = getMat(darker.getHex());
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.name = `${name}_leftLeg`;
  leftLeg.position.set(-0.13, 0.225, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.name = `${name}_rightLeg`;
  rightLeg.position.set(0.13, 0.225, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Hip connector
  const hipGeo = new THREE.BoxGeometry(0.48, 0.1, 0.25);
  const hip = new THREE.Mesh(hipGeo, getMat(agentColor));
  hip.name = `${name}_hip`;
  hip.position.set(0, 0.5, 0);
  group.add(hip);

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.55, 0.55, 0.3);
  const torsoMat = getMat(agentColor);
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.name = `${name}_torso`;
  torso.position.set(0, 0.825, 0);
  torso.castShadow = true;
  group.add(torso);

  // Chest plate detail
  const chestGeo = new THREE.BoxGeometry(0.3, 0.2, 0.02);
  const chest = new THREE.Mesh(chestGeo, getMat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.15 }));
  chest.name = `${name}_chestPlate`;
  chest.position.set(0, 0.85, 0.17);
  group.add(chest);

  // Arms
  const armGeo = new THREE.BoxGeometry(0.15, 0.45, 0.18);
  const armMat = getMat(agentColor);

  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.name = `${name}_leftArm`;
  leftArm.position.set(-0.38, 0.8, 0);
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.name = `${name}_rightArm`;
  rightArm.position.set(0.38, 0.8, 0);
  rightArm.castShadow = true;
  group.add(rightArm);

  // Hands (C-claws)
  const handGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8);
  const handMat = getMat(0xf5d76e);
  const leftHand = new THREE.Mesh(handGeo, handMat);
  leftHand.name = `${name}_leftHand`;
  leftHand.position.set(-0.38, 0.52, 0);
  group.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, handMat);
  rightHand.name = `${name}_rightHand`;
  rightHand.position.set(0.38, 0.52, 0);
  group.add(rightHand);

  // Head
  const headGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.35, 16);
  const headMat = getMat(0xf5d76e);
  const head = new THREE.Mesh(headGeo, headMat);
  head.name = `${name}_head`;
  head.position.set(0, 1.3, 0);
  head.castShadow = true;
  group.add(head);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const eyeMat = getMat(0x111111);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.name = `${name}_leftEye`;
  leftEye.position.set(-0.08, 1.33, 0.2);
  group.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.name = `${name}_rightEye`;
  rightEye.position.set(0.08, 1.33, 0.2);
  group.add(rightEye);

  // Smile
  const smileCurve = new THREE.EllipseCurve(0, 0, 0.08, 0.04, Math.PI, 0, false);
  const smileGeo = new THREE.BufferGeometry().setFromPoints(smileCurve.getPoints(12));
  const smile = new THREE.Line(smileGeo, new THREE.LineBasicMaterial({ color: 0x111111 }));
  smile.name = `${name}_smile`;
  smile.position.set(0, 1.26, 0.225);
  group.add(smile);

  // Stud on top
  const studGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12);
  const stud = new THREE.Mesh(studGeo, getMat(agentColor));
  stud.name = `${name}_stud`;
  stud.position.set(0, 1.53, 0);
  group.add(stud);

  // Helmet/cap
  const helmetGeo = new THREE.SphereGeometry(0.24, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const helmet = new THREE.Mesh(helmetGeo, getMat(agentColor, { emissive: agentColor, emissiveIntensity: 0.2 }));
  helmet.name = `${name}_helmet`;
  helmet.position.set(0, 1.44, 0);
  group.add(helmet);

  return group;
}

// ─── AGENTS CONFIG ───
const AGENT_DEFS = [
  { id: 'orchestrator', label: 'Orchestrator', color: 0xff6b6b, role: 'Coordinates all tasks' },
  { id: 'researcher', label: 'Researcher', color: 0x4ecdc4, role: 'Gathers & analyzes data' },
  { id: 'processor', label: 'Processor', color: 0x45b7d1, role: 'Processes documents' },
  { id: 'validator', label: 'Validator', color: 0xf9ca24, role: 'Validates & QA checks' },
];

const SCENARIOS = {
  banking: [
    { agent: 'orchestrator', path: ['llm_room', 'loan_processing', 'ai_apps', 'kyc_desk', 'smart_tables'], handTo: [null, null, 'researcher', null, null] },
    { agent: 'researcher', path: ['ai_apps', 'file_storage', 'kyc_desk', 'fraud_detection', 'smart_tables'], handTo: [null, null, null, 'processor', null] },
    { agent: 'processor', path: ['fraud_detection', 'file_storage', 'llm_room', 'loan_processing', 'smart_tables'], handTo: [null, null, null, 'validator', null] },
    { agent: 'validator', path: ['loan_processing', 'smart_tables', 'ai_apps', 'file_storage', 'llm_room'], handTo: [null, null, null, null, null] },
  ],
  recruitment: [
    { agent: 'orchestrator', path: ['llm_room', 'resume_screen', 'ai_apps', 'offer_desk', 'smart_tables'], handTo: [null, null, 'researcher', null, null] },
    { agent: 'researcher', path: ['ai_apps', 'resume_screen', 'file_storage', 'interview_room', 'smart_tables'], handTo: [null, null, null, 'processor', null] },
    { agent: 'processor', path: ['interview_room', 'llm_room', 'file_storage', 'offer_desk', 'smart_tables'], handTo: [null, null, null, 'validator', null] },
    { agent: 'validator', path: ['offer_desk', 'smart_tables', 'ai_apps', 'file_storage', 'llm_room'], handTo: [null, null, null, null, null] },
  ],
  construction: [
    { agent: 'orchestrator', path: ['llm_room', 'site_office', 'ai_apps', 'foundation_site', 'smart_tables'], handTo: [null, null, 'researcher', null, null] },
    { agent: 'researcher', path: ['ai_apps', 'file_storage', 'inspection_bay', 'llm_room', 'smart_tables'], handTo: [null, null, null, 'processor', null] },
    { agent: 'processor', path: ['foundation_site', 'smart_tables', 'file_storage', 'site_office', 'llm_room'], handTo: [null, null, null, 'validator', null] },
    { agent: 'validator', path: ['inspection_bay', 'smart_tables', 'ai_apps', 'file_storage', 'llm_room'], handTo: [null, null, null, null, null] },
  ],
};

// ─── AGENT STATE ───
const agents = [];
const agentMeshes = {};
const pathTraces = {};
const chatBubbles = [];
let simulationTime = 0;
let simSpeed = 1;
let pathsVisible = true;

function getZonePos(envKey, zoneId) {
  const z = ENVIRONMENTS[envKey].zones.find(z => z.id === zoneId);
  return z ? new THREE.Vector3(z.pos[0], 0, z.pos[2]) : new THREE.Vector3(0, 0, 0);
}

function initAgents() {
  // Clear
  agents.length = 0;
  for (let i = chatBubbles.length - 1; i >= 0; i--) {
    const b = chatBubbles[i];
    if (b && b.el && b.el.parentNode) {
      b.el.remove();
    }
  }
  chatBubbles.length = 0;
  Object.keys(agentMeshes).forEach(k => {
    scene.remove(agentMeshes[k]);
    delete agentMeshes[k];
  });
  Object.keys(pathTraces).forEach(k => {
    scene.remove(pathTraces[k]);
    pathTraces[k].geometry.dispose();
    delete pathTraces[k];
  });

  const scenario = SCENARIOS[currentEnv];
  scenario.forEach((s, i) => {
    const def = AGENT_DEFS.find(a => a.id === s.agent);
    const startPos = getZonePos(currentEnv, s.path[0]);

    const mesh = createLegoCharacter(def.color, def.id);
    mesh.position.copy(startPos);
    mesh.position.y = 0;
    scene.add(mesh);
    agentMeshes[def.id] = mesh;

    // Nametag
    const nameCanvas = document.createElement('canvas');
    nameCanvas.width = 512;
    nameCanvas.height = 128;
    const nCtx = nameCanvas.getContext('2d');
    nCtx.fillStyle = '#000000cc';
    nCtx.roundRect(4, 4, 504, 120, 16);
    nCtx.fill();
    nCtx.strokeStyle = `#${new THREE.Color(def.color).getHexString()}88`;
    nCtx.lineWidth = 3;
    nCtx.roundRect(4, 4, 504, 120, 16);
    nCtx.stroke();
    nCtx.fillStyle = '#fff';
    nCtx.font = 'bold 52px Inter, Arial, sans-serif';
    nCtx.textAlign = 'center';
    nCtx.textBaseline = 'middle';
    nCtx.fillText(def.label, 256, 64);
    const nameTex = new THREE.CanvasTexture(nameCanvas);
    nameTex.minFilter = THREE.LinearFilter;
    const nameSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nameTex, transparent: true, depthTest: false }));
    nameSprite.name = `nametag_${def.id}`;
    nameSprite.scale.set(3, 0.75, 1);
    nameSprite.position.set(0, 2.3, 0);
    mesh.add(nameSprite);

    // Path trace line
    const traceGeo = new THREE.BufferGeometry();
    const traceMat = new THREE.LineBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: 0.7,
      linewidth: 1,
    });
    const traceLine = new THREE.Line(traceGeo, traceMat);
    traceLine.name = `trace_${def.id}`;
    traceLine.frustumCulled = false;
    scene.add(traceLine);
    pathTraces[def.id] = traceLine;

    agents.push({
      id: def.id,
      def,
      scenario: s,
      pathIndex: 0,
      progress: 0,
      currentPos: startPos.clone(),
      tracePoints: [new THREE.Vector3(startPos.x, 0.15, startPos.z)],
      paused: false,
      pauseTimer: 0,
      delayStart: i * 2.5,
      started: false,
      finished: false,
      atZone: s.path[0],
      visiting: false,
      visitTimer: 0,
    });
  });

  simulationTime = 0;
  updateLog('Simulation started: ' + ENVIRONMENTS[currentEnv].label);
}

// ─── CHAT BUBBLE SYSTEM ───
const bubbleContainer = document.createElement('div');
bubbleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;';
document.body.appendChild(bubbleContainer);

function showChatBubble(agent, text, duration = 2.5) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:absolute;padding:6px 14px;border-radius:12px;font:bold 13px Inter,Arial,sans-serif;
    color:#fff;white-space:nowrap;transform:translate(-50%,-100%);pointer-events:none;
    transition:opacity 0.4s;opacity:1;
    background:${`#${new THREE.Color(agent.def.color).getHexString()}`}cc;
    border:2px solid #fff4;box-shadow:0 2px 12px #0008;
  `;
  el.textContent = text;
  bubbleContainer.appendChild(el);
  const bubble = { el, agent, timer: duration, maxTime: duration };
  chatBubbles.push(bubble);
  return bubble;
}

function updateBubbles(dt) {
  for (let i = chatBubbles.length - 1; i >= 0; i--) {
    const b = chatBubbles[i];
    if (!b || !b.el) {
      chatBubbles.splice(i, 1);
      continue;
    }
    b.timer -= dt;
    if (b.timer <= 0) {
      b.el.style.opacity = '0';
      const el = b.el;
      chatBubbles.splice(i, 1);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
      continue;
    }
    // Project 3D to screen
    const mesh = agentMeshes[b.agent.id];
    if (mesh) {
      const v = new THREE.Vector3(0, 2.6, 0);
      v.applyMatrix4(mesh.matrixWorld);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * innerWidth;
      const y = (-v.y * 0.5 + 0.5) * innerHeight;
      b.el.style.left = x + 'px';
      b.el.style.top = y + 'px';
    }
  }
}

// ─── CROSSING DETECTION ───
const crossingCooldowns = {};

function checkCrossings(dt) {
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const a = agents[i], b = agents[j];
      if (!a.started || a.finished || !b.started || b.finished) continue;
      if (a.paused || b.paused) continue;

      const dist = a.currentPos.distanceTo(b.currentPos);
      const key = `${a.id}_${b.id}`;

      if (crossingCooldowns[key] > 0) {
        crossingCooldowns[key] -= dt;
        continue;
      }

      if (dist < 1.2) {
        a.paused = true;
        a.pauseTimer = 2.5;
        b.paused = true;
        b.pauseTimer = 2.5;
        crossingCooldowns[key] = 8;

        showChatBubble(a, '📋 Please takeover from here!', 2.5);
        setTimeout(() => showChatBubble(b, '✅ Got it! Taking over.', 2.5), 600);
        updateLog(`🤝 ${a.def.label} → ${b.def.label}: Task handover`);
      }
    }
  }
}

// ─── PATH TRACE UPDATE ───
function updatePathTrace(agent) {
  const trace = pathTraces[agent.id];
  if (!trace) return;
  const pts = agent.tracePoints;
  const positions = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  });
  trace.geometry.dispose();
  trace.geometry = new THREE.BufferGeometry();
  trace.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  trace.visible = pathsVisible;
}

// ─── ARROW HEADS ON TRACES ───
const arrowGroup = new THREE.Group();
arrowGroup.name = 'arrowGroup';
scene.add(arrowGroup);

function updateArrowHeads() {
  while (arrowGroup.children.length) arrowGroup.remove(arrowGroup.children[0]);
  if (!pathsVisible) return;

  agents.forEach(agent => {
    const pts = agent.tracePoints;
    if (pts.length < 2) return;
    const tip = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const dir = new THREE.Vector3().subVectors(tip, prev).normalize();
    const arrowLen = 0.4;

    const arrowGeo = new THREE.ConeGeometry(0.15, arrowLen, 6);
    const arrowMat = getMat(agent.def.color, { emissive: agent.def.color, emissiveIntensity: 0.5 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.name = `arrow_${agent.id}`;
    arrow.position.copy(tip);
    arrow.position.y = 0.15;
    // Point arrow in movement direction
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().setY(0).normalize().length() > 0.01 ? new THREE.Vector3(dir.x, 0, dir.z).normalize().applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2).normalize() : up);
    arrow.lookAt(tip.x + dir.x, 0.15, tip.z + dir.z);
    arrow.rotateX(Math.PI / 2);
    arrowGroup.add(arrow);
  });
}

// ─── AGENT MOVEMENT ───
const AGENT_SPEED = 2.5;

function updateAgents(dt) {
  agents.forEach(agent => {
    if (agent.finished) return;

    if (!agent.started) {
      if (simulationTime >= agent.delayStart) {
        agent.started = true;
        showChatBubble(agent, `🚀 Starting task!`, 2);
        updateLog(`${agent.def.label} started`);
      }
      return;
    }

    // Paused (crossing or handover)
    if (agent.paused) {
      agent.pauseTimer -= dt;
      if (agent.pauseTimer <= 0) agent.paused = false;
      return;
    }

    // Visiting zone
    if (agent.visiting) {
      agent.visitTimer -= dt;
      if (agent.visitTimer <= 0) {
        agent.visiting = false;
        // Check handover
        const handTo = agent.scenario.handTo[agent.pathIndex];
        if (handTo) {
          const target = agents.find(a => a.id === handTo);
          if (target && target.started && !target.finished) {
            showChatBubble(agent, `📋 ${target.def.label}, please take over!`, 2.5);
            setTimeout(() => showChatBubble(target, '✅ On it!', 2), 700);
            updateLog(`🤝 ${agent.def.label} → ${target.def.label}: Handover at ${agent.atZone}`);
          }
        }
        agent.pathIndex++;
        if (agent.pathIndex >= agent.scenario.path.length) {
          agent.finished = true;
          showChatBubble(agent, '✅ Task complete!', 3);
          updateLog(`${agent.def.label} finished all tasks`);
        }
      }
      return;
    }

    // Move toward next zone
    if (agent.pathIndex < agent.scenario.path.length) {
      const targetZone = agent.scenario.path[agent.pathIndex];
      const targetPos = getZonePos(currentEnv, targetZone);
      const dir = new THREE.Vector3().subVectors(targetPos, agent.currentPos);
      dir.y = 0;
      const dist = dir.length();

      if (dist < 0.2) {
        agent.currentPos.copy(targetPos);
        agent.atZone = targetZone;
        agent.visiting = true;
        agent.visitTimer = 1.5;
        const zone = ENVIRONMENTS[currentEnv].zones.find(z => z.id === targetZone);
        showChatBubble(agent, `${zone?.icon || '📍'} Working at ${zone?.label || targetZone}...`, 1.5);
      } else {
        dir.normalize();
        const step = Math.min(AGENT_SPEED * dt, dist);
        agent.currentPos.add(dir.multiplyScalar(step));
      }

      // Update mesh
      const mesh = agentMeshes[agent.id];
      if (mesh) {
        mesh.position.x = agent.currentPos.x;
        mesh.position.z = agent.currentPos.z;
        // Face direction
        if (dist > 0.3) {
          const angle = Math.atan2(dir.x, dir.z);
          mesh.rotation.y = angle;
        }
        // Walking animation
        const walkCycle = Math.sin(simulationTime * 8) * 0.25;
        const leftLeg = mesh.getObjectByName(`${agent.id}_leftLeg`);
        const rightLeg = mesh.getObjectByName(`${agent.id}_rightLeg`);
        const leftArm = mesh.getObjectByName(`${agent.id}_leftArm`);
        const rightArm = mesh.getObjectByName(`${agent.id}_rightArm`);
        if (leftLeg && dist > 0.3) {
          leftLeg.rotation.x = walkCycle;
          rightLeg.rotation.x = -walkCycle;
          if (leftArm) leftArm.rotation.x = -walkCycle * 0.6;
          if (rightArm) rightArm.rotation.x = walkCycle * 0.6;
        } else if (leftLeg) {
          leftLeg.rotation.x = 0;
          rightLeg.rotation.x = 0;
          if (leftArm) leftArm.rotation.x = 0;
          if (rightArm) rightArm.rotation.x = 0;
        }
      }

      // Track path
      const lastPt = agent.tracePoints[agent.tracePoints.length - 1];
      if (lastPt.distanceTo(new THREE.Vector3(agent.currentPos.x, 0.15, agent.currentPos.z)) > 0.3) {
        agent.tracePoints.push(new THREE.Vector3(agent.currentPos.x, 0.15, agent.currentPos.z));
        updatePathTrace(agent);
      }
    }
  });
}

// ─── LOG ───
const logEntries = [];

function updateLog(msg) {
  const time = simulationTime.toFixed(1);
  logEntries.push(`[${time}s] ${msg}`);
  if (logEntries.length > 50) logEntries.shift();
  const logEl = document.getElementById('sim-log');
  if (logEl) {
    logEl.innerHTML = logEntries.slice(-8).map(e => `<div>${e}</div>`).join('');
    logEl.scrollTop = logEl.scrollHeight;
  }
  showToast(msg);
}

// ─── TOAST ───
const toastContainer = document.createElement('div');
toastContainer.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;';
document.body.appendChild(toastContainer);

function showToast(msg) {
  const el = document.createElement('div');
  el.style.cssText = 'padding:8px 18px;border-radius:8px;font:13px Inter,Arial,sans-serif;color:#fff;background:#000b;backdrop-filter:blur(8px);border:1px solid #fff2;white-space:nowrap;opacity:1;transition:opacity 0.5s;';
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
  setTimeout(() => el.remove(), 3000);
}

// ─── CAMERA MODES ───
let cameraMode = 'overview';
let autoOrbitAngle = 0;

function setCameraMode(mode) {
  cameraMode = mode;
  controls.enabled = true;
  switch (mode) {
    case 'overview':
      camera.position.set(0, 25, 25);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      break;
    case 'topdown':
      camera.position.set(0, 35, 0.01);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      break;
    case 'orbit':
      autoOrbitAngle = 0;
      break;
    case 'closeup':
      camera.position.set(5, 8, 12);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      break;
  }
  controls.update();
  document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
  const el = document.querySelector(`.cam-btn[data-mode="${mode}"]`);
  if (el) el.classList.add('active');
}

// ─── UI ───
const uiHTML = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  .ui-panel {
    font-family: Inter, Arial, sans-serif;
    position: fixed;
    z-index: 50;
  }
  .panel-card {
    background: rgba(10, 10, 25, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 255, 204, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 255, 204, 0.1);
  }
  .top-bar {
    top: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; align-items: center;
  }
  .env-btn, .cam-btn {
    padding: 8px 16px;
    border: 1px solid rgba(0, 255, 204, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.4);
    color: #94a3b8;
    font: 600 13px Inter, Arial, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .env-btn:hover, .cam-btn:hover { background: rgba(0, 255, 204, 0.15); color: #00ffcc; border-color: #00ffcc; }
  .env-btn.active { background: rgba(0, 255, 204, 0.2); color: #00ffcc; border-color: #00ffcc; box-shadow: 0 0 10px rgba(0,255,204,0.3); }
  .env-btn.active[data-env="recruitment"] { background: rgba(255, 0, 255, 0.2); color: #ff00ff; border-color: #ff00ff; box-shadow: 0 0 10px rgba(255,0,255,0.3); }
  .env-btn.active[data-env="construction"] { background: rgba(255, 136, 0, 0.2); color: #ff8800; border-color: #ff8800; box-shadow: 0 0 10px rgba(255,136,0,0.3); }
  .cam-btn.active { background: rgba(0, 170, 255, 0.2); color: #00aaff; border-color: #00aaff; box-shadow: 0 0 10px rgba(0,170,255,0.3); }
  .left-panel {
    top: 66px; left: 10px; width: 220px;
  }
  .agent-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1);
    font-size: 13px; color: #cbd5e1;
  }
  .agent-item:last-child { border-bottom: none; }
  .agent-dot {
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  }
  .right-panel {
    top: 66px; right: 10px; width: 280px; max-height: 280px;
  }
  #sim-log {
    max-height: 180px; overflow-y: auto; font-size: 12px;
    color: #94a3b8; line-height: 1.7;
  }
  #sim-log::-webkit-scrollbar { width: 4px; }
  #sim-log::-webkit-scrollbar-thumb { background: rgba(0,255,204,0.3); border-radius: 2px; }
  .bottom-bar {
    bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 12px; align-items: center;
  }
  .ctrl-btn {
    padding: 8px 20px;
    border: 1px solid rgba(0, 255, 204, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.4);
    color: #cbd5e1;
    font: 600 13px Inter, Arial, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ctrl-btn:hover { background: rgba(0, 255, 204, 0.2); color: #00ffcc; border-color: #00ffcc; box-shadow: 0 0 10px rgba(0,255,204,0.2); }
  .speed-label { color: #94a3b8; font: 12px Inter, sans-serif; }
  .path-toggle { display:flex; align-items:center; gap:6px; color:#cbd5e1; font:13px Inter,sans-serif; cursor:pointer; }
  .path-toggle input { accent-color: #00ffcc; }
</style>

<div class="ui-panel top-bar">
  <div class="panel-card" style="display:flex;gap:6px;align-items:center;padding:8px 12px;">
    <span style="font-size:14px;font-weight:700;color:#fff;margin-right:8px;">🏢 Environment</span>
    <button class="env-btn active" data-env="banking" onclick="switchEnv('banking')">💰 Banking</button>
    <button class="env-btn" data-env="recruitment" onclick="switchEnv('recruitment')">🎯 Recruitment</button>
    <button class="env-btn" data-env="construction" onclick="switchEnv('construction')">🏗️ Construction</button>
  </div>
  <div class="panel-card" style="display:flex;gap:6px;align-items:center;padding:8px 12px;">
    <span style="font-size:14px;font-weight:700;color:#fff;margin-right:8px;">📷 Camera</span>
    <button class="cam-btn active" data-mode="overview" onclick="setCamMode('overview')">Overview</button>
    <button class="cam-btn" data-mode="topdown" onclick="setCamMode('topdown')">Top-Down</button>
    <button class="cam-btn" data-mode="orbit" onclick="setCamMode('orbit')">Orbit</button>
    <button class="cam-btn" data-mode="closeup" onclick="setCamMode('closeup')">Close-Up</button>
  </div>
</div>

<div class="ui-panel left-panel panel-card">
  <div style="font-weight:700;margin-bottom:8px;font-size:14px;">🤖 Agents</div>
  <div id="agent-list"></div>
  <div style="margin-top:10px;border-top:1px solid #fff1;padding-top:8px;">
    <label class="path-toggle">
      <input type="checkbox" id="path-toggle" checked onchange="togglePaths(this.checked)">
      Show Path Traces
    </label>
  </div>
</div>

<div class="ui-panel right-panel panel-card">
  <div style="font-weight:700;margin-bottom:8px;font-size:14px;">📋 Activity Log</div>
  <div id="sim-log"></div>
</div>

<div class="ui-panel bottom-bar">
  <div class="panel-card" style="display:flex;gap:10px;align-items:center;padding:8px 14px;">
    <button class="ctrl-btn" onclick="resetSim()">🔄 Reset</button>
    <button class="ctrl-btn" id="pause-btn" onclick="togglePause()">⏸ Pause</button>
    <span class="speed-label">Speed:</span>
    <button class="ctrl-btn" onclick="setSpeed(1)">1×</button>
    <button class="ctrl-btn" onclick="setSpeed(2)">2×</button>
    <button class="ctrl-btn" onclick="setSpeed(4)">4×</button>
  </div>
</div>
`;

const uiDiv = document.createElement('div');
uiDiv.innerHTML = uiHTML;
document.body.appendChild(uiDiv);

// Agent list
function updateAgentList() {
  const el = document.getElementById('agent-list');
  if (!el) return;
  el.innerHTML = agents.map(a => {
    const status = a.finished ? '✅ Done' : a.paused ? '⏸ Paused' : a.visiting ? `📍 ${a.atZone}` : a.started ? '🚶 Moving' : '⏳ Waiting';
    return `<div class="agent-item">
      <div class="agent-dot" style="background:#${new THREE.Color(a.def.color).getHexString()}"></div>
      <div><b>${a.def.label}</b><br><span style="color:#888;font-size:11px">${status}</span></div>
    </div>`;
  }).join('');
}

// Global functions for UI
let paused = false;
window.switchEnv = function (env) {
  currentEnv = env;
  buildEnvironment(env);
  initAgents();
  document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.env-btn[data-env="${env}"]`)?.classList.add('active');
};

window.setCamMode = function (mode) {
  setCameraMode(mode);
};

window.togglePaths = function (show) {
  pathsVisible = show;
  Object.values(pathTraces).forEach(t => t.visible = show);
  arrowGroup.visible = show;
};

window.setSpeed = function (s) {
  simSpeed = s;
};

window.togglePause = function () {
  paused = !paused;
  document.getElementById('pause-btn').textContent = paused ? '▶ Play' : '⏸ Pause';
};

window.resetSim = function () {
  Object.keys(crossingCooldowns).forEach(k => delete crossingCooldowns[k]);
  initAgents();
  paused = false;
  document.getElementById('pause-btn').textContent = '⏸ Pause';
};

// ─── ANIMATION LOOP ───
const clock = new THREE.Clock();

function animate() {
  const rawDt = clock.getDelta();
  const dt = paused ? 0 : rawDt * simSpeed;
  simulationTime += dt;

  // Orbit cam mode
  if (cameraMode === 'orbit' && !paused) {
    autoOrbitAngle += dt * 0.3;
    const radius = 30;
    camera.position.x = Math.sin(autoOrbitAngle) * radius;
    camera.position.z = Math.cos(autoOrbitAngle) * radius;
    camera.position.y = 18;
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
  }

  controls.update();

  // Update agents
  updateAgents(dt);
  checkCrossings(dt);
  updateBubbles(rawDt);
  updateAgentList();
  updateArrowHeads();

  // Subtle smart-table glow pulse
  const pulse = Math.sin(simulationTime * 2) * 0.12 + 0.32;
  envGroup.children.forEach(child => {
    if (child.name && child.name.startsWith('smartTop_')) {
      child.material.emissiveIntensity = pulse;
    }
  });
  controls.update();
  composer.render();
}

renderer.setAnimationLoop(animate);

// ─── RESIZE ───
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ─── INIT ───
initAgents();
setCameraMode('overview');