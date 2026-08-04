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
      alt="Jewel IQ Technologies logo"
      className={`${size} w-auto object-contain`}
      style={{ filter: "invert(1) hue-rotate(180deg)" }}
      loading="eager"
    />
  </div>
);
