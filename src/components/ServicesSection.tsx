import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Smartphone,
  Globe,
  Lightbulb,
  TrendingUp,
  Users,
  Palette,
  Database,
  Cloud,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom, responsive websites built with modern technologies. From landing pages to complex web applications, we deliver pixel-perfect designs that convert.",
    features: ["React & Next.js", "SEO Optimized", "Mobile First", "Fast Loading"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Cross-platform mobile applications that deliver native-like experiences. We build apps that users love and businesses rely on.",
    features: ["React Native", "iOS & Android", "Push Notifications", "Offline Support"],
  },
  {
    icon: Database,
    title: "Full-Stack Solutions",
    description:
      "End-to-end development with robust backends and scalable infrastructure. Complete solutions from database design to cloud deployment.",
    features: ["Node.js & Python", "PostgreSQL & MongoDB", "REST & GraphQL APIs", "Cloud Hosting"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces designed with your users in mind. We create designs that are not just stunning but also highly functional.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
  },
  {
    icon: Lightbulb,
    title: "Startup Consulting",
    description:
      "Strategic guidance for entrepreneurs and startups. We help you validate ideas, build MVPs, and scale your digital products.",
    features: ["MVP Development", "Market Validation", "Tech Strategy", "Growth Planning"],
  },
  {
    icon: TrendingUp,
    title: "Business Development",
    description:
      "Turn your business vision into reality with our entrepreneurship expertise. From ideation to execution, we're your digital partner.",
    features: ["Business Strategy", "Digital Transformation", "Process Automation", "Analytics"],
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 card-hover"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <service.icon className="w-7 h-7 text-primary" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

        <div className="flex flex-wrap gap-2">
          {service.features.map((feature, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-secondary rounded-full text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
