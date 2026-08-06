import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Rocket,
  ShieldCheck,
  Network,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { FadeInSection } from "@/components/jewel/FadeInSection";
import { GlassCard } from "@/components/jewel/GlassCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const pillars = [
  {
    id: "software",
    icon: Code2,
    title: "Software Development",
    tag: "Build",
    tone: "text-primary",
    ring: "hsl(217 91% 60%)",
    lead: "Custom web, mobile, and cloud software built to your specification and maintained long-term.",
    features: [
      "UI/UX design and prototyping",
      "Web applications & business portals",
      "Android & cross-platform mobile apps",
      "APIs, databases & system integrations",
      "SaaS & Custom Platform Development",
      "Legacy System Modernization",
      "Software Testing & Quality Assurance (QA)",
      "DevOps & Cloud Deployment",
      "Maintenance & Continuous Support",
      "Workflow Automation & AI Integration",
    ],
  },
  {
    id: "entrepreneurship",
    icon: Rocket,
    title: "Digital Entrepreneurship",
    tag: "Grow",
    tone: "text-accent",
    ring: "hsl(187 92% 55%)",
    lead: "We help founders and small businesses take an idea online and run it as a real digital operation.",
    features: [
      "MVP (Minimum Viable Product) Development",
      "Digital business setup & online presence",
      "E-commerce and booking platforms",
      "Workflow automation & digital tooling",
      "Tech consulting and product guidance",
      "Digital Marketing & Growth Strategy",
      "Business Analytics & Performance Tracking",
      "Customer Relationship Management (CRM) Solutions",
      "Monetization & Payment Gateway Setup",
      "Brand Identity & Digital Assets Creation",
      "Graphic Design & Visual Content Production",
      "Legal & Compliance Guidance for Digital Ventures",
      "Marketing & Promotional Collateral Design",
      "Social Media Strategy & Management",
      "Email Marketing Campaigns & Automation",
    ],
  },
  {
    id: "cybersecurity",
    icon: ShieldCheck,
    title: "Cybersecurity",
    tag: "Secure",
    tone: "text-[hsl(var(--emerald))]",
    ring: "hsl(158 84% 45%)",
    lead: "Practical security work that protects your systems, your data, and the people who use them.",
    features: [
      "Threat Vulnerability & Penetration Testing",
      "Zero-Trust Access & Endpoint Security",
      "Incident Response & Disaster Recovery",
      "Security Awareness Training & Phishing Simulations",
      "Data Encryption & Secure Communication Protocols",
      "Compliance Management & Security Awareness",
      "Cloud Infrastructure & Architecture Hardening",
      "Identity & Access Management (IAM) Solutions",
      "Continuous SOC & Real-Time Threat Monitoring",
      "API & Web Application Protection",
      "Data Loss Prevention (DLP) & Privacy Controls",
      "Identity & Access Management (IAM) Solutions",
    ],
  },
  {
    id: "network",
    icon: Network,
    title: "Network Engineering",
    tag: "Connect",
    tone: "text-primary",
    ring: "hsl(217 91% 60%)",
    lead: "Designing, installing, and maintaining reliable networks for offices, campuses, and remote sites.",
    features: [
      "LAN, WAN & Wi-Fi design and installation",
      "Routing, switching & firewall configuration",
      "Structured cabling and site surveys",
      "Network monitoring, support & maintenance",
    ],
  },
];

export const EcosystemSection = () => {
  const [active, setActive] = useState(pillars[0].id);
  const current = pillars.find((p) => p.id === active)!;
  const [detail, setDetail] = useState<string | null>(null);
  const detailPillar = pillars.find((p) => p.id === detail) ?? null;

  // Typing effect for the lead line
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    let i = 0;
    const text = current.lead;
    const t = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 14);
    return () => clearInterval(t);
  }, [current.lead]);

  return (
    <section id="ecosystem" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <FadeInSection className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            The Ecosystem
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Four disciplines.{" "}
            <span className="text-jewel-gradient">One IT partner.</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            Jewel IQ Technologies delivers software, digital business
            enablement, cybersecurity, and network engineering under one roof.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1} className="mt-12">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full glass p-1.5">
            {pillars.map((p) => {
              const isActive = p.id === active;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={`relative rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground/90"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="pillar-pill"
                      className="absolute inset-0 rounded-full bg-jewel-gradient opacity-90"
                      transition={{
                        type: "spring",
                        stiffness: 340,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <p.icon className="h-3.5 w-3.5" />
                    {p.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeInSection>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => {
            const isActive = p.id === active;
            return (
              <FadeInSection key={p.id} delay={0.1 + idx * 0.08}>
                <GlassCard
                  onClick={() => setActive(p.id)}
                  className={`group relative h-full cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                    isActive ? "border-transparent" : ""
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow: `0 0 0 1px ${p.ring}, 0 20px 60px -20px ${p.ring}`,
                        }
                      : undefined
                  }
                >
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                    style={{ background: p.ring }}
                  />
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-background/50 ${p.tone}`}
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-semibold">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65">{p.lead}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(p.id);
                      setDetail(p.id);
                    }}
                    className="relative z-10 mt-4 inline-flex items-center gap-1 text-xs text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </GlassCard>
              </FadeInSection>
            );
          })}
        </div>

        {/* Drawer / detail */}
        <FadeInSection delay={0.2} className="mt-8">
          <div className="glass-strong overflow-hidden rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid gap-8 md:grid-cols-[1fr,1fr] md:items-center"
              >
                <div>
                  <p
                    className={`font-mono text-xs uppercase tracking-[0.25em] ${current.tone}`}
                  >
                    {current.tag} · Pillar
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
                    {current.title}
                  </h3>
                  <p className="mt-3 min-h-[3rem] text-foreground/70">
                    {typed}
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-accent align-middle" />
                  </p>
                </div>
                <ul className="grid gap-2">
                  {current.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm"
                    >
                      <span
                        className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full"
                        style={{
                          background: current.ring,
                          color: "hsl(var(--background))",
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/85">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};
