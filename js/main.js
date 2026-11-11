(function () {
  "use strict";

  function boot() {
    if (window.PortfolioTheme && typeof window.PortfolioTheme.init === "function") {
      window.PortfolioTheme.init();
    }
    if (window.PortfolioMenu && typeof window.PortfolioMenu.init === "function") {
      window.PortfolioMenu.init();
    }
    if (window.PortfolioTags && typeof window.PortfolioTags.init === "function") {
      window.PortfolioTags.init();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
