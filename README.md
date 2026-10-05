# 79897.com — China Trade & Prosperity Hub

**79897 · 七九八九七 · 起久发久起 — rise, endure, prosper, endure, rise.**

A static website for businesses that source from China, sell to Chinese consumers, and price or brand with Chinese number culture. It includes free tools, a China business calendar, guides, a lead-generation RFQ engine, donations, contests, careers and advertising pages. It is built for **GitHub Pages (free plan)**.

- Research and concept selection: [`RESEARCH.md`](RESEARCH.md)
- Phase-wise build prompts: [`BUILD-PROMPTS.md`](BUILD-PROMPTS.md)

## Structure (Jekyll, built automatically by GitHub Pages)
```
_layouts/default.html      shared layout: interest bar, header/mega-nav, footer, newsletter, cookie banner, modal
_includes/article-sidebar.html
_config.yml                site version (cache-busting) and excluded files
*.html                     one page per file (front matter: title, description, optional jsonld)
assets/css/style.css       design system (light/dark)
assets/js/config.js        ALL settings: AdSense, GA4, donation links, YouTube videos, fundraising, form relay
assets/js/main.js          nav, consent, ads, forms, tabs, videos, modals, countdowns
assets/js/tools.js         landed cost, freight/CBM, profit/MOQ, lucky price, number decoder, calendar (.ics), RMB converter
scripts/preview.py         local preview without Ruby (renders to _site/)
sitemap.xml, robots.txt, ads.txt, manifest.webmanifest, 404.html
```

## Local preview
```bash
python3 scripts/preview.py && python3 -m http.server -d _site 8000
```

## Go-live checklist
1. **Forms:** submit any form once on the live site. FormSubmit sends a one-time activation email to the site inbox. Click it, and every later submission is delivered. The inbox is stored encoded in `config.js` and never rendered.
2. **AdSense:** apply with the live domain, then set `adsenseClient` and `adSlots` in `config.js` and uncomment the line in `ads.txt`.
3. **Donations:** paste your PayPal, Stripe, Ko-fi, Buy Me a Coffee, Patreon and crypto links into `config.donate`. Until then, buttons open the pledge form.
4. **YouTube:** set `youtubeChannel` and replace `videos` with your own uploads.
5. **Fundraising bar:** update `fundraising.raised` in `config.js`.
6. **Custom domain:** in *Settings → Pages → Custom domain*, enter `79897.com`, then add these records at your registrar:
   - `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` for `www` → `webworksa1.github.io`
   Then tick **Enforce HTTPS**.
7. **Calendar:** after the State Council publishes the 2027 holiday schedule (usually in November), update the `EVENTS` array in `tools.js`.

## Legal
See `legal.html` (Trademark & Copyright Disclosure). "79897" is used only as a numeral and domain name. No trademark rights in the number are claimed.

© 79897.com. All rights reserved.
