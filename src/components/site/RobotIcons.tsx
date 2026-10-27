import type { ArmKind } from "@/data/portfolio";

/*
  Original line illustrations of robot types — deliberately generic, not any
  vendor's product photo or logo. Colours come from currentColor + the accent
  token so they follow the section's light/dark tone.
*/

const IndustrialArm = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-full w-full">
    <rect x="16" y="52" width="22" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
    <rect x="20" y="44" width="14" height="9" rx="2" fill="currentColor" opacity="0.55" />
    <path d="M27 46 L22 26" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M22 26 L44 17" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
    <circle cx="22" cy="26" r="4.5" fill="hsl(var(--primary))" />
    <circle cx="27" cy="46" r="3.5" fill="hsl(var(--primary))" />
    <path d="M44 17 L48 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M45 27 L45 32 M51 25 L51 30" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const Cobot = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-full w-full">
    <rect x="18" y="53" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.85" />
    <path d="M27 53 V40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    <path d="M27 40 L36 22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M36 22 L50 30" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
    <circle cx="27" cy="40" r="4" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" />
    <circle cx="36" cy="22" r="4" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" />
    <circle cx="50" cy="30" r="3.2" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" />
    <path d="M50 34 V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Plc = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-full w-full">
    <rect x="8" y="18" width="48" height="30" rx="3" stroke="currentColor" strokeWidth="2.5" />
    <rect x="13" y="23" width="10" height="20" rx="1.5" fill="currentColor" opacity="0.7" />
    <rect x="26" y="23" width="7" height="20" rx="1.5" fill="currentColor" opacity="0.4" />
    <rect x="36" y="23" width="7" height="20" rx="1.5" fill="currentColor" opacity="0.4" />
    <rect x="46" y="23" width="5" height="20" rx="1.5" fill="currentColor" opacity="0.4" />
    <circle cx="16" cy="27" r="1.6" fill="hsl(var(--primary))" />
    <circle cx="20" cy="27" r="1.6" fill="hsl(142 70% 45%)" />
    <path d="M14 48 V54 M22 48 V54 M30 48 V54 M38 48 V54 M46 48 V54" stroke="currentColor" strokeWidth="2" opacity="0.6" />
  </svg>
);

const ICONS: Record<ArmKind, () => JSX.Element> = {
  industrial: IndustrialArm,
  cobot: Cobot,
  plc: Plc,
};

export const RobotIcon = ({ kind }: { kind: ArmKind }) => {
  const Icon = ICONS[kind];
  return <Icon />;
};
