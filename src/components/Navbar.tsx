import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Settings, Sun, Moon, Shield, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/jeweliq-logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/fuse-gigs", label: "Fuse Gigs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/reports", label: "Reports", authOnly: true },
] as const;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isRouteActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname === href || location.pathname.startsWith(`${href}/`);

  const visibleLinks = navLinks.filter((link) => !("authOnly" in link && link.authOnly && !user));

  const roleLinks = [
    { href: "/portal", label: "Client Portal", icon: LayoutDashboard, show: !!user },
    { href: "/admin", label: "Admin Panel", icon: Shield, show: !!user && isAdmin },
  ].filter((link) => link.show);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          <Link to="/" className="flex flex-col items-start shrink-0">
            <img src={logo} alt="Jewel IQ Logo" className="h-14 md:h-16 w-auto object-contain" />
            <span className="text-[10px] md:text-xs text-muted-foreground tracking-wide -mt-1">
              Intelligent systems built with precision.
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isRouteActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {roleLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isRouteActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/settings" className="text-muted-foreground hover:text-foreground" aria-label="Settings">
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/login?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-card border-b border-border py-4"
          >
            {[...visibleLinks, ...roleLinks.map(({ href, label }) => ({ href, label }))].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-3 px-4 transition-colors duration-200 ${
                  isRouteActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 pt-4 space-y-2">
              {user ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="hero" className="w-full" asChild>
                    <Link to="/login?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
