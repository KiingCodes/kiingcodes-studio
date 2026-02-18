import { motion } from "framer-motion";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";

interface FloatingDiamondProps {
  className?: string;
  size?: string;
  delay?: number;
  duration?: number;
}

export const FloatingDiamond = ({
  className = "",
  size = "w-20 h-20",
  delay = 0,
  duration = 7,
}: FloatingDiamondProps) => (
  <motion.img
    src={diamondLogo}
    alt=""
    aria-hidden
    className={`absolute pointer-events-none select-none ${size} ${className}`}
    style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.4))" }}
    animate={{
      y: [0, -18, 0],
      rotate: [0, 8, -8, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    }}
  />
);
