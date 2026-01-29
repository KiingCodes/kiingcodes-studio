import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small businesses & personal sites",
    pages: "1-3 Pages",
    price: "R2,500",
    priceNote: "Starting from",
    icon: Zap,
    features: [
      "Responsive Design",
      "Mobile Optimized",
      "Basic SEO Setup",
      "Contact Form",
      "Social Media Links",
      "1 Revision Round",
      "5 Days Delivery",
    ],
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    pages: "4-6 Pages",
    price: "R5,500",
    priceNote: "Starting from",
    icon: Star,
    features: [
      "Everything in Starter",
      "Custom Animations",
      "Advanced SEO",
      "Blog Integration",
      "Analytics Setup",
      "3 Revision Rounds",
      "Speed Optimization",
      "10 Days Delivery",
    ],
    popular: true,
  },
  {
    name: "Business",
    description: "For established businesses",
    pages: "7-10 Pages",
    price: "R10,000",
    priceNote: "Starting from",
    icon: Crown,
    features: [
      "Everything in Professional",
      "E-commerce Ready",
      "Admin Dashboard",
      "API Integrations",
      "Database Setup",
      "5 Revision Rounds",
      "Priority Support",
      "14 Days Delivery",
    ],
    popular: false,
  },
  {
    name: "Enterprise",
    description: "Full-scale digital solutions",
    pages: "10+ Pages",
    price: "Custom",
    priceNote: "Get a quote",
    icon: Rocket,
    features: [
      "Everything in Business",
      "Custom Features",
      "Full-Stack Development",
      "Mobile App Integration",
      "Cloud Infrastructure",
      "Unlimited Revisions",
      "Dedicated Support",
      "Custom Timeline",
    ],
    popular: false,
  },
];

const PricingCard = ({ plan, index }: { plan: typeof pricingPlans[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-card rounded-2xl p-8 border ${
        plan.popular
          ? "border-primary glow-effect"
          : "border-border hover:border-primary/30"
      } transition-all duration-300 card-hover`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            plan.popular
              ? "bg-gradient-to-br from-primary to-accent"
              : "bg-secondary"
          }`}
        >
          <plan.icon
            className={`w-8 h-8 ${
              plan.popular ? "text-primary-foreground" : "text-primary"
            }`}
          />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
        <div className="inline-block px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground mb-4">
          {plan.pages}
        </div>
        <div>
          <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
          <div className="text-4xl font-bold text-gradient">{plan.price}</div>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={plan.popular ? "hero" : "heroOutline"}
        className="w-full"
        asChild
      >
        <a href="#contact">Get Started</a>
      </Button>
    </motion.div>
  );
};

export const PricingSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/30 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Pricing Plans
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Website <span className="text-gradient">Packages</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Transparent pricing with no hidden fees. Choose the package that fits your
            needs and budget. All prices in South African Rand.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-muted-foreground"
        >
          <p className="mb-4">
            Need something custom? We also offer App Development starting from{" "}
            <span className="text-primary font-semibold">R15,000</span>
          </p>
          <p className="text-sm">
            * Final pricing depends on specific requirements. Contact us for a detailed quote.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
