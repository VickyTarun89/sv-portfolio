import { Cpu, Cable, Gauge, ShieldCheck } from "lucide-react";
import { ARMS, ARM_STATUS_LABEL, ENGINES, type ArmStatus } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { RobotIcon } from "./RobotIcons";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

const STATUS_STYLE: Record<ArmStatus, string> = {
  integrated: "bg-primary text-primary-foreground",
  ready: "bg-accent/15 text-accent",
  client: "bg-muted text-muted-foreground",
};

const HARDWARE = [
  { icon: Cpu, title: "Low-spec ready", body: "Developed on a GTX 1660 and a laptop CPU. The classical engine needs no GPU at all; the AI engine exports to ONNX / OpenVINO for CPU inference." },
  { icon: Gauge, title: "Speed where it counts", body: "Per-part windows instead of whole-frame maths, a background frame writer, collision checks cropped to the gripper's reach — same answers, less waiting." },
  { icon: Cable, title: "Poses out, not trajectories", body: "One line per pick over TCP or Modbus TCP. The robot's own controller plans the move — so no paid real-time motion options." },
  { icon: ShieldCheck, title: "Fails closed", body: "A part the system is unsure about is left in the bin and logged — a wrong part in the wrong bin costs more than a skipped one." },
];

const DEPTH_POINTS = [
  { k: "Sensor", v: "Intel RealSense D435 / D435i — stereo depth + colour over one USB cable" },
  { k: "Accuracy tricks", v: "Median of N frames, 0.1 mm depth step, precision preset — noise ≈0.2 mm at 30 cm" },
  { k: "Depth snap", v: "Each pose is pulled onto the camera's own measured surface along the viewing ray" },
  { k: "Second camera", v: "Optional: fuse two cameras for deep bins or mirror-bright chrome" },
];

const DepthSensing = () => (
  <div className="mt-20 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
    <Reveal>
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Economical depth sensing</div>
      <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
        A commodity depth camera, not an imported 3D scanner
      </h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Imported bin-picking cells ship with dedicated structured-light 3D scanners. This stack gets its 3D from an
        off-the-shelf Intel RealSense stereo depth camera — and makes up the difference in software: floor fitting,
        frame averaging and pose-to-depth snapping. The same camera works with every arm on the list below.
      </p>
      <dl className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {DEPTH_POINTS.map((p) => (
          <div key={p.k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
            <dt className="font-display text-sm font-semibold">{p.k}</dt>
            <dd className="text-sm text-muted-foreground">{p.v}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
    <Reveal delay={0.1}>
      <figure className="overflow-hidden rounded-2xl border border-border bg-[hsl(220_20%_6%)] shadow-xl">
        <img
          src="/robotics/depth-map.jpg"
          alt="Depth map of a tub of hydraulic fittings from an Intel RealSense camera, coloured by height"
          loading="lazy"
          className="w-full"
        />
        <figcaption className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-[hsl(218_11%_62%)]">
          <span>Real RealSense depth · fittings in a tub</span>
          <span className="text-[#ff7a45]">warm = higher</span>
        </figcaption>
      </figure>
    </Reveal>
  </div>
);

const Platform = () => (
  <Section id="platform" tone="light" label="Platform" className="py-24 sm:py-32">
    <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
    <Container>
      <SectionHeading
        eyebrow="The platform"
        title={
          <>
            One vision brain. <span className="text-primary">Any industrial arm.</span> AI or no AI.
          </>
        }
        lede="The robot already knows how to move. What it lacks is eyes and judgement. I build that layer as software — CAD in, depth frame in, a pick pose out — so it drops onto the arm, the camera and the PC a plant already has."
      />

      {/* two engines */}
      <div className="grid gap-5 md:grid-cols-2">
        {ENGINES.map((e, i) => (
          <Reveal key={e.tag} delay={i * 0.08}>
            <article className="group h-full rounded-2xl border border-border bg-card p-7 shadow-[0_1px_0_hsl(0_0%_100%/0.6)_inset] transition hover:-translate-y-0.5 hover:shadow-xl sm:p-9">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{e.tag}</div>
              <h3 className="mt-3 text-2xl font-semibold">{e.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{e.body}</p>
              <ul className="mt-6 space-y-2.5">
                {e.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Both engines sit behind the same job file, the same operator screen and the same robot protocol — switch per
          part, not per project.
        </p>
      </Reveal>

      <DepthSensing />

      {/* arm compatibility */}
      <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 [&>*]:min-w-0">
        <Reveal>
          <h3 className="text-2xl font-semibold sm:text-3xl">Brand-agnostic by design</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Any arm whose controller can open a TCP socket can take our picks — one small client program per brand,
            about a day with the controller's manual. Nothing above the line protocol changes per robot.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl bg-[hsl(220_20%_6%)] p-4 font-mono text-[12px] leading-relaxed text-[hsl(210_20%_85%)]">
            <span className="text-[hsl(218_11%_55%)]">robot  →</span> GET{"\n"}
            <span className="text-[hsl(218_11%_55%)]">vision →</span>{" "}
            <span className="text-[#ff7a45]">OK</span>,0.91,0,203.9,40.3,68.9,0.0,180.0,45.2,7{"\n"}
            <span className="text-[hsl(218_11%_55%)]">{"          "}status conf class x y z (mm) u v w (deg) seq</span>
          </pre>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ARMS.map((a) => {
              const label = ARM_STATUS_LABEL[a.status];
              return (
                <li
                  key={a.brand}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl border border-border bg-card px-3 pb-4 pt-5 text-center transition hover:-translate-y-0.5 hover:shadow-lg",
                    a.status === "integrated" && "border-primary/50 ring-1 ring-primary/30",
                  )}
                >
                  <div className="h-16 w-16 text-foreground/80 transition group-hover:text-foreground">
                    <RobotIcon kind={a.kind} />
                  </div>
                  <div className="mt-3 font-display text-sm font-semibold leading-tight">{a.brand}</div>
                  <div className="mt-1 text-xs leading-snug text-muted-foreground">{a.detail}</div>
                  {label && (
                    <span
                      className={cn(
                        "mt-3 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                        STATUS_STYLE[a.status],
                      )}
                    >
                      {label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      {/* hardware + behaviour */}
      <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {HARDWARE.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 0.05} className="bg-card p-6">
            <Icon size={22} className="text-primary" />
            <h4 className="mt-4 font-display text-lg font-semibold">{title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </Reveal>
        ))}
      </div>
    </Container>
  </Section>
);

export default Platform;
