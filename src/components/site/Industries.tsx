import { Check } from "lucide-react";
import { INDUSTRIES, SHOP_FLOOR_DEFAULTS } from "@/data/portfolio";
import { Container, Reveal, Section, SectionHeading } from "./primitives";

const Industries = () => (
  <Section id="industries" tone="dark" label="Industries" className="py-24 sm:py-32">
    <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[140px]" />
    <Container>
      <SectionHeading
        eyebrow="Built for Indian industry"
        title={
          <>
            Imported vision costs <span className="text-primary">₹40 L+</span> a cell. Most Indian lines can't wait for
            that.
          </>
        }
        lede="The physical-AI shift will not reach a Coimbatore foundry or a Hosur job shop through ₹40-lakh imports. It arrives as software on hardware they already own."
      />

      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((ind, i) => (
          <Reveal key={ind.name} delay={(i % 3) * 0.05} className="bg-background p-6 sm:p-7">
            <div className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="mt-3 font-display text-xl font-semibold">{ind.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ind.need}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <h3 className="font-display text-lg font-semibold">Shop-floor defaults, not add-ons</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_FLOOR_DEFAULTS.map((d) => (
            <li key={d} className="flex items-start gap-3 text-sm text-foreground/85">
              <Check size={16} className="mt-0.5 shrink-0 text-primary" />
              {d}
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  </Section>
);

export default Industries;
