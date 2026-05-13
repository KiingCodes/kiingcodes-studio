import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";

export interface TOCItem {
  id: string;
  title: string;
}

/**
 * Sticky table of contents for long legal pages.
 * Tracks the section in view and scrolls smoothly on click.
 */
export const LegalTOC = ({ items }: { items: TOCItem[] }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <List className="w-3.5 h-3.5" />
          On this page
        </div>
        <nav className="border-l border-border space-y-0.5">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(item.id);
                }}
                className={`relative block pl-4 py-1.5 text-xs leading-snug transition-colors ${
                  active
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-primary rounded-full"
                  />
                )}
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};