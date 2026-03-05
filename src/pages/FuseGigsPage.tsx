import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, ShoppingBag, Briefcase, Star, ArrowRight, Globe, Shield, Zap } from "lucide-react";
import fuseGigsLogo from "@/assets/fusegigs-logo.png";

const features = [
  { icon: Users, title: "Community-Driven", description: "Connect with skilled freelancers and businesses in a vibrant marketplace built on trust and collaboration." },
  { icon: ShoppingBag, title: "Gig Marketplace", description: "Browse and post gigs across multiple categories — from design and development to marketing and consulting." },
  { icon: Briefcase, title: "Hire & Get Hired", description: "Whether you're looking for talent or offering your skills, Fuse Gigs matches the right people with the right opportunities." },
  { icon: Shield, title: "Secure Transactions", description: "Built-in escrow and payment protection ensures both clients and freelancers are covered on every project." },
  { icon: Globe, title: "Global Reach", description: "Access talent and opportunities from around the world, with a focus on African markets and emerging economies." },
  { icon: Zap, title: "Fast & Simple", description: "Post a gig in minutes, get proposals within hours, and start working with top talent immediately." },
];



export default function FuseGigsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <FloatingDiamond className="top-32 right-12 opacity-10" size="w-24" delay={1} />
        <FloatingDiamond className="bottom-20 left-8 opacity-10" size="w-16" delay={3} duration={9} />
        <FloatingDiamond className="top-1/2 left-1/4 opacity-8" size="w-12" delay={5} duration={11} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Star className="w-4 h-4" /> Official Partner
            </motion.div>

            <motion.img
              src={fuseGigsLogo}
              alt="Fuse Gigs Logo"
              className="h-20 md:h-28 w-auto object-contain mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Community-Driven Marketplace
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Fuse Gigs is a thriving marketplace where freelancers and businesses connect, 
              collaborate, and grow together. Powered by community, built for impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild className="text-base px-8">
                <a href="https://fusegigs.com" target="_blank" rel="noopener noreferrer">
                  Visit Fuse Gigs <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base px-8">
                <a href="https://fusegigs.com" target="_blank" rel="noopener noreferrer">
                  Join the Marketplace <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <FloatingDiamond className="top-16 right-10 opacity-8" size="w-14" delay={2} duration={10} />
        <FloatingDiamond className="bottom-24 left-6 opacity-8" size="w-10" delay={6} duration={12} />

        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why <span className="text-primary">Fuse Gigs</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A marketplace designed to empower freelancers and connect businesses with top-tier talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              JewelIQ × Fuse Gigs Partnership
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              As an official partner, JewelIQ clients get priority access to Fuse Gigs' talent pool. 
              Need extra hands on your project? We've got you covered through our partnership network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="https://fusegigs.com" target="_blank" rel="noopener noreferrer">
                  Explore Fuse Gigs <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Talk to Us About Partnership</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
