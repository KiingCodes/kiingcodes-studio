import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useServices } from "@/hooks/use-dynamic-content";

import serviceWebDev from "@/assets/service-web-dev.jpg";
import serviceWebDevV2 from "@/assets/service-web-dev-v2.jpg";
import serviceMobileDevV2 from "@/assets/service-mobile-dev-v2.jpg";
import serviceStartupConsulting from "@/assets/service-startup-consulting.jpg";
import serviceBusinessDev from "@/assets/service-business-dev.jpg";
import serviceCloud from "@/assets/service-cloud.jpg";
import serviceUiux from "@/assets/service-uiux.jpg";
import serviceAnalytics from "@/assets/service-analytics.jpg";
import serviceConsulting from "@/assets/service-consulting.jpg";
import serviceEcommerce from "@/assets/service-ecommerce.jpg";
import serviceDocumentation from "@/assets/service-documentation.png";
import serviceGraphicDesignNew from "@/assets/service-graphic-design-new.png";
import serviceCopywriting from "@/assets/service-copywriting.png";
import serviceMarketingNew from "@/assets/service-marketing-new.png";
import serviceFullstack from "@/assets/service-fullstack.png";

const iconImages: Record<string, string> = {
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

const titleOverrides: { match: RegExp; image: string }[] = [
  { match: /website\s*development|web\s*development/i, image: serviceWebDevV2 },
  { match: /mobile\s*app|mobile\s*development/i, image: serviceMobileDevV2 },
  { match: /startup\s*consult/i, image: serviceStartupConsulting },
  { match: /business\s*development|project\s*management/i, image: serviceBusinessDev },
  { match: /document/i, image: serviceDocumentation },
  { match: /graphic\s*design/i, image: serviceGraphicDesignNew },
  { match: /copywriting|storytelling/i, image: serviceCopywriting },
  { match: /marketing|social/i, image: serviceMarketingNew },
  { match: /full[-\s]?stack/i, image: serviceFullstack },
];

const pickImage = (service: any) => {
  const t = titleOverrides.find((o) => o.match.test(service.title || ""));
  return t?.image || iconImages[service.icon] || serviceWebDev;
};

interface Props {
  /** seconds per full loop — lower = faster */
  speed?: number;
  /** reverse direction */
  reverse?: boolean;
}

const ServiceCard = ({ service }: { service: any }) => (
  <div
    className="group relative block w-[320px] md:w-[360px] shrink-0 rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.45)] hover:border-primary/50 transition-all duration-500"
  >
    <div className="relative h-44 overflow-hidden">
      <img
        src={pickImage(service)}
        alt={service.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      {service.description && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
          {service.description}
        </p>
      )}
      <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
        Explore <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </div>
);

export const ServicesMarquee = ({ speed = 45, reverse = false }: Props) => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(headerRef, { once: true });
  const { data: services, isLoading } = useServices();

  const list = services ?? [];
  // Duplicate enough times to fill on wide screens with few services
  const minCount = 8;
  const repeat = list.length > 0 ? Math.max(2, Math.ceil(minCount / list.length)) : 0;
  const track = Array.from({ length: repeat }).flatMap(() => list);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-xs uppercase tracking-[0.3em] mb-4 block">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need, <span className="text-gradient">in motion</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            A premium suite of digital services — flowing, always on, always evolving.
          </p>
        </motion.div>
      </div>

      {isLoading || track.length === 0 ? (
        <div className="container mx-auto px-4">
          <div className="h-64 rounded-2xl bg-card/40 border border-border animate-pulse" />
        </div>
      ) : (
        <div
          className="relative group/marquee"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <motion.div
            className="flex gap-6 w-max py-4"
            animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            {[...track, ...track].map((s, i) => (
              <ServiceCard key={`${s.id}-${i}`} service={s} />
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ServicesMarquee;