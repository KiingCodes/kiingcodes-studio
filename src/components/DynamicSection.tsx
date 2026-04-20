import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePageSection, type PageSection } from "@/hooks/use-page-sections";
import {
  resolveBackground,
  animationVariants,
} from "@/lib/background-presets";

interface DynamicSectionProps {
  pageSlug: string;
  sectionKey: string;
  /** Static fallback rendered while loading or if no DB row exists */
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Renders an editable page section pulled from the page_sections table.
 * If no row is found, falls back to the provided static content so the
 * site never breaks before content is authored.
 */
export const DynamicSection = ({
  pageSlug,
  sectionKey,
  fallback,
  className = "",
}: DynamicSectionProps) => {
  const { data: section, isLoading } = usePageSection(pageSlug, sectionKey);

  if (isLoading) {
    return fallback ? <>{fallback}</> : null;
  }

  if (!section) {
    return fallback ? <>{fallback}</> : null;
  }

  return <RenderedSection section={section} className={className} />;
};

interface RenderedSectionProps {
  section: PageSection;
  className?: string;
}

const RenderedSection = ({ section, className = "" }: RenderedSectionProps) => {
  const bg = resolveBackground(section.background_gradient);
  const variants = animationVariants(section.animation_preset);
  const accentStyle = section.accent_color
    ? ({ "--section-accent": section.accent_color } as React.CSSProperties)
    : undefined;

  return (
    <section
      className={`relative overflow-hidden py-20 md:py-28 ${className}`}
      style={accentStyle}
    >
      {/* Background layers */}
      {section.background_image_url && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${section.background_image_url})` }}
        />
      )}
      {bg && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: bg }}
        />
      )}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
        className="container relative z-10 mx-auto px-4 md:px-6 max-w-5xl text-center"
      >
        {section.subheadline && (
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            {section.subheadline}
          </span>
        )}
        {section.headline && (
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {section.headline}
          </h2>
        )}
        {section.body && (
          <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl text-muted-foreground [&_p]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary">
            <ReactMarkdown>{section.body}</ReactMarkdown>
          </div>
        )}
        {section.cta_label && section.cta_url && (
          <div className="mt-8">
            <Button variant="hero" size="xl" asChild>
              {section.cta_url.startsWith("http") ? (
                <a
                  href={section.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {section.cta_label}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              ) : (
                <Link to={section.cta_url}>
                  {section.cta_label}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  );
};