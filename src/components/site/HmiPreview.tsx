import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/*
  A working miniature of the operator screen. Labels are the real HMI's own
  English / Tamil strings (Robotics/hmi/static/strings.js); the counters are
  animated for illustration, not a recording.
*/

const STRINGS = {
  en: {
    start: "START",
    stop: "STOP",
    served: "Served",
    placed: "Placed",
    refused: "Refused",
    job: "Job",
    steps: ["Look", "Check", "Move", "Grip", "Carry", "Release"],
    running: "Running — robot picking",
  },
  ta: {
    start: "தொடங்கு",
    stop: "நிறுத்து",
    served: "அனுப்பியது",
    placed: "வைத்தது",
    refused: "மறுக்கப்பட்டது",
    job: "வேலை",
    steps: ["பார்வை", "சரிபார்ப்பு", "நகர்வு", "பிடிப்பு", "கொண்டுசெல்", "விடுவிப்பு"],
    running: "இயங்குகிறது",
  },
} as const;

const HmiPreview = () => {
  const [lang, setLang] = useState<"en" | "ta">("en");
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(41);
  const s = STRINGS[lang];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setStep((p) => {
        const n = (p + 1) % 6;
        if (n === 0) setPlaced((x) => x + 1);
        return n;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="tone-dark overflow-hidden rounded-xl border border-white/10 text-[13px] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.400)]" />
          <span className="font-display font-semibold">Bin pick</span>
          <span className="rounded bg-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-black">PREVIEW</span>
        </div>
        <button
          type="button"
          onClick={() => setLang((l) => (l === "en" ? "ta" : "en"))}
          className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/5"
          aria-label="Switch operator screen language"
        >
          {lang === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-[1.3fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black">
          <img src="/robotics/real-tub.jpg" alt="" className="h-full w-full object-cover opacity-90" loading="lazy" />
          <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-white">
            PICK #{placed + 1} · 0.91
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-medium text-emerald-300">
            {s.running}
          </div>
          <div className="rounded-lg border border-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.job}</div>
            <div className="font-display font-semibold">star_flat_pick</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              [s.served, placed + 3],
              [s.placed, placed],
              [s.refused, 2],
            ].map(([label, v]) => (
              <div key={String(label)} className="rounded-lg border border-white/10 px-2 py-1.5">
                <div className="truncate text-[9px] uppercase text-muted-foreground">{label}</div>
                <div className="font-display text-lg font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SFC-style sequence strip */}
      <div className="flex items-center gap-1 overflow-x-auto px-4 pb-3" role="list" aria-label="Robot sequence">
        {s.steps.map((name, i) => (
          <div key={i} role="listitem" className="flex items-center gap-1">
            <span
              className={cn(
                "whitespace-nowrap rounded-md border px-2 py-1 text-[11px] transition-colors",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < step
                    ? "border-white/15 text-foreground/70"
                    : "border-white/10 text-muted-foreground",
              )}
            >
              {name}
            </span>
            {i < s.steps.length - 1 && <span className="text-white/20">›</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
        <div className="rounded-lg bg-emerald-500/90 py-2.5 text-center font-display font-bold text-black">{s.start}</div>
        <div className="rounded-lg bg-white/5 py-2.5 text-center font-display font-bold text-muted-foreground">{s.stop}</div>
      </div>
    </div>
  );
};

export default HmiPreview;
