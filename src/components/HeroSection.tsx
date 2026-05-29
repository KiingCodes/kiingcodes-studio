import heroBg from "@/assets/hero-bg-tech.jpg";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <img
        src={heroBg}
        alt="JewelIQ digital network"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </section>
  );
};
