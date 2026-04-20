import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STORAGE_KEY = "jeweliq_cookie_consent_v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: string;
};

export function getCookieConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    // Hint to GA / other scripts that consent changed
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consent }));
  } catch {
    /* ignore */
  }
}

export const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      // Delay slightly so it doesn't fight with greeting/animations
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (a: boolean, m: boolean) => {
    saveConsent({
      necessary: true,
      analytics: a,
      marketing: m,
      ts: new Date().toISOString(),
    });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[60] md:left-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl">
            {/* Subtle brand wallpaper */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.12))",
              }}
            />
            <button
              onClick={() => accept(true, false)}
              className="absolute top-3 right-3 z-10 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/15 p-2 text-primary">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    We use cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We use cookies to keep the site working, measure usage, and
                    remember your preferences. Read our{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-2 text-sm"
                >
                  <Row label="Necessary" desc="Required for the site to work." checked disabled />
                  <Row
                    label="Analytics"
                    desc="Helps us understand how the site is used."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <Row
                    label="Marketing"
                    desc="Personalised content and ads."
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </motion.div>
              )}

              <div className="mt-5 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails((s) => !s)}
                >
                  {showDetails ? "Hide options" : "Customize"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => accept(false, false)}
                >
                  Reject all
                </Button>
                {showDetails ? (
                  <Button
                    size="sm"
                    onClick={() => accept(analytics, marketing)}
                  >
                    Save preferences
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => accept(true, true)}>
                    Accept all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function Row({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/40 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <div className="flex-1">
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </label>
  );
}