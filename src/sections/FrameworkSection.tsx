import { motion } from "framer-motion";
import { Compass, Layers, Rocket, LifeBuoy } from "lucide-react";
import { FadeInSection } from "@/components/jewel/FadeInSection";

const steps = [
  {
    icon: Compass,
    title: "Consultation",
    lead: "We sit down with you to understand the business, the systems in place, and the problem to solve.",
  },
  {
    icon: Layers,
    title: "Design & Planning",
    lead: "Scope, technical design, timelines, and cost — agreed in writing before any work starts.",
  },
  {
    icon: Rocket,
    title: "Implementation",
    lead: "We build, configure, and deploy — with regular check-ins so you always know where things stand.",
  },
  {
    icon: LifeBuoy,
    title: "Support & Maintenance",
    lead: "Ongoing monitoring, updates, and technical support to keep everything running after handover.",
  },
];

export const FrameworkSection = () => (
  <section id="about" className="relative py-28 sm:py-36">
    <div className="mx-auto max-w-5xl px-4">
      <FadeInSection className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
          How We Work
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          A clear process, <span className="text-jewel-gradient">start to support</span>.
        </h2>
      </FadeInSection>

      <div className="relative mt-16 pl-6 sm:pl-12">
        {/* Timeline spine */}
        <div className="absolute left-3 top-2 bottom-2 w-px sm:left-6">
          <div className="h-full w-full bg-gradient-to-b from-primary via-accent to-[hsl(var(--emerald))] opacity-40" />
        </div>

        <ol className="space-y-10">
          {steps.map((s, i) => (
            <FadeInSection key={s.title} delay={i * 0.08}>
              <li className="relative">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-jewel-gradient text-[10px] font-semibold text-primary-foreground shadow-[0_0_20px_hsl(var(--accent)/0.6)] sm:-left-12 sm:h-8 sm:w-8 sm:text-xs"
                >
                  0{i + 1}
                </motion.span>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-border/70 bg-background/40 text-accent">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-foreground/70">{s.lead}</p>
                    </div>
                  </div>
                </div>
              </li>
            </FadeInSection>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
