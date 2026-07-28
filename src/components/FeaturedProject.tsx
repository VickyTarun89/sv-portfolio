import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Metric {
  label: string;
  value: string;
  change: string;
}

interface Feature {
  label: string;
  desc: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  cta: string;
  link: string;
  metrics: Metric[];
  features: Feature[];
  version: string;
  image?: string;
  imageAlt?: string;
  live?: boolean;
  screens?: { src: string; alt: string }[];
  liveStatsUrl?: string;
}

const PROJECTS: Project[] = [
  {
    id: "nammaooru",
    title: "NammaOoru",
    subtitle: "Civic Tech — Live Public Platform",
    description: "Anonymous civic grievance reporting for Chennai. Every report is geo-matched offline to its GCC ward and assembly constituency, putting corporators and MLAs on the same public scoreboard. No login, no email, zero PII — by design.",
    stack: ["React", "Vite", "Leaflet", "turf.js", "Neon Postgres", "Cloudflare R2", "Vercel"],
    cta: "Visit nammaooru.site",
    link: "https://nammaooru.site",
    version: "NAMMAOORU_LIVE_v1.0",
    image: "/projects/nammaooru-logo.png",
    imageAlt: "NammaOoru — Report Chennai civic issues anonymously",
    live: true,
    liveStatsUrl: "https://www.nammaooru.site/api/leaderboard",
    screens: [
      { src: "/projects/nammaooru-feed.jpg", alt: "NammaOoru live feed — civic issue reports clustered on a Chennai map" },
      { src: "/projects/nammaooru-detail.jpg", alt: "Report detail — garbage report routed to Ward 99 Anna Nagar" },
      { src: "/projects/nammaooru-leaderboard.jpg", alt: "Accountability Board — wards ranked by reports filed vs resolved" },
    ],
    metrics: [
      { label: "GCC Wards Mapped", value: "200", change: "OFFLINE GEO" },
      { label: "Constituencies", value: "16", change: "DUAL-ROUTED" },
      { label: "PII Collected", value: "0", change: "ANONYMOUS" },
      { label: "Languages", value: "த / EN", change: "TAMIL-FIRST" },
    ],
    features: [
      { label: "Dual-Routing Accountability", desc: "One report lands on both the ward and MLA scoreboards — no buck-passing" },
      { label: "Anonymous by Design", desc: "No accounts, EXIF stripping, hashed short-TTL IPs for spam control only" },
      { label: "Public Leaderboard", desc: "Wards and constituencies ranked by reports filed vs. resolved" },
      { label: "Offline Spatial Lookup", desc: "turf.js point-in-polygon over open DataMeet GeoJSON in serverless functions" },
    ]
  },
  {
    id: "clawguard",
    title: "ClawGuard",
    subtitle: "Open Source — Security for AI Agents",
    description: "A default-deny firewall for AI agents. Every tool call an agent makes is gated before it runs: key material is blocked outright, anything unusual pings your phone for approval, and every decision lands in a tamper-evident audit log. Works with any agent — plugin or no plugin.",
    stack: ["TypeScript", "Node", "Zero-dependency core", "Telegram / WhatsApp API", "SHA-256 hash chain"],
    cta: "View on GitHub",
    link: "https://github.com/VickyTarun89/clawguard",
    version: "CLAWGUARD_PROXY_v0.3",
    image: "/projects/clawguard-mascot.png",
    imageAlt: "ClawGuard — the firewall for AI agents",
    metrics: [
      { label: "Prompt Injection", value: "Blocked", change: "VERIFIED" },
      { label: "Inbound Ports", value: "0", change: "LOOPBACK" },
      { label: "Test Suite", value: "40/40", change: "PASS" },
      { label: "Audit Log", value: "Hash-chained", change: "TAMPER-EVIDENT" },
    ],
    features: [
      { label: "Default-Deny Policy", desc: "The config format cannot express 'allow by default'" },
      { label: "Human In The Loop", desc: "Tap to approve on Telegram, WhatsApp, or the browser" },
      { label: "Universal Proxy Mode", desc: "Gates any agent with no plugin installed" },
      { label: "Tamper-Evident Log", desc: "Edit one past entry and verification breaks" },
    ]
  },
  {
    id: "crm",
    title: "Construction CRM",
    subtitle: "Flagship Web Build",
    description: "A high-performance management ecosystem for complex construction workflows. Vibe-coded from scratch using AI agents to turn logistics chaos into operational clarity.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    cta: "Launch Live Demo",
    link: "https://brix-pro-agentrive.vercel.app/",
    version: "CRM_DASHBOARD_v3.2",
    metrics: [
      { label: "Active Projects", value: "24", change: "+3" },
      { label: "Budget Health", value: "94%", change: "↑" },
      { label: "On Schedule", value: "87%", change: "+5%" },
      { label: "AI Queries Today", value: "142", change: "OPTIMAL" },
    ],
    features: [
      { label: "AI-Powered Insights", desc: "Natural language queries for instant project intelligence" },
      { label: "Real-Time Tracking", desc: "Live dashboards across all construction phases" },
      { label: "Predictive Analytics", desc: "Anticipate delays and budget overruns before they happen" },
      { label: "Smart Automation", desc: "Automated workflows that eliminate manual reporting" },
    ]
  },
  {
    id: "velora",
    title: "Velora Marketplace",
    subtitle: "Flutter Mobile Build",
    description: "A secure, verified service marketplace mobile app connecting Indian customers with verified service professionals for yoga, massage, companionship, and home care.",
    stack: ["Flutter", "Node.js", "Firebase Auth", "Razorpay Escrow", "AWS"],
    cta: "View Startup Profile",
    link: "https://www.linkedin.com/in/shree-vignesh-m",
    version: "VELORA_MOBILE_v1.0.4",
    metrics: [
      { label: "OTP Login Status", value: "Active", change: "SECURE" },
      { label: "KYC Aadhaar Match", value: "99.8%", change: "PASSED" },
      { label: "Escrow Payments", value: "Razorpay", change: "SHIELD" },
      { label: "Emergency GPS", value: "SOS", change: "LIVE" },
    ],
    features: [
      { label: "Aadhaar + PAN KYC", desc: "Automatic background and face liveness validation" },
      { label: "Razorpay Escrow", desc: "Funds held securely until job verification is complete" },
      { label: "SOS Emergency Shield", desc: "Live location sharing during personal service visits" },
      { label: "Real-Time Admin Console", desc: "Dispute resolution and instant alert routing" },
    ]
  },
  {
    id: "devsecguard",
    title: "DevSecGuard",
    subtitle: "Open Source Tool",
    description: "Automate security audits, secrets detection, and compliance checking in active CI/CD repository pipelines. Built to protect critical code bases from credential leaks and misconfigurations.",
    stack: ["Python", "Shell Scripting", "Docker", "Git Actions", "Security Scanner"],
    cta: "Explore Open Source",
    link: "https://github.com/VickyTarun89/devsecguard",
    version: "DEVSECGUARD_SCAN_v1.2",
    metrics: [
      { label: "Secrets Leak Scan", value: "0 Leaks", change: "PASS" },
      { label: "Vulnerability Check", value: "Secure", change: "100%" },
      { label: "Pipeline Speed", value: "<15s", change: "OPTIMAL" },
      { label: "Compliance Score", value: "SOC-2 Ready", change: "PASS" },
    ],
    features: [
      { label: "Entropy Secrets Scanner", desc: "Scan commits for AWS, Stripe, and private keys" },
      { label: "Docker Image Audits", desc: "Identify base image package vulnerabilities" },
      { label: "CI/CD Gate Integration", desc: "Blocks vulnerable merges before production deployment" },
      { label: "Automated Reports", desc: "Generates HTML audits for security reviews" },
    ]
  }
];

