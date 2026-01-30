import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import specialOffer from "@/assets/special-offer.png";

export const SpecialOfferBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="floating-orb w-64 h-64 bg-accent top-0 -right-32 opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <a
            href="#contact"
            className="block relative group cursor-pointer"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
            
            {/* Banner Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/30"
            >
              <img
                src={specialOffer}
                alt="Special Offer - 4-6 Page Website Package Only R1,800 - Limited Time Deal! Includes Custom Design, Mobile Responsive, Contact Forms, Image Gallery"
                className="w-full h-auto"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Claim This Offer →
                </span>
              </div>
            </motion.div>
          </a>

          {/* Urgency Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Limited time offer - Click to book now!
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
