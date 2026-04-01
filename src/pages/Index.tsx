import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { OwamaChatbot } from "@/components/OwamaChatbot";
import { ServicesPreview } from "@/components/ServicesPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesPreview />
      <Footer />
      <OwamaChatbot />
    </div>
  );
};

export default Index;
