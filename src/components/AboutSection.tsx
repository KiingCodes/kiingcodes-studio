import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Shield, Clock, HeartHandshake, Award, Lightbulb } from "lucide-react";

const values = [
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

export const AboutSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

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
            Why Choose <span className="text-gradient">KiingCodes</span>?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            We're more than just developers – we're your digital partners. With a passion for
            technology and entrepreneurship, we bring a unique perspective to every project.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Building the Future of Digital Business
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                At KiingCodes, we understand that in today's digital age, having a strong online
                presence is crucial for business success. That's why we combine our expertise in
                full-stack development with entrepreneurial insights to deliver solutions that
                not only look great but drive real business results.
              </p>
              <p>
                Our team brings together years of experience in web development, mobile
                applications, and business strategy. We've helped startups launch their MVPs,
                established businesses modernize their digital infrastructure, and entrepreneurs
                turn their ideas into thriving online ventures.
              </p>
              <p>
                Whether you need a simple landing page or a complex enterprise application, we
                approach every project with the same level of dedication and attention to detail.
                Your vision, our expertise – together, we create digital excellence.
              </p>
            </div>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl p-8 border border-border glow-effect"
          >
            <h4 className="text-xl font-semibold text-foreground mb-8 text-center">
              Our Expertise
            </h4>
            <div className="space-y-6">
              {[
                { label: "Full-Stack Development", value: 95 },
                { label: "UI/UX Design", value: 90 },
                { label: "Mobile Development", value: 85 },
                { label: "Business Strategy", value: 88 },
                { label: "Cloud & DevOps", value: 82 },
              ].map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{skill.label}</span>
                    <span className="text-sm text-primary font-medium">{skill.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isHeaderInView ? { width: `${skill.value}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true, margin: "-50px" });

            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/50 rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
