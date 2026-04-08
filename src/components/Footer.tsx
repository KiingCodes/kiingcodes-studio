import { motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/jeweliq-logo.png";
import heroDiamondLogo from "@/assets/jeweliq-diamond-logo.png";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappNumber = "27604334341";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ];

  const serviceLinks = [
    { href: "/services/branding", label: "Branding" },
    { href: "/services/design", label: "Design" },
    { href: "/services/development", label: "Development" },
    { href: "/services/marketing", label: "Marketing" },
    { href: "/services/data-insights", label: "Data & Insights" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Diamond Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.img
          src={heroDiamondLogo}
          alt=""
          aria-hidden
          className="w-[600px] h-[600px] object-contain opacity-[0.06] dark:opacity-[0.08]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-secondary/80 dark:bg-card/90" />

      <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Jewel IQ Logo" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Intelligent systems built with precision. We create premium digital experiences that drive real growth.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-background/80 transition-colors inline-flex"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-foreground mb-2">Contact</h4>
            <p className="text-sm text-muted-foreground">kiingncube@gmail.com</p>
            <p className="text-sm text-muted-foreground">+27 60 433 4341</p>
          </div>
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
