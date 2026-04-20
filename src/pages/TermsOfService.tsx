import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  ScrollText, Briefcase, ClipboardCheck, CreditCard, Copyright, Users,
  ShieldAlert, XCircle, RefreshCw, Mail, Gavel, Sparkles, Server, Globe,
} from "lucide-react";

const sections = [
  {
    icon: ScrollText,
    title: "1. Agreement to Terms",
    body: (
      <>
        <p>
          These Terms of Service ("Terms") form a binding agreement between you ("Client," "you") and{" "}
          <strong>Jewel IQ</strong> ("we," "us," "our"), a digital technology studio operating from the Republic of
          South Africa. By accessing our website, requesting a quote, signing a project brief, or using our client
          portal, you confirm you have read, understood, and agreed to these Terms.
        </p>
        <p className="mt-3">
          If you are entering into these Terms on behalf of a company, you warrant that you have authority to bind
          that entity.
        </p>
      </>
    ),
  },
  {
    icon: Briefcase,
    title: "2. Services Offered",
    body: (
      <>
        <p className="mb-3">Jewel IQ designs, builds, and maintains digital products, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Custom web and mobile application development</li>
          <li>UI / UX design and brand identity</li>
          <li>E-commerce platforms and payment integrations</li>
          <li>AI assistants, automation, and data dashboards</li>
          <li>Technical consulting, audits, and architecture reviews</li>
          <li>Website hosting, maintenance, and support retainers</li>
        </ul>
        <p className="mt-3">
          Specific deliverables, timelines, and pricing for your engagement are defined in a written
          Statement of Work (SoW) or quote, which together with these Terms forms the full agreement.
        </p>
      </>
    ),
  },
  {
    icon: ClipboardCheck,
    title: "3. Quotes, Engagement & Project Terms",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Quote validity:</strong> 30 days from issue date unless otherwise stated.</li>
        <li><strong>Deposit:</strong> A 50% non-refundable deposit is required to reserve a project slot and commence work.</li>
        <li><strong>Timelines:</strong> Estimates only — actual delivery depends on scope, third-party services, and client responsiveness. Delays caused by late feedback, content, or approvals may shift the schedule and incur additional fees.</li>
        <li><strong>Revisions:</strong> Each package includes a defined number of revision rounds. Additional rounds are billed at our standard hourly rate.</li>
        <li><strong>Scope changes:</strong> Material changes to the agreed scope require a written change request and may affect price and timeline.</li>
      </ul>
    ),
  },
  {
    icon: CreditCard,
    title: "4. Payment Terms",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Invoices are issued in ZAR (or USD/EUR by agreement) and payable within 7 days of issue unless otherwise specified.</li>
        <li>Accepted methods: EFT / bank transfer, card payment, and approved online gateways.</li>
        <li>Final source files, deployment access, and full ownership transfer occur only upon receipt of the final payment.</li>
        <li>Overdue invoices accrue interest at 2% per month and may result in suspension of services and removal of access.</li>
        <li>Recurring services (hosting, maintenance, retainers) are billed monthly in advance and renew automatically unless cancelled in writing 30 days before renewal.</li>
      </ul>
    ),
  },
  {
    icon: Copyright,
    title: "5. Intellectual Property",
    body: (
      <>
        <p>
          Upon full and final payment, you receive ownership of the bespoke deliverables created specifically for your
          project (designs, custom code, copy). The following remain the property of Jewel IQ or their respective
          owners:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Pre-existing tools, libraries, frameworks, and reusable components used to build your project</li>
          <li>Open-source software (subject to its original licence)</li>
          <li>Stock assets and third-party fonts/illustrations licensed on your behalf</li>
        </ul>
        <p className="mt-3">
          Jewel IQ retains the right to display completed work in its portfolio, case studies, and marketing
          materials unless an NDA or written opt-out is in place.
        </p>
      </>
    ),
  },
  {
    icon: Users,
    title: "6. Client Responsibilities",
    body: (
      <>
        <p className="mb-3">To deliver high-quality work on time, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate briefs, brand assets, content, and access credentials promptly</li>
          <li>Respond to feedback requests within 5 business days unless otherwise agreed</li>
          <li>Warrant that all content you supply is owned, licensed, and free of third-party rights infringement</li>
          <li>Maintain confidentiality of any portal logins, API keys, or admin credentials issued to you</li>
          <li>Designate a single primary point of contact authorised to approve work</li>
        </ul>
      </>
    ),
  },
  {
    icon: Server,
    title: "7. Hosting, Third-Party Services & Uptime",
    body: (
      <>
        <p>
          Many projects depend on third-party platforms (e.g. Supabase, Resend, payment gateways, domain registrars,
          analytics, AI providers). We integrate and configure them in good faith but are not responsible for outages,
          policy changes, price increases, or data loss originating from those providers.
        </p>
        <p className="mt-3">
          We do not guarantee 100% uptime. Where a maintenance retainer exists, we target a 99% monthly availability
          on managed infrastructure, excluding scheduled maintenance and force-majeure events.
        </p>
      </>
    ),
  },
  {
    icon: Sparkles,
    title: "8. AI Features (Owami Assistant)",
    body: (
      <>
        <p>
          Our website and portal include an AI assistant ("Owami") powered by third-party large language models.
          Outputs are generated automatically and may contain inaccuracies. They do not constitute professional,
          legal, financial, or medical advice. You remain responsible for verifying any information before relying
          on it.
        </p>
        <p className="mt-3">
          Conversations may be logged for service improvement and lead-management purposes, as described in our{" "}
          <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    icon: ShieldAlert,
    title: "9. Warranties & Limitation of Liability",
    body: (
      <>
        <p>
          We warrant that our services will be performed with reasonable skill and care. To the maximum extent
          permitted by law, all other warranties (express or implied) are excluded.
        </p>
        <p className="mt-3">
          Jewel IQ shall not be liable for any indirect, incidental, special, punitive, or consequential damages —
          including loss of revenue, profits, data, or goodwill — arising from your use of our services. Our total
          aggregate liability for any claim shall not exceed the fees actually paid by you for the specific service
          giving rise to the claim in the 6 months preceding the event.
        </p>
      </>
    ),
  },
  {
    icon: XCircle,
    title: "10. Cancellation, Termination & Refunds",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Deposits are non-refundable once work has commenced.</li>
        <li>Either party may terminate the engagement in writing for material breach if the breach is not remedied within 14 days of notice.</li>
        <li>On termination, you will be invoiced for all work completed up to the termination date and any non-cancellable third-party costs.</li>
        <li>Partial refunds for unused retainer hours are at our sole discretion.</li>
        <li>Upon termination, portal access and hosting may be revoked after final invoicing is settled.</li>
      </ul>
    ),
  },
  {
    icon: Gavel,
    title: "11. Confidentiality",
    body: (
      <p>
        Both parties agree to keep confidential any non-public information shared during the engagement (business
        plans, source code, credentials, designs). This obligation survives termination of the engagement for a
        period of 3 years. We are happy to sign a separate Mutual NDA on request.
      </p>
    ),
  },
  {
    icon: Globe,
    title: "12. Governing Law & Disputes",
    body: (
      <p>
        These Terms are governed by the laws of the <strong>Republic of South Africa</strong>. Any dispute arising out
        of or in connection with these Terms shall first be addressed in good-faith negotiation, then by mediation,
        and failing resolution, by the competent courts of South Africa.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "13. Changes to These Terms",
    body: (
      <p>
        We may update these Terms from time to time to reflect changes in our services or legal requirements.
        Material changes will be communicated by email or a notice on the website. Continued use of our services
        after the effective date constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "14. Contact",
    body: (
      <>
        <p>For questions, support, or formal notices under these Terms:</p>
        <div className="mt-3 space-y-1">
          <p><strong>Email:</strong> <a href="mailto:info@jeweliq.com" className="text-primary hover:underline">info@jeweliq.com</a></p>
          <p><strong>Phone / WhatsApp:</strong> +27 60 433 4341</p>
          <p><strong>Website:</strong> <a href="https://jeweliq.com" className="text-primary hover:underline">jeweliq.com</a></p>
        </div>
      </>
    ),
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="soft" className="fixed z-0" />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6">
                <Gavel className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Legal · South African Law</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The terms that govern every project, retainer, and digital product we deliver — written plainly, so
                you know exactly what to expect when working with Jewel IQ.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-4">
                Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>

            {/* Sections */}
            <div className="space-y-5">
              {sections.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
                    className="group relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 md:p-8 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{section.title}</h2>
                        <div className="text-muted-foreground leading-relaxed text-[15px]">{section.body}</div>
                      </div>
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;
