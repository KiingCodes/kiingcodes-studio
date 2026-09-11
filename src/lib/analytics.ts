import posthog from "posthog-js";

const POSTHOG_KEY = "phc_yYQ3L5Czb5inF2pkDpYMqBDnFg3pCw56L5Cf9QVJbLZP";
const POSTHOG_HOST = "https://eu.i.posthog.com";

let started = false;

export const initAnalytics = () => {
  if (started || typeof window === "undefined") return;
  started = true;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "always",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
  });

  // Global capture of lead-intent links (email, phone, WhatsApp) anywhere on the site.
  window.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const label = (link.innerText || link.getAttribute("aria-label") || "").trim();

      if (href.startsWith("mailto:")) {
        track("lead_contact_click", { channel: "email", value: href.replace("mailto:", ""), label });
      } else if (href.startsWith("tel:")) {
        track("lead_contact_click", { channel: "phone", value: href.replace("tel:", ""), label });
      } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        track("lead_contact_click", { channel: "whatsapp", value: href, label });
      }
    },
    { capture: true },
  );
};

export const track = (event: string, properties: Record<string, unknown> = {}) => {
  try {
    posthog.capture(event, { path: window.location.pathname, ...properties });
  } catch {
    // analytics must never break the UI
  }
};

export { posthog };
