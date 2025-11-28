/**
 * scripts/behavior.js
 * Shared component behavior registry.
 *
 * - Idempotent: safe to run multiple times.
 * - Exposes init functions for components (initHeader currently).
 * - Automatically initializes known components when the script runs.
 *
 * This file is intentionally small and plain (no dependencies).
 */

(function () {
  // global registry to avoid re-init across multiple injections
  window.__codesArcIn = window.__codesArcIn || {};
  const root = window.__codesArcIn;

  // guard map of initialized components
  root.__initialized = root.__initialized || {};

  /****************************************************************
   * Header initializer
   * - toggles menu
   * - handles outside click and Escape to close
   * - sets ARIA attributes
   * - idempotent (checks root.__initialized.header)
   ****************************************************************/
  function initHeader(context = document) {
    if (root.__initialized.header) return;
    const header = context.querySelector('[data-component="header"]') || document.querySelector('[data-component="header"]');
    if (!header) return; // header not present in this context

    const toggle = header.querySelector('#menu-toggle');
    const menu = header.querySelector('#site-menu');
    const quickActions = header.querySelector('.nav-quick-actions');

    // If required elements missing, mark as initialized and bail
    if (!toggle || !menu) {
      root.__initialized.header = true;
      return;
    }

    // Helper: open / close
    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      menu.style.display = 'flex';
    };
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.style.display = ''; // defer to CSS for default
    };
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    // Ensure initial state based on viewport
    const mq = window.matchMedia('(max-width: 767px)');
    const applyInitialState = () => {
      if (mq.matches) {
        // mobile: hide menu by default (CSS should also do this)
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        menu.style.display = '';
      } else {
        // desktop: menu visible inline
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'false');
        menu.style.display = '';
      }
    };
    applyInitialState();
    // listen for breakpoint changes to update initial state
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', applyInitialState);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(applyInitialState);
    }

    // Click toggle
    const onToggleClick = (e) => {
      e.stopPropagation();
      if (isOpen()) closeMenu(); else openMenu();
    };
    toggle.addEventListener('click', onToggleClick);

    // Close on outside click
    const onDocClick = (e) => {
      if (!isOpen()) return;
      const t = e.target;
      if (!menu.contains(t) && !toggle.contains(t)) closeMenu();
    };
    document.addEventListener('click', onDocClick, { passive: true });

    // Close on Escape
    const onKeyDown = (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMenu();
        try { toggle.focus(); } catch (err) {}
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Prevent duplicate initialization
    root.__initialized.header = true;

    // Optional: expose cleanup to root if dynamic teardown is needed later
    root.__cleanupHeader = function cleanupHeader() {
      try { toggle.removeEventListener('click', onToggleClick); } catch (_) {}
      try { document.removeEventListener('click', onDocClick); } catch (_) {}
      try { document.removeEventListener('keydown', onKeyDown); } catch (_) {}
      root.__initialized.header = false;
      // remove any style overrides we set
      if (menu) menu.style.display = '';
    };
  } // end initHeader

  /****************************************************************
   * Register and auto-run initializers
   ****************************************************************/
  function runInitializers() {
    // Add any future initializers here
    initHeader(document);
    // e.g. initHero(), initGallery() later...
  }

  // Execute once when script loads
  runInitializers();

  // Expose API for manual init if needed (e.g., SPA re-inserted markup)
  root.initComponent = function (name, context) {
    if (name === 'header') initHeader(context || document);
    // add other names as added
  };

})();
