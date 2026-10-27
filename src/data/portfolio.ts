/*
  All portfolio copy lives here. House rule carried over from the robotics repos:
  every number is MEASURED (with what it was measured on) or labelled TARGET.
  Sources: D:\playground\Robotics\docs (OVERVIEW-ONE-PAGE, ADDING-ARMS-AND-GRIPPERS,
  ACCURACY-AND-SPEED, PROJECT_MEMORY) and D:\playground\switchon.io clone\README.
*/

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export const HERO_STATS: Stat[] = [
  { value: "98%", label: "of real metal parts found in clutter", note: "82 of 84, hand-checked bench frames" },
  { value: "0.8 s", label: "to onboard a new part from CAD", note: "no retraining, no photo shoot" },
  { value: "0.1 s", label: "per look on the classical engine", note: "laptop CPU, no graphics card" },
  { value: "₹0", label: "in paid robot-controller options", note: "poses over plain TCP / Modbus" },
];

export interface Engine {
  tag: string;
  title: string;
  body: string;
  points: string[];
}

export const ENGINES: Engine[] = [
  {
    tag: "Engine A · Classical",
    title: "Geometry-first, no AI required",
    body: "For flat, repeatable parts the cell does not need a neural network. Depth geometry finds the part, its side and its grip point — deterministic, explainable, and fast on any office PC.",
    points: ["0.1 s a look on CPU", "145 picks chosen on real frames, none on the wrong side", "No GPU, no training data"],
  },
  {
    tag: "Engine B · AI 6D pose",
    title: "CAD-conditioned AI for mixed bins",
    body: "For tilted, mixed or overlapping parts: our own segmentation, identification and render-and-compare pose networks — trained only on synthetic data from CAD, so the weights are licence-clean.",
    points: ["New SKU = one CAD file, 0.8 s", "Full 6-D pose (x, y, z, u, v, w)", "Exports to ONNX / OpenVINO for CPU"],
  },
];

export type ArmStatus = "integrated" | "ready" | "client";
export type ArmKind = "industrial" | "cobot" | "plc";

export interface Arm {
  brand: string;
  detail: string;
  status: ArmStatus;
  kind: ArmKind;
}

export const ARMS: Arm[] = [
  { brand: "Epson", detail: "C8 · RC800 / RC700", status: "integrated", kind: "industrial" },
  { brand: "Universal Robots", detail: "e-Series cobots", status: "ready", kind: "cobot" },
  { brand: "ABB", detail: "IRC5 / OmniCore", status: "client", kind: "industrial" },
  { brand: "FANUC", detail: "R-30iB controllers", status: "client", kind: "industrial" },
  { brand: "KUKA", detail: "KRC4 / KRC5", status: "client", kind: "industrial" },
  { brand: "Yaskawa", detail: "YRC1000", status: "client", kind: "industrial" },
  { brand: "Dobot / Doosan", detail: "Cobots", status: "client", kind: "cobot" },
  { brand: "Any PLC", detail: "Siemens, Mitsubishi, Delta… over Modbus TCP", status: "ready", kind: "plc" },
];

/** Only shown for arms past the "small client per brand" stage. */
export const ARM_STATUS_LABEL: Partial<Record<ArmStatus, string>> = {
  integrated: "Integrated",
  ready: "Protocol ready",
};

export interface Reel {
  id: string;
  kind: "Digital twin" | "Our software" | "AI-generated concept" | "Real-arm pick";
  title: string;
  caption: string;
  /** mp4 in /public. Leave undefined to show the poster only. */
  src?: string;
  poster: string;
}

/*
  To add a recording: drop a short muted MP4 (H.264, <= 8 MB, ~10–30 s) in
  public/robotics/ and add an entry here. Encode with:
  ffmpeg -i in.mp4 -an -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 27 -movflags +faststart out.mp4
*/
export const REELS: Reel[] = [
  {
    id: "twin",
    kind: "Digital twin",
    title: "Eight picks on the Epson RC+ virtual controller",
    caption: "Our vision PC serves each pose over TCP; the Epson C8 in RC+ runs the real SPEL+ program to pick every part. 4× speed.",
    src: "/robotics/twin-rcplus.mp4",
    poster: "/robotics/twin-rcplus.jpg",
  },
  {
    id: "software",
    kind: "Our software",
    title: "Setup Studio and the operator screen, live",
    caption: "The 3D depth view with every part's pose and verdict, then the Run screen serving picks while the twin moves. 2× speed.",
    src: "/robotics/software-loop.mp4",
    poster: "/robotics/hmi-depth-3d.jpg",
  },
];

export const CONCEPT_REEL: Reel = {
  id: "concept",
  kind: "AI-generated concept",
  title: "Where the inspection station is heading",
  caption: "A generated concept of the vision station on a bearing line — PASS / REJECT per part, the PLC owns the ejector.",
  src: "/robotics/concept-inspection.mp4",
  poster: "/robotics/concept-inspection.jpg",
};

