import { PageLayout } from "@/components/PageLayout";
import { TechStackSection } from "@/components/TechStackSection";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import heroImage from "@/assets/wallpaper-cta.jpg";

const AboutPage = () => {
  return (
    <PageLayout>
      <PageHero
        eyebrow="About JewelIQ"
        title={
          <>
            A studio built for <span className="text-gradient">ambitious brands</span>
          </>
        }
        description="We blend strategy, design and engineering to ship digital products that perform — proudly from South Africa, made for the world."
        image={heroImage}
      />
      <TechStackSection />
      <CTASection />
    </PageLayout>
  );
};

export default AboutPage;
