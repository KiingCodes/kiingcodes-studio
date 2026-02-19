import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SpecialOfferBanner } from "@/components/SpecialOfferBanner";
import { ServicesSection } from "@/components/ServicesSection";
import { ServicePostersSection } from "@/components/ServicePostersSection";
import { PricingSection } from "@/components/PricingSection";
import { AboutSection } from "@/components/AboutSection";
import { TechStackSection } from "@/components/TechStackSection";

import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { OwamaChatbot } from "@/components/OwamaChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SpecialOfferBanner />
      <ServicesSection />
      <ServicePostersSection />
      <PricingSection />
      <AboutSection />
      <TechStackSection />
      
      <CTASection />
      <ContactSection />
      <Footer />
      <OwamaChatbot />
    </div>
  );
};

export default Index;
