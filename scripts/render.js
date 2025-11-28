/******************************************************************************
 * RENDER.JS — Unified component loader + responsive mode + testimonials
 * (patched: absolute-cache, return fetched URL, executeScripts awaits external
 *  scripts and resolves relative src against component URL)
 *****************************************************************************/

(function () {

  const BREAKPOINT = 768;          // px where desktop mode activates
  const COMPONENT_DIR = "components";
  const DATA_DIR = "data";
  const CACHE = new Map();         // keys are absolute URLs

  /* Helper: make absolute URL for consistent cache keys */
  function absUrl(path) {
    try { return new URL(path, location.href).href; }
    catch (e) { return path; }
  }

  /* Cached fetch that keys by absolute URL and returns text */
  async function cachedFetch(url) {
    const key = absUrl(url);
    if (CACHE.has(key)) return CACHE.get(key);
    const pending = fetch(key).then(async res => {
      if (!res.ok) throw new Error(`Fetch failed for ${key} (${res.status})`);
      return res.text();
    });
    CACHE.set(key, pending);
    return pending;
  }

  /* tryPaths: return { html, url } where url is the absolute path that worked */
  async function tryPaths(paths) {
    for (const p of paths) {
      const candidate = absUrl(p);
      try {
        const html = await cachedFetch(candidate);
        return { html, url: candidate };
      } catch (e) {
        // try next
      }
    }
    // nothing found
    console.warn("Include not found in paths:", paths);
    return { html: "", url: null };
  }

  /* executeScripts: inject inline scripts immediately; for external scripts
     create script elements with absolute URLs resolved against baseUrl; returns Promise
     that resolves when all external scripts have loaded/errored. */
  function executeScripts(container, baseUrl) {
    const scripts = Array.from(container.querySelectorAll("script"));
    if (scripts.length === 0) return Promise.resolve();

    const externalPromises = [];

    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.type) newScript.type = oldScript.type;

      if (oldScript.src) {
        // Resolve src relative to component file URL (baseUrl)
        const resolved = (baseUrl) ? new URL(oldScript.getAttribute("src"), baseUrl).href
                                   : absUrl(oldScript.getAttribute("src"));
        newScript.src = resolved;

        // Preserve async/defer if present on original script
        if (oldScript.hasAttribute("async")) newScript.async = true;
        if (oldScript.hasAttribute("defer")) newScript.defer = true;

        const p = new Promise((resolve) => {
          newScript.addEventListener("load", () => resolve({ src: resolved, ok: true }));
          newScript.addEventListener("error", () => resolve({ src: resolved, ok: false }));
        });
        externalPromises.push(p);
        document.body.appendChild(newScript);
      } else {
        // Inline script: copy text and append (executes immediately)
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      }

      // remove the old script node so it doesn't run twice
      oldScript.remove();
    });

    // Wait for all external scripts (if any) to settle
    return Promise.all(externalPromises).then(results => results);
  }


  /* loadIncludes: finds all [data-include], tries paths, injects html,
     executes scripts (resolving relative to fetched url), then calls initComponent */
  async function loadIncludes() {
    const targets = document.querySelectorAll("[data-include]");

    await Promise.all([...targets].map(async el => {
      const name = el.getAttribute("data-include");

      // lightweight placeholder
      el.innerHTML = `<div style="height:24px;opacity:.08;background:#ddd;border-radius:4px;"></div>`;

      // Try root-first then component locations (root-first patch applied)
      const paths = [
        `/${name}.html`,                    // root-level file (you moved header/footer here)
        `${COMPONENT_DIR}/${name}.html`,
        `../${COMPONENT_DIR}/${name}.html`,
        `/${COMPONENT_DIR}/${name}.html`,
      ];

      const { html, url } = await tryPaths(paths);
      el.innerHTML = html || "";

      // Execute scripts in the injected markup, resolving external src against the component URL
      await executeScripts(el, url);

      // If behavior registry exists, call the initComponent for this include
      try {
        if (window.__codesArcIn && typeof window.__codesArcIn.initComponent === "function") {
          // call by name (e.g., 'header') and pass the injected element as context
          window.__codesArcIn.initComponent(name, el);
        }
      } catch (err) {
        // defensive: log but don't break other includes
        console.warn("initComponent failed for", name, err);
      }
    }));
  }


  /* RESPONSIVE mode unchanged */
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

  // Listen / init
  window.addEventListener("resize", updateResponsiveMode);
  window.addEventListener("orientationchange", updateResponsiveMode);

  async function renderHomeTestimonials() {
    const container = document.getElementById("home-testimonials");
    if (!container) return;
    const count = parseInt(container.dataset.count || "3", 10);
    try {
      const txt = await cachedFetch(`${DATA_DIR}/testimonials.json`);
      const testimonials = JSON.parse(txt);
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
    } catch (err) {
      console.warn("Couldn't render testimonials:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    updateResponsiveMode();
    await loadIncludes();
    renderHomeTestimonials();
  });

})();

