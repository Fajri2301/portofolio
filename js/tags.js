(function () {
  "use strict";

  // Angles and vertical offsets create the stacked pile look shown in the reference design.
  const PRESET_TRANSFORMS = [
    { angle: "-12deg", y: "6px" },
    { angle: "-3deg", y: "-8px" },
    { angle: "-14deg", y: "-14px" },
    { angle: "-8deg", y: "10px" },
    { angle: "16deg", y: "8px" },
    { angle: "2deg", y: "4px" },
    { angle: "18deg", y: "-4px" },
    { angle: "0deg", y: "10px" },
    { angle: "-6deg", y: "12px" },
    { angle: "9deg", y: "6px" }
  ];

  function initTags() {
    const pills = document.querySelectorAll(".skill-pill");
    if (!pills.length) return;

    const reducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    pills.forEach(function (pill, index) {
      const preset = PRESET_TRANSFORMS[index % PRESET_TRANSFORMS.length];
      pill.style.setProperty("--tag-angle", preset.angle);
      pill.style.setProperty("--tag-shift-y", preset.y);

      if (!reducedMotion) {
        pill.addEventListener("click", function () {
          pill.classList.remove("is-wiggling");
          void pill.offsetWidth;
          pill.classList.add("is-wiggling");
        });

        pill.addEventListener("animationend", function () {
          pill.classList.remove("is-wiggling");
        });
      }
    });
  }

  window.PortfolioTags = {
    init: initTags
  };
})();
