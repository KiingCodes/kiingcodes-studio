import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="floating-orb w-96 h-96 bg-primary top-20 -left-48 opacity-10" />
      <div className="floating-orb w-80 h-80 bg-accent bottom-20 -right-40 opacity-10" />

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
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-xl overflow-hidden shadow-xl border border-primary/20 bg-card"
              >
                <img
                  src={poster.src}
                  alt={poster.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
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
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25"
          >
            Get Started Today
            <span className="ml-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
