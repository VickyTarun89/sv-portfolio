import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import StoryTimeline from "@/components/StoryTimeline";
import FeaturedProject from "@/components/FeaturedProject";
import AIExperience from "@/components/AIExperience";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import { useIsLinkedInApp } from "@/hooks/useIsLinkedInApp";
import HudNavigation from "@/components/HudNavigation";

// Lazy load heavy canvas components (keeps three.js out of the initial bundle)
const Unified3DScene = lazy(() => import("@/components/3d/Unified3DScene"));
const MatrixRain = lazy(() => import("@/components/MatrixRain"));

const Index = () => {
  const isLinkedIn = useIsLinkedInApp();
  const matrixSectionsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const buildsRef = useRef<HTMLDivElement>(null);

  // Global scroll progress for 3D camera transitions
  const { scrollYProgress } = useScroll();

  // Track continuous scroll for the entire Matrix block
  const { scrollYProgress: blockProgress } = useScroll({
    target: matrixSectionsRef,
    offset: ["start end", "end start"]
  });

  // Journey section progress — used to spin the globe up while in view
  const { scrollYProgress: journeyRaw } = useScroll({
    target: journeyRef,
    offset: ["start end", "end start"]
  });

  // Builds section progress — used to sink the globe toward the grid floor
  const { scrollYProgress: buildsRaw } = useScroll({
    target: buildsRef,
    offset: ["start end", "end start"]
  });

  // Track the specific exit transition at the Connect section
  const { scrollYProgress: exitProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "start center"]
  });

  // Grid + globe fade-out driver: stays fully visible through Hero, Journey and
  // Builds, then fades out only as the Matrix (agents) block takes over.
  const gridFadeProgress = useTransform(blockProgress, [0, 0.2], [0, 1]);

  // Spin boost — ramps up as the Journey enters, holds fast through it, eases off
  const globeSpinBoost = useTransform(journeyRaw, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Descent — globe sinks toward the grid floor across the Builds section so the
  // grid's bottom edge becomes the launch point for the Matrix rain.
  const globeDescent = useTransform(buildsRaw, [0.35, 0.9], [0, 1]);

  // Entry and Exit transforms for Matrix
  const entryOpacity = useTransform(blockProgress, [0, 0.25], [0, 1]);
  const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0]);
  const matrixOpacityCombined = useTransform(
    [entryOpacity, exitOpacity],
    ([entry, exit]) => entry * exit
  );

  return (
    <main className="min-h-screen overflow-x-clip scroll-smooth selection:bg-primary/20 selection:text-primary relative bg-transparent">
      {/* Global 3D Scroll Linked Background */}
      {!isLinkedIn && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>
            <Unified3DScene
              scrollYProgress={scrollYProgress}
              fadeProgress={gridFadeProgress}
              spinBoost={globeSpinBoost}
              descentProgress={globeDescent}
            />
          </Suspense>
        </div>
      )}

      {/* Persistent Background Grid (Global) - Above the 3D canvas but behind text */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute inset-0 bg-tron-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-70" />
      </div>

      {/* HUD Navigation Sidebar */}
      <HudNavigation />

      {/* Global Matrix Rain Background Layer - Disabled for LinkedIn to prevent crash */}
      {!isLinkedIn && (
        <Suspense fallback={null}>
          <motion.div 
            style={{ 
              opacity: matrixOpacityCombined,
              maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
            }}
            className="fixed inset-0 pointer-events-none z-15 overflow-hidden"
          >
            <MatrixRain opacity={0.55} />
          </motion.div>
        </Suspense>
      )}

      <div className="relative z-20 w-full">
        <div id="hero">
          <HeroSection />
        </div>
        <div id="work" ref={journeyRef}>
          <StoryTimeline />
        </div>
        <div id="projects" ref={buildsRef}>
          <FeaturedProject />
        </div>
        
        {/* Continuous Matrix Block */}
        <div ref={matrixSectionsRef} className="relative w-full">
          <div id="agents">
            <AIExperience />
          </div>
          <div id="capabilities">
            <SkillsSection />
          </div>
          <div ref={contactRef} id="connect">
            <ContactSection />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
