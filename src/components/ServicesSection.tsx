import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { useServices } from "@/hooks/use-dynamic-content";
import { TypewriterText } from "@/components/TypewriterText";

import serviceWebDev from "@/assets/service-web-dev.jpg";
import serviceMobileDev from "@/assets/service-mobile-dev.jpg";
import serviceWebDevNew from "@/assets/service-web-dev-new.jpg";
import serviceMobileDevNew from "@/assets/service-mobile-dev-new.jpg";
import serviceWebDevV2 from "@/assets/service-web-dev-v2.jpg";
import serviceMobileDevV2 from "@/assets/service-mobile-dev-v2.jpg";
import serviceStartupConsulting from "@/assets/service-startup-consulting.jpg";
import serviceBusinessDev from "@/assets/service-business-dev.jpg";
import serviceCloud from "@/assets/service-cloud.jpg";
import serviceGraphicDesign from "@/assets/service-graphic-design.jpg";
import serviceDigitalMarketing from "@/assets/service-digital-marketing.jpg";
import serviceConsulting from "@/assets/service-consulting.jpg";
import serviceSeo from "@/assets/service-seo.jpg";
import serviceUiux from "@/assets/service-uiux.jpg";
import serviceEcommerce from "@/assets/service-ecommerce.jpg";
import serviceAnalytics from "@/assets/service-analytics.jpg";
import serviceDocumentation from "@/assets/service-documentation.png";
import serviceGraphicDesignNew from "@/assets/service-graphic-design-new.png";
import serviceCopywriting from "@/assets/service-copywriting.png";
import serviceMarketingNew from "@/assets/service-marketing-new.png";
import serviceFullstack from "@/assets/service-fullstack.png";
import serviceMobileApp from "@/assets/service-mobile-app.png";
import serviceWebsiteDev from "@/assets/service-website-dev.png";
import serviceProjectMgmt from "@/assets/service-project-management.png";
import serviceBusinessDevNew from "@/assets/service-business-development.png";
import serviceStartupConsultation from "@/assets/service-startup-consultation.png";

const serviceImages: Record<string, string> = {
  Globe: serviceWebDevV2,
  Smartphone: serviceMobileDevV2,
  Database: serviceCloud,
  Cloud: serviceCloud,
  Palette: serviceGraphicDesignNew,
  PenTool: serviceUiux,
  Image: serviceGraphicDesignNew,
  Megaphone: serviceMarketingNew,
  TrendingUp: serviceAnalytics,
  Lightbulb: serviceStartupConsulting,
  Briefcase: serviceBusinessDev,
  Code2: serviceWebDevV2,
  Video: serviceMarketingNew,
  FileText: serviceDocumentation,
  Users: serviceConsulting,
  Sparkles: serviceEcommerce,
};

// Title-based overrides take precedence over icon mapping
const titleImageOverrides: { match: RegExp; image: string }[] = [
  { match: /website\s*development|web\s*development/i, image: serviceWebsiteDev },
  { match: /mobile\s*app|mobile\s*development/i, image: serviceMobileApp },
  { match: /project\s*management/i, image: serviceProjectMgmt },
  { match: /startup\s*consult/i, image: serviceStartupConsultation },
  { match: /business\s*development/i, image: serviceBusinessDevNew },
  { match: /document/i, image: serviceDocumentation },
  { match: /graphic\s*design/i, image: serviceGraphicDesignNew },
  { match: /copywriting|storytelling/i, image: serviceCopywriting },
  { match: /marketing|social/i, image: serviceMarketingNew },
  { match: /full[-\s]?stack/i, image: serviceFullstack },
];

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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient">Services</span>
          </h2>
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
              const titleMatch = titleImageOverrides.find((o) =>
                o.match.test(service.title || "")
              );
              const image =
                titleMatch?.image ||
                serviceImages[service.icon] ||
                serviceWebDev;
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
