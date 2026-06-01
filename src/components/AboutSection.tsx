import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import {
  Target,
  Shield,
  Clock,
  HeartHandshake,
  Award,
  Lightbulb,
  LucideIcon,
} from "lucide-react";

/* ----------------------------- */
/* Types */
/* ----------------------------- */

type ValueItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/* ----------------------------- */
/* Data */
/* ----------------------------- */

const values: ValueItem[] = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're committed to helping businesses and entrepreneurs succeed in the digital landscape with cutting-edge solutions.",
  },
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every line of code, every pixel, every interaction is crafted with precision and attention to detail.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We respect your deadlines and work efficiently to deliver projects on time, every time.",
  },
  {
    icon: HeartHandshake,
    title: "Client Partnership",
    description:
      "Your success is our success. We build lasting relationships based on trust and transparency.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from initial concept to final deployment.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We stay ahead of the curve, adopting the latest technologies and best practices.",
  },
];

/* ----------------------------- */
/* Value Card Component */
/* ----------------------------- */

type ValueCardProps = ValueItem & {
  index: number;
};

const ValueCard = ({ icon: Icon, title, description, index }: ValueCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card/50 rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      <h4 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h4>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
};

/* ----------------------------- */
/* Main About Section */
/* ----------------------------- */

export const AboutSection = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <FloatingDiamond
        className="top-16 left-10 opacity-10"
        size="w-20"
        delay={1}
      />

      <FloatingDiamond
        className="bottom-24 right-8 opacity-10"
        size="w-16"
        delay={1}
        duration={9}
      />

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
            About Us
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="text-gradient">Jewel IQ</span>?
          </h2>

          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            We're more than just developers – we're your digital partners.
            With a passion for technology and entrepreneurship, we bring a
            unique perspective to every project.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              {...value}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
