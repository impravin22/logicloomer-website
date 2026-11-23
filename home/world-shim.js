// vendor/world.js (jsvectormap 1.6.0, MIT) registers its data by calling
// jsVectorMap.addMap(). This stand-in keeps the data and nothing else, so the
// page needs the 100 KB of outlines without the 60 KB map library.
(function () {
  "use strict";
  window.jsVectorMap = Object.freeze({
    addMap: function (name, data) {
      if (name === "world") window.__WORLD = data;
    },
  });
})();
