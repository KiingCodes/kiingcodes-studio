import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";
import { usePricingPlans } from "@/hooks/use-dynamic-content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Star, Crown, Rocket,
};
const iconOrder = ["Zap", "Star", "Crown", "Rocket"];

const PricingCard = ({ plan, index }: { plan: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const IconComponent = iconMap[iconOrder[index]] || Zap;
  const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || "[]");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-card rounded-2xl p-8 border ${
        plan.is_popular ? "border-primary glow-effect" : "border-border hover:border-primary/30"
      } transition-all duration-300 card-hover`}
    >
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          plan.is_popular ? "bg-gradient-to-br from-primary to-accent" : "bg-secondary"
        }`}>
          <IconComponent className={`w-8 h-8 ${plan.is_popular ? "text-primary-foreground" : "text-primary"}`} />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
        {plan.price_unit && (
          <div className="inline-block px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground mb-4">
            {plan.price_unit}
          </div>
        )}
        <div>
          <span className="text-xs text-muted-foreground">{plan.price > 0 ? "Starting from" : "Get a quote"}</span>
          <div className="text-4xl font-bold text-gradient">
            {plan.price > 0 ? `R${Number(plan.price).toLocaleString()}` : "Custom"}
          </div>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button variant={plan.is_popular ? "hero" : "heroOutline"} className="w-full" asChild>
        <Link to="/contact">Get Started</Link>
      </Button>
    </motion.div>
  );
};

export const PricingSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { data: plans, isLoading } = usePricingPlans();

  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <FloatingDiamond className="top-20 right-12 opacity-10" size="w-20" delay={1.5} />
      <FloatingDiamond className="bottom-20 left-8 opacity-10" size="w-14" delay={4} duration={10} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border animate-pulse">
                <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto mb-4" />
                <div className="h-6 bg-secondary rounded w-1/2 mx-auto mb-2" />
                <div className="h-8 bg-secondary rounded w-2/3 mx-auto mb-6" />
                <div className="space-y-2">{[1,2,3].map(j=><div key={j} className="h-4 bg-secondary rounded" />)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans?.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        )}

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
