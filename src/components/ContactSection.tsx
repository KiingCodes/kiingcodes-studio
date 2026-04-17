import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Send, CheckCircle, Clock, Calendar, MessageCircle } from "lucide-react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";


export const ContactSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-booking", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          projectType: formData.projectType,
          budget: formData.budget || undefined,
          message: formData.message.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Booking Sent! ✉️",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        budget: "",
        message: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "jeweliq.tech.@outlook.com",
      href: "mailto:jeweliq.tech.@outlook.com",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+27 60 433 4341",
      href: "tel:+27604334341",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Fri: 9AM - 24hrs",
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="floating-orb w-80 h-80 bg-primary -top-40 -right-40" />
        <div className="floating-orb w-80 h-80 bg-accent -bottom-40 -left-40" style={{ animationDelay: "3s" }} />
        <FloatingDiamond className="top-20 left-8 opacity-10" size="w-20" delay={2} />
        <FloatingDiamond className="bottom-32 right-10 opacity-10" size="w-14" delay={4.5} duration={8} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Let's Build Something <span className="text-gradient">Amazing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ready to start your project? Fill out the form below and we'll get back to
            you within 24 hours with a custom quote.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Contact Information</h3>
              <p className="text-muted-foreground">
                Have a project in mind? Let's discuss how we can help bring your vision to life.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                What to Expect
              </h4>
              <ul className="space-y-3">
                {[
                  "Response within 24 hours",
                  "Free initial consultation",
                  "Detailed project quote",
                  "No commitment required",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 border border-border glow-effect"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Book a Consultation
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kiing Ncube"
                    required
                    maxLength={100}
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kiing@example.com"
                    required
                    maxLength={255}
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+27 00 000 0000"
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Company Name
                  </label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a type</option>
                    <option value="website">Website Development</option>
                    <option value="webapp">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a range</option>
                    <option value="500-1000">R500 - R1,000</option>
                    <option value="2500-5000">R2,500 - R5,000</option>
                    <option value="5000-10000">R5,000 - R10,000</option>
                    <option value="10000-20000">R10,000 - R20,000</option>
                    <option value="20000+">R20,000+</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Project Details *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, goals, and timeline..."
                  required
                  rows={5}
                  maxLength={5000}
                  className="bg-secondary/50 border-border focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By submitting, you agree to receive communications from Jewel IQ.
              </p>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-xl font-semibold text-foreground mb-1">Our Location</h3>
              <p className="text-sm text-muted-foreground">7 Caledon Street, Wilro Park, Roodepoort, Johannesburg</p>
            </div>
            <div className="p-6">
              <iframe
                title="Jewel IQ Location - 7 Caledon Street, Wilro Park"
                src="https://www.google.com/maps?q=7+Caledon+Street,+Wilro+Park,+Roodepoort,+Johannesburg&output=embed"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "0.75rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Floating Quick Contact */}
      <a
        href="https://wa.me/27604334341?text=Hi%20Jewel%20IQ%2C%20I'd%20like%20to%20chat%20about%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full pl-4 pr-5 py-3 shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/50 transition-all hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="hidden sm:inline font-medium text-sm">Chat on WhatsApp</span>
        </div>
      </a>
    </section>
  );
};
