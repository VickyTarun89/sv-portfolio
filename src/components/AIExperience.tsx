import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const prompts = [
  { query: "Which project is delayed?", response: "→ Riverside Tower — 12 days behind schedule. Root cause: concrete supplier delay." },
  { query: "Where are we overspending?", response: "→ Phase 3 electrical at 118% budget. Recommend: renegotiate subcontractor terms." },
  { query: "Top performing client?", response: "→ Meridian Corp — 6 projects, 98% on-time, $4.2M lifetime value." },
];

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [started, text]);

  return <span>{displayed}<span className="animate-pulse-glow text-primary">|</span></span>;
};

const AIExperience = () => {
  const [activePrompt, setActivePrompt] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const terminalY = useTransform(scrollYProgress, [0, 1], [80, -20]);

  useEffect(() => {
    setShowResponse(false);
    const timer = setTimeout(() => setShowResponse(true), 800);
    return () => clearTimeout(timer);
  }, [activePrompt]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePrompt((prev) => (prev + 1) % prompts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
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
              AI Interface
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Talk to Your Data
            </h2>
          </motion.div>
        </motion.div>

        {/* Terminal with parallax */}
        <motion.div
          style={{ y: terminalY }}
          className="glass-tron-card overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="ml-3 font-display text-[10px] tracking-widest text-muted-foreground uppercase">
                SV_AI_ENGINE // v4.0
              </span>
            </div>

            {/* Prompt tabs */}
            <div className="flex border-b border-white/5">
              {prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePrompt(i)}
                  className={`flex-1 px-4 py-4 font-body text-sm transition-all duration-300 ${
                    activePrompt === i
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                  }`}
                >
                  {p.query}
                </button>
              ))}
            </div>

            {/* Response area */}
            <div className="p-8 min-h-[120px]">
              <div className="font-body text-sm text-muted-foreground mb-2">
                &gt; {prompts[activePrompt].query}
              </div>
              {showResponse && (
                <div className="font-body text-lg text-foreground">
                  <TypingText
                    key={activePrompt}
                    text={prompts[activePrompt].response}
                    delay={300}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIExperience;
