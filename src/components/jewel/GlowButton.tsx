import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChildClass?: string;
}

export const GlowButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "solid", size = "md", children, ...rest }, ref) => {
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };
    const base =
      "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

    if (variant === "solid") {
      return (
        <button
          ref={ref}
          {...rest}
          className={cn(
            base,
            sizes[size],
            "bg-jewel-gradient text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] hover:shadow-[0_15px_60px_-10px_hsl(var(--accent)/0.7)] hover:-translate-y-0.5",
            className,
          )}
        >
          {children}
        </button>
      );
    }
    if (variant === "outline") {
      return (
        <button
          ref={ref}
          {...rest}
          className={cn(
            base,
            sizes[size],
            "group relative text-foreground",
            className,
          )}
        >
          <span className="absolute inset-0 rounded-full bg-jewel-gradient opacity-70 transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-[1px] rounded-full bg-background transition-colors group-hover:bg-background/70" />
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
      );
    }
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          base,
          sizes[size],
          "text-foreground/80 hover:text-foreground hover:bg-foreground/5",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
GlowButton.displayName = "GlowButton";
