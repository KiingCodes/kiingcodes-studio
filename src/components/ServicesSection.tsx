import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { useServices } from "@/hooks/use-dynamic-content";
import {
  Code2, Smartphone, Globe, Lightbulb, TrendingUp, Users, Palette, Database, Cloud,
  Megaphone, PenTool, Image, Video, FileText, Briefcase, Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Smartphone, Database, Palette, Lightbulb, TrendingUp,
  Megaphone, PenTool, Image, Video, FileText, Briefcase, Code2, Cloud, Users, Sparkles,
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, type: "spring" as const, stiffness: 100 },
  }),
};

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const IconComponent = iconMap[service.icon] || Sparkles;

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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-sm" />
      </div>
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
        >
          <IconComponent className="w-7 h-7 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
        {service.price_from > 0 && (
          <span className="text-sm text-primary font-medium">
            From R{service.price_from.toLocaleString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { data: services, isLoading } = useServices();

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <FloatingDiamond className="top-16 right-8 opacity-10" size="w-20" delay={1} />
      <FloatingDiamond className="bottom-24 left-6 opacity-10" size="w-16" delay={4} duration={9} />
      <div className="container mx-auto px-4 md:px-6">
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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border animate-pulse">
                <div className="w-14 h-14 bg-secondary rounded-xl mb-6" />
                <div className="h-6 bg-secondary rounded w-3/4 mb-3" />
                <div className="h-4 bg-secondary rounded w-full mb-2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
