/**
 * Shared background style presets used by DynamicSection, PremiumBlogPost,
 * and the Owami admin editor. All values use semantic HSL tokens.
 */

export type BackgroundPresetKey =
  | "none"
  | "aurora"
  | "sunset"
  | "ocean"
  | "midnight"
  | "diamond"
  | "ember"
  | "mint"
  | "royal";

export interface BackgroundPreset {
  key: BackgroundPresetKey;
  label: string;
  /** CSS background value using HSL semantic tokens */
  gradient: string;
  /** Suggested accent color (HSL token reference) */
  accent: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { key: "none", label: "None", gradient: "", accent: "var(--primary)" },
  {
    key: "aurora",
    label: "Aurora",
    gradient:
      "linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--accent) / 0.25), hsl(var(--primary) / 0.15))",
    accent: "var(--primary)",
  },
  {
    key: "sunset",
    label: "Sunset",
    gradient:
      "linear-gradient(135deg, hsl(20 90% 55% / 0.25), hsl(340 85% 55% / 0.25), hsl(280 70% 50% / 0.2))",
    accent: "20 90% 55%",
  },
  {
    key: "ocean",
    label: "Ocean",
    gradient:
      "linear-gradient(135deg, hsl(195 85% 50% / 0.25), hsl(220 70% 45% / 0.25), hsl(260 60% 50% / 0.15))",
    accent: "195 85% 50%",
  },
  {
    key: "midnight",
    label: "Midnight",
    gradient:
      "linear-gradient(135deg, hsl(240 60% 15% / 0.6), hsl(260 70% 25% / 0.5), hsl(220 80% 30% / 0.4))",
    accent: "260 70% 60%",
  },
  {
    key: "diamond",
    label: "Diamond",
    gradient:
      "conic-gradient(from 180deg at 50% 50%, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))",
    accent: "var(--primary)",
  },
  {
    key: "ember",
    label: "Ember",
    gradient:
      "radial-gradient(ellipse at top, hsl(15 90% 55% / 0.3), transparent 60%), radial-gradient(ellipse at bottom, hsl(340 80% 50% / 0.25), transparent 60%)",
    accent: "15 90% 55%",
  },
  {
    key: "mint",
    label: "Mint",
    gradient:
      "linear-gradient(135deg, hsl(160 70% 45% / 0.22), hsl(190 75% 50% / 0.2), hsl(210 65% 55% / 0.15))",
    accent: "160 70% 45%",
  },
  {
    key: "royal",
    label: "Royal",
    gradient:
      "linear-gradient(135deg, hsl(265 70% 45% / 0.3), hsl(290 65% 50% / 0.25), hsl(220 80% 50% / 0.2))",
    accent: "265 70% 55%",
  },
];

export function getBackgroundPreset(
  key?: string | null,
): BackgroundPreset | undefined {
  if (!key) return undefined;
  return BACKGROUND_PRESETS.find((p) => p.key === key);
}

/**
 * Resolve the final CSS background string. Accepts either a preset key
 * (e.g. "aurora") or a raw CSS gradient string.
 */
export function resolveBackground(value?: string | null): string {
  if (!value) return "";
  const preset = getBackgroundPreset(value);
  if (preset) return preset.gradient;
  return value;
}

export type AnimationPresetKey =
  | "fade-in"
  | "scale-in"
  | "slide-in-right"
  | "none";

export const ANIMATION_PRESETS: { key: AnimationPresetKey; label: string }[] = [
  { key: "fade-in", label: "Fade in" },
  { key: "scale-in", label: "Scale in" },
  { key: "slide-in-right", label: "Slide in" },
  { key: "none", label: "No animation" },
];

export function animationVariants(preset?: string | null) {
  switch (preset) {
    case "scale-in":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
      };
    case "slide-in-right":
      return {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
      };
    case "none":
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
    case "fade-in":
    default:
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      };
  }
}