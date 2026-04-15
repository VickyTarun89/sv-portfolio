import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const skills = [
  {
    title: "System Thinking",
    desc: "Architecting interconnected solutions across engineering, operations, and technical domains.",
    icon: "◆",
    status: "ACTIVE",
  },
  {
    title: "AI Workflows",
    desc: "Building with LLMs, n8n automation, and intelligent RAG-powered systems.",
    icon: "◈",
    status: "ONLINE",
  },
  {
    title: "Rapid Prototyping",
    desc: "Turning multi-industry pattern recognition into functional SaaS products at high velocity.",
    icon: "▲",
    status: "READY",
  },
  {
    title: "Frontend Experience",
    desc: "Implementing premium, high-performance interfaces using modern React and UI frameworks.",
    icon: "◇",
    status: "DEPLOYED",
  },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -30]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 flex items-center">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <motion.div
          style={{ y: headerY }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-display text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
              System Modules
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Capabilities
            </h2>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="group relative glass-tron-card p-10 transition-all duration-500 cursor-default overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-3xl text-primary transition-all">
                  {skill.icon}
                </span>
                <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                  SYSTEM::{skill.status}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {skill.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {skill.desc}
              </p>

              {/* Bottom accent glow */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/70 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
