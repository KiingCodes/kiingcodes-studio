import logoAsset from "@/assets/jeweliq-logo-real.png.asset.json";

interface Props {
  className?: string;
  /** Height utility class for the logo image */
  size?: string;
}

export const JewelLogo = ({ className = "", size = "h-9" }: Props) => (
  <div className={`flex items-center ${className}`}>
    <img
      src={logoAsset.url}
      alt="JewelIQ Technologies logo"
      className={`${size} w-auto object-contain`}
      style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.35))" }}
      loading="eager"
    />
  </div>
);
