import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
}

const PROJECTS: Project[] = [
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

export const FeaturedProject = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentProject = PROJECTS[activeTab];

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Tab Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-white/5 pb-6">
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
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-primary/40" />
                    <span className="font-display text-xs tracking-[0.4em] uppercase text-primary">
                      {currentProject.subtitle}
                    </span>
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
