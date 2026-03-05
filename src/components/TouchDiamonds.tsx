import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  rotation: number;
  type: "diamond" | "sparkle";
  delay: number;
}

let idCounter = 0;

export const TouchDiamonds = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticles = useCallback((clientX: number, clientY: number) => {
    const diamondCount = 5 + Math.floor(Math.random() * 4); // 5-8 diamonds
    const sparkleCount = 6 + Math.floor(Math.random() * 5); // 6-10 sparkles

    const newParticles: Particle[] = [
      ...Array.from({ length: diamondCount }, () => ({
        id: ++idCounter,
        x: clientX,
        y: clientY,
        angle: Math.random() * 360,
        distance: 60 + Math.random() * 120,
        size: 18 + Math.random() * 28,
        rotation: -45 + Math.random() * 90,
        type: "diamond" as const,
        delay: Math.random() * 0.08,
      })),
      ...Array.from({ length: sparkleCount }, () => ({
        id: ++idCounter,
        x: clientX,
        y: clientY,
        angle: Math.random() * 360,
        distance: 30 + Math.random() * 90,
        size: 4 + Math.random() * 6,
        rotation: 0,
        type: "sparkle" as const,
        delay: Math.random() * 0.15,
      })),
    ];
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent) => spawnParticles(e.clientX, e.clientY),
    [spawnParticles]
  );

  const handleTouch = useCallback(
    (e: TouchEvent) => {
      Array.from(e.changedTouches).forEach((t) =>
        spawnParticles(t.clientX, t.clientY)
      );
    },
    [spawnParticles]
  );

  useEffect(() => {
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [handleClick, handleTouch]);

  const removeParticle = (id: number) =>
    setParticles((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;

          if (p.type === "sparkle") {
            return (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  background: `radial-gradient(circle, hsl(var(--primary)), hsl(var(--accent)))`,
                  boxShadow: `0 0 ${p.size * 2}px hsl(var(--primary) / 0.8)`,
                }}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 0.8, 0],
                  scale: [0.5, 1.2, 0.3],
                  x: tx,
                  y: ty - 20,
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.3,
                  ease: "easeOut",
                  delay: p.delay,
                }}
                onAnimationComplete={() => removeParticle(p.id)}
              />
            );
          }

          return (
            <motion.img
              key={p.id}
              src={diamondLogo}
              alt=""
              aria-hidden
              className="absolute"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                filter: `drop-shadow(0 0 12px hsl(var(--primary) / 0.7))`,
              }}
              initial={{ opacity: 1, scale: 0.2, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [1, 0.9, 0],
                scale: [0.2, 1.1, 0.6],
                x: tx,
                y: ty - 40,
                rotate: p.rotation,
              }}
              transition={{
                duration: 0.85,
                ease: "easeOut",
                delay: p.delay,
              }}
              onAnimationComplete={() => removeParticle(p.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
