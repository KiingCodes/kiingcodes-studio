import { PageLayout } from "@/components/PageLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { ServicesMarquee } from "@/components/ServicesMarquee";
import { CTASection } from "@/components/CTASection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PageHero } from "@/components/PageHero";
import heroImage from "@/assets/wallpaper-tech.jpg";

const ServicesPage = () => {
  return (
    <PageLayout>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Premium digital <span className="text-gradient">services</span>, end-to-end
          </>
        }
        description="Strategy, design and engineering crafted to scale. Explore the full catalogue — flowing below, in motion."
        image={heroImage}
      />
      <div className="relative">
        <AnimatedBackground variant="vivid" className="z-0" />
        <div className="relative z-10">
          <ServicesMarquee speed={45} />
          <ServicesMarquee speed={55} reverse />
          <ServicesSection />
          <CTASection />
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
