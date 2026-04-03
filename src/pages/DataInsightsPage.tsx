import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BarChart3, PieChart, TrendingUp, Database, Brain, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/service-data-insights.jpg";

const services = [
  { icon: BarChart3, title: "Business Intelligence", description: "Custom dashboards and reports that transform raw data into actionable insights. Know your numbers, make smarter decisions." },
  { icon: Brain, title: "Predictive Analytics", description: "Machine learning models that forecast trends, customer behavior, and market shifts — so you're always one step ahead." },
  { icon: PieChart, title: "Data Visualization", description: "Beautiful, interactive charts and infographics that make complex data digestible for stakeholders at every level." },
  { icon: Database, title: "Data Architecture", description: "Scalable data pipelines, warehouses, and ETL processes that ensure your data is clean, accessible, and secure." },
  { icon: TrendingUp, title: "Performance Analytics", description: "Deep-dive analysis into marketing, sales, and operational performance with KPI tracking and benchmarking." },
  { icon: LineChart, title: "Custom Reporting", description: "Automated, branded reports delivered on your schedule — weekly, monthly, or real-time. Always know where you stand." },
];

const stats = [
  { value: "10x", label: "Faster Insights" },
  { value: "98%", label: "Data Accuracy" },
  { value: "360°", label: "Customer View" },
  { value: "24/7", label: "Real-Time Monitoring" },
];

const DataInsightsPage = () => (
  <PageLayout>
    <div className="pt-20">
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Data analytics dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/85" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Data & Insights</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Turn Data Into <span className="text-gradient">Competitive Advantage</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Data without insight is just noise. We help you collect, analyze, and act on your data — transforming numbers into strategy and guesswork into precision.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="group">
                Unlock Your Data <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <span className="text-4xl md:text-5xl font-bold text-primary">{s.value}</span>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Data & Analytics <span className="text-gradient">Services</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">From data collection to actionable insights — we handle the full analytics lifecycle.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Data-Driven Decisions Start Here</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Stop guessing. Start knowing. Let's build your analytics foundation today.</p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  </PageLayout>
);

export default DataInsightsPage;
