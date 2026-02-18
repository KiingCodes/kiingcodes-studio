import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Send, CheckCircle, Clock, Calendar } from "lucide-react";
import { FloatingDiamond } from "@/components/FloatingDiamond";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import contactBg from "@/assets/wallpaper-tech.jpg";

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
      value: "info@jeweliq.com",
      href: "mailto:info@jeweliq.com",
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
      value: "Mon - Fri: 9AM - 6PM",
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 30, 0.9), rgba(10, 15, 30, 0.95)), url(${contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
      </div>
    </section>
  );
};
