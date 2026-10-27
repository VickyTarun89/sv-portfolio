import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { JOURNEY } from "@/data/portfolio";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

export const About = () => (
  <Section id="about" tone="dark" label="About" className="py-24 sm:py-32">
    <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <SectionHeading
        eyebrow="About"
        title="From fighter jets to factory floors."
        lede="I'm M. Shree Vignesh, an engineer in Chennai. Aerospace taught me that a system is only as good as its failure modes; a manufacturing floor taught me what operators actually need at 3 am. Physical AI is where both meet."
      />
      <Reveal>
        <ol className="relative border-l border-border pl-8">
          {JOURNEY.map((j, i) => (
            <li key={j.when} className="relative pb-9 last:pb-0">
              <span
                className={`absolute -left-[42.5px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 ${
                  i === JOURNEY.length - 1 ? "border-primary bg-primary" : "border-border bg-background"
                }`}
              />
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{j.when}</div>
              <p className="mt-1.5 text-base leading-relaxed">{j.what}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Container>
  </Section>
);

export const Contact = () => (
  <Section id="contact" tone="dark" label="Contact" className="py-24 sm:py-32">
    <div className="bg-blueprint fade-edges pointer-events-none absolute inset-0 opacity-60" />
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
    <Container className="text-center">
      <Reveal>
        <span className="eyebrow">Let's talk</span>
        <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Have an arm, a line, or a bin that needs eyes?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Send a photo of the parts and the cell. I'll tell you honestly whether vision can do it, which engine fits,
          and what it would take.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:shreevigneshm@gmail.com?subject=Robot%20cell%20%E2%80%94%20vision%20enquiry"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            <Mail size={16} />
            shreevigneshm@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/shree-vignesh-m/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition hover:border-foreground/40"
          >
            <Linkedin size={16} />
            LinkedIn
            <ArrowUpRight size={14} />
          </a>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Chennai, Tamil Nadu · working with teams across India
        </p>
      </Reveal>
    </Container>
    <footer className="relative mt-24 border-t border-border">
      <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} M. Shree Vignesh</span>
        <span className="font-mono">Physical AI · Robotics software · Chennai</span>
      </Container>
    </footer>
  </Section>
);
