import { motion } from "framer-motion";
import { Suspense } from "react";
import { useIsLinkedInApp } from "@/hooks/useIsLinkedInApp";

// Lazy load the heavy 3D component to prevent LinkedIn webview crashes


const HeroSection = () => {
  const isLinkedIn = useIsLinkedInApp();

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-transparent" aria-label="Hero">
      <h2 className="sr-only">
        SaaS Development, AI Software Services, and Custom CRM Engineering by M. Shree Vignesh
      </h2>
      {/* Brand Header */}
      <div className="absolute top-8 right-8 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-end"
        >
          <span className="font-display text-sm tracking-[0.5em] text-primary uppercase">
            M. Shree Vignesh
          </span>
          <div className="w-12 h-px bg-primary/40 mt-1" />
        </motion.div>
      </div>



      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,15,0.4)_100%)] z-10 pointer-events-none" />

      {/* Content container */}
      <div className="relative z-20 h-full flex items-center justify-center px-6 max-w-5xl mx-auto text-center">
        <motion.div className="relative">
          {/* Soft backdrop blur behind text for legibility over globe */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-8 -inset-y-12 sm:-inset-x-16 sm:-inset-y-16 backdrop-blur-[6px] pointer-events-none rounded-[3rem] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_88%)]"
          />
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative flex items-center justify-center gap-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-body text-xs tracking-[0.4em] uppercase text-primary/80">
              Systems Online
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative font-display text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 text-foreground"
          >
            I build systems that turn{" "}
            <span className="text-accent text-glow-orange">chaos</span> into{" "}
            <span className="text-primary text-glow-blue">clarity</span>.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="relative font-body text-lg sm:text-xl lg:text-2xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 font-light"
          >
            SaaS products, AI software services, and custom CRM systems — engineered with aerospace-grade rigor.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://brix-pro-agentrive.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-4 font-display text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 box-glow-blue"
            >
              <span className="relative z-10 font-bold">Try Live CRM</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
