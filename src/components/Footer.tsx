import { motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/jeweliq-logo.png";
import footerBg from "@/assets/wallpaper-footer.jpg";
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
          backgroundImage: `url(${footerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-background/90 dark:bg-background/92" />

      {/* Subtle Decorations */}
      <FloatingDiamond className="top-20 right-10 opacity-10 z-10" size="w-16" delay={2} />
      <FloatingDiamond className="bottom-32 left-8 opacity-10 z-10" size="w-12" delay={5} duration={10} />
      <FloatingDiamond className="top-1/2 left-1/3 opacity-8 z-10" size="w-10" delay={3.5} duration={9} />

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