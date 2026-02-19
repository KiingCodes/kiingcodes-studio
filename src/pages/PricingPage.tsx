import { PageLayout } from "@/components/PageLayout";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";

const PricingPage = () => {
  return (
    <PageLayout>
      <div className="pt-20">
        <PricingSection />
        <CTASection />
      </div>
    </PageLayout>
  );
};

export default PricingPage;
