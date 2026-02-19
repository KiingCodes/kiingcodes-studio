import specialOffer from "@/assets/special-offer.png";

export const SpecialOfferBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="floating-orb w-64 h-64 bg-accent top-0 -right-32 opacity-20" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-primary/30">
          <img
            src={specialOffer}
            alt="Special Offer"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};
