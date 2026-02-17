import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/jeweliq-logo.png";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
  { href: "#tech", label: "Tech Stack" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (!isHomePage) {
      // Navigate to home page with hash
      window.location.href = "/" + href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start">
            <img 
              src={logo} 
              alt="Jewel IQ Logo" 
              className="h-14 md:h-16 w-auto object-contain"
            />
            <span className="text-[10px] md:text-xs text-muted-foreground tracking-wide -mt-1">Intelligent systems built with precision.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              isHomePage ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={"/" + link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg" asChild>
              {isHomePage ? (
                <a href="#contact">Book a Call</a>
              ) : (
                <a href="/#contact">Book a Call</a>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-card border-b border-border py-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={isHomePage ? link.href : "/" + link.href}
                className="block py-3 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-200"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-4">
              <Button variant="hero" className="w-full" asChild>
                {isHomePage ? (
                  <a href="#contact">Book a Call</a>
                ) : (
                  <a href="/#contact">Book a Call</a>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
