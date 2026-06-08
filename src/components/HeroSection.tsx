import heroBg from "@/assets/hero-bg-tech.png.asset.json";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0a4cff] pt-16"
    >
      <img
        src={heroBg.url}
        alt="JewelIQ digital network"
        className="block w-full h-auto object-contain"
      />
    </section>
  );
};
