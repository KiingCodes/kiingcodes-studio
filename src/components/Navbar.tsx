import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Settings, Sun, Moon, Shield, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/jeweliq-logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    href: "/services",
    children: [
      { href: "/services", label: "All Services" },
      { href: "/services/branding", label: "Branding" },
      { href: "/services/design", label: "Design" },
      { href: "/services/development", label: "Development" },
      { href: "/services/marketing", label: "Marketing" },
      { href: "/services/data-insights", label: "Data & Insights" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
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
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <Link
                    to={link.href}
                    className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                      isRouteActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </Link>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card border border-border rounded-xl shadow-lg py-2 min-w-[180px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isRouteActive(child.href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isRouteActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            {user && (
              <Link
                to="/reports"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isRouteActive("/reports") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reports
              </Link>
            )}

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
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
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
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild><Link to="/login">Sign In</Link></Button>
                <Button variant="hero" asChild><Link to="/login?mode=signup">Sign Up</Link></Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button className="text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-card border-b border-border py-4">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between py-3 px-4 text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`block py-2 px-4 text-sm ${isRouteActive(child.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block py-3 px-4 transition-colors duration-200 ${isRouteActive(link.href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            {user && (
              <Link to="/reports" className="block py-3 px-4 text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                Reports
              </Link>
            )}

            {roleLinks.map(({ href, label }) => (
              <Link key={href} to={href} className={`block py-3 px-4 font-semibold ${isRouteActive(href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setIsMobileMenuOpen(false)}>
                {label}
              </Link>
            ))}

            <div className="px-4 pt-4 space-y-2">
              {user ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}><Settings className="w-4 h-4 mr-2" /> Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link></Button>
                  <Button variant="hero" className="w-full" asChild><Link to="/login?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link></Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
