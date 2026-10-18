// Runs in <head>, before the intro paints. Hides the intro words so journey.js
// can animate them in, and if the map never finishes starting (a script failed
// to load or threw), swaps in a readable fallback that links to the main site.
(function () {
  "use strict";
  const root = document.documentElement;
  root.classList.add("armed");
  window.addEventListener("load", function () {
    if (window.__journeyReady) return;
    root.classList.remove("armed");
    root.classList.add("failed");
  });
})();
