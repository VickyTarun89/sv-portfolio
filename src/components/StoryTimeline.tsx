import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, lazy, Suspense } from "react";

const WireframeCanvas = lazy(() => import("./wireframes/WireframeCanvas"));

const phases = [
  {
    id: 1,
    year: "Phase 01",
    title: "Aeronautical Engineering",
    description: "Advanced fighter systems — where precision and aeronautical engineering began with the Jaguar project.",
    icon: "🛩",
  },
  {
    id: 2,
    year: "Phase 02",
    title: "The US Journey",
    description: "Masters degree, setbacks, and the resilience forged through dropping out and hustling in gas stations & restaurants.",
    icon: "🇺🇸",
  },
  {
    id: 3,
    year: "Phase 03",
    title: "Manufacturing & Leadership",
    description: "BMU manufacturing supervisor — scaling operations and leading teams on the ground.",
    icon: "🔧",
  },
  {
    id: 4,
    year: "Phase 04",
    title: "Multi-Domain Hustler",
    description: "Call centers (McAfee, Expedia, Dell), HR, Real Estate, E-commerce — cross-industry pattern recognition.",
    icon: "💼",
  },
  {
    id: 5,
    year: "Phase 05",
    title: "AI + SaaS Builder",
    description: "The Singularity — building tactical intelligence systems and neural architectures that turn chaos into clarity.",
    icon: "🤖",
  },
];

const StoryTimeline = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const lineScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={sectionRef} id="work" className="relative py-32 px-6 overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--neon-blue)/0.03),transparent_60%)]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
      />

      {/* 3D Wireframe holographic backdrop */}
      <Suspense fallback={null}>
        <WireframeCanvas activePhase={activePhase} />
      </Suspense>

      {/* Section header with parallax */}
      <motion.div
        style={{ y: headerY }}
        className="text-center mb-20 max-w-3xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-display text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Race Log
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The Journey
          </h2>
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Central line with parallax scale */}
        <motion.div
          className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent origin-top"
          style={{ scaleY: lineScale }}
        />

        {phases.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 60 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex items-start mb-16 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } flex-row`}
            onMouseEnter={() => setActivePhase(phase.id)}
            onMouseLeave={() => setActivePhase(null)}
          >
            {/* Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  activePhase === phase.id
                    ? "border-primary bg-primary box-glow-blue scale-150"
                    : "border-primary/40 bg-background"
                }`}
              />
            </div>

            {/* Content card */}
            <div
              className={`ml-20 md:ml-0 ${
                i % 2 === 0 ? "md:mr-auto md:pr-16 md:w-1/2 md:text-right" : "md:ml-auto md:pl-16 md:w-1/2"
              }`}
            >
              <div
                className={`p-6 transition-all duration-300 cursor-default glass-tron-card ${
                  activePhase === phase.id
                    ? "border-primary/40 box-glow-blue scale-[1.02]"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <span className="font-display text-[10px] tracking-[0.3em] text-primary/70 uppercase">
                    {phase.year}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {phase.title}
                </h3>
                <motion.p
                  animate={{
                    height: activePhase === phase.id ? "auto" : "0",
                    opacity: activePhase === phase.id ? 1 : 0,
                    marginTop: activePhase === phase.id ? "1rem" : "0"
                  }}
                  className="font-body text-muted-foreground overflow-hidden text-sm leading-relaxed"
                >
                  {phase.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StoryTimeline;
