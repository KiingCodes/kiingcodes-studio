import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import diamondLogo from "@/assets/jeweliq-diamond-logo.png";

interface Diamond {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  rotation: number;
}

let idCounter = 0;

export const TouchDiamonds = () => {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);

  const spawnDiamonds = useCallback((clientX: number, clientY: number) => {
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 diamonds
    const newDiamonds: Diamond[] = Array.from({ length: count }, () => ({
      id: ++idCounter,
      x: clientX,
      y: clientY,
      angle: Math.random() * 360,
      distance: 40 + Math.random() * 80,
      size: 16 + Math.random() * 20,
      rotation: -30 + Math.random() * 60,
    }));
    setDiamonds((prev) => [...prev, ...newDiamonds]);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent) => spawnDiamonds(e.clientX, e.clientY),
    [spawnDiamonds]
  );

  const handleTouch = useCallback(
    (e: TouchEvent) => {
      Array.from(e.changedTouches).forEach((t) =>
        spawnDiamonds(t.clientX, t.clientY)
      );
    },
    [spawnDiamonds]
  );

  useEffect(() => {
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [handleClick, handleTouch]);

  const removeDiamond = (id: number) =>
    setDiamonds((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {diamonds.map((d) => {
          const rad = (d.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * d.distance;
          const ty = Math.sin(rad) * d.distance;
          return (
            <motion.img
              key={d.id}
              src={diamondLogo}
              alt=""
              aria-hidden
              className="absolute"
              style={{
                left: d.x,
                top: d.y,
                width: d.size,
                height: d.size,
                marginLeft: -d.size / 2,
                marginTop: -d.size / 2,
                filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))",
              }}
              initial={{ opacity: 1, scale: 0.3, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: tx,
                y: ty - 30,
                rotate: d.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => removeDiamond(d.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
