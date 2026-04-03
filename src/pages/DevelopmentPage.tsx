import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Globe, Smartphone, Database, Cloud, Shield, Zap, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/service-development.jpg";

const capabilities = [
  { icon: Globe, title: "Website Development", description: "High-performance, SEO-optimized websites built with React, Next.js, and modern frameworks. Blazing fast, mobile-first, and built to convert." },
  { icon: Smartphone, title: "Mobile App Development", description: "Cross-platform iOS and Android apps with native performance. We use React Native and Flutter to ship beautiful, functional apps fast." },
  { icon: Database, title: "Full-Stack Solutions", description: "End-to-end web applications with robust backends, APIs, and database architecture. From MVP to enterprise-grade systems." },
  { icon: Cloud, title: "Cloud Infrastructure", description: "Scalable cloud deployment on AWS, Vercel, or Supabase. Auto-scaling, CI/CD pipelines, and 99.9% uptime guarantees." },
  { icon: Shield, title: "Security & Performance", description: "Security-first development with OWASP best practices, SSL, rate limiting, and performance optimization for sub-second load times." },
  { icon: Zap, title: "AI & Automation", description: "Intelligent features powered by machine learning — from chatbots to recommendation engines and predictive analytics." },
];

const techStack = ["React", "TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL", "Supabase", "AWS", "Docker", "Tailwind CSS", "React Native", "Flutter"];

const DevelopmentPage = () => (
  <PageLayout>
    <div className="pt-20">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Development studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Development</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Code That <span className="text-gradient">Powers Growth</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              We don't just write code — we engineer solutions. Clean architecture, scalable systems, and pixel-perfect implementations that perform under pressure.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Build With Us <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Development <span className="text-gradient">Expertise</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">From landing pages to complex SaaS platforms — we build it all.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {capabilities.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all">
                <c.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <GitBranch className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Our Tech Stack</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-12">
              {techStack.map((tech) => (
                <span key={tech} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground">{tech}</span>
              ))}
            </div>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  </PageLayout>
);

export default DevelopmentPage;
