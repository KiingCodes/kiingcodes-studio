import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import {
  Code2, Smartphone, Globe, Lightbulb, TrendingUp, Users, Palette, Database, Cloud,
  Megaphone, PenTool, Image, Video, FileText, Briefcase,
} from "lucide-react";

const services = [
  { icon: Globe, title: "Website Development", description: "Custom, responsive websites built with modern technologies. From landing pages to complex web applications, we deliver pixel-perfect designs that convert.", features: ["React & Next.js", "SEO Optimized", "Mobile First", "Fast Loading"] },
  { icon: Smartphone, title: "Mobile App Development", description: "Cross-platform mobile applications that deliver native-like experiences. We build apps that users love and businesses rely on.", features: ["React Native", "iOS & Android", "Push Notifications", "Offline Support"] },
  { icon: Database, title: "Full-Stack Solutions", description: "End-to-end development with robust backends and scalable infrastructure. Complete solutions from database design to cloud deployment.", features: ["Node.js & Python", "PostgreSQL & MongoDB", "REST & GraphQL APIs", "Cloud Hosting"] },
  { icon: Palette, title: "UI/UX Design", description: "Beautiful, intuitive interfaces designed with your users in mind. We create designs that are not just stunning but also highly functional.", features: ["User Research", "Wireframing", "Prototyping", "Design Systems"] },
  { icon: Lightbulb, title: "Startup Consulting", description: "Strategic guidance for entrepreneurs and startups. We help you validate ideas, build MVPs, and scale your digital products.", features: ["MVP Development", "Market Validation", "Tech Strategy", "Growth Planning"] },
  { icon: TrendingUp, title: "Business Development", description: "Turn your business vision into reality with our entrepreneurship expertise. From ideation to execution, we're your digital partner.", features: ["Business Strategy", "Digital Transformation", "Process Automation", "Analytics"] },
  { icon: Megaphone, title: "Digital & Social Media Marketing", description: "Data-driven digital marketing strategies designed to grow reach, engagement, and revenue.", features: ["Social Media Campaigns", "Paid Ads (Meta & Google)", "Analytics & Reporting", "Brand Growth Strategy"] },
  { icon: PenTool, title: "Advanced Copywriting & Storytelling", description: "High-impact messaging that connects, converts, and builds brand loyalty.", features: ["Brand Voice Development", "Website & App Copy", "Ad & Sales Copy", "Storytelling Frameworks"] },
  { icon: Image, title: "Graphic Design", description: "Visually compelling designs that elevate your brand identity across digital and print platforms.", features: ["Brand Identity", "Marketing Collateral", "UI Assets", "Social Media Creatives"] },
  { icon: Video, title: "Content Creation", description: "Scroll-stopping content engineered for modern platforms. We create content that educates, entertains, and converts.", features: ["Short-Form Video", "Content Strategy", "Photography & Visuals", "Platform Optimization"] },
  { icon: FileText, title: "Software Documentation", description: "Clear, structured documentation that improves onboarding, reduces support costs, and scales with your product.", features: ["Technical Documentation", "API Docs", "User Guides", "Knowledge Bases"] },
  { icon: Briefcase, title: "Project Management", description: "End-to-end project oversight ensuring timelines, budgets, and deliverables stay aligned.", features: ["Agile & Scrum", "Roadmapping", "Stakeholder Management", "Delivery Tracking"] },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, type: "spring" as const, stiffness: 100 },
  }),
};

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-sm" />
      </div>

      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
        >
          <service.icon className="w-7 h-7 text-primary" />
        </motion.div>

        <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

        <div className="flex flex-wrap gap-2">
          {service.features.map((feature, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.08 + i * 0.05 + 0.3 }}
              className="px-3 py-1 text-xs font-medium bg-secondary rounded-full text-muted-foreground"
            >
              {feature}
            </motion.span>
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
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <FloatingDiamond className="top-16 right-8 opacity-10" size="w-20" delay={1} />
      <FloatingDiamond className="bottom-24 left-6 opacity-10" size="w-16" delay={4} duration={9} />
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={isHeaderInView ? { opacity: 1, letterSpacing: "0.15em" } : {}}
            transition={{ duration: 0.8 }}
            className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block"
          >
            Our Services
          </motion.span>
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
