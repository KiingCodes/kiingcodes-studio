import heroBg from "@/assets/hero-bg-tech.jpg";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0a4cff] pt-16"
    >
      <img
        src={heroBg}
        alt="JewelIQ digital network"
        className="block w-full h-auto object-contain"
      />
    </section>
  );
};
