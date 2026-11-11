(function () {
  "use strict";

  function initMenu() {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const closeBtn = document.getElementById("menu-close-btn");
    const overlay = document.getElementById("menu-overlay");

    if (!hamburgerBtn || !overlay) return;

    function setMenuOpen(isOpen) {
      overlay.classList.toggle("is-open", isOpen);
      overlay.setAttribute("aria-hidden", String(!isOpen));
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";

      if (isOpen && closeBtn) {
        closeBtn.focus();
      } else if (!isOpen) {
        hamburgerBtn.focus();
      }
    }

    hamburgerBtn.addEventListener("click", function () {
      const currentlyOpen = overlay.classList.contains("is-open");
      setMenuOpen(!currentlyOpen);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setMenuOpen(false);
      });
    }

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });
  }

  window.PortfolioMenu = {
    init: initMenu
  };
})();
