import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SOFTWARE_BUILDS, type Build } from "@/data/portfolio";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

const NAMMAOORU_STATS = "https://www.nammaooru.site/api/leaderboard";

const useNammaOoruStats = () => {
  const [stats, setStats] = useState<{ total: number; resolved: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(NAMMAOORU_STATS)
      .then((r) => r.json())
      .then((json) => {
        const rows: { stats?: { total?: number; resolved?: number } }[] = json?.data;
        if (!Array.isArray(rows)) return;
        const total = rows.reduce((sum, row) => sum + (row.stats?.total ?? 0), 0);
        const resolved = rows.reduce((sum, row) => sum + (row.stats?.resolved ?? 0), 0);
        if (!cancelled && total > 0) setStats({ total, resolved });
      })
      .catch(() => {
        // CORS or network failure — the static card already says enough
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return stats;
};

const BuildCard = ({ build, live }: { build: Build; live?: string }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-xl">
    <div className="relative grid h-48 place-items-center overflow-hidden bg-[hsl(220_20%_6%)]">
      {build.image ? (
        <img
          src={build.image}
          alt={`${build.name} screenshot`}
          loading="lazy"
          className={
            build.id === "nammaooru"
              ? "h-full w-full object-cover object-top opacity-90 transition duration-500 group-hover:scale-[1.03]"
              : "h-36 w-auto drop-shadow-[0_0_30px_rgba(255,90,31,0.35)] transition duration-500 group-hover:scale-105"
          }
        />
      ) : (
        <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden />
      )}
      {!build.image && <span className="relative font-display text-3xl font-semibold text-white/90">{build.name}</span>}
      {build.live && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      )}
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{build.kicker}</div>
      <h3 className="mt-2 text-2xl font-semibold">{build.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{build.summary}</p>
      {live && <p className="mt-3 text-sm font-medium text-emerald-700">{live}</p>}
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {build.points.map((p) => (
          <li key={p} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] text-muted-foreground">{build.stack.join(" · ")}</p>
      <a
        href={build.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-foreground hover:text-primary"
      >
        {build.cta}
        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  </article>
);

const SoftwareBuilds = () => {
  const stats = useNammaOoruStats();
  return (
    <Section id="software" tone="light" label="Software builds" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Also shipped"
          title="Software that's already in people's hands."
          lede="The same habits — fail closed, measure everything, keep data private — applied to civic tech, AI-agent security and business SaaS."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {SOFTWARE_BUILDS.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.06}>
              <BuildCard
                build={b}
                live={
                  b.id === "nammaooru" && stats
                    ? `${stats.total} reports filed · ${stats.resolved} resolved across Chennai`
                    : undefined
                }
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default SoftwareBuilds;
