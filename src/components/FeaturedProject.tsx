import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  { label: "AI-Powered Insights", desc: "Natural language queries for instant project intelligence" },
  { label: "Real-Time Tracking", desc: "Live dashboards across all construction phases" },
  { label: "Predictive Analytics", desc: "Anticipate delays and budget overruns before they happen" },
  { label: "Smart Automation", desc: "Automated workflows that eliminate manual reporting" },
];

const FeaturedProject = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [100, -20]);
  const dashboardScale = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.92, 1, 1]);

  return (
    <section ref={sectionRef} id="featured" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-tron-card overflow-hidden group"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Project Info */}
            <div className="p-8 lg:p-16 lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary/40" />
                <span className="font-display text-xs tracking-[0.4em] uppercase text-primary">
                  Flagship Build
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                Construction <br />
                <span className="text-primary text-glow-blue">Intelligence CRM</span>
              </h3>
              <p className="font-body text-lg text-muted-foreground/90 mb-10 leading-relaxed font-light">
                A high-performance management ecosystem for complex construction workflows. Vibe-coded from scratch using AI agents to turn logistics chaos into operational clarity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard mockup with parallax */}
        <motion.div
          style={{ y: dashboardY, scale: dashboardScale }}
          className="relative glass-tron-card p-8 mb-12 overflow-hidden"
        >
          {/* Scan line effect */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan-line" />
          
          {/* Header bar */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
            <div className="w-3 h-3 rounded-full bg-primary/60" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <span className="ml-4 font-display text-xs tracking-wider text-muted-foreground">
              CRM_DASHBOARD_v3.2
            </span>
          </div>

          {/* Mock metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Projects", value: "24", change: "+3" },
              { label: "Budget Health", value: "94%", change: "↑" },
              { label: "On Schedule", value: "87%", change: "+5%" },
              { label: "AI Queries Today", value: "142", change: "" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 border border-border/20 bg-secondary/50"
              >
                <div className="font-display text-2xl font-bold text-primary">{metric.value}</div>
                <div className="font-body text-sm text-muted-foreground">{metric.label}</div>
                {metric.change && (
                  <div className="font-body text-xs text-accent mt-1">{metric.change}</div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Feature list */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-3"
              >
                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <div className="font-display text-sm font-semibold text-foreground">{f.label}</div>
                  <div className="font-body text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://brix-pro-agentrive.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 font-display text-sm tracking-wider uppercase bg-accent text-accent-foreground hover:shadow-[0_0_30px_hsl(var(--neon-orange)/0.4)] transition-all duration-300"
          >
            Launch Live Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProject;
