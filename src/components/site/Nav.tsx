import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#reels", label: "Reels" },
  { href: "#products", label: "Products" },
  { href: "#industries", label: "Industries" },
  { href: "#software", label: "Software" },
  { href: "#about", label: "About" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "tone-dark fixed inset-x-0 top-0 z-50 !bg-transparent transition-all duration-300",
        scrolled && "!bg-[hsl(220_20%_4%/0.94)] shadow-[0_1px_0_hsl(0_0%_100%/0.06)] backdrop-blur-xl",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5" aria-label="M. Shree Vignesh — home">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
            SV
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">M. Shree Vignesh</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 sm:inline-block"
          >
            Discuss a cell
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {[...LINKS, { href: "#contact", label: "Contact" }].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Nav;
