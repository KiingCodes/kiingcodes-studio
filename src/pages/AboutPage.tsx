import { PageLayout } from "@/components/PageLayout";
import { AboutSection } from "@/components/AboutSection";
import { TechStackSection } from "@/components/TechStackSection";
import { CTASection } from "@/components/CTASection";

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="pt-20">
        <AboutSection />
        <TechStackSection />
        <CTASection />
      </div>
    </PageLayout>
  );
};

export default AboutPage;
