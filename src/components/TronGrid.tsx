import { useEffect, useState, useRef } from "react";
import frame1 from "@/assets/hero-frame-1.jpg";
import frame2 from "@/assets/hero-frame-2.jpg";
import frame3 from "@/assets/hero-frame-3.jpg";
import frame4 from "@/assets/hero-frame-4.jpg";

const frames = [frame1, frame2, frame3, frame4];

const TronGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = containerRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      // Progress from 0 (top of section in view) to 1 (bottom of section leaving)
      const scrolled = -rect.top;
      const total = sectionHeight - viewportH;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(total, 1)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map scroll progress to frame index + blend
  const totalFrames = frames.length;
  const position = scrollProgress * (totalFrames - 1);
  const currentFrame = Math.min(Math.floor(position), totalFrames - 2);
  const nextFrame = currentFrame + 1;
  const blend = position - currentFrame;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {frames.map((src, i) => {
        let opacity = 0;
        if (i === currentFrame) {
          opacity = 1 - blend;
        } else if (i === nextFrame) {
          opacity = blend;
        } else if (i < currentFrame) {
          opacity = 0;
        } else if (i === totalFrames - 1 && scrollProgress >= 1) {
          opacity = 1;
        }

        return (
          <img
            key={i}
            src={src}
            alt=""
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity,
              transition: "opacity 0.05s linear",
            }}
          />
        );
      })}
    </div>
  );
};

export default TronGrid;
