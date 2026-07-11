import { useEffect } from "react";
import { CursorGlow } from "@/components/jewel/CursorGlow";
import { JewelNavbar } from "@/sections/JewelNavbar";
import { HeroSection } from "@/sections/HeroSection";
import { EcosystemSection } from "@/sections/EcosystemSection";
import { PortfolioSection } from "@/sections/PortfolioSection";
import { FrameworkSection } from "@/sections/FrameworkSection";
import { ContactHub } from "@/sections/ContactHub";
import { JewelFooter } from "@/sections/JewelFooter";

const JewelHome = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <CursorGlow />
      <JewelNavbar />
      <main className="relative z-10">
        <HeroSection />
        <EcosystemSection />
        <PortfolioSection />
        <FrameworkSection />
        <ContactHub />
      </main>
      <JewelFooter />
    </div>
  );
};

export default JewelHome;
