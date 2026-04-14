import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/use-dynamic-content";

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

export const ServicesPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { data: services } = useServices();
  const previewServices = services?.slice(0, 6) ?? [];

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <FloatingDiamond className="top-16 right-8 opacity-10" size="w-20" delay={1} />

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
          {previewServices.map((service: any, index: number) => {
            const image = serviceImages[service.icon] || serviceWebDev;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
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
