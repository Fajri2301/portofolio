(function () {
  "use strict";

  const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function initMenu() {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const closeBtn = document.getElementById("menu-close-btn");
    const overlay = document.getElementById("menu-overlay");

    if (!hamburgerBtn || !overlay) return;

    // Semua elemen body selain overlay dibuat inert saat menu terbuka, agar dialog benar-benar modal.
    const backgroundNodes = Array.prototype.filter.call(document.body.children, function (node) {
      return node !== overlay && node.tagName !== "SCRIPT";
    });

    function isOpen() {
      return overlay.classList.contains("is-open");
    }

    function setMenuOpen(open, options) {
      const restoreFocus = !options || options.restoreFocus !== false;

      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", String(!open));
      overlay.inert = !open;
      hamburgerBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      backgroundNodes.forEach(function (node) {
        node.inert = open;
      });

      if (open) {
        (closeBtn || overlay.querySelector(FOCUSABLE_SELECTOR)).focus();
      } else if (restoreFocus) {
        hamburgerBtn.focus();
      }
    }

    // Pindahkan fokus ke section tujuan agar pengguna keyboard melanjutkan dari sana, bukan dari header.
    function focusTarget(hash) {
      let target = null;
      try {
        target = document.querySelector(decodeURIComponent(hash));
      } catch (_) {
        return;
      }
      if (!target) return;
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    }

    overlay.inert = true;

    hamburgerBtn.addEventListener("click", function () {
      setMenuOpen(!isOpen());
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setMenuOpen(false);
      });
    }

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        const samePage = link.hash && link.pathname === window.location.pathname;
        setMenuOpen(false, { restoreFocus: !samePage });
        if (samePage) {
          // Tunggu navigasi anchor bawaan browser selesai dimulai, baru pindahkan fokus.
          window.setTimeout(function () {
            focusTarget(link.hash);
          }, 0);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      // Focus trap: Tab dan Shift+Tab berputar di dalam overlay.
      if (event.key === "Tab") {
        const focusables = overlay.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (!overlay.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  window.PortfolioMenu = {
    init: initMenu
  };
})();
