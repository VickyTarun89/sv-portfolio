import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HERO_STATS } from "@/data/portfolio";
import HeroVideo from "./HeroVideo";
import { Container } from "./primitives";

// ArmScene.tsx (the in-browser 3D twin) is kept but not mounted; swap it back here if wanted.

const CHIPS = ["AI + classical engines", "Any TCP-capable arm", "Low-cost RealSense depth", "Runs on CPU", "Offline", "EN / தமிழ்"];

const VideoLabel = () => (
  <span className="pointer-events-none absolute bottom-4 right-4 lg:bottom-auto lg:right-8 lg:top-24 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
    AI-generated concept
  </span>
);

const Hero = () => {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="tone-dark relative overflow-hidden" aria-label="Introduction">
      <div className="bg-blueprint fade-edges pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />

      {/* desktop: the wide clip fills the right side and fades into the copy */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <HeroVideo
          variant="wide"
          className="[mask-image:linear-gradient(to_right,transparent,black_38%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_80%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(to_right,transparent,black_38%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_80%,transparent)]"
        />
        <VideoLabel />
      </div>

      <Container className="grid min-h-[100svh] items-center gap-6 pb-14 pt-24 lg:grid-cols-[1.05fr_1fr] lg:pb-20">
        <div className="relative z-10">
          <motion.div {...rise(0.05)} className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="eyebrow">Physical AI · Chennai, India</span>
          </motion.div>

          <motion.h1
            {...rise(0.15)}
            className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[4.4rem]"
          >
            Robots that see,
            <br />
            decide and <span className="text-primary">pick</span>.
          </motion.h1>

          <motion.p {...rise(0.25)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            I build the software layer for industrial robots — 3D bin picking, AI visual inspection, operator HMIs and
            digital twins — for the arm you already own, on a PC you already have. Built for Indian shop floors.
          </motion.p>

          <motion.div {...rise(0.35)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#reels"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              <Play size={16} className="fill-current" />
              Watch it work
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-6 py-3 text-sm font-medium transition hover:border-foreground/40"
            >
              Discuss your line
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.ul {...rise(0.45)} className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* phone / tablet: the tall clip sits under the copy */}
        <div className="relative -mx-4 aspect-[9/13] max-h-[640px] overflow-hidden sm:mx-auto sm:w-full sm:max-w-md sm:rounded-2xl lg:hidden">
          <HeroVideo
            variant="tall"
            className="[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)]"
          />
          <VideoLabel />
        </div>
      </Container>

      {/* measured numbers */}
      <div className="relative border-t border-border">
        <Container className="grid grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`py-7 pr-4 sm:py-9 ${i % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-border lg:pl-6" : ""} ${i === 1 ? "border-l border-border" : ""} ${i === 3 ? "border-l border-border" : ""} ${i < 2 ? "border-b border-border lg:border-b-0" : ""}`}
            >
              <div className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</div>
              <div className="mt-2 text-sm leading-snug text-foreground/85">{s.label}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.note}</div>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
};

export default Hero;
