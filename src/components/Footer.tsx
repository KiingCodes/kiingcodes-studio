import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/jeweliq-logo.png";
import heroDiamondLogo from "@/assets/jeweliq-diamond-logo.png";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Animated brand background */}
      <AnimatedBackground variant="soft" className="z-0" />

      {/* Diamond Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.img
          src={heroDiamondLogo}
          alt=""
          aria-hidden
          className="w-[500px] h-[500px] object-contain opacity-[0.06] dark:opacity-[0.08]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-secondary/60 dark:bg-card/70 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="inline-block mb-2">
              <img src={logo} alt="Jewel IQ Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground text-xs max-w-[220px]">
              Intelligent systems built with precision. Premium digital experiences that drive growth.
            </p>
          </div>

          {/* Links row */}
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Pages</h4>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Legal</h4>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
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
