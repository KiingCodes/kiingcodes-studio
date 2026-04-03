import { PageLayout } from "@/components/PageLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { CTASection } from "@/components/CTASection";

const ServicesPage = () => {
  return (
    <PageLayout>
      <div className="pt-20">
        <ServicesSection />
        <CTASection />
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
