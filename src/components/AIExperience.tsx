import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Campaign {
  name: string;
  query: string;
  logs: string[];
}

const CAMPAIGNS: Campaign[] = [
  {
    name: "D2C E-Commerce // India",
    query: "Run Campaign: D2C E-commerce (India)",
    logs: [
      "Initializing LangGraph pipeline (Prospector -> Qualifier -> Copywriter)...",
      "[PROSPECTOR] Searching Indian retail space... found 14 high-volume D2C websites.",
      "[QUALIFIER] Analyzing tech stacks, traffic profiles, and Shopify signatures.",
      "[QUALIFIER] Qualified prospects: 9 targets match ICP with score > 8.5/10.",
      "[COPYWRITER] Writing personalized outbound pitch drafts outlining landing page friction.",
      "Campaign complete: 9 personalized pitches exported. Stack: FastAPI + Next.js."
    ]
  },
  {
    name: "B2B SaaS // US",
    query: "Run Campaign: B2B SaaS (US)",
    logs: [
      "Initializing LangGraph pipeline (Prospector -> Qualifier -> Copywriter)...",
      "[PROSPECTOR] Scanning active US startup lists... identified 8 B2B SaaS targets.",
      "[QUALIFIER] Resolving decision-maker profiles (Founder, VP Marketing, Head of Growth).",
      "[QUALIFIER] Scored leads: 5 prospects verified with valid outbound channels.",
      "[COPYWRITER] Writing custom value propositions based on active hiring lists.",
      "Sequence queued: 5 customized pitch drafts ready. Infrastructure: Railway + Vercel."
    ]
  }
];

export const AIExperience = () => {
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const terminalY = useTransform(scrollYProgress, [0, 1], [80, -20]);

  // Restart logging animation whenever campaign is changed
  useEffect(() => {
    setVisibleLogs([]);
    setCurrentLineIndex(0);
    setIsTyping(true);
  }, [activeCampaign]);

  // Sequentially display log lines
  useEffect(() => {
    if (!isTyping) return;
    
    const logs = CAMPAIGNS[activeCampaign].logs;
    if (currentLineIndex < logs.length) {
      const timer = setTimeout(() => {
        setVisibleLogs(prev => [...prev, logs[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, 700); // Add a new log line every 700ms
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, activeCampaign, isTyping]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
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
              AI Agents Lab
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              B2B LeadGen Engine
            </h2>
          </motion.div>
        </motion.div>

        {/* Terminal Wrapper */}
        <motion.div
          style={{ y: terminalY }}
          className="glass-tron-card overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-3 font-display text-[10px] tracking-widest text-muted-foreground uppercase">
                  AG_LEADGEN // v2.1
                </span>
              </div>
              <div className="text-[9px] tracking-wider font-mono text-primary/60">
                PIPELINE: PROSPECTOR &rarr; QUALIFIER &rarr; COPYWRITER
              </div>
            </div>

            {/* Campaign Selection Tabs */}
            <div className="flex border-b border-white/5 bg-black/10">
              {CAMPAIGNS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (activeCampaign !== i) {
                      setActiveCampaign(i);
                    }
                  }}
                  className={`flex-1 px-4 py-4 font-display text-xs tracking-wider transition-all duration-300 ${
                    activeCampaign === i
                      ? "text-primary border-b-2 border-primary bg-primary/5 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Console Log Area */}
            <div className="p-8 min-h-[220px] font-mono text-xs sm:text-sm text-foreground bg-black/30">
              <div className="text-muted-foreground/60 mb-4 tracking-wider">
                &gt; {CAMPAIGNS[activeCampaign].query}
              </div>
              
              <div className="flex flex-col gap-2.5">
                {visibleLogs.map((log, idx) => {
                  const isSystemLog = log.startsWith("[SYSTEM]") || log.startsWith("Sequence queued") || log.startsWith("Campaign complete");
                  const isProspector = log.startsWith("[PROSPECTOR]");
                  const isQualifier = log.startsWith("[QUALIFIER]");
                  const isCopywriter = log.startsWith("[COPYWRITER]");
                  
                  let textColor = "text-foreground";
                  if (isSystemLog) textColor = "text-accent font-bold";
                  else if (isProspector) textColor = "text-primary/90";
                  else if (isQualifier) textColor = "text-[#8A2BE2]/90"; // Purple for qualifier
                  else if (isCopywriter) textColor = "text-glow-blue text-primary";

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${textColor} leading-relaxed`}
                    >
                      {log}
                    </motion.div>
                  );
                })}

                {/* Blinking cursor at the active streaming line */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-primary text-glow-blue animate-pulse mt-1">
                    <span>EXECUTION IN PROGRESS</span>
                    <span className="w-1.5 h-3.5 bg-primary" />
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIExperience;
