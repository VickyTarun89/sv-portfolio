import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { CONCEPT_REEL, GALLERY, REELS, type Reel } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

const ReelCard = ({ reel, portrait }: { reel: Reel; portrait?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // play only while on screen; respect reduced motion and a manual pause
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reel.src) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce && !userPaused) {
          v.play().catch(() => setPlaying(false));
        } else {
          v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reel.src, userPaused]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("relative overflow-hidden bg-black", portrait ? "aspect-[9/14]" : "aspect-video")}>
        {reel.src && !failed ? (
          <video
            ref={videoRef}
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            aria-label={reel.title}
          />
        ) : (
          <img src={reel.poster} alt={reel.title} className="h-full w-full object-cover" loading="lazy" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
          {reel.kind}
        </span>
        {reel.src && !failed && (
          <button
            type="button"
            onClick={toggle}
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
            aria-label={playing ? `Pause ${reel.title}` : `Play ${reel.title}`}
          >
            {playing ? <Pause size={15} /> : <Play size={15} className="fill-current" />}
          </button>
        )}
      </div>
      <figcaption className="p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold">{reel.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{reel.caption}</p>
      </figcaption>
    </figure>
  );
};

const Reels = () => (
  <Section id="reels" tone="dark" label="Reels" className="py-24 sm:py-32">
    <Container>
      <SectionHeading
        eyebrow="Simulation → real world"
        title="Proven in the twin. Checked on real frames."
        lede="Every pick is rehearsed on a virtual robot controller before steel moves, and every vision claim is measured on real depth-camera frames — star gears, hydraulic fittings, mixed fasteners."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {REELS.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.08}>
            <ReelCard reel={r} />
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.75fr_1.25fr] lg:grid-cols-[0.6fr_1.4fr]">
        <Reveal>
          <ReelCard reel={CONCEPT_REEL} portrait />
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="grid h-full grid-cols-2 gap-3 sm:gap-5">
            {GALLERY.map((g) => (
              <li key={g.src} className="group relative overflow-hidden rounded-2xl border border-border bg-black">
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full min-h-[150px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/65 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur">
                  {g.label}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 text-xs leading-snug text-white/90">
                  {g.caption}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Container>
  </Section>
);

export default Reels;
