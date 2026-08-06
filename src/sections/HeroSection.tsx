import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Code2, Rocket, ShieldCheck, Network } from "lucide-react";
import { useRef } from "react";
import { ParticleField } from "@/components/jewel/ParticleField";
import { GlowButton } from "@/components/jewel/GlowButton";
import { TiltCard } from "@/components/jewel/TiltCard";

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-24"
    >
      {/* Particle backdrop */}
      <div className="absolute inset-0 -z-10">
        <ParticleField density={70} />
      </div>
      {/* Ambient gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, hsl(var(--primary) / 0.25), transparent 70%), radial-gradient(50% 40% at 80% 60%, hsl(var(--accent) / 0.18), transparent 70%)",
        }}
      />

      <motion.div style={{ y, opacity }} className="mx-auto max-w-6xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Software, Security &{" "}
          <span className="text-jewel-gradient">Networks</span>, done properly.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-foreground/70 sm:text-lg"
        >
          An IT company delivering software development, digital entrepreneurship,
          cybersecurity, and network engineering for businesses of every size.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <GlowButton
            size="lg"
            onClick={() => document.querySelector("#ecosystem")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Our Services <ArrowRight className="h-4 w-4" />
          </GlowButton>
          <GlowButton
            variant="outline"
            size="lg"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Talk to Us
          </GlowButton>
        </motion.div>

        {/* Capability panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mt-20"
        >
          <TiltCard intensity={6} className="mx-auto max-w-4xl">
            <div
              className="absolute -inset-4 rounded-3xl blur-3xl"
              style={{ background: "var(--gradient-jewel)", opacity: 0.25 }}
            />
            <div className="glass-strong relative overflow-hidden rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/50">
                  What we do
                </span>
                <span className="font-mono text-[10px] text-foreground/40">
                  Jewel IQ Technologies
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-4">
                <Stat icon={<Code2 className="h-4 w-4" />} label="Build" value="Software Development" tone="sapphire" />
                <Stat icon={<Rocket className="h-4 w-4" />} label="Grow" value="Digital Entrepreneurship" tone="cyan" />
                <Stat icon={<ShieldCheck className="h-4 w-4" />} label="Secure" value="Cybersecurity" tone="emerald" />
                <Stat icon={<Network className="h-4 w-4" />} label="Connect" value="Network Engineering" tone="sapphire" />
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Stat = ({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "sapphire";
}) => {
  const toneClass =
    tone === "cyan"
      ? "text-accent"
      : tone === "emerald"
        ? "text-[hsl(var(--emerald))]"
        : "text-primary";
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-left">
      <div className={`flex items-center gap-2 text-xs ${toneClass}`}>
        {icon}
        <span className="uppercase tracking-wider text-foreground/60">{label}</span>
      </div>
      <div className="font-display mt-1.5 text-sm font-semibold leading-snug sm:text-base text-foreground">{value}</div>
    </div>
  );
};
