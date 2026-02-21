import { motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/jeweliq-logo.png";
import footerBg from "@/assets/wallpaper-footer.jpg";
import sceneLogo from "@/assets/scene-logo.png"; // <-- add this
import fuseGigsLogo from "@/assets/fusegigs-logo.png"; // <-- add this
import { FloatingDiamond } from "@/components/FloatingDiamond";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappNumber = "27604334341";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 30, 0.92), rgba(10, 15, 30, 0.96)), url(${footerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Subtle Decorations */}
      <FloatingDiamond className="top-20 right-10 opacity-10 z-10" size="w-16" delay={2} />
      <FloatingDiamond className="bottom-32 left-8 opacity-10 z-10" size="w-12" delay={5} duration={10} />

      <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-12">
          <Link to="/" className="mb-4">
            <img 
              src={logo} 
              alt="Jewel IQ Logo" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          <p className="text-muted-foreground text-sm max-w-md">
            Intelligent systems built with precision.  
            We create premium digital experiences that drive real growth.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>

        {/* Partner / Project Logos */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            src={sceneLogo}
            alt="Scene Logo"
            className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />

          <motion.img
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            src={fuseGigsLogo}
            alt="Fuse Gigs Logo"
            className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Bottom */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jewel IQ. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scroll To Top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 z-50 hover:shadow-primary/50 transition-shadow"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};