import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useVelocity,
  useSpring,
  MotionValue,
} from "framer-motion";
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

// Long-exposure style light streaks, ignited by scroll velocity
const TRAILS = [
  { top: "12%", width: "55%", left: "-10%", color: "hsl(var(--neon-blue) / 0.9)", height: 2, tilt: -3, delayFactor: 1.0 },
  { top: "22%", width: "70%", left: "40%", color: "hsl(28 100% 60% / 0.75)", height: 1.5, tilt: -1.5, delayFactor: 0.7 },
  { top: "35%", width: "45%", left: "-5%", color: "hsl(320 90% 65% / 0.6)", height: 1, tilt: 2, delayFactor: 1.3 },
  { top: "48%", width: "80%", left: "25%", color: "hsl(var(--neon-blue) / 0.7)", height: 2.5, tilt: 0, delayFactor: 0.85 },
  { top: "61%", width: "60%", left: "-15%", color: "hsl(45 100% 62% / 0.7)", height: 1.5, tilt: 1.5, delayFactor: 1.15 },
  { top: "73%", width: "50%", left: "55%", color: "hsl(320 90% 65% / 0.55)", height: 1, tilt: -2, delayFactor: 0.6 },
  { top: "84%", width: "75%", left: "5%", color: "hsl(28 100% 60% / 0.6)", height: 2, tilt: 3, delayFactor: 1.4 },
];

const LightTrail = ({
  trail,
  intensity,
}: {
  trail: (typeof TRAILS)[number];
  intensity: MotionValue<number>;
}) => {
  const opacity = useTransform(intensity, [0, 1], [0, 1]);
  const scaleX = useTransform(intensity, [0, 1], [0.1, 1 * trail.delayFactor]);
  const x = useTransform(intensity, [0, 1], [0, trail.delayFactor > 1 ? 60 : -60]);

  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full"
      style={{
        top: trail.top,
        left: trail.left,
        width: trail.width,
        height: trail.height,
        rotate: trail.tilt,
        opacity,
        scaleX,
        x,
        background: `linear-gradient(90deg, transparent, ${trail.color}, transparent)`,
        boxShadow: `0 0 12px ${trail.color}`,
        filter: "blur(0.5px)",
      }}
    />
  );
};

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

  // Trail intensity follows scroll speed: ignites while spinning, fades at rest
  const scrollVelocity = useVelocity(scrollYProgress);
  const trailIntensity = useSpring(
    useTransform(scrollVelocity, (v) => Math.min(1, Math.abs(v) * 4)),
    { stiffness: 120, damping: 28 }
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
          {/* Velocity-reactive light trails */}
          <div className="absolute inset-x-0 -inset-y-12 pointer-events-none overflow-hidden">
            {TRAILS.map((trail, i) => (
              <LightTrail key={i} trail={trail} intensity={trailIntensity} />
            ))}
          </div>

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
