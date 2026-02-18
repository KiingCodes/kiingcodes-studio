import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingDiamond } from "@/components/FloatingDiamond";

const technologies = {
  frontend: [
    { name: "React", color: "from-cyan-400 to-blue-500" },
    { name: "Next.js", color: "from-gray-400 to-gray-600" },
    { name: "TypeScript", color: "from-blue-400 to-blue-600" },
    { name: "Tailwind CSS", color: "from-teal-400 to-cyan-500" },
    { name: "Vue.js", color: "from-green-400 to-emerald-500" },
    { name: "Framer Motion", color: "from-pink-400 to-purple-500" },
  ],
  backend: [
    { name: "Node.js", color: "from-green-500 to-green-700" },
    { name: "Python", color: "from-yellow-400 to-blue-500" },
    { name: "Express.js", color: "from-gray-400 to-gray-600" },
    { name: "FastAPI", color: "from-teal-400 to-green-500" },
    { name: "GraphQL", color: "from-pink-500 to-pink-700" },
    { name: "REST APIs", color: "from-orange-400 to-red-500" },
  ],
  database: [
    { name: "PostgreSQL", color: "from-blue-400 to-blue-600" },
    { name: "MongoDB", color: "from-green-400 to-green-600" },
    { name: "MySQL", color: "from-blue-500 to-orange-500" },
    { name: "Redis", color: "from-red-500 to-red-700" },
    { name: "Firebase", color: "from-yellow-400 to-orange-500" },
    { name: "Supabase", color: "from-green-400 to-emerald-500" },
  ],
  tools: [
    { name: "Git", color: "from-orange-400 to-red-500" },
    { name: "Docker", color: "from-blue-400 to-blue-600" },
    { name: "AWS", color: "from-yellow-400 to-orange-500" },
    { name: "Vercel", color: "from-gray-400 to-gray-600" },
    { name: "Figma", color: "from-pink-400 to-purple-500" },
    { name: "VS Code", color: "from-blue-400 to-blue-600" },
  ],
};

const TechBadge = ({ tech, index }: { tech: { name: string; color: string }; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="group relative"
    >
      <div className={`px-5 py-3 rounded-xl bg-gradient-to-r ${tech.color} bg-opacity-10 border border-border hover:border-primary/50 transition-all duration-300`}>
        <span className="text-sm font-medium text-foreground">{tech.name}</span>
      </div>
    </motion.div>
  );
};

export const TechStackSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const categories = [
    { title: "Frontend", techs: technologies.frontend },
    { title: "Backend", techs: technologies.backend },
    { title: "Database", techs: technologies.database },
    { title: "Tools & Cloud", techs: technologies.tools },
  ];

  return (
    <section id="tech" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>
      <FloatingDiamond className="top-12 right-10 opacity-10" size="w-18 md:w-22" delay={1} />
      <FloatingDiamond className="bottom-16 left-6 opacity-10" size="w-14" delay={3.5} duration={8} />

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
            Technology Stack
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Powered by <span className="text-gradient">Modern Tech</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We use the latest and most reliable technologies to build scalable,
            performant, and maintainable applications.
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full" />
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {category.techs.map((tech, index) => (
                  <TechBadge key={tech.name} tech={tech} index={index} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            And many more... We adapt our stack to best fit your project's needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
