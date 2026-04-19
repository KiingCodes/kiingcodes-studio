import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  /** "soft" for app shells (admin/portal), "vivid" for marketing pages, "panel" for compact UIs (chat) */
  variant?: "soft" | "vivid" | "panel";
  className?: string;
}

/**
 * Branded animated background built entirely with semantic tokens (primary/accent).
 * Sits behind content. Pointer-events disabled. Always renders absolute-fill.
 */
export const AnimatedBackground = ({
  variant = "soft",
  className = "",
}: AnimatedBackgroundProps) => {
  const intensity =
    variant === "vivid" ? 0.55 : variant === "panel" ? 0.35 : 0.25;
  const orbSize = variant === "panel" ? 220 : 420;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Animated conic gradient base */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, hsl(var(--primary) / ${intensity * 0.4}), hsl(var(--accent) / ${intensity * 0.4}), hsl(var(--primary) / ${intensity * 0.4}))`,
          filter: "blur(80px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Drifting primary orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: orbSize,
          height: orbSize,
          background: `radial-gradient(circle, hsl(var(--primary) / ${intensity}) 0%, transparent 70%)`,
          filter: "blur(60px)",
          top: "10%",
          left: "5%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting accent orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: orbSize,
          height: orbSize,
          background: `radial-gradient(circle, hsl(var(--accent) / ${intensity}) 0%, transparent 70%)`,
          filter: "blur(60px)",
          bottom: "10%",
          right: "5%",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 25, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid overlay for tech texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft veil so content stays readable */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
    </div>
  );
};
