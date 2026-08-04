import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Mail, Phone, MessageCircle } from "lucide-react";
import { FadeInSection } from "@/components/jewel/FadeInSection";
import { GlowButton } from "@/components/jewel/GlowButton";

const services = [
  "Software Development",
  "Web Application",
  "Mobile App",
  "Digital Entrepreneurship",
  "Cybersecurity",
  "Network Engineering",
  "IT Support & Maintenance",
  "Not sure yet",
];

export const ContactHub = () => {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggle = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <FadeInSection className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Get in touch
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Tell us what you <span className="text-jewel-gradient">need</span>.
          </h2>
          <p className="mt-4 text-foreground/70">
            Tell us what you need. We reply within one business day.
          </p>
        </FadeInSection>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          {/* Multi-step form */}
          <FadeInSection delay={0.1}>
            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              {/* Progress */}
              <div className="mb-6 flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-jewel-gradient" : "bg-foreground/10"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jewel-gradient text-primary-foreground">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="font-display mt-4 text-2xl font-semibold">Message received.</h3>
                    <p className="mt-2 text-foreground/70">
                      Our team will reach out to {form.email || "you"} within one business day.
                    </p>
                  </motion.div>
                ) : step === 0 ? (
                  <motion.div
                    key="s0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold">
                      What do you need help with?
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60">
                      Pick every service that applies to your project.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {services.map((s) => {
                        const on = picked.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggle(s)}
                            className={`rounded-full border px-4 py-2 text-sm transition-all ${
                              on
                                ? "border-transparent bg-jewel-gradient text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)]"
                                : "border-border bg-background/40 text-foreground/80 hover:border-accent/60 hover:text-foreground"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-8 flex justify-end">
                      <GlowButton
                        size="md"
                        disabled={picked.length === 0}
                        onClick={() => setStep(1)}
                        className="disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </GlowButton>
                    </div>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold">Tell us about you.</h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                      <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                      <Field label="Company (optional)" value={form.company} onChange={(v) => setForm({ ...form, company: v })} full />
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <GlowButton variant="ghost" onClick={() => setStep(0)}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </GlowButton>
                      <GlowButton
                        disabled={!form.name || !form.email}
                        onClick={() => setStep(2)}
                        className="disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </GlowButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold">Project details.</h3>
                    <p className="mt-1 text-sm text-foreground/60">
                      A few lines about what you need and any deadlines.
                    </p>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="mt-5 w-full resize-none rounded-2xl border border-border bg-background/40 p-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="Describe your project or IT requirement..."
                    />
                    <div className="mt-8 flex items-center justify-between">
                      <GlowButton variant="ghost" onClick={() => setStep(1)}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </GlowButton>
                      <GlowButton onClick={() => setSubmitted(true)}>
                        Send Brief <ArrowRight className="h-4 w-4" />
                      </GlowButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeInSection>

          {/* Contact sidebar */}
          <FadeInSection delay={0.2}>
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8">
              <div>
                <h3 className="font-display text-xl font-semibold">Prefer to talk directly?</h3>
                <p className="mt-2 text-sm text-foreground/65">
                  Reach our team by email, phone, or WhatsApp — whichever suits you.
                </p>
                <div className="mt-6 space-y-3">
                  <ContactRow icon={<Mail className="h-4 w-4" />} label="Email" value="info@jeweliq.com" href="mailto:info@jeweliq.com" />
                  <ContactRow icon={<Phone className="h-4 w-4" />} label="Phone" value="+27 60 433 4341" href="tel:+27604334341" />
                  <ContactRow icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" value="Chat with us" href="https://wa.me/27604334341" />
                </div>
              </div>
              <div className="mt-8 rounded-2xl border border-border/70 bg-background/40 p-4 text-xs text-foreground/70">
                <p className="font-medium text-foreground">Response time</p>
                <p className="mt-1">Within one business day · Based in South Africa, working remotely worldwide.</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) => (
  <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
    <span className="text-xs uppercase tracking-wider text-foreground/60">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-border bg-background/40 px-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
    />
  </label>
);

const ContactRow = ({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/30 p-3 transition-colors hover:border-accent/60"
  >
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jewel-soft text-accent">
      {icon}
    </span>
    <span className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-foreground/50">{label}</span>
      <span className="text-sm text-foreground group-hover:text-accent">{value}</span>
    </span>
  </a>
);
