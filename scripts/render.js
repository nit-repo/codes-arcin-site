/******************************************************************************
 * RENDER.JS — Unified component loader + responsive mode + testimonials
 * ---------------------------------------------------------------------------
 * Features:
 *  ✓ Replace loader.js completely
 *  ✓ HTML includes via data-include="header"
 *  ✓ Multiple relative path attempts
 *  ✓ In-memory fetch cache (no double requests)
 *  ✓ Execute inline & external scripts in included HTML
 *  ✓ Toggle `.mobile` / `.desktop` class on <html>
 *  ✓ NEVER reload components on resize → pure CSS handles layout
 *  ✓ Placeholder minimization to reduce layout shift
 *  ✓ Renders short testimonials on home
 *****************************************************************************/

(function () {

  /**************************************************************
   * CONFIG
   **************************************************************/
  const BREAKPOINT = 768;          // px where desktop mode activates
  const COMPONENT_DIR = "components";
  const DATA_DIR = "data";
  const CACHE = new Map();


  /**************************************************************
   * UTILITY — Fetch with in-memory cache
   **************************************************************/
  async function cachedFetch(url) {
    if (CACHE.has(url)) return CACHE.get(url);

    const pending = fetch(url).then(async res => {
      if (!res.ok) throw new Error(`Fetch failed for ${url}`);
      return res.text();
    });

    CACHE.set(url, pending);
    return pending;
  }


  /**************************************************************
   * UTILITY — Try multiple possible paths for includes
   **************************************************************/
  async function tryPaths(paths) {
    for (const p of paths) {
      try {
        const html = await cachedFetch(p);
        return html;
      } catch (e) { /* try next */ }
    }
    console.warn("Include not found in paths:", paths);
    return "";
  }


  /**************************************************************
   * UTILITY — Execute scripts found inside injected HTML
   **************************************************************/
  function executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const s = document.createElement("script");
      if (oldScript.src) s.src = oldScript.src;
      s.type = oldScript.type || "text/javascript";
      if (oldScript.textContent) s.textContent = oldScript.textContent;
      document.body.appendChild(s);
      oldScript.remove();
    });
  }


  /**************************************************************
   * COMPONENT INCLUDE SYSTEM — replaces loader.js
   **************************************************************/
  async function loadIncludes() {
    const targets = document.querySelectorAll("[data-include]");

    await Promise.all([...targets].map(async el => {
      const name = el.getAttribute("data-include");

      // Show lightweight placeholder to minimize CLS
      el.innerHTML = `<div style="height:24px;opacity:.2;background:#ddd;border-radius:4px;"></div>`;

      const paths = [
        `${COMPONENT_DIR}/${name}.html`,
        `../${COMPONENT_DIR}/${name}.html`,
        `/${COMPONENT_DIR}/${name}.html`,
      ];

      const html = await tryPaths(paths);
      el.innerHTML = html;

      // Run any embedded <script>
      executeScripts(el);
    }));
  }


  /**************************************************************
   * RESPONSIVE MODE — toggle .mobile / .desktop on <html>
   **************************************************************/
  function updateResponsiveMode() {
    const html = document.documentElement;
    if (window.innerWidth >= BREAKPOINT) {
      html.classList.add("desktop");
      html.classList.remove("mobile");
    } else {
      html.classList.add("mobile");
      html.classList.remove("desktop");
    }
  }

  // Initialize & listen for resize
  window.addEventListener("resize", updateResponsiveMode);
  window.addEventListener("orientationchange", updateResponsiveMode);


  /**************************************************************
   * TESTIMONIALS — home page short list
   **************************************************************/
  async function renderHomeTestimonials() {
    const container = document.getElementById("home-testimonials");
    if (!container) return;

    const count = parseInt(container.dataset.count || "3", 10);

    // Load JSON
    const testimonials = await cachedFetch(`${DATA_DIR}/testimonials.json`).then(JSON.parse);

    // Load template
    const tplText = await cachedFetch(`${COMPONENT_DIR}/testimonial-card.html`);
    const holder = document.createElement("div");
    holder.innerHTML = tplText;
    const template = holder.querySelector("#testimonial-card-template");

    const items = testimonials.slice(0, count);

    items.forEach(item => {
      const clone = template.content.cloneNode(true);
      clone.querySelector('[data-field="quote"]').textContent = item.quoteShort || item.quoteLong || "";
      clone.querySelector('[data-field="name"]').textContent = item.name;
      clone.querySelector('[data-field="meta"]').textContent = item.meta || "";
      container.appendChild(clone);
    });
  }


  /**************************************************************
   * INIT — run everything
   **************************************************************/
  document.addEventListener("DOMContentLoaded", async () => {
    updateResponsiveMode();       // set mobile/desktop class
    await loadIncludes();         // load header/footer/etc
    renderHomeTestimonials();     // homepage testimonials
  });

})();
