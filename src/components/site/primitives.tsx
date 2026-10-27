import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Section = ({
  id,
  tone,
  className,
  children,
  label,
}: {
  id?: string;
  tone: "dark" | "light";
  className?: string;
  children: ReactNode;
  label?: string;
}) => (
  <section
    id={id}
    aria-label={label}
    className={cn(tone === "dark" ? "tone-dark" : "tone-light", "relative overflow-hidden", className)}
  >
    {children}
  </section>
);

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("relative mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>
);

export const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
}) => (
  <Reveal className={cn("mb-12 sm:mb-16", align === "center" && "mx-auto text-center")}>
    <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
      <span className="h-px w-8 bg-primary" />
      <span className="eyebrow">{eyebrow}</span>
    </div>
    <h2 className="mt-5 max-w-3xl text-balance text-3xl font-semibold leading-[1.08] sm:text-5xl">{title}</h2>
    {lede && (
      <p
        className={cn(
          "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
          align === "center" && "mx-auto",
        )}
      >
        {lede}
      </p>
    )}
  </Reveal>
);
