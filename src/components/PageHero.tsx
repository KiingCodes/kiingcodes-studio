import { motion } from "framer-motion";
import { FloatingDiamond } from "@/components/FloatingDiamond";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  image: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

/**
 * Premium page-level hero with full-bleed image background, gradient overlays,
 * floating accents, and animated entrance. Drop at the top of any page.
 */
export const PageHero = ({
  eyebrow,
  title,
  description,
  image,
  align = "center",
  children,
}: PageHeroProps) => {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <section
      className="relative isolate overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center pt-28 pb-20"
    >
      {/* Image background */}
      <div className="absolute inset-0 -z-20">
        <motion.img
          src={image}
          alt=""
          aria-hidden
          loading="eager"
          className="w-full h-full object-cover"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        {/* Tinted overlays for readability + brand mood */}
        <div className="absolute inset-0 bg-background/75 dark:bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 30%, hsl(var(--primary) / 0.25), transparent 60%), radial-gradient(50% 50% at 80% 70%, hsl(var(--accent) / 0.25), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Floating decorative diamonds */}
      <FloatingDiamond className="top-32 right-6 md:right-16 opacity-20" size="w-16 md:w-24" />
      <FloatingDiamond className="bottom-16 left-6 opacity-15" size="w-12 md:w-20" delay={3} duration={9} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`max-w-3xl ${alignCls}`}
        >
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-primary font-medium text-xs uppercase mb-5 inline-block"
            >
              {eyebrow}
            </motion.span>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;