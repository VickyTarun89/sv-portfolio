import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FutureVision = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const cornersScale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 min-h-[80vh] flex items-center">
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <motion.div
          style={{ y: cardY, scale: cornersScale }}
          className="border border-accent/20 bg-card/30 p-12 sm:p-16 text-center relative overflow-hidden"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-display text-xs tracking-[0.4em] uppercase text-accent mb-8 block">
              Mission
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-relaxed">
              I'm building AI-powered systems for industries that still run on{" "}
              <span className="text-accent text-glow-orange">chaos</span>.
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureVision;
