import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "01 // ORIGIN" },
  { id: "work", label: "02 // JOURNEY" },
  { id: "projects", label: "03 // BUILDS" },
  { id: "agents", label: "04 // AGENTS" },
  { id: "capabilities", label: "05 // TECH" },
  { id: "connect", label: "06 // VOID" },
];

export const HudNavigation = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    // Track scroll depth smoothly in state for telemetry
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollDepth(latest * 100);
    });

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({
        x: Number(((e.clientX / window.innerWidth) * 100).toFixed(2)),
        y: Number(((e.clientY / window.innerHeight) * 100).toFixed(2)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Detect when section is in the view center
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [scrollYProgress]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HUD Sidebar Timeline */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-6 font-display select-none pointer-events-auto">
        <div className="relative pl-6">
          {/* Vertical line tracker */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10">
            {/* Sliding neon bead */}
            <motion.div
              style={{
                top: `${scrollDepth}%`,
                y: "-50%",
              }}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary box-glow-blue"
            />
          </div>

          <div className="flex flex-col gap-6">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="flex items-center text-left group text-[10px] tracking-[0.25em] transition-all duration-300"
                >
                  <span
                    className={`transition-colors duration-300 font-bold ${
                      isActive
                        ? "text-primary text-glow-blue"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    }`}
                  >
                    {sec.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="ml-2 text-primary font-bold animate-pulse text-[8px]"
                    >
                      ▲
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* High-Tech Telemetry Diagnostics Overlay */}
      <div className="fixed bottom-6 left-8 z-40 hidden xl:flex flex-col gap-1 text-[9px] tracking-[0.3em] font-mono text-primary/40 pointer-events-none select-none">
        <div>SYS_STATUS // ACTIVE</div>
        <div>SYS_COORD_X // {coords.x}%</div>
        <div>SYS_COORD_Y // {coords.y}%</div>
        <div>SYS_DEPTH_Z // {scrollDepth.toFixed(1)}%</div>
      </div>
    </>
  );
};

export default HudNavigation;
