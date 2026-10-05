# 79897.com — Phase-wise Build Prompts

**Concept:** **79897 · 起久发久起 — China Trade & Prosperity Hub.** Free tools, guides and a vetted-partner RFQ engine for businesses that **source from China**, **sell to Chinese consumers**, and want to **price and brand with Chinese number culture**.

**Monetization stack:** Google AdSense, YouTube embeds and channel growth, pay-per-lead RFQs, sponsorships and ads, affiliates, donations and patrons, contests.

**Hosting:** GitHub Pages (free plan, Jekyll). Repo `webworksa1/79897-com`.

Run each phase as one prompt. Each phase builds on the previous one.

---

## Phase 0 — Global rules (prepend to every phase)

```
You are building 79897.com, a static Jekyll site hosted on GitHub Pages (free plan). No server code.
Hard rules:
1. Every page shows a top bar: "Contact, if you are interested in this website / domain name /
   Sponsorship / Advertisement / Partnership", linked to https://web.works/contact (new tab).
2. All forms POST via fetch to the FormSubmit AJAX relay. The owner inbox [OWNER_INBOX] is stored
   ONLY as an XOR-encoded integer array in assets/js/config.js and decoded at submit time.
   The address must never appear in HTML, JS strings, mailto links, meta tags, or sitemaps.
3. Relative links only (works on github.io/79897-com/ AND on the custom domain).
4. Mobile-first, WCAG AA contrast, light and dark themes, no layout shift from ads.
5. Trademark/copyright: "79897" is used as a numeral and domain name only. Do not claim
   trademark rights in the number. Do not use third-party logos or copyrighted text.
   Add a full disclosure on legal.html and a short one in the footer.
6. Content is information only, not legal/customs/tax/investment advice.
```

## Phase 1 — Foundation and design system

```
Create _config.yml (version for cache-busting, exclude docs/scripts), _layouts/default.html
(head with SEO meta, OG/Twitter, canonical, JSON-LD hook, Google Fonts Inter + Noto Serif SC),
assets/css/style.css with design tokens: ink #0f1d2b, jade #0e7c66, vermilion #d6402b, gold #c99a2e,
paper #faf8f3; dark theme tokens; container, grid, cards, buttons, badges, forms, stepper, tables,
tabs, modals, toasts, ad-slot placeholders with reserved height, sticky header with mega-nav:
Source from China | Sell to China | Tools | Calendar | Guides | Community (Contests, Careers,
Support, Advertise) + "Get Free Quotes" CTA. Footer link map (5 columns), cookie consent
(Accept all / Essential), theme toggle, back-to-top, mobile drawer nav.
```

## Phase 2 — Config and core JS

```
assets/js/config.js: single settings object (adsenseClient, adSlots, ga4, donate links
{paypal,kofi,buymeacoffee,stripe,patreon,crypto}, youtubeChannel, videos[], social, fundraising
goal, encoded inbox array, interestUrl).
assets/js/main.js: nav and drawer, theme, consent-gated AdSense loader (house "Advertise here" ads
when no publisher ID), GA4 after consent, lazy YouTube facade (thumbnail → iframe on click),
multi-step forms with validation, progress bar, honeypot, FormSubmit AJAX submit, success panel,
exit-intent and scroll-depth newsletter modal (once per 7 days), countdowns, reveal-on-scroll,
copy/share buttons, fundraising progress bar, toasts.
```

## Phase 3 — Free tools (traffic and lead magnets)

```
assets/js/tools.js + one page per tool, each ending with a contextual RFQ CTA:
1. Landed Cost Calculator: FOB unit price × qty, freight, insurance %, duty %, extra tariff %,
   VAT/GST %, broker and QC fees, payment fee % → total, per-unit, stacked breakdown bars,
   suggested retail at target margin.
2. Freight & CBM Estimator: carton dims, cartons, gross kg → CBM, volumetric kg (air /6000,
   express /5000), chargeable kg, editable indicative rates for sea LCL/FCL, air, express, transit.
3. Profit, MOQ & Break-even: landed cost, price, platform fee %, ad cost/unit, MOQ → margin,
   ROI, cash needed, break-even units.
4. Lucky Price Generator: any price → ranked 8/88/168/888 endings, flags 4/14/74, by currency.
5. Number Meaning Decoder: any number (phone, plate, SKU, address, domain) → digit homophones,
   famous combos (168, 518, 520, 1314, 88, 99, 98, 4, 14, 74), palindrome check, score 0–100.
6. China Business Calendar 2026–2027: holidays, factory shutdown windows, Canton Fair phases,
   618, Double 11, Double 12, Golden Week; filter by type; live countdown; per-event and
   full-year .ics download.
7. RMB Currency Converter: live rates from open.er-api.com with an offline fallback table.
```

