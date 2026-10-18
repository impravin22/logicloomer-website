// Runs in <head>, before the intro paints.
// 1. The map uses no URL fragments, so a fragment here is an old link to a
//    section of the previous home page (#work, #about, #contact and so on).
//    Those sections now live under ./in-short/, so the link is forwarded there.
//    The fragment is appended to a fixed relative path, so it cannot change the
//    origin, the scheme or the path.
// 2. Otherwise hides the intro words so journey.js can animate them in, and if
//    the map never finishes starting (a script failed to load or threw), swaps
//    in a readable fallback that links to the short version.
(function () {
  "use strict";
  const SHORT_VERSION = "./in-short/";
  if (window.location.hash) {
    window.location.replace(SHORT_VERSION + window.location.hash);
    return;
  }
  const root = document.documentElement;
  root.classList.add("armed");
  window.addEventListener("load", function () {
    if (window.__journeyReady) return;
    root.classList.remove("armed");
    root.classList.add("failed");
  });
})();