const LiveStats = ({ url }: { url: string }) => {
  const [stats, setStats] = useState<{ total: number; resolved: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const rows: { stats?: { total?: number; resolved?: number } }[] = json?.data;
        if (!Array.isArray(rows)) return;
        const total = rows.reduce((sum, row) => sum + (row.stats?.total ?? 0), 0);
        const resolved = rows.reduce((sum, row) => sum + (row.stats?.resolved ?? 0), 0);
        if (!cancelled && total > 0) setStats({ total, resolved });
      })
      .catch(() => {
        // CORS or network failure — static metrics already cover the card
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-2.5 mb-8 px-4 py-3 border border-green-400/20 bg-green-400/[0.03]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
      <span className="font-display text-[11px] tracking-[0.15em] uppercase text-green-400/90">
        Live: {stats.total} reports filed · {stats.resolved} resolved across Chennai
      </span>
    </div>
  );
};

export const FeaturedProject = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentProject = PROJECTS[activeTab];

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section header */}
        <div className="relative text-center mb-12 z-10">
          {/* Frost layer — softens the wireframe behind the title so the text stays legible */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-3xl bg-background/55 backdrop-blur-md [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)]"
          />
          <span className="font-display text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Shipped &amp; Live
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 text-glow-blue">
            Things I've Built
          </h2>
          <p className="font-body text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto font-light">
            Real products designed, built, and shipped to production — from a live civic platform to an open-source security tool. Tap any build below to explore it.
          </p>
        </div>

        {/* Header Tab Selector */}
        <div className="relative flex flex-wrap justify-center gap-4 mb-16 border-b border-white/5 pb-6">
          {/* Frost layer — keeps the tab labels legible over the wireframe */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-4 bottom-0 -z-10 rounded-2xl bg-background/55 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          />
          {PROJECTS.map((p, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(idx)}
                className="relative px-6 py-3 font-display text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              >
                <span className={isActive ? "text-primary text-glow-blue font-bold" : "text-muted-foreground hover:text-foreground"}>
                  {p.title}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="projectActiveLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary box-glow-blue"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass-tron-card overflow-hidden group mb-8">
              <div className="flex flex-col lg:flex-row">
                
                {/* Project Info */}
                <div className="p-8 lg:p-16 lg:w-1/2 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  {currentProject.image && currentProject.screens && (
                    <img
                      src={currentProject.image}
                      alt={currentProject.imageAlt ?? currentProject.title}
                      className="h-36 sm:h-44 w-auto mb-8 self-start drop-shadow-[0_0_28px_hsl(var(--primary)/0.4)]"
                    />
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-primary/40" />
                    <span className="font-display text-xs tracking-[0.4em] uppercase text-primary">
                      {currentProject.subtitle}
                    </span>
                    {currentProject.live && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 border border-green-400/30 bg-green-400/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-display text-[10px] tracking-[0.2em] uppercase text-green-400">Live</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
                    {currentProject.title}
                  </h3>
                  
                  <p className="font-body text-base sm:text-lg text-muted-foreground/90 mb-8 leading-relaxed font-light">
                    {currentProject.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {currentProject.stack.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[10px] tracking-wider font-display font-semibold border border-primary/20 bg-primary/5 text-primary/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div>
                    <a
                      href={currentProject.link}
                      target={currentProject.link.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3.5 font-display text-xs tracking-[0.25em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-bold box-glow-blue"
                    >
                      {currentProject.cta}
                    </a>
                  </div>
                </div>

                {/* Telemetry Dashboard Mockup */}
                <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center relative overflow-hidden bg-black/20">
                  {/* Scan line effect */}
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
                  
                  {/* Header bar */}
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-pulse-glow" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="ml-4 font-display text-[10px] tracking-wider text-muted-foreground uppercase">
                      {currentProject.version}
                    </span>
                  </div>

                  {/* Real app screenshots */}
                  {currentProject.screens ? (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {currentProject.screens.map((screen, i) => (
                        <motion.div
                          key={screen.src}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="overflow-hidden rounded-lg border border-white/10 bg-black/40 hover:border-primary/40 transition-colors duration-300"
                        >
                          <img
                            src={screen.src}
                            alt={screen.alt}
                            className="w-full aspect-[10/19] object-cover object-top"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : currentProject.image && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex justify-center mb-8"
                    >
                      <img
                        src={currentProject.image}
                        alt={currentProject.imageAlt ?? currentProject.title}
                        className="max-h-48 w-auto drop-shadow-[0_0_25px_hsl(var(--primary)/0.35)]"
                      />
                    </motion.div>
                  )}

                  {/* Live production stats */}
                  {currentProject.liveStatsUrl && <LiveStats url={currentProject.liveStatsUrl} />}

                  {/* Telemetry metrics grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {currentProject.metrics.map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="p-4 border border-white/5 bg-white/[0.01]"
                      >
                        <div className="font-display text-xl sm:text-2xl font-bold text-primary text-glow-blue mb-1">
                          {metric.value}
                        </div>
                        <div className="font-body text-xs text-muted-foreground/75 tracking-wider uppercase mb-1">
                          {metric.label}
                        </div>
                        <div className="font-body text-[10px] text-accent/80 tracking-wider">
                          {metric.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Project specific features list */}
                  <div className="flex flex-col gap-4">
                    {currentProject.features.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex items-start gap-3 p-3 border border-white/5 bg-white/[0.01]"
                      >
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary box-glow-blue shrink-0" />
                        <div>
                          <div className="font-display text-xs font-semibold text-foreground tracking-wider uppercase mb-1">
                            {f.label}
                          </div>
                          <div className="font-body text-xs text-muted-foreground leading-relaxed">
                            {f.desc}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default FeaturedProject;
