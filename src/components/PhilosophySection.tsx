import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="relative py-40 px-6 overflow-hidden flex items-center">
      <motion.div
        style={{ y: textY }}
        className="max-w-4xl mx-auto text-center relative z-10 w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-tron-card p-12 sm:p-20 relative overflow-hidden"
        >
          {/* Subtle decorative grid overlay inside glass */}
          <div className="absolute inset-0 bg-tron-grid opacity-10 pointer-events-none" />

          <span className="font-display text-xs tracking-[0.4em] uppercase text-primary/50 mb-12 block">
            Core Philosophy
          </span>
          <blockquote className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block mb-6"
            >
              I’m not the fastest learner.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="block text-primary text-glow-blue"
            >
              But I don’t stop iterating.
            </motion.span>
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PhilosophySection;
