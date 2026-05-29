import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { OwamaChatbot } from "@/components/OwamaChatbot";
import { ServicesMarquee } from "@/components/ServicesMarquee";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="relative">
        <AnimatedBackground variant="soft" className="z-0" />
        <div className="relative z-10">
          <ServicesMarquee speed={120} />
        </div>
      </div>
      <Footer />
      <OwamaChatbot />
    </div>
  );
};

export default Index;
