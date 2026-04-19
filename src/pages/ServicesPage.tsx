import { PageLayout } from "@/components/PageLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { CTASection } from "@/components/CTASection";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const ServicesPage = () => {
  return (
    <PageLayout>
      <div className="pt-20 relative">
        <AnimatedBackground variant="vivid" className="z-0 fixed" />
        <div className="relative z-10">
          <ServicesSection />
          <CTASection />
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
