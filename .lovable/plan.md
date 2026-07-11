## Goal
Rebuild the JewelIQ site as a premium cyber-luxury experience behind the scenes while keeping `MAINTENANCE_MODE = true` so public visitors continue to see the maintenance page. All new work will be reachable via a preview toggle so you can review before flipping maintenance off.

## Approach
- Keep `MAINTENANCE_MODE = true` in `src/App.tsx` (public stays on maintenance page).
- Add a preview escape hatch: visiting `/?preview=1` (or setting `localStorage.jeweliq_preview = "1"`) bypasses maintenance so you can QA the new site. Everyone else keeps seeing maintenance.
- Rebuild the marketing surface (`/`, About, Portfolio, Contact, Services detail) with the new visual system. Leave portal/admin/auth code untouched.

## Visual System
- Tokens in `src/index.css`: obsidian background `222 47% 4%`, surface `222 40% 7%`, sapphire `#2563eb`, emerald `#10b981`, radiant cyan `#22d3ee`, crisp white foreground. Add gradient + glow tokens (`--gradient-jewel`, `--glow-sapphire`, etc.). No hard-coded colors in components.
- Typography: Inter for body, Space Grotesk for display (already loaded / add via Google Fonts import).
- Reusable primitives: `GlassCard`, `GlowButton`, `SectionHeading`, `AnimatedGradientBorder`, `TiltCard` (Framer Motion 3D tilt), `CursorGlow` (ambient orb following cursor), `FadeInSection` (scroll reveal).

## New / Rebuilt Components
- `Navbar` — sticky glassmorphic bar, new logo lockup, gradient-border CTA.
- `HeroSection` — headline "Architecting the Future of Digital Intelligence", dual CTAs, particle canvas + cursor-tracking orb, floating mock dashboard card with parallax on scroll.
- `EcosystemSection` — 3-pillar tabbed interface (Engineering / Marketing / Business), typing effect on tab switch, expandable service drawers.
- `PortfolioSection` — horizontal snap-scroll gallery of mock case studies with hover metric overlays.
- `FrameworkSection` — animated vertical timeline: Discovery → Architecture → Execution → Hyper-Growth.
- `ContactHub` — multi-step form: tag picker → details → review; sidebar with contact info + WhatsApp.
- `Footer` — multi-column, newsletter input, subtle copyright.

## Files
Create:
- `src/components/jewel/CursorGlow.tsx`
- `src/components/jewel/GlassCard.tsx`
- `src/components/jewel/TiltCard.tsx`
- `src/components/jewel/FadeInSection.tsx`
- `src/components/jewel/GlowButton.tsx`
- `src/components/jewel/ParticleField.tsx`
- `src/components/jewel/JewelLogo.tsx`
- `src/sections/HeroSection.tsx` (replaces marketing hero)
- `src/sections/EcosystemSection.tsx`
- `src/sections/PortfolioSection.tsx`
- `src/sections/FrameworkSection.tsx`
- `src/sections/ContactHub.tsx`
- `src/sections/JewelFooter.tsx`
- `src/sections/JewelNavbar.tsx`
- `src/pages/JewelHome.tsx` (composes the sections)

Edit:
- `src/index.css` — new tokens, gradients, glow shadows, keyframes.
- `tailwind.config.ts` — expose sapphire/emerald/cyan semantic colors + shadow utilities.
- `src/App.tsx` — add `?preview=1` / localStorage bypass; when bypassed, render `JewelHome` at `/` (rest of routes stay as-is). Maintenance page still default.
- `index.html` — update `<title>` and meta description to reflect JewelIQ Technologies.

Leave untouched: maintenance page, portal, admin, auth pages, Supabase code.

## Verification
- Public root `/` still renders `MaintenancePage`.
- `/?preview=1` renders the new home; reload keeps preview via localStorage.
- Build passes (`bun run build`).
- Playwright screenshot of `/?preview=1` at 1280×1800 to confirm hero, ecosystem, portfolio, framework, contact, footer all render with the dark jewel aesthetic.
