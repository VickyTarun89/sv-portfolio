import type { ReactNode } from "react";
import { PIPELINE } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import HmiPreview from "./HmiPreview";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

const Status = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    {children}
  </div>
);

const Row = ({
  index,
  kicker,
  title,
  body,
  bullets,
  status,
  visual,
  flip,
}: {
  index: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  status: string;
  visual: ReactNode;
  flip?: boolean;
}) => (
  <div className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
    <Reveal className={cn(flip && "lg:order-2")}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-primary">{index}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{kicker}</span>
      </div>
      <h3 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h3>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {b}
          </li>
        ))}
      </ul>
      <Status>{status}</Status>
    </Reveal>
    <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
      {visual}
    </Reveal>
  </div>
);

const PipelineCard = () => (
  <div className="tone-dark overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Perception chain</span>
      <span className="font-mono text-[11px] text-primary">depth frame → pick pose</span>
    </div>
    <ol>
      {PIPELINE.map((p) => (
        <li key={p.n} className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-white/5 px-5 py-3.5 last:border-0">
          <span className="font-mono text-xs text-primary">{p.n}</span>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-display font-semibold">{p.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{p.result}</span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{p.what}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const WASHERS = [
  { cls: "good", verdict: "PASS" },
  { cls: "crack", verdict: "REJECT" },
  { cls: "dent", verdict: "REJECT" },
  { cls: "stain", verdict: "REJECT" },
] as const;

const InspectionCard = () => (
  <div className="tone-dark rounded-2xl border border-white/10 p-5 shadow-2xl">
    <div className="grid grid-cols-2 gap-3">
      {WASHERS.map((w) => (
        <figure key={w.cls} className="relative overflow-hidden rounded-xl bg-black">
          <img
            src={`/robotics/washer-${w.cls}.jpg`}
            alt={`Synthetic washer, ${w.cls}`}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="absolute inset-x-2 bottom-2 flex items-center justify-between">
            <span className="rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] uppercase text-white">{w.cls}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                w.verdict === "PASS" ? "bg-emerald-400 text-black" : "bg-red-500 text-white",
              )}
            >
              {w.verdict}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
    <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      Synthetic practice SKU · trained on good parts only
    </p>
  </div>
);

const TwinCard = () => (
  <div className="tone-dark overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
    <div className="relative">
      <img
        src="/robotics/twin-rcplus.jpg"
        alt="Epson C8 arm picking parts on the RC+ virtual controller"
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
      />
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
        Epson RC+ virtual controller
      </span>
    </div>
    <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
      {[
        ["9 / 9", "picks, 0 collisions", "RoboDK"],
        ["8 / 8", "picks", "Epson RC+ virtual"],
        ["1", "camera clash caught", "before real steel"],
      ].map(([v, l, n]) => (
        <div key={l} className="p-4">
          <dt className="font-display text-xl font-semibold">{v}</dt>
          <dd className="text-xs text-foreground/80">{l}</dd>
          <dd className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{n}</dd>
        </div>
      ))}
    </dl>
  </div>
);

const Products = () => (
  <Section id="products" tone="light" label="Products" className="py-24 sm:py-32">
    <Container>
      <SectionHeading
        eyebrow="What I build"
        title="Four pieces of one Physical AI stack."
        lede="Each one is useful alone and better together: the same job file, the same honest logging, the same operator screen pattern."
      />

      <div className="divide-y divide-border">
        <Row
          index="01"
          kicker="Vision-guided robotics"
          title="3D bin picking from CAD"
          body="A fixed depth camera looks into a tub of mixed metal parts. The software finds each part, names it, works out its full 6-D pose, chooses a safe grasp and hands the arm a target — on commodity hardware, at a fraction of imported-system cost."
          bullets={[
            "Segment → identify → 6-D pose → grasp",
            "Two-finger grippers and magnets",
            "Hand-eye calibration solver built in",
            "Target: under ₹8 L incl. camera vs ₹40 L+",
          ]}
          status="Bench-proven on real frames · first live cell in progress"
          visual={<PipelineCard />}
        />

        <Row
          flip
          index="02"
          kicker="AI visual inspection"
          title="Anomaly detection for MSME lines"
          body="An edge station over a conveyor learns what a good part looks like from a few dozen real samples — no defect library needed — and posts one PASS or REJECT per part to the line's PLC, which owns the ejector."
          bullets={[
            "Few-shot PatchCore / EfficientAD",
            "OpenVINO on an x86 mini-PC, INT8 option",
            "Fails closed: timeout or bad frame = REJECT",
            "Hash-chained, tamper-evident record per part",
          ]}
          status="Toolchain proven on a synthetic SKU · seeking a design-partner line"
          visual={<InspectionCard />}
        />

        <Row
          index="03"
          kicker="Custom HMI"
          title="Operator screens people actually use"
          body="Touch-first, offline, build-free screens that run on the cell PC: a traffic light, the live picture with the next pick outlined, a step-by-step robot sequence chart that shows where a cycle got stuck, PIN-gated setup, and every word in English and Tamil."
          bullets={[
            "Run · Picks · Sequence · Job · Setup",
            "SFC view of the robot's cycle",
            "Engineer PIN, operator log, access rules",
            "English / தமிழ் toggle — try it →",
          ]}
          status="In use on the bench cell · FastAPI + static UI"
          visual={<HmiPreview />}
        />

        <Row
          flip
          index="04"
          kicker="Digital twins"
          title="Prove the cell before it moves"
          body="The whole cell — arm, jaws, camera post, bins and the parts at the poses the vision found — is rebuilt in simulation straight from the job file, so reach, posture flips and collisions show up on a laptop instead of on the shop floor."
          bullets={[
            "RoboDK and Epson RC+ cells from one recipe",
            "Synthetic training data from BlenderProc",
            "Robot program proven on the virtual controller first",
            "Cycle-time estimates per layout",
          ]}
          status="Used on every layout change"
          visual={<TwinCard />}
        />
      </div>
    </Container>
  </Section>
);

export default Products;
