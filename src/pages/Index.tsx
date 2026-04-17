import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import StoryTimeline from "@/components/StoryTimeline";
import FeaturedProject from "@/components/FeaturedProject";
import AIExperience from "@/components/AIExperience";
import SkillsSection from "@/components/SkillsSection";
import PhilosophySection from "@/components/PhilosophySection";
import FutureVision from "@/components/FutureVision";
import ContactSection from "@/components/ContactSection";
import { useIsLinkedInApp } from "@/hooks/useIsLinkedInApp";

const Index = () => {
  const isLinkedIn = useIsLinkedInApp();
  const matrixSectionsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // Track continuous scroll for the entire Matrix block
  const { scrollYProgress: blockProgress } = useScroll({
    target: matrixSectionsRef,
    offset: ["start end", "end start"]
  });

  // Track the specific exit transition at the Connect section
  const { scrollYProgress: exitProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "start center"]
  });

  // Entry and Exit transforms for Matrix
  const entryOpacity = useTransform(blockProgress, [0, 0.1], [0, 1]);
  const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0]);
  const matrixOpacityCombined = useTransform(
    [entryOpacity, exitOpacity],
    ([entry, exit]) => entry * exit
  );

  return (
    <main className="bg-background min-h-screen overflow-x-hidden scroll-smooth selection:bg-primary/20 selection:text-primary relative">
      {/* Persistent Background Grid (Global) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute inset-0 bg-tron-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-80" />
      </div>

      {/* Global Matrix Rain Background Layer - Disabled for LinkedIn to prevent crash */}
      {!isLinkedIn && (
        <motion.div 
          style={{ 
            opacity: matrixOpacityCombined,
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
          className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        >
          <MatrixRain opacity={0.3} />
        </motion.div>
      )}

      <div className="relative z-20 w-full">
        <HeroSection />
        <StoryTimeline />
        <FeaturedProject />
        
        {/* Continuous Matrix Block */}
        <div ref={matrixSectionsRef} className="relative w-full">
          <AIExperience />
          <div id="capabilities">
            <SkillsSection />
          </div>
          <PhilosophySection />
          <FutureVision />
          <div ref={contactRef}>
            <ContactSection />
          </div>
        </div>
      </div>
    </main>
  );
};


export default Index;


