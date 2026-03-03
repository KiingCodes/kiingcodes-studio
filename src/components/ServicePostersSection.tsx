import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { ArrowRight } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
import servicesWebAi from "@/assets/services-web-ai.png";
import servicesMobileIt from "@/assets/services-mobile-it.png";
import servicesGraphicDocs from "@/assets/services-graphic-docs.png";
import servicesBusinessMarketing from "@/assets/services-business-marketing.png";

const servicePosters = [
  {
    src: servicesWebAi,
    alt: "Web Development & AI Solutions",
    label: "Web & AI Solutions",
    description: "Custom websites, e-commerce, CMS, AI development, automation, and data analytics",
  },
  {
    src: servicesMobileIt,
    alt: "Mobile App Development & IT Consulting",
    label: "Mobile & IT",
    description: "iOS, Android, cross-platform apps, cloud solutions, cybersecurity",
  },
  {
    src: servicesGraphicDocs,
    alt: "Graphic Designing & Software Documentation",
    label: "Design & Docs",
    description: "Logo, branding, UI/UX graphics, technical docs, API documentation",
  },
  {
    src: servicesBusinessMarketing,
    alt: "Business Development & Digital Marketing",
    label: "Business & Marketing",
    description: "Market research, strategic planning, social media, SEO, content marketing",
  },
];

export const ServicePostersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <FloatingDiamond className="top-12 left-8 opacity-10" size="w-16" delay={2} />
        <FloatingDiamond className="bottom-16 right-10 opacity-10" size="w-20" delay={5} duration={8} />
        <FloatingDiamond className="top-1/3 right-4 opacity-8" size="w-12" delay={3.5} duration={10} />
        <FloatingDiamond className="bottom-1/3 left-1/4 opacity-8" size="w-10" delay={7} duration={11} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Our Services</span> at a Glance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tap any category to explore our comprehensive digital solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {servicePosters.map((poster, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 100 }}
                className="group relative cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-xl overflow-hidden"
                >
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">{poster.label}</h3>
                    <p className="text-muted-foreground text-sm mb-4 max-w-xs">{poster.description}</p>
                    <Link
                      to="/services"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                    >
                      View Services <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25"
            >
              Get Started Today
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-1"
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      <ImageLightbox
        images={servicePosters}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};
