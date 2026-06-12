import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";

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
    description: "The Singularity — shipping live products like NammaOoru, Chennai's anonymous civic reporting platform, and building intelligence systems that turn chaos into clarity.",
    icon: "🤖",
  },
];

const CARD_ANGLE = 360 / phases.length;
const WHEEL_RADIUS = 420;

const StoryTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spin the wheel one card per scroll step so each phase lands front-center
  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -CARD_ANGLE * (phases.length - 1)]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.round(v * (phases.length - 1));
    setActive(Math.min(phases.length - 1, Math.max(0, idx)));
  });

  const jumpTo = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + (scrollable * idx) / (phases.length - 1),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative"
      style={{ height: `${phases.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Section header */}
        <div className="text-center mb-12 relative z-10">
          <span className="font-display text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Race Log
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The Journey
          </h2>
        </div>

        {/* 3D roulette wheel */}
        <div
          className="relative w-full max-w-5xl h-[360px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="relative w-[320px] h-[340px]"
            style={{ rotateY, transformStyle: "preserve-3d" }}
          >
            {phases.map((phase, i) => {
              const isActive = i === active;
              return (
                <div
                  key={phase.id}
                  className={`absolute inset-0 glass-tron-card p-8 flex flex-col justify-center transition-[opacity,border-color] duration-500 ${
                    isActive
                      ? "opacity-100 border-primary/40 box-glow-blue"
                      : "opacity-20 pointer-events-none"
                  }`}
                  style={{
                    transform: `rotateY(${i * CARD_ANGLE}deg) translateZ(${WHEEL_RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{phase.icon}</span>
                    <span className="font-display text-[10px] tracking-[0.3em] text-primary/70 uppercase">
                      {phase.year}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {phase.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-6 mt-12 relative z-10">
          <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground uppercase tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
          </span>
          <div className="flex gap-3">
            {phases.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => jumpTo(i)}
                aria-label={`Go to ${phase.title}`}
                className={`h-1.5 transition-all duration-300 ${
                  i === active
                    ? "w-8 bg-primary box-glow-blue"
                    : "w-3 bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryTimeline;
