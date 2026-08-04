import { FadeInSection } from "@/components/jewel/FadeInSection";
import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    tag: "Software",
    title: "Business Web Applications",
    metric: "Custom build",
    detail: "Client portals, dashboards, booking and management systems built around how your business actually works.",
    gradient: "from-primary via-accent to-emerald-400",
  },
  {
    tag: "Software",
    title: "Mobile Applications",
    metric: "Android & cross-platform",
    detail: "Mobile apps for customers or staff, connected to your existing systems and data.",
    gradient: "from-emerald-400 via-primary to-accent",
  },
  {
    tag: "Entrepreneurship",
    title: "Digital Business Enablement",
    metric: "Online presence",
    detail: "Getting small businesses and founders online: websites, e-commerce, payments, and automated workflows.",
    gradient: "from-accent via-emerald-400 to-primary",
  },
  {
    tag: "Cybersecurity",
    title: "Security Assessments & Hardening",
    metric: "Assess · Fix · Train",
    detail: "Vulnerability assessment, access and endpoint hardening, backups, and staff security awareness training.",
    gradient: "from-primary via-emerald-400 to-accent",
  },
  {
    tag: "Networking",
    title: "Network Design & Installation",
    metric: "LAN · WAN · Wi-Fi",
    detail: "Site surveys, structured cabling, routing and switching, firewalls, and ongoing network support.",
    gradient: "from-accent via-primary to-emerald-400",
  },
];

export const PortfolioSection = () => (
  <section id="portfolio" className="relative py-28 sm:py-36">
    <div className="mx-auto max-w-6xl px-4">
      <FadeInSection className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Capabilities
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            What we <span className="text-jewel-gradient">deliver</span>.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-foreground/65">
          The services our team takes on day to day — swipe to explore.
        </p>
      </FadeInSection>
    </div>

    <FadeInSection delay={0.1} className="mt-12">
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:pl-[max(1rem,calc((100vw-72rem)/2))]">
        {cases.map((c) => (
          <article
            key={c.title}
            className="group relative aspect-[3/4] w-[280px] flex-none snap-start overflow-hidden rounded-3xl sm:aspect-[4/5] sm:w-[360px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-80`} />
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-background/20" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.15] transition-opacity group-hover:opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Metric overlay */}
            <div className="absolute right-5 top-5 rounded-full glass px-3 py-1 text-xs font-medium text-foreground">
              {c.metric}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="glass-strong translate-y-2 rounded-2xl p-5 transition-transform duration-500 group-hover:translate-y-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {c.tag}
                </p>
                <h3 className="font-display mt-1.5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{c.detail}</p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-foreground/80 hover:text-accent"
                >
                  Enquire <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
        <div className="w-4 flex-none sm:hidden" />
      </div>
    </FadeInSection>
  </section>
);
