import { useState, useCallback, useEffect, useRef } from "react";
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
  type: "diamond" | "sparkle" | "trail";
  delay: number;
}

let idCounter = 0;

const TRAIL_INTERVAL = 60; // ms between trail spawns

export const TouchDiamonds = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const dragging = useRef(false);
  const trailTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  // Full burst on tap
  const spawnBurst = useCallback((x: number, y: number) => {
    const diamondCount = 5 + Math.floor(Math.random() * 4);
    const sparkleCount = 6 + Math.floor(Math.random() * 5);
    const batch: Particle[] = [
      ...Array.from({ length: diamondCount }, () => ({
        id: ++idCounter, x, y,
        angle: Math.random() * 360,
        distance: 60 + Math.random() * 120,
        size: 18 + Math.random() * 28,
        rotation: -45 + Math.random() * 90,
        type: "diamond" as const,
        delay: Math.random() * 0.08,
      })),
      ...Array.from({ length: sparkleCount }, () => ({
        id: ++idCounter, x, y,
        angle: Math.random() * 360,
        distance: 30 + Math.random() * 90,
        size: 4 + Math.random() * 6,
        rotation: 0,
        type: "sparkle" as const,
        delay: Math.random() * 0.15,
      })),
    ];
    setParticles((prev) => [...prev, ...batch]);
  }, []);

  // Lighter trail particles while dragging
  const spawnTrail = useCallback((x: number, y: number) => {
    const count = 1 + Math.floor(Math.random() * 2); // 1-2 diamonds
    const sparkles = 2 + Math.floor(Math.random() * 2); // 2-3 sparkles
    const batch: Particle[] = [
      ...Array.from({ length: count }, () => ({
        id: ++idCounter, x, y,
        angle: Math.random() * 360,
        distance: 30 + Math.random() * 60,
        size: 14 + Math.random() * 18,
        rotation: -30 + Math.random() * 60,
        type: "trail" as const,
        delay: 0,
      })),
      ...Array.from({ length: sparkles }, () => ({
        id: ++idCounter, x, y,
        angle: Math.random() * 360,
        distance: 20 + Math.random() * 50,
        size: 3 + Math.random() * 5,
        rotation: 0,
        type: "sparkle" as const,
        delay: 0,
      })),
    ];
    setParticles((prev) => [...prev, ...batch]);
  }, []);

  const startDrag = useCallback((x: number, y: number) => {
    dragging.current = true;
    lastPos.current = { x, y };
    spawnBurst(x, y);
    trailTimer.current = setInterval(() => {
      if (dragging.current) spawnTrail(lastPos.current.x, lastPos.current.y);
    }, TRAIL_INTERVAL);
  }, [spawnBurst, spawnTrail]);

  const moveDrag = useCallback((x: number, y: number) => {
    if (dragging.current) lastPos.current = { x, y };
  }, []);

  const endDrag = useCallback(() => {
    dragging.current = false;
    if (trailTimer.current) {
      clearInterval(trailTimer.current);
      trailTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      startDrag(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      moveDrag(t.clientX, t.clientY);
    };
    const onTouchEnd = () => endDrag();

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (trailTimer.current) clearInterval(trailTimer.current);
    };
  }, [startDrag, moveDrag, endDrag]);

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
                  left: p.x, top: p.y,
                  width: p.size, height: p.size,
                  marginLeft: -p.size / 2, marginTop: -p.size / 2,
                  background: `radial-gradient(circle, hsl(var(--primary)), hsl(var(--accent)))`,
                  boxShadow: `0 0 ${p.size * 2}px hsl(var(--primary) / 0.8)`,
                }}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{ opacity: [1, 0.8, 0], scale: [0.5, 1.2, 0.3], x: tx, y: ty - 20 }}
                transition={{ duration: 0.6 + Math.random() * 0.3, ease: "easeOut", delay: p.delay }}
                onAnimationComplete={() => removeParticle(p.id)}
              />
            );
          }

          // diamond or trail — trail is smaller/faster
          const isTrail = p.type === "trail";
          return (
            <motion.img
              key={p.id}
              src={diamondLogo}
              alt=""
              aria-hidden
              className="absolute"
              style={{
                left: p.x, top: p.y,
                width: p.size, height: p.size,
                marginLeft: -p.size / 2, marginTop: -p.size / 2,
                filter: `drop-shadow(0 0 ${isTrail ? 8 : 12}px hsl(var(--primary) / ${isTrail ? 0.5 : 0.7}))`,
              }}
              initial={{ opacity: 1, scale: 0.2, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [1, isTrail ? 0.7 : 0.9, 0],
                scale: [0.2, isTrail ? 0.9 : 1.1, isTrail ? 0.3 : 0.6],
                x: tx,
                y: ty - (isTrail ? 25 : 40),
                rotate: p.rotation,
              }}
              transition={{
                duration: isTrail ? 0.6 : 0.85,
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
