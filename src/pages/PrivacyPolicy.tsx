import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Shield, Lock, Eye, Database, UserCheck, Mail, Cookie, Globe, AlertCircle, FileText } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "1. Introduction",
    body: (
      <>
        <p>
          Jewel IQ ("we," "our," or "us") is a South African digital technology company committed to protecting the
          privacy and personal information of every visitor, client, and applicant who interacts with our website,
          client portal, or services.
        </p>
        <p className="mt-3">
          This Privacy Policy is governed by the <strong>Protection of Personal Information Act, 4 of 2013 (POPIA)</strong>,
          and where applicable, the <strong>EU General Data Protection Regulation (GDPR)</strong>. By using our
          services, you acknowledge and consent to the practices described below.
        </p>
      </>
    ),
  },
  {
    icon: Database,
    title: "2. Information We Collect",
    body: (
      <>
        <p className="mb-3">We collect the following categories of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity & Contact Data:</strong> Full name, email address, phone number, company name, and physical address provided through booking forms, the client portal, contact forms, or job applications.</li>
          <li><strong>Project & Commercial Data:</strong> Project briefs, budgets, timelines, milestones, files you upload, invoices, and payment history.</li>
          <li><strong>Account Data:</strong> Login credentials, authentication tokens, role assignments, and portal activity.</li>
          <li><strong>Communication Data:</strong> Messages sent via the Owami chatbot, email correspondence, support tickets, and portal messages.</li>
          <li><strong>Technical & Usage Data:</strong> IP address, browser type, device identifiers, pages visited, referral source, and session duration captured via cookies and analytics tools (Google Analytics 4).</li>
          <li><strong>Recruitment Data:</strong> CVs, portfolios, education, and work history submitted through our Careers page.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Eye,
    title: "3. How We Use Your Information",
    body: (
      <>
        <p className="mb-3">Personal information is processed only for legitimate, specific purposes, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Responding to enquiries and providing quotes, support, and onboarding</li>
          <li>Delivering, managing, and invoicing for the services you request</li>
          <li>Operating the client portal, project milestones, and secure messaging</li>
          <li>Sending transactional emails (account, billing, project updates) via Resend</li>
          <li>Improving our website, products, and AI assistant (Owami)</li>
          <li>Evaluating job applications and communicating with applicants</li>
          <li>Detecting fraud, abuse, and complying with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "4. Lawful Basis for Processing",
    body: (
      <>
        <p>We rely on the following lawful grounds under POPIA / GDPR:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li><strong>Consent</strong> — when you submit a form, accept cookies, or opt in to marketing.</li>
          <li><strong>Contractual necessity</strong> — to deliver services you have engaged us for.</li>
          <li><strong>Legitimate interest</strong> — to secure our systems, prevent fraud, and improve our offering.</li>
          <li><strong>Legal obligation</strong> — to comply with tax, accounting, and regulatory requirements.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Globe,
    title: "5. Information Sharing & Third Parties",
    body: (
      <>
        <p className="mb-3">
          We do <strong>not</strong> sell or rent your personal information. We share data only with vetted processors
          who help us operate the service, under strict confidentiality and data-processing agreements:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Supabase</strong> — secure database, authentication, and file storage.</li>
          <li><strong>Resend</strong> — transactional email delivery.</li>
          <li><strong>Google Analytics 4</strong> — anonymised traffic analytics (only with your cookie consent).</li>
          <li><strong>Lovable AI / Gemini</strong> — to power the Owami assistant; conversations may be processed for response generation.</li>
          <li><strong>Payment providers and accountants</strong> — for invoicing and tax compliance.</li>
        </ul>
        <p className="mt-3">
          Some of these providers may store data outside South Africa. We ensure adequate safeguards (Standard
          Contractual Clauses or equivalent) are in place for any cross-border transfer.
        </p>
      </>
    ),
  },
  {
    icon: Cookie,
    title: "6. Cookies & Tracking",
    body: (
      <>
        <p>
          Our site uses <strong>strictly necessary</strong> cookies (session, authentication, security) and, with your
          consent, <strong>analytics</strong> and <strong>marketing</strong> cookies. You can manage preferences at any
          time through the cookie banner or by clearing your browser storage.
        </p>
        <p className="mt-3">
          Disabling non-essential cookies will not break the site but will limit personalisation and analytics.
        </p>
      </>
    ),
  },
  {
    icon: Lock,
    title: "7. Data Security",
    body: (
      <>
        <p>We protect your information using industry-standard controls, including:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>TLS 1.2+ encryption in transit and AES-256 encryption at rest</li>
          <li>Row-Level Security (RLS) policies on every database table</li>
          <li>Role-Based Access Control (RBAC) with separate admin and client roles</li>
          <li>Hashed and salted passwords; multi-factor authentication where supported</li>
          <li>Regular security audits, dependency scanning, and access reviews</li>
        </ul>
        <p className="mt-3">
          No system is 100% secure. In the event of a breach affecting your data, we will notify you and the
          Information Regulator within the timeframes required by POPIA.
        </p>
      </>
    ),
  },
  {
    icon: FileText,
    title: "8. Data Retention",
    body: (
      <>
        <p>
          We retain personal information only as long as necessary to fulfil the purpose for which it was collected,
          or as required by law:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li><strong>Active client data:</strong> for the duration of our engagement plus 5 years (tax & contractual records).</li>
          <li><strong>Leads & enquiries:</strong> up to 24 months from last contact.</li>
          <li><strong>Job applications:</strong> up to 12 months unless you request earlier deletion.</li>
          <li><strong>Analytics data:</strong> up to 14 months in Google Analytics.</li>
        </ul>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "9. Your Rights",
    body: (
      <>
        <p className="mb-3">Under POPIA and GDPR you have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction or deletion of inaccurate or outdated data</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Withdraw consent at any time (without affecting prior lawful processing)</li>
          <li>Request data portability in a machine-readable format</li>
          <li>Lodge a complaint with the South African Information Regulator at <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inforegulator.org.za</a></li>
        </ul>
        <p className="mt-3">To exercise any right, email us at <strong>info@jeweliq.com</strong>. We respond within 30 days.</p>
      </>
    ),
  },
  {
    icon: AlertCircle,
    title: "10. Children's Privacy",
    body: (
      <p>
        Our services are intended for users aged 18 and above. We do not knowingly collect personal information from
        children. If you believe a child has provided us with information, contact us and we will delete it promptly.
      </p>
    ),
  },
  {
    icon: FileText,
    title: "11. Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Material changes will be communicated via email or a
        prominent notice on the site. The "Last updated" date at the top reflects the latest revision.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "12. Contact & Information Officer",
    body: (
      <>
        <p>
          For privacy questions, data requests, or to contact our designated Information Officer:
        </p>
        <div className="mt-3 space-y-1">
          <p><strong>Email:</strong> <a href="mailto:info@jeweliq.com" className="text-primary hover:underline">info@jeweliq.com</a></p>
          <p><strong>Phone / WhatsApp:</strong> +27 60 433 4341</p>
          <p><strong>Website:</strong> <a href="https://jeweliq.com" className="text-primary hover:underline">jeweliq.com</a></p>
        </div>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
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
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Legal · POPIA & GDPR Compliant</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                How Jewel IQ collects, uses, and protects your personal information across our website, client
                portal, and AI-powered services.
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

export default PrivacyPolicy;
