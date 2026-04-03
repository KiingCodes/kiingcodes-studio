import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Megaphone, TrendingUp, Search, Mail, PenTool, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/service-marketing.jpg";

const services = [
  { icon: TrendingUp, title: "Social Media Marketing", description: "Strategic content planning, community management, and paid social campaigns across Instagram, LinkedIn, Facebook, TikTok, and X." },
  { icon: Search, title: "SEO & SEM", description: "Dominate search results with technical SEO, content optimization, and targeted Google Ads campaigns that deliver measurable ROI." },
  { icon: PenTool, title: "Content Marketing", description: "Compelling blog posts, case studies, whitepapers, and video content that establish thought leadership and drive organic traffic." },
  { icon: Mail, title: "Email Marketing", description: "Automated email sequences, newsletters, and drip campaigns with A/B testing that nurture leads and boost conversions." },
  { icon: BarChart3, title: "Analytics & Reporting", description: "Data-driven insights with custom dashboards, conversion tracking, and monthly performance reports that inform strategy." },
  { icon: Megaphone, title: "Campaign Strategy", description: "Full-funnel campaign planning from awareness to conversion. We map every touchpoint and optimize for maximum impact." },
];

const MarketingPage = () => (
  <PageLayout>
    <div className="pt-20">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Marketing command center" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Marketing</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Marketing That <span className="text-gradient">Moves Needles</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              We don't do vanity metrics. Every campaign, every piece of content, every ad dollar is optimized for real business growth — more leads, more conversions, more revenue.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Grow Your Business <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Marketing <span className="text-gradient">Services</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Full-spectrum digital marketing to amplify your brand and accelerate growth.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Scale?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Let's build a marketing engine that turns clicks into customers and browsers into buyers.</p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Let's Talk Strategy</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  </PageLayout>
);

export default MarketingPage;
