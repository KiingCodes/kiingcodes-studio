import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
import servicesWebAi from "@/assets/services-web-ai.png";
import servicesMobileIt from "@/assets/services-mobile-it.png";
import servicesGraphicDocs from "@/assets/services-graphic-docs.png";
import servicesBusinessMarketing from "@/assets/services-business-marketing.png";

const servicePosters = [
  {
    src: servicesWebAi,
    alt: "Web Development & AI Solutions - Custom websites, e-commerce, CMS, AI development, automation, and data analytics",
  },
  {
    src: servicesMobileIt,
    alt: "Mobile App Development & IT Consulting - iOS, Android, cross-platform apps, cloud solutions, cybersecurity",
  },
  {
    src: servicesGraphicDocs,
    alt: "Graphic Designing & Software Documentation - Logo, branding, UI/UX graphics, technical docs, API documentation",
  },
  {
    src: servicesBusinessMarketing,
    alt: "Business Development & Digital Marketing - Market research, strategic planning, social media, SEO, content marketing",
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="floating-orb w-96 h-96 bg-primary top-20 -left-48 opacity-10" />
        <div className="floating-orb w-80 h-80 bg-accent bottom-20 -right-40 opacity-10" />
        <FloatingDiamond className="top-12 left-8 opacity-10" size="w-16" delay={2} />
        <FloatingDiamond className="bottom-16 right-10 opacity-10" size="w-20" delay={5} duration={8} />

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
              Explore our comprehensive range of digital solutions designed to transform your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {servicePosters.map((poster, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: 8 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 100 }}
                className="group relative cursor-pointer perspective-1000"
                onClick={() => openLightbox(index)}
              >
                {/* Animated glow ring */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
                    filter: "blur(12px)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  whileHover={{ scale: 1.03, rotateY: 2, rotateX: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-xl overflow-hidden shadow-xl border border-primary/20 bg-card"
                >
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay with zoom icon */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40"
                    >
                      <ZoomIn className="w-7 h-7 text-primary-foreground" />
                    </motion.div>
                  </motion.div>

                  {/* Shine sweep effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div
                      className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000 ease-out"
                    />
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
