import { FadeInSection } from "@/components/jewel/FadeInSection";
import { ArrowUpRight } from "lucide-react";

const cases = [
  {
    tag: "Fintech",
    title: "Fintech Platform Overhaul",
    metric: "+300% Growth",
    detail: "Rebuilt payment rails and dashboards for a Series B fintech, cutting checkout drop-off in half.",
    gradient: "from-primary via-accent to-emerald-400",
  },
  {
    tag: "E-Commerce",
    title: "Global E-Commerce Expansion",
    metric: "Sub-100ms Latency",
    detail: "Multi-region storefront with edge personalization for a fashion brand shipping to 42 markets.",
    gradient: "from-emerald-400 via-primary to-accent",
  },
  {
    tag: "SaaS",
    title: "AI Analytics Platform",
    metric: "5.4× ARR",
    detail: "Realtime analytics with LLM-powered insights for an ops platform serving Fortune-500 teams.",
    gradient: "from-accent via-emerald-400 to-primary",
  },
  {
    tag: "Brand",
    title: "Luxury Brand Relaunch",
    metric: "+184% Retention",
    detail: "End-to-end rebrand, immersive site, and paid engine for a heritage jewellery house.",
    gradient: "from-primary via-emerald-400 to-accent",
  },
  {
    tag: "Infra",
    title: "Operator Cloud Migration",
    metric: "62% Cost Cut",
    detail: "Legacy-to-cloud migration and IaC pipeline for a national telecoms operator.",
    gradient: "from-accent via-primary to-emerald-400",
  },
];

export const PortfolioSection = () => (
  <section id="portfolio" className="relative py-28 sm:py-36">
    <div className="mx-auto max-w-6xl px-4">
      <FadeInSection className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Case Studies
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Work we&rsquo;re <span className="text-jewel-gradient">obsessed</span> with.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-foreground/65">
          A handful of the platforms, launches, and turnarounds we&rsquo;ve architected —
          drag to explore.
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
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-foreground/80">
                  View case study <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="w-4 flex-none sm:hidden" />
      </div>
    </FadeInSection>
  </section>
);
