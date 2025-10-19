## How would you implement 301 redirects in Nuxt that are manageable?

I’d keep a simple "Redirects" list in the CMS (or a tiny JSON file as a backup). Each row has: from, to, status (301), enabled, and optional dates. In Nuxt, a small server-side middleware checks the current path against that list and, if there’s a match, sends a 301. I’d cache the list for a few minutes so we’re not hammering the CMS, and hook up a webhook so when someone hits "Save" in the CMS, the cache clears and changes go live instantly—no deploy needed.

For safety, I’d export the same rules to the hosting layer (Vercel/Netlify/Cloudflare) during build so redirects still work even if the app has a bad day. I’d also block obvious foot-guns (loops and chains), log 404s so we can convert the frequent ones into redirects, and keep preview/staging tied to their own CMS spaces so marketing can test before going live.

Net result: non-devs manage URLs, SEO stays happy, and we don’t ship hotfixes just to fix a link.

## How would you monitor the application for errors?

I’d set up Sentry for both the frontend and backend to catch real errors with full stack traces and release tags. That covers 90% of cases right there. For "what actually happened" before an error, I’d add LogRocket or Sentry Replay for session replays.

Then a lightweight uptime monitor (Better Stack or UptimeRobot) to ping key routes, and maybe Sentry Performance or SpeedCurve for real-user performance metrics.

Alerts go to Slack with clear thresholds - e.g. SSR error rate above 1%, uptime fail in 2+ regions, or big spikes in 404s.

Basically: Sentry for why it broke, uptime monitor for when it’s down, and Slack alerts so the team knows right away.

## If you could pick one CMS for the website bywinona.com, what would it be and why?

1) Pure Nuxt stack (my default if the site’s mostly marketing pages)

- Nuxt Content for content (Markdown/JSON/YAML).

- Nuxt Studio on top for non-dev editing (visual-ish editor for Nuxt Content).

- Pros: zero headless CMS overhead, blazing fast, versioned in Git, cheap.

- Cons: heavy non-tech editing might still feel “Git-y” unless Studio workflow fits.

2) Vue-native headless CMS

- Directus (admin is Vue 3) as the headless layer; Nuxt consumes via REST/GraphQL.

- Pros: real roles/workflows, structured data, media library, webhooks; still Vue vibes.

- Cons: more infra to run; you’re managing a DB + service.

If content is mostly pages/sections and the team is small → Nuxt Content + Nuxt Studio.
If you need structured content, permissions, scheduled promos, etc. → Directus + Nuxt.

**High-level requirements**

Technical (Vue/Nuxt-first)

- Nuxt 3 with SSR/ISR, image optimization, edge caching/CDN.

- Centralized design system (shared UI lib) used by both site & portal.

- Error monitoring (Sentry), uptime checks, real-user perf (LCP/CLS).

- CI/CD with preview deploys for every PR; content preview wired in.

- i18n-ready, a11y checks in CI, schema.org/OG metas from content.

- Secrets via env manager; infra as code; no PHI on the public site.

- For Directus path: typed SDK/GraphQL client, webhooks to revalidate.

- For Nuxt Content path: Nuxt Studio enabled, content linting, link checker.

User (editors & visitors)

- Editors: quick previews, easy media management, rollback/version history, scheduled publishes, safe staging → prod flow.

- Visitors: sub-1.5s LCP on mobile, clear CTAs, accessible UI (WCAG AA), consistent branding with the portal, trustworthy content (reviews, policies), fast search/FAQ.

Rule of thumb

- Mostly marketing pages, small team → Nuxt Content + Studio (speed, simplicity).

- Structured content, permissions, scheduled promos, multi-app consumers → Directus + Nuxt (flexibility, scale).

## If you had to technically improve the homepage of bywinona.com

Looking at the website I can suggest only UI/UX updates.
For technical expertize I need to see your code and production environment.

## Given there are two parts of the system: The website and a patient portal. How can these two applications share data like a promo code that should display a $50 off banner at the website and the patient portal for each visitor?

- **Single source of truth:** a tiny Promotions API (GET /promotions/:code) both apps call.

- **First-party, apex-domain cookie:** set Domain=.bywinona.com, SameSite=Lax, short TTL. Payload is signed { code, campaignId, expires }.

- **SSR read + verify in both apps:** on every request, read the cookie server-side, verify signature, optionally re-validate the code (cached 60–300s).

- **Render banner + enforce on server:** show the $50 off banner in both apps if valid; the actual discount is enforced server-side by campaignId (no trusting the client).

- **Logged-in persistence:** when a user signs in, store campaignId in the portal DB so it follows them across devices; DB flag overrides cookie.

- **Revocation & hygiene:** cookie TTL ≤ promo end, easy webhook to purge edge cache, clear the cookie if invalid/expired.

## You have to setup the team for fast but reliable software development. How would you setup the infrastructure and the workflows like PRs and branching models?

- **Staging environment:** before release all new changes comes to the staging environment for QA stage. Separate branch, separate database, etc. Release by pushing staging to prod.

- **Dedicated Slack channel for automatic PR announcements:** got new PR - here is Slack announcement.

- **Github actions on commit/PR:** run Linting, Unit and E2E test on new PR to make sure that a change works. Results comes Slack.

- **Code quality AI review:** add AI to review the code first.

- **Team PR review:** at least one team member should approve a change before merging.

- **All Tasks are PR's in a separate branches:** when start working on a task create user/DEV-001 schema branch for better visibility.