import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/*
  The hero's AI-generated concept clip. Two cuts (16:9 desktop, 9:16 phone);
  only the one whose media query matches is mounted, so a phone never
  downloads the wide file. Reduced-motion users get the still frame.
*/

const VARIANTS = {
  wide: { query: "(min-width: 1024px)", src: "/robotics/hero-wide.mp4", poster: "/robotics/hero-wide.jpg" },
  tall: { query: "(max-width: 1023.98px)", src: "/robotics/hero-tall.mp4", poster: "/robotics/hero-tall.jpg" },
} as const;

const useMedia = (query: string) => {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
};

const HeroVideo = ({ variant, className }: { variant: keyof typeof VARIANTS; className?: string }) => {
  const v = VARIANTS[variant];
  const active = useMedia(v.query);
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  if (!active) return null;

  return reduce ? (
    <img src={v.poster} alt="" aria-hidden className={cn("h-full w-full object-cover", className)} />
  ) : (
    <video
      src={v.src}
      poster={v.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      className={cn("h-full w-full object-cover", className)}
    />
  );
};

export default HeroVideo;