## Phase 4 — Lead generation engine (highest priority for revenue)

```
get-quotes.html: tabbed, 3-step RFQ wizard with a progress bar and a "reply in 24–48h" promise.
Tabs: (A) Source a product — product, category, link or spec, qty, target unit price, budget,
timeline, destination country/port, shipping mode, OEM/private label, certifications
(CE/FCC/FDA/UL/ISO/BSCI), samples needed, sales channel, business stage.
(B) Sell to China — brand, category, website, target platforms (Tmall Global, JD Worldwide,
Douyin, Xiaohongshu, WeChat), budget, timeline.
(C) Inspection / factory audit — service, factory city, category, date.
(D) Lucky-number branding and pricing audit.
Step 3 contact: name, work email, company, country, WhatsApp/WeChat, preferred channel,
consent checkbox with partner-sharing disclosure.
Trust: stats bar, how it works (3 steps), partner categories, FAQ, testimonials placeholder
(labelled "sample"), no fake reviews. Every tool, guide and footer links here.
Add inline mini-forms: homepage hero quote form, sticky mobile CTA bar, end-of-article CTA.
```

## Phase 5 — Content hub (SEO)

```
Pillar guides (1,200–2,000 words each, with TOC, FAQ, JSON-LD Article/FAQ):
- How to Import from China (step-by-step)
- How to Sell to Chinese Consumers (cross-border e-commerce)
- Chinese Lucky-Number Pricing & Branding
- The Meaning of 79897 (起久发久起)
- Chinese New Year Factory Shutdown Playbook
- China Sourcing Agent Fees Explained
- Incoterms & Sourcing Glossary (FOB, EXW, CIF, DDP, MOQ, OEM/ODM, HS code, CBM)
Plus guides.html hub with category filters and search, and videos.html (YouTube facade grid,
category tabs, subscribe CTA).
```

## Phase 6 — Community and monetization pages

```
support.html: donation tiers (Supporter $8, Builder $28, Patron $88, Founder $888), one-time and
monthly links (PayPal, Stripe, Ko-fi, BMC, Patreon, crypto) from config, fundraising bar, use of
funds (operations, promotions, marketing, hiring, contests/prizes), donor wall opt-in form.
contests.html: current contest (e.g. "Best Lucky-Number Brand Name" / "Import Success Story"),
prize table, rules, judging criteria, timeline, entry form, past winners placeholder.
careers.html: open roles (content writers EN/中文, video editor, SEO, partnerships, China-based
sourcing researchers), talent pool form with portfolio link.
advertise.html: audience, placements (sponsored tool, calendar sponsor, newsletter, display,
sponsored guide, directory listing), indicative rate card, media-kit request form.
about.html, contact.html (form only, no address), faq.html.
```

## Phase 7 — Legal, trust and compliance

```
legal.html (Trademark & Copyright Disclosure, no-advice disclaimer, affiliate and advertiser
disclosure, lead-sharing disclosure), privacy.html (cookies, AdSense/Google partners, GA4,
FormSubmit, consent, GDPR/PIPEDA/CCPA rights), terms.html, cookie banner, ads.txt template,
robots.txt, sitemap.xml, manifest.webmanifest, 404.html, humans.txt.
```

## Phase 8 — Performance, SEO and QA

```
Lighthouse ≥ 90 on all categories. Preconnect fonts, defer JS, lazy media, SVG icons inline,
favicon SVG, unique titles and descriptions, OG image, JSON-LD (Organization, WebSite+SearchAction,
Article, FAQPage, Event for calendar). Test at 360/768/1280 px. Grep the repo to confirm the inbox
string never appears. Validate every form posts and shows success.
```

## Phase 9 — Deploy and growth

```
Push to webworksa1/79897-com main. Settings → Pages → Deploy from branch main / root.
Custom domain 79897.com: A records 185.199.108-111.153, CNAME www → webworksa1.github.io,
Enforce HTTPS. Submit sitemap to Search Console, apply for AdSense, activate FormSubmit
(first submission sends a confirmation email to the inbox; click it once).
Growth: one calendar-timed post per week (e.g. "CNY shutdown in 8 weeks"), YouTube Shorts
from each tool, LinkedIn/Reddit r/FulfillmentByAmazon and r/smallbusiness answers that link
to the tools, sponsor outreach to 20 sourcing agents, QC firms and forwarders.
```
