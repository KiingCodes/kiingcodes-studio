import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Download, Store, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import fusegigsLogo from "@/assets/fusegigs-logo.png";

export const FuseGigsAd = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-blue-900/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Partner App
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Discover Our Community Marketplace
          </h2>
        </motion.div>

        <motion.a
          href="https://fusegigs-app.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="block max-w-5xl mx-auto group"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 p-8 md:p-12">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="flex-shrink-0"
              >
                <img
                  src={fusegigsLogo}
                  alt="Fuse Gigs - Connect. Hustle. Thrive."
                  className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  <span className="text-amber-400">Fuse</span>{" "}
                  <span className="text-foreground">Gigs</span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed"
                >
                  A community-driven marketplace app designed to{" "}
                  <span className="text-foreground font-medium">discover & connect</span> local 
                  businesses with your community. Market your business, find services, and grow together!
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="text-muted-foreground">List Your Business</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-muted-foreground">Community Driven</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span className="text-muted-foreground">Free to Download</span>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Connect. Hustle. Thrive.
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-sm text-muted-foreground"
        >
          Built with ❤️ by <span className="text-primary">KiingCodes</span> • Supporting local entrepreneurs
        </motion.p>
      </div>
    </section>
  );
};
