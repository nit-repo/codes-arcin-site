
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

---

# ⚙️ Local Development

### ⚠️ Requirement: Use **Git Bash** or VS Code Terminal with Git Bash

Windows PowerShell does not support `touch` and some Linux commands.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/codes-arcin-site.git
cd codes-arcin-site
```

### 2. Start a local development server

Option A — VS Code Live Server extension

* Right-click `index.html` → **Open with Live Server**

Option B — Python local server

```bash
python -m http.server 5500
```

Open: `http://localhost:5500`

---

# 📦 Component Loading

`loader.js` loads components dynamically:

```html
<div data-include="header"></div>
```

This is replaced with the contents of:

```
components/header.html
```

Every page should have:

```html
<div data-include="header"></div>
...
<div data-include="footer"></div>
```

---

# 🧩 JSON Data Rendering

The website uses JSON files for dynamic content:

* portfolio.json
* services.json
* testimonials.json

`render.js` fetches this data and turns it into HTML cards using component templates.

---

# 📱 Mobile Optimization

The layout is built as **mobile-first**:

* Responsive navigation
* Lazy-loaded images
* Grid/flex components
* Minified & compressed images recommended

---

# 📈 Tracking (GA4 + GTM + Pixel)

Tracking scripts are managed inside:

```
scripts/tracking.js
```

Supports:

* GA4
* Google Tag Manager
* Meta Pixel
* UTM parameter tracking
* WhatsApp click tracking
* Form submission events

---

# 🚀 Deployment

## Option A — Netlify (recommended)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site → Deploy manually**
3. Drag-and-drop the entire project folder
4. Done (Netlify gives you a live URL)

OR connect GitHub repo:

* Every `git push` will deploy automatically.

### If routes break, enable SPA-style fallback:

`netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Option B — GitHub Pages

1. Commit & push repo to GitHub
2. Settings → Pages → Deploy from root
3. Site goes live at
   `https://yourusername.github.io/codes-arcin-site/`

✔ Use **relative paths**, not absolute.

---

# 📌 Best Practices

* Never use absolute paths like `/components/header.html`
* Optimize all images before adding to the `assets/images/` folder
* Keep header/footer inside components, NOT duplicated
* Use `loading="lazy"` for images
* Keep colors + fonts in `base.css` variables
* Keep long text (services, testimonials) inside JSON, not HTML

---

# 👨‍💻 Maintainers

**Codes ArcIn**
Interior Design & Build Studio
Chennai, India

Website developer & MarTech setup: *You*

---

# 📞 Contact

For website changes:
`contact@codesarcin.com` (or your email)

---

If you want, I can now generate:

✅ Starter HTML files
✅ Full `loader.js`
✅ Brand-styled header + footer
✅ Sample portfolio JSON
✅ Sample CSS theme

Just tell me **“generate starter files”**.
