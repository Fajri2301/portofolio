(function () {
  "use strict";

  const STORAGE_KEY = "fajri_portfolio_theme";

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (_) {
      // Ignore storage access errors in private browsing contexts.
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);

    const toggleBtn = document.getElementById("mode-toggle-btn");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(nextTheme === "dark"));
    }

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (_) {
      // Ignore storage write errors.
    }
  }

  function initTheme() {
    applyTheme(getInitialTheme());

    const toggleBtn = document.getElementById("mode-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  }

  window.PortfolioTheme = {
    init: initTheme,
    applyTheme: applyTheme
  };
})();