export const GALLERY = [
  { src: "/robotics/hmi-depth-3d.jpg", label: "Our software", caption: "3D depth view — served and refused parts, with the reason for each" },
  { src: "/robotics/fittings-spread.jpg", label: "Real frame", caption: "37 hydraulic fittings in a real tub, RealSense D435" },
  { src: "/robotics/real-tub.jpg", label: "Real frame", caption: "Star gears — blue = cleared for picking" },
  { src: "/robotics/sim-bin.jpg", label: "Simulation", caption: "Mixed fasteners rendered from CAD to train the vision" },
];

export interface Product {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  bullets: string[];
  status: string;
}

export const PIPELINE = [
  { n: "00", name: "Floor", what: "RANSAC plane fit — the bin floor and each part's true height", result: "fitted once per cell" },
  { n: "01", name: "Segment", what: "Small U-Net on colour + height, split into instances", result: "98% found on real frames" },
  { n: "02", name: "Identify", what: "Contrastive descriptor vs 128 rendered views per SKU", result: "new SKU in 0.8 s" },
  { n: "03", name: "Pose", what: "Coarse 6-D pose from the matched view and camera intrinsics", result: "≈3° repeatable, lying flat" },
  { n: "04", name: "Refine", what: "Render-and-compare network, three passes, depth snap", result: "≈3.7 mm median repeatability" },
  { n: "05", name: "Grasp", what: "Authored grasps ranked by clearance against the live pile", result: "highest clear part first" },
  { n: "06", name: "Hand-off", what: "One line over TCP / Modbus — the arm plans its own motion", result: "OK,conf,class,x,y,z,u,v,w" },
];

export const INDUSTRIES = [
  { name: "Auto components", need: "Machine tending and bin picking for Tier-1/2 suppliers in Chennai, Pune and Gurugram." },
  { name: "Fasteners & machined parts", need: "Sorting mixed bolts, nuts, brackets and fittings into kits — oriented." },
  { name: "Castings & forgings", need: "Surface-defect inspection where a human inspector gets tired by 3 pm." },
  { name: "Packaging & FMCG", need: "PASS / REJECT on the line, handed to the PLC that owns the ejector." },
  { name: "Electrical & appliances", need: "Kitting and assembly feeding from bulk bins." },
  { name: "MSME job shops", need: "Retrofit the arm already on the floor instead of buying a ₹40 L+ imported vision system." },
];

export const SHOP_FLOOR_DEFAULTS = [
  "Runs fully offline — no cloud, no internet on the plant floor",
  "Operator screens in English and தமிழ்",
  "Runs on an existing PC; GPU optional",
  "Off-the-shelf Intel RealSense depth camera",
  "Talks to the PLC over Modbus TCP",
  "Fails closed: unsure parts are left, never guessed",
  "Every pick and every reject logged with its score",
];

export interface Build {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  stack: string[];
  points: string[];
  cta: string;
  link: string;
  image?: string;
  live?: boolean;
}

export const SOFTWARE_BUILDS: Build[] = [
  {
    id: "nammaooru",
    name: "NammaOoru",
    kicker: "Civic tech · Live",
    summary: "Anonymous civic-issue reporting for Chennai. Every report is geo-matched offline to its GCC ward and assembly constituency, putting corporators and MLAs on the same public scoreboard.",
    stack: ["React", "Leaflet", "turf.js", "Neon Postgres", "Cloudflare R2", "Vercel"],
    points: ["200 wards · 16 constituencies", "Zero PII by design", "Tamil-first"],
    cta: "nammaooru.site",
    link: "https://nammaooru.site",
    image: "/projects/nammaooru-feed.jpg",
    live: true,
  },
  {
    id: "clawguard",
    name: "ClawGuard",
    kicker: "Open source · AI-agent security",
    summary: "A default-deny firewall for AI agents. Every tool call is gated before it runs, unusual actions ping your phone for approval, and every decision lands in a hash-chained audit log.",
    stack: ["TypeScript", "Node", "Zero-dependency core", "Telegram / WhatsApp"],
    points: ["Default-deny policy", "Human-in-the-loop approvals", "Tamper-evident log"],
    cta: "View on GitHub",
    link: "https://github.com/VickyTarun89/clawguard",
    image: "/projects/clawguard-mascot.png",
  },
  {
    id: "crm",
    name: "Construction CRM",
    kicker: "SaaS · Operations",
    summary: "A management system for construction workflows — projects, budgets, schedules and site logistics in one place, with natural-language queries over the project data.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    points: ["Phase-by-phase tracking", "Budget and schedule health", "AI project queries"],
    cta: "Open live demo",
    link: "https://brix-pro-agentrive.vercel.app/",
  },
];

export const JOURNEY = [
  { when: "Aerospace", what: "Aeronautical engineering — fighter-aircraft systems on the Jaguar programme." },
  { when: "United States", what: "Master's study, setbacks, and the resilience built working through them." },
  { when: "Manufacturing", what: "Manufacturing supervisor at BMU — scaling operations and leading teams on the floor." },
  { when: "Many industries", what: "Support, HR, real estate, e-commerce — learning how businesses actually run." },
  { when: "Now", what: "Physical AI: software that lets machines see, decide and act on Indian shop floors." },
];
