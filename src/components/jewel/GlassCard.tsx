import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-500",
        className,
      )}
    />
  ),
);
GlassCard.displayName = "GlassCard";
