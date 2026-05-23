import { PageLayout } from "@/components/PageLayout";
import { ContactSection } from "@/components/ContactSection";
import { PageHero } from "@/components/PageHero";
import heroImage from "@/assets/wallpaper-footer.jpg";

const ContactPage = () => {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let's build something <span className="text-gradient">remarkable</span>
          </>
        }
        description="Tell us about your project. We reply within one business day."
        image={heroImage}
      />
      <ContactSection />
    </PageLayout>
  );
};

export default ContactPage;
