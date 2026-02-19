import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Smartphone, Palette, Megaphone, Database, Lightbulb } from "lucide-react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";

const previewServices = [
  { icon: Globe, title: "Website Development", description: "Custom, responsive websites built with modern technologies that convert visitors into customers." },
  { icon: Smartphone, title: "Mobile App Development", description: "Cross-platform mobile apps that deliver native-like experiences users love." },
  { icon: Database, title: "Full-Stack Solutions", description: "End-to-end development with robust backends and scalable cloud infrastructure." },
  { icon: Palette, title: "UI/UX Design", description: "Beautiful, intuitive interfaces designed with your users in mind." },
  { icon: Megaphone, title: "Digital Marketing", description: "Data-driven strategies designed to grow reach, engagement, and revenue." },
  { icon: Lightbulb, title: "Startup Consulting", description: "Strategic guidance to validate ideas, build MVPs, and scale your products." },
];

export const ServicesPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <FloatingDiamond className="top-16 right-8 opacity-10" size="w-20" delay={1} />
      <FloatingDiamond className="bottom-24 left-6 opacity-10" size="w-16" delay={4} duration={9} />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            What We <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive digital solutions tailored to your needs. From concept to deployment,
            we handle every aspect of your digital journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
                >
                  <service.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/services" className="group">
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
