(function () {
  "use strict";

  // Seluruh efek gerak (reveal, counter, 3D scroll, tilt, parallax) dikumpulkan di sini.
  // Jika pengguna memilih "reduce motion" atau browser terlalu lama, modul ini tidak aktif
  // dan semua konten tetap tampil statis karena state tersembunyi hanya berlaku di bawah .motion-ready.

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function initReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) {
      el.textContent = "0";
      observer.observe(el);
    });
  }

  // Pill skill "jatuh" bertumpuk dengan efek 3D saat section skills masuk layar.
  function initSkillsPile() {
    const pile = document.querySelector(".skills-pile");
    if (!pile) return;

    pile.querySelectorAll(".skill-pill").forEach(function (pill, index) {
      pill.style.setProperty("--i", String(index));
    });

    const observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      pile.classList.add("is-entering", "is-in");
      window.setTimeout(function () {
        pile.classList.remove("is-entering");
      }, 2200);
    }, { threshold: 0.25 });

    observer.observe(pile);
  }

  // Kartu miring mengikuti posisi kursor, dengan pantulan cahaya (glare).
  function initTilt(finePointer) {
    if (!finePointer) return;

    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      let frame = 0;

      el.addEventListener("pointermove", function (event) {
        const rect = el.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          el.classList.add("is-tilting");
          el.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
          el.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
          el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
        });
      });

      el.addEventListener("pointerleave", function () {
        cancelAnimationFrame(frame);
        el.classList.remove("is-tilting");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  // Parallax hero: posisi kursor diperhalus (lerp) lalu dikirim sebagai variabel CSS --mx / --my.
  function initHeroPointer(finePointer) {
    const hero = document.querySelector(".hero-section");
    if (!hero || !finePointer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = false;

    function loop() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      hero.style.setProperty("--mx", currentX.toFixed(3));
      hero.style.setProperty("--my", currentY.toFixed(3));

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    function kick() {
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    }

    hero.addEventListener("pointermove", function (event) {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      kick();
    });

    hero.addEventListener("pointerleave", function () {
      targetX = 0;
      targetY = 0;
      kick();
    });
  }

  // Satu loop scroll (dibatasi requestAnimationFrame) untuk progress bar, hero, cincin proses 3D, dan teks yang bergeser.
  function initScrollScene(wideQuery) {
    const bar = document.querySelector(".scroll-progress");
    const hero = document.querySelector(".hero-section");
    const process = document.querySelector(".process-section");
    const processCards = process ? process.querySelectorAll(".process-card") : [];
    const processCurrent = process ? process.querySelector("[data-process-current]") : null;
    const drifters = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-x]"));
    let activeIndex = -1;
    let ticking = false;

    function syncProcessMode() {
      if (!process) return;
      process.classList.toggle("is-3d", wideQuery.matches);
      activeIndex = -1;
    }

    function update() {
      ticking = false;
      const vh = window.innerHeight;
      const y = window.scrollY;

      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ")";
      }

      if (hero) {
        const heroHeight = hero.offsetHeight || 1;
        if (y < heroHeight + vh) {
          hero.style.setProperty("--hp", clamp(y / heroHeight, 0, 1).toFixed(4));
        }
      }

      if (process && process.classList.contains("is-3d") && processCards.length) {
        const rect = process.getBoundingClientRect();
        const span = rect.height - vh;
        const progress = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
        process.style.setProperty("--pp", progress.toFixed(4));

        const index = Math.round(progress * (processCards.length - 1));
        if (index !== activeIndex) {
          activeIndex = index;
          processCards.forEach(function (card, i) {
            card.classList.toggle("is-active", i === index);
          });
          if (processCurrent) {
            processCurrent.textContent = String(index + 1).padStart(2, "0");
          }
        }
      }

      drifters.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const t = (rect.top + rect.height / 2 - vh / 2) / vh;
        const amount = parseFloat(el.getAttribute("data-scroll-x")) || 40;
        el.style.translate = (t * amount).toFixed(1) + "px 0";
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    syncProcessMode();
    if (typeof wideQuery.addEventListener === "function") {
      wideQuery.addEventListener("change", function () {
        syncProcessMode();
        requestUpdate();
      });
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  function initMotion() {
    if (!window.matchMedia || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("motion-ready");

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    initReveal();
    initCounters();
    initSkillsPile();
    initTilt(finePointer);
    initHeroPointer(finePointer);
    initScrollScene(window.matchMedia("(min-width: 900px)"));
  }

  window.PortfolioMotion = {
    init: initMotion
  };
})();
