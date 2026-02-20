import { PageLayout } from "@/components/PageLayout";
import { usePortfolioItems } from "@/hooks/use-dynamic-content";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { CTASection } from "@/components/CTASection";

const PortfolioPage = () => {
  const { data: items, isLoading } = usePortfolioItems();

  return (
    <PageLayout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
              Portfolio
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our latest projects and see how we've helped businesses transform digitally.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                  <div className="h-48 bg-secondary rounded-xl mb-4" />
                  <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-full" />
                </div>
              ))}
            </div>
          ) : !items?.length ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-muted-foreground text-lg">Portfolio coming soon! ✨</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      {item.is_featured && <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0" />}
                    </div>
                    {item.client_name && (
                      <p className="text-primary text-sm font-medium mb-2">{item.client_name}</p>
                    )}
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                    )}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech) => (
                          <span key={tech} className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CTASection />
    </PageLayout>
  );
};

export default PortfolioPage;
