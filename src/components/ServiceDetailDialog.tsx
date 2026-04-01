import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Smartphone, Globe, Lightbulb, TrendingUp, Users,
  Palette, Database, Cloud, Megaphone, PenTool, Image,
  Video, FileText, Briefcase, Sparkles, CheckCircle2, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Smartphone, Database, Palette, Lightbulb, TrendingUp,
  Megaphone, PenTool, Image, Video, FileText, Briefcase,
  Code2, Cloud, Users, Sparkles,
};

/* Extended details per category */
const categoryDetails: Record<string, { highlights: string[]; deliverables: string[] }> = {
  "Web & AI": {
    highlights: [
      "Modern frameworks (React, Next.js, Vite)",
      "SEO-optimized & mobile-first",
      "AI/ML integration capabilities",
      "Performance-tuned architecture",
    ],
    deliverables: ["Source code & documentation", "Hosting setup & deployment", "30-day post-launch support", "Training & handover session"],
  },
  Design: {
    highlights: [
      "User-centered design methodology",
      "Figma prototypes & design systems",
      "Brand consistency across platforms",
      "Accessibility-first approach",
    ],
    deliverables: ["High-fidelity mockups", "Design system & style guide", "Exportable assets (all formats)", "Unlimited revisions in scope"],
  },
  Business: {
    highlights: [
      "Market research & competitive analysis",
      "Strategic roadmap planning",
      "KPI tracking & growth metrics",
      "Stakeholder alignment workshops",
    ],
    deliverables: ["Business strategy document", "Implementation roadmap", "Progress reports", "Ongoing advisory sessions"],
  },
  Marketing: {
    highlights: [
      "Data-driven campaign strategies",
      "Multi-platform content distribution",
      "Analytics & conversion tracking",
      "A/B testing & optimization",
    ],
    deliverables: ["Content calendar & strategy", "Campaign performance reports", "Creative assets & copy", "Monthly optimization reviews"],
  },
  Consulting: {
    highlights: [
      "Industry expert guidance",
      "Technology stack recommendations",
      "Scalability & architecture planning",
      "Risk assessment & mitigation",
    ],
    deliverables: ["Consultation report", "Technology roadmap", "MVP specification", "Follow-up sessions"],
  },
};

interface Service {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  category: string;
  price_from: number;
  price_unit?: string | null;
}

interface ServiceDetailDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceDetailDialog = ({ service, open, onOpenChange }: ServiceDetailDialogProps) => {
  if (!service) return null;

  const IconComponent = iconMap[service.icon] || Sparkles;
  const details = categoryDetails[service.category] || categoryDetails["Consulting"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0"
            >
              <IconComponent className="w-7 h-7 text-primary" />
            </motion.div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {service.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {service.category}
                </Badge>
              </div>
            </div>
          </div>
          <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-2">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 mt-2"
          >
            {/* Highlights */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                What's Included
              </h4>
              <ul className="space-y-2">
                {details.highlights.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                Deliverables
              </h4>
              <ul className="space-y-2">
                {details.deliverables.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button
                asChild
                className="w-full group"
                size="lg"
              >
                <a href="#contact">
                  Get Started with {service.title}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
