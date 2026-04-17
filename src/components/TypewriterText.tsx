import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  as?: "p" | "span" | "h3";
}

export const TypewriterText = ({
  text,
  speed = 25,
  delay = 0,
  className = "",
  as: Tag = "p",
}: TypewriterTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    const startTimer = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [isInView, text, speed, delay, started]);

  return (
    <div ref={ref}>
      <Tag className={className}>
        {displayed}
        {started && displayed.length < text.length && (
          <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle animate-pulse" />
        )}
      </Tag>
    </div>
  );
};
