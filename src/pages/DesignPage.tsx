import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Figma, MonitorSmartphone, Layers, PenTool, Accessibility, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/service-design.jpg";

const services = [
  { icon: PenTool, title: "UI/UX Design", description: "Human-centered interfaces that are intuitive, beautiful, and conversion-focused. Every pixel serves a purpose." },
  { icon: Layers, title: "Design Systems", description: "Scalable, consistent component libraries that keep your product cohesive as your team and features grow." },
  { icon: MonitorSmartphone, title: "Responsive Design", description: "Seamless experiences across every device and screen size — from mobile to ultra-wide desktop." },
  { icon: Palette, title: "Graphic Design", description: "Eye-catching visuals for social media, print, presentations, and marketing collateral that amplify your brand." },
  { icon: Accessibility, title: "Accessibility-First", description: "WCAG-compliant designs that ensure every user, regardless of ability, can interact with your product." },
  { icon: Figma, title: "Prototyping & Testing", description: "Interactive prototypes and usability testing that validate ideas before a single line of code is written." },
];

const DesignPage = () => (
  <PageLayout>
    <div className="pt-20">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Design studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Design</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Design That <span className="text-gradient">Speaks Volumes</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Great design isn't decoration — it's communication. We create visual experiences that connect with users emotionally and guide them effortlessly to action.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Explore Design Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Design <span className="text-gradient">Capabilities</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">From concept to pixel-perfect delivery, we cover the full design spectrum.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all">
                <s.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Let's Create Something Beautiful</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Whether it's a full product redesign or fresh marketing graphics, we're ready to bring your vision to life.</p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Start a Project</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  </PageLayout>
);

export default DesignPage;
