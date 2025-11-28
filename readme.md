
# 📁 **README.md — Codes ArcIn Website**

## 🎨 Overview

Codes ArcIn is the official portfolio website for an interior design studio.
This repository contains a clean, modular, component-based **static website**, built using:

* HTML (with component includes)
* CSS (modular stylesheets)
* JavaScript (for component loading, rendering, tracking)
* JSON data (for portfolio, services, testimonials)
* Deployed on **Netlify** or **GitHub Pages**
* No backend required

The structure is optimized for:

* Easy development
* Easy deployment
* Mobile-first performance
* SEO
* MarTech tracking (GA4, GTM, Meta Pixel)
* Clean code maintenance

---

# 📂 Folder Structure

```
codes-arcin-site/
│
├─ index.html               — Homepage (hero, USP, featured work)
├─ 404.html                 — Not-found fallback (Netlify/GitHub Pages)
├─ netlify.toml             — Optional Netlify redirect/config
├─ README.md                — Documentation
├─ .gitignore               — Ignored files for Git
│
├─ pages/                   — All standalone pages
│  ├─ portfolio.html
│  ├─ services.html
│  ├─ about.html
│  ├─ testimonials.html
│  └─ contact.html
│
├─ components/              — Reusable HTML chunks injected via JS
│  ├─ header.html
│  ├─ footer.html
│  ├─ hero.html
│  ├─ portfolio-card.html
│  ├─ service-card.html
│  ├─ testimonial-card.html
│  ├─ contact-form.html
│  └─ whatsapp-widget.html
│
├─ data/                    — JSON data sources
│  ├─ settings.json
│  ├─ portfolio.json
│  ├─ services.json
│  └─ testimonials.json
│
├─ branding/                — Logos & brand guide
│  ├─ logo.png
│  ├─ logo-small.png
│  └─ palette.md
│
├─ assets/                  — Images, icons, fonts
│  ├─ images/
│  │  ├─ hero/
│  │  ├─ portfolio/
│  │  ├─ services/
│  │  ├─ testimonials/
│  │  └─ global/
│  ├─ icons/
│  └─ fonts/
│
├─ styles/                  — CSS modules
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  ├─ pages.css
│  └─ utils.css
│
└─ scripts/                 — JS modules
   ├─ loader.js             — Injects components into pages
   ├─ render.js             — Renders JSON-based content
   ├─ tracking.js           — GA4, GTM, UTM, Pixel events
   └─ form.js               — Contact form logic
```

-