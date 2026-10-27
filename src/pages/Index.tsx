import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Platform from "@/components/site/Platform";
import Reels from "@/components/site/Reels";
import Products from "@/components/site/Products";
import Industries from "@/components/site/Industries";
import SoftwareBuilds from "@/components/site/SoftwareBuilds";
import { About, Contact } from "@/components/site/AboutContact";

// Sections alternate dark / light; each sets its own tone tokens (see index.css).
const Index = () => (
  <>
    <a
      href="#platform"
      className="sr-only z-[60] rounded bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
    <Nav />
    <main className="overflow-x-clip">
      <Hero />
      <Platform />
      <Reels />
      <Products />
      <Industries />
      <SoftwareBuilds />
      <About />
      <Contact />
    </main>
  </>
);

export default Index;
