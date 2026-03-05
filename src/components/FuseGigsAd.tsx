import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import fusegigsLogo from "@/assets/fusegigs-logo.png";

export const FuseGigsAd = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <a
            href="https://fusegigs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 hover:border-primary/30 transition-all duration-300"
            >
              <img
                src={fusegigsLogo}
                alt="Fuse Gigs"
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Partner Marketplace
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Install Fuse Gigs Marketplace
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A community-driven marketplace to discover local businesses, post gigs, and grow together.
                </p>
                <Button size="sm" variant="hero" className="gap-2">
                  <Download className="w-4 h-4" />
                  Get Fuse Gigs
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
