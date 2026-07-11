import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Activity, TrendingUp, ShieldCheck } from "lucide-react";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-foreground/80"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Cyber-luxury tech studio · Est. 2024
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Architecting the Future of{" "}
          <span className="text-jewel-gradient">Digital Intelligence</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-foreground/70 sm:text-lg"
        >
          We blend cutting-edge software development, dominant marketing strategies,
          and bulletproof business execution to scale your vision.
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
            Book a Consultation
          </GlowButton>
        </motion.div>

        {/* Mock dashboard */}
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
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                </div>
                <span className="font-mono text-xs text-foreground/50">
                  jeweliq.io / control-plane
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-4">
                <Stat icon={<Activity className="h-4 w-4" />} label="Uptime" value="99.99%" tone="cyan" />
                <Stat icon={<TrendingUp className="h-4 w-4" />} label="Growth" value="+312%" tone="emerald" />
                <Stat icon={<ShieldCheck className="h-4 w-4" />} label="Threats blocked" value="1.2M" tone="sapphire" />
                <Stat icon={<Sparkles className="h-4 w-4" />} label="Latency" value="83ms" tone="cyan" />
              </div>
              <div className="mt-4 h-32 rounded-xl bg-background/40 p-3">
                <MockChart />
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
        ? "text-emerald-400"
        : "text-primary";
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-left">
      <div className={`flex items-center gap-2 text-xs ${toneClass}`}>
        {icon}
        <span className="uppercase tracking-wider text-foreground/60">{label}</span>
      </div>
      <div className="font-display mt-1.5 text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
};

const MockChart = () => {
  const points = [12, 18, 14, 22, 30, 26, 38, 42, 55, 48, 64, 70, 66, 78, 90];
  const max = Math.max(...points);
  const w = 100;
  const h = 100;
  const step = w / (points.length - 1);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(187 92% 55%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(187 92% 55%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#heroChart)" />
      <path d={path} stroke="hsl(187 92% 55%)" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};
