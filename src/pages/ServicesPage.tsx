import { PageLayout } from "@/components/PageLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { ServicePostersSection } from "@/components/ServicePostersSection";
import { CTASection } from "@/components/CTASection";

const ServicesPage = () => {
  return (
    <PageLayout>
      <div className="pt-20">
        <ServicesSection />
        <ServicePostersSection />
        <CTASection />
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
