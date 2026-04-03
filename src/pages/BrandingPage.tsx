import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Palette, Eye, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/service-branding.jpg";

const offerings = [
  {
    icon: Palette,
    title: "Brand Identity Design",
    description: "We craft unique visual identities — logos, color palettes, and typography — that capture your brand's essence and make you instantly recognizable.",
  },
  {
    icon: Eye,
    title: "Brand Strategy",
    description: "We define your positioning, voice, and messaging framework so every touchpoint communicates a consistent, compelling story.",
  },
  {
    icon: Target,
    title: "Brand Guidelines",
    description: "Comprehensive brand books that ensure everyone — from your team to external partners — represents your brand consistently.",
  },
  {
    icon: Layers,
    title: "Rebranding & Refresh",
    description: "Whether you've outgrown your current look or need a complete overhaul, we breathe new life into established brands without losing what makes them special.",
  },
];

const process = [
  { step: "01", title: "Discovery", desc: "We deep-dive into your business, audience, and competitive landscape." },
  { step: "02", title: "Strategy", desc: "We define your brand positioning, personality, and messaging pillars." },
  { step: "03", title: "Design", desc: "Multiple concept directions are explored and refined with your input." },
  { step: "04", title: "Deliver", desc: "Final assets, guidelines, and all files delivered, ready for launch." },
];

const BrandingPage = () => (
  <PageLayout>
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Branding studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Branding</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Build a Brand That <span className="text-gradient">Commands Attention</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Your brand is more than a logo — it's the promise you make and the experience you deliver. We create identities that resonate, inspire trust, and drive loyalty.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Start Your Brand Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our Branding <span className="text-gradient">Services</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Everything you need to build, evolve, or reinvent your brand.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {offerings.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all">
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our <span className="text-gradient">Process</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {process.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <span className="text-5xl font-bold text-primary/20">{p.step}</span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Stand Out?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Let's craft a brand identity that sets you apart and drives meaningful connections.</p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  </PageLayout>
);

export default BrandingPage;
