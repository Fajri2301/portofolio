(function () {
  "use strict";

  // Harus sama dengan key di skrip inline <head> yang memasang tema sebelum halaman dirender.
  const STORAGE_KEY = "fajri_portfolio_theme";

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "dark" || saved === "light" ? saved : null;
    } catch (_) {
      return null;
    }
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);

    const toggleBtn = document.getElementById("mode-toggle-btn");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(nextTheme === "dark"));
    }
  }

  // Disimpan hanya saat pengguna memilih sendiri, agar tema yang mengikuti sistem tidak terkunci.
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // Abaikan jika storage diblokir (mode privat).
    }
  }

  function initTheme() {
    applyTheme(getSavedTheme() || getSystemTheme());

    const toggleBtn = document.getElementById("mode-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        saveTheme(next);
      });
    }

    // Ikuti perubahan tema OS selama pengguna belum memilih tema secara manual.
    if (window.matchMedia) {
      const query = window.matchMedia("(prefers-color-scheme: dark)");
      const onSystemChange = function (event) {
        if (!getSavedTheme()) {
          applyTheme(event.matches ? "dark" : "light");
        }
      };
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", onSystemChange);
      } else if (typeof query.addListener === "function") {
        query.addListener(onSystemChange);
      }
    }
  }

  window.PortfolioTheme = {
    init: initTheme,
    applyTheme: applyTheme
  };
})();
