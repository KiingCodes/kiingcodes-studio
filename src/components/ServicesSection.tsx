import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { useServices } from "@/hooks/use-dynamic-content";
import { TypewriterText } from "@/components/TypewriterText";

import serviceWebDev from "@/assets/service-web-dev.jpg";
import serviceMobileDev from "@/assets/service-mobile-dev.jpg";
import serviceCloud from "@/assets/service-cloud.jpg";
import serviceGraphicDesign from "@/assets/service-graphic-design.jpg";
import serviceDigitalMarketing from "@/assets/service-digital-marketing.jpg";
import serviceConsulting from "@/assets/service-consulting.jpg";
import serviceSeo from "@/assets/service-seo.jpg";
import serviceUiux from "@/assets/service-uiux.jpg";
import serviceEcommerce from "@/assets/service-ecommerce.jpg";
import serviceAnalytics from "@/assets/service-analytics.jpg";

const serviceImages: Record<string, string> = {
  Globe: serviceWebDev,
  Smartphone: serviceMobileDev,
  Database: serviceCloud,
  Cloud: serviceCloud,
  Palette: serviceGraphicDesign,
  PenTool: serviceUiux,
  Image: serviceGraphicDesign,
  Megaphone: serviceDigitalMarketing,
  TrendingUp: serviceAnalytics,
  Lightbulb: serviceConsulting,
  Briefcase: serviceConsulting,
  Code2: serviceWebDev,
  Video: serviceDigitalMarketing,
  FileText: serviceSeo,
  Users: serviceConsulting,
  Sparkles: serviceEcommerce,
};

export const ServicesSection = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { data: services, isLoading } = useServices();

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <FloatingDiamond className="top-16 right-8 opacity-10" size="w-20" delay={1} />

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
            Comprehensive digital solutions tailored to your needs. From concept
            to deployment, we handle every aspect of your digital journey.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                <div className="h-48 bg-secondary" />
                <div className="p-6">
                  <div className="h-6 bg-secondary rounded w-3/4 mb-3" />
                  <div className="h-4 bg-secondary rounded w-full mb-2" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service: any, index: number) => {
              const image = serviceImages[service.icon] || serviceWebDev;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image}
                      alt={service.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                    <TypewriterText
                      text={service.description || ""}
                      speed={20}
                      delay={index * 100}
                      className="text-muted-foreground text-sm leading-relaxed min-h-[60px]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
