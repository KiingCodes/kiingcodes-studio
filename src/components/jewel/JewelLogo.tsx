interface Props {
  className?: string;
  showText?: boolean;
}

export const JewelLogo = ({ className = "", showText = true }: Props) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg
      viewBox="0 0 40 40"
      className="h-8 w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="jewelLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(217 91% 60%)" />
          <stop offset="55%" stopColor="hsl(187 92% 55%)" />
          <stop offset="100%" stopColor="hsl(158 84% 45%)" />
        </linearGradient>
      </defs>
      <path
        d="M20 3 L36 15 L20 37 L4 15 Z"
        stroke="url(#jewelLogoGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 15 L36 15 M12 15 L20 37 L28 15 M20 3 L12 15 M20 3 L28 15"
        stroke="url(#jewelLogoGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
    {showText && (
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        Jewel<span className="text-jewel-gradient">IQ</span>
      </span>
    )}
  </div>
);
