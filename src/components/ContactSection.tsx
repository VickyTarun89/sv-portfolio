import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 min-h-[80vh] flex items-center overflow-hidden">


      <div className="max-w-4xl mx-auto text-center px-6 w-full relative z-10">
        <motion.div
          style={{ y: contentY }}
          className="glass-tron-card p-12 sm:p-16 relative overflow-hidden bg-background/20 backdrop-blur-md border border-white/10"
        >
          <div className="absolute inset-0 bg-tron-grid opacity-[0.03] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <span className="font-display text-xs tracking-[0.4em] uppercase text-primary mb-6 block">
              Connect
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Let's build something real.
            </h2>
            <p className="font-body text-lg text-muted-foreground/80 mb-6 max-w-lg mx-auto leading-relaxed">
              SaaS development, AI software services, and CRM engineering from Chennai — open to collaborations and consulting with clients across India and worldwide.
            </p>
            <div className="flex items-center justify-center gap-2 mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <span className="font-display text-xs tracking-[0.3em] uppercase text-muted-foreground/70">
                Based in Chennai, Tamil Nadu, India
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href="https://www.linkedin.com/in/shree-vignesh-m/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-display text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                LinkedIn
              </a>
              <a
                href="mailto:shreevigneshm@gmail.com"
                className="group flex items-center gap-2 font-display text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                Email
              </a>
              <a
                href="https://www.nammaooru.site"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-display text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                NammaOoru
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer accent */}
        <div className="mt-24 flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-primary/20" />
          <span className="font-display text-[10px] tracking-[0.5em] text-muted-foreground/40">
            SV
          </span>
          <div className="w-12 h-px bg-primary/20" />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
