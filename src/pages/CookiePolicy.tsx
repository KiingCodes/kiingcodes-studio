import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Cookie, Shield, Settings, BarChart3, Megaphone, Clock, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalTOC } from "@/components/LegalTOC";
import jeweliqLogo from "@/assets/jeweliq-logo.png";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cookies = [
  {
    name: "jeweliq_cookie_consent_v1",
    provider: "Jewel IQ (localStorage)",
    purpose: "Stores your cookie preferences so we don't ask again.",
    duration: "12 months",
    type: "Necessary",
  },
  {
    name: "sb-access-token / sb-refresh-token",
    provider: "Lovable Cloud (Supabase Auth)",
    purpose: "Keeps you signed into the client portal and admin area.",
    duration: "Session / 7 days",
    type: "Necessary",
  },
  {
    name: "theme",
    provider: "Jewel IQ (localStorage)",
    purpose: "Remembers your light / dark theme choice.",
    duration: "Persistent",
    type: "Necessary",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics 4",
    purpose: "Anonymised analytics: pages visited, traffic source, device.",
    duration: "13 months",
    type: "Analytics",
  },
  {
    name: "_gid",
    provider: "Google Analytics 4",
    purpose: "Distinguishes users for short-term reporting.",
    duration: "24 hours",
    type: "Analytics",
  },
  {
    name: "owami_session",
    provider: "Jewel IQ",
    purpose: "Maintains the conversation thread with the Owami assistant.",
    duration: "Session",
    type: "Necessary",
  },
];

const sections = [
  {
    icon: Cookie,
    title: "1. What Are Cookies?",
    body: (
      <p>
        Cookies are small text files (and similar storage like <strong>localStorage</strong>) placed on your device when
        you visit a website. They let the site remember your actions and preferences — such as login state, language,
        theme, and analytics — so you don't have to re-enter them on every visit.
      </p>
    ),
  },
  {
    icon: Shield,
    title: "2. Categories We Use",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Strictly Necessary</strong> — required for the site to function (auth, security, consent storage). Cannot be disabled.</li>
        <li><strong>Analytics</strong> — anonymised usage data via Google Analytics 4 to improve the site.</li>
        <li><strong>Marketing</strong> — currently <em>not active</em>. If we add ad pixels in future, they will only load with your consent.</li>
      </ul>
    ),
  },
  {
    icon: Settings,
    title: "3. Managing Your Preferences",
    body: (
      <>
        <p>
          When you first visit the site you'll see our consent banner. You can accept all, reject all, or open
          <strong> Customize</strong> to toggle Analytics and Marketing individually.
        </p>
        <p className="mt-3">
          To change your choice later, clear the <code className="px-1.5 py-0.5 rounded bg-muted text-xs">jeweliq_cookie_consent_v1</code>
          {" "}entry from your browser's site data, or click the button below to reopen the banner.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            try { localStorage.removeItem("jeweliq_cookie_consent_v1"); } catch {}
            window.location.reload();
          }}
        >
          Reopen cookie preferences
        </Button>
      </>
    ),
  },
  {
    icon: Globe,
    title: "4. Third-Party Cookies",
    body: (
      <>
        <p>Third parties that may set cookies through our site include:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li><strong>Google Analytics 4</strong> — analytics. <a className="text-primary hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy policy</a>.</li>
          <li><strong>Lovable Cloud (Supabase)</strong> — authentication and secure session management.</li>
        </ul>
        <p className="mt-3">We do not sell or share cookie data with advertising networks.</p>
      </>
    ),
  },
  {
    icon: Clock,
    title: "5. How Long Cookies Last",
    body: (
      <p>
        <strong>Session cookies</strong> are deleted when you close your browser. <strong>Persistent cookies</strong> remain
        for the duration listed in the table below — typically up to 13 months — unless you clear them sooner.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "6. Contact",
    body: (
      <p>
        Questions about cookies? Email{" "}
        <a href="mailto:hello@jeweliq.co.za" className="text-primary hover:underline">hello@jeweliq.co.za</a>{" "}
        or WhatsApp us via the chat icon on the site.
      </p>
    ),
  },
];

const typeIcon: Record<string, JSX.Element> = {
  Necessary: <Shield className="w-3.5 h-3.5" />,
  Analytics: <BarChart3 className="w-3.5 h-3.5" />,
  Marketing: <Megaphone className="w-3.5 h-3.5" />,
};

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="soft" className="fixed z-0" />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <img
                src={jeweliqLogo}
                alt="Jewel IQ"
                className="h-14 w-auto mx-auto mb-6 drop-shadow-[0_4px_24px_hsl(var(--primary)/0.35)]"
              />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-4">
                <Cookie className="w-3.5 h-3.5" /> Cookie Policy
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How <span className="text-gradient">Jewel IQ</span> uses cookies
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparent, POPIA & GDPR-aligned cookie practices — no surprises, no shady trackers.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-[220px_1fr] gap-10">
              <LegalTOC
                items={[
                  ...sections.map((s) => ({ id: slugify(s.title), title: s.title })),
                  { id: "cookies-table", title: "7. Cookies We Set" },
                ]}
              />
              <div className="space-y-6">
              {sections.map((section, i) => (
                <motion.section
                  key={section.title}
                  id={slugify(section.title)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-sm scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl bg-primary/10 text-primary p-2">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground">{section.title}</h2>
                  </div>
                  <div className="text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_a]:text-primary">
                    {section.body}
                  </div>
                </motion.section>
              ))}

              <motion.section
                id="cookies-table"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-sm scroll-mt-28"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">7. Cookies We Set</h2>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="px-2 py-2 font-medium">Name</th>
                        <th className="px-2 py-2 font-medium">Provider</th>
                        <th className="px-2 py-2 font-medium">Purpose</th>
                        <th className="px-2 py-2 font-medium">Duration</th>
                        <th className="px-2 py-2 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookies.map((c) => (
                        <tr key={c.name} className="border-b border-border/50 last:border-0">
                          <td className="px-2 py-3 font-mono text-xs text-foreground">{c.name}</td>
                          <td className="px-2 py-3 text-muted-foreground">{c.provider}</td>
                          <td className="px-2 py-3 text-muted-foreground">{c.purpose}</td>
                          <td className="px-2 py-3 text-muted-foreground whitespace-nowrap">{c.duration}</td>
                          <td className="px-2 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                              {typeIcon[c.type]} {c.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CookiePolicy;