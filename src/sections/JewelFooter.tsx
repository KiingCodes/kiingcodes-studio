import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { JewelLogo } from "@/components/jewel/JewelLogo";

const cols = [
  {
    title: "Services",
    links: [
      { label: "Software Development", href: "#ecosystem" },
      { label: "Digital Entrepreneurship", href: "#ecosystem" },
      { label: "Cybersecurity", href: "#ecosystem" },
      { label: "Network Engineering", href: "#ecosystem" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How We Work", href: "#about" },
      { label: "Capabilities", href: "#portfolio" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "bookings@jeweliq.tech", href: "mailto:bookings@jeweliq.tech" },
      { label: "+27 60 433 4341", href: "tel:+27604334341" },
      { label: "WhatsApp", href: "https://wa.me/27604334341" },
    ],
  },
];

export const JewelFooter = () => {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <footer className="relative border-t border-border/60 pt-20 pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 0%, hsl(var(--accent) / 0.25), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[1.4fr,repeat(3,1fr)]">
          <div>
            <JewelLogo size="h-10" />
            <p className="mt-4 max-w-xs text-sm text-foreground/65">
              An Information Technology company delivering software development,
              digital entrepreneurship, cybersecurity, and network engineering.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setOk(true);
              }}
              className="mt-6 flex max-w-sm items-center rounded-full glass p-1"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@brand.com"
                className="h-9 flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1 rounded-full bg-jewel-gradient px-4 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {ok ? "Joined" : "Subscribe"}{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-foreground/75 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-foreground/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Jewel IQ Technologies. All rights
            reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">South Africa</p>
        </div>
      </div>
    </footer>
  );
};
