import { motion } from "framer-motion";
import { Mail, Phone, ArrowUp, MessageCircle, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import logo from "@/assets/jeweliq-logo.png";
import footerBg from "@/assets/wallpaper-footer.jpg";

const footerLinks = {
  services: [
    { label: "Website Development", href: "#services" },
    { label: "Mobile Apps", href: "#services" },
    { label: "UI/UX Design", href: "#services" },
    { label: "Consulting", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Work", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Support", href: "#contact" },
  ],
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const whatsappNumber = "27604334341";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="relative overflow-hidden">
      {/* Background Wallpaper */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 30, 0.92), rgba(10, 15, 30, 0.96)), url(${footerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10" />

      {/* Showreel Video Section */}
      <div className="relative z-10 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider"></span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2"></h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-border glow-effect cursor-pointer group"
              onClick={toggleVideo}
            >
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source src="/videos/showreel.mp4" type="video/mp4" />
              </video>
              {!isPlaying && (
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center group-hover:bg-background/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex flex-col items-start mb-2">
              <img 
                src={logo} 
                alt="Jewel IQ Logo" 
                className="h-16 w-auto object-contain"
              />
              <span className="text-xs text-muted-foreground tracking-wide -mt-1">Intelligent systems built with precision.</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Premium web development and intelligent systems studio. Building digital
              experiences that drive growth.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@jeweliq.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  jeweliq.tech@outlook.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+27604334341"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  +27 60 433 4341
                  +27 63 567 9395
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Jewel IQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
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
