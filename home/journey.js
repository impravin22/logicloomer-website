// The map page engine: draws the world, the route, the walker and the stops on
// a canvas, and drives the HUD, the side card and the intro. Pure maths and DOM
// builders live in journey-core.js; the content lives in journey-data.js.
(function () {
  "use strict";

  // If a dependency is missing (or anything below throws), __journeyReady is
  // never set and boot.js shows the fallback once the window loads.
  const Core = window.JourneyCore;
  const Data = window.JourneyData;
  if (!Core || !Data) return;

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      this.moveTo(x + rr, y); this.lineTo(x + w - rr, y); this.quadraticCurveTo(x + w, y, x + w, y + rr);
      this.lineTo(x + w, y + h - rr); this.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      this.lineTo(x + rr, y + h); this.quadraticCurveTo(x, y + h, x, y + h - rr);
      this.lineTo(x, y + rr); this.quadraticCurveTo(x, y, x + rr, y); this.closePath();
    };
  }

  const $ = (id) => document.getElementById(id);
  const MOTION_KEY = "journey-motion";
  const NARROW_PX = 860;
  const CARD_OPEN_DELAY_MS = 700;
  const CARD_HIDE_MS = 400; // matches the card's opacity transition
  const CONFETTI_DELAY_MS = 350;
  const COPY_RESET_MS = 1600;
  const HURRY_FACTOR = 4;
  const INSTANT_PX_S = 6000; // travel speed with motion off: there in a blink
  const DRAG_THRESHOLD_PX = 4;
  const MIN_ZOOM = 0.4, MAX_ZOOM = 3;
  const WHEEL_ZOOM_RATE = 0.0015; // zoom factor per wheel pixel, as exp(-dy * rate)
  const WHEEL_LINE_PX = 16; // a line-mode wheel step, in pixels
  const FRAME_RATE_REFERENCE = 60; // easing constants below are tuned per 60 Hz frame
  const MAX_FRAME_S = 0.05;
  const HERO_LIFT_PX = 20; // the walker is drawn above its anchor, so aim a little low
  const HERO_HEIGHT_PX = 60;
  const MAPF = '"MedievalSharp", "Palatino Linotype", Georgia, serif';
  const INK = "#1B1612", STEEL = "#A9B1BB", STEEL2 = "#7D8792", SKIN = "#F1C9A5";
  const COPPER = "#4E8C6A", SILVER = "#B9BEC4", STONE = "#C9AE78";

  /* ------------------------------------------------------------------ */
  /* World geometry: Miller projection, 900 x 440.7 base, scaled by K    */
  /* ------------------------------------------------------------------ */
  const WORLD = window.__WORLD || null;
  const INSET = WORLD && WORLD.insets && WORLD.insets[0] ? WORLD.insets[0] : Core.DEFAULT_INSET;
  const K = 4, WW = INSET.width * K, WH = INSET.height * K;
  const project = Core.makeProjection(INSET, K);

  const TINTS = ["#E7D6A8", "#DCC7A3", "#D7C3AE", "#CFCFA6", "#E2CDA6", "#D9BFA0", "#E4D3B4"];
  const COUNTRIES = [];
  if (WORLD && WORLD.paths) {
    Object.keys(WORLD.paths).forEach((code, idx) => {
      const p = WORLD.paths[code];
      if (!p || typeof p.path !== "string") return;
      const info = Core.analysePath(p.path);
      let h = 0;
      for (let k = 0; k < code.length; k++) h = (h * 31 + code.charCodeAt(k)) | 0;
      COUNTRIES.push({
        code, name: String(p.name || code), path: new Path2D(p.path), area: info.area, cx: info.cx, cy: info.cy,
        tint: TINTS[Math.abs(h + idx) % TINTS.length],
        size: Math.max(2.4, Math.min(9, 1.6 + Math.sqrt(info.area) * 0.16)),
      });
    });
  }
  if (!COUNTRIES.length) $("hintCountry").hidden = true;
  const hit = document.createElement("canvas").getContext("2d");
  function countryAt(wx, wy) {
    const mx = wx / K, my = wy / K;
    hit.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = COUNTRIES.length - 1; i >= 0; i--) if (hit.isPointInPath(COUNTRIES[i].path, mx, my)) return COUNTRIES[i];
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* The journey and its route                                           */
  /* ------------------------------------------------------------------ */
  const at = (w) => Object.assign({}, w, project(w.lat, w.lng));
  const WAY = [at(Data.start)].concat(Data.stops.map(at));
  const STOP_COUNT = Data.stops.length;
  const route = Core.buildRoute(WAY, Core.ROUTE_SAMPLES_PER_LEG);
  // Land or sea per route sample (about 640 hit tests, a few milliseconds),
  // then where the walker sails: only the long stretches of open sea.
  const land = route.map((s) => !COUNTRIES.length || !!countryAt(s.x, s.y));
  const sail = Core.seaways(route, land);
  const stopD = Core.stopDistances(route, WAY);
  const posAt = (d) => {
    const p = Core.positionAt(route, d);
    return { x: p.x, y: p.y, dx: p.dx, sailing: sail[p.nearest] };
  };

  /* ------------------------------------------------------------------ */
  /* Motion preference                                                   */
  /* ------------------------------------------------------------------ */
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionOn = !mq.matches;
  try {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved === "off") motionOn = false;
    if (saved === "on") motionOn = true;
  } catch (error) { /* storage unavailable: keep the system preference */ }
  const motionBtn = $("motionBtn");
  function paintMotion() {
    motionBtn.textContent = "Motion: " + (motionOn ? "on" : "off");
    document.documentElement.classList.toggle("no-motion", !motionOn);
  }
  paintMotion();
  motionBtn.addEventListener("click", () => {
    motionOn = !motionOn;
    try { localStorage.setItem(MOTION_KEY, motionOn ? "on" : "off"); } catch (error) { /* session-only */ }
    paintMotion();
  });

  /* ------------------------------------------------------------------ */
  /* Static sea layer                                                    */
  /* ------------------------------------------------------------------ */
  const bg = document.createElement("canvas");
  bg.width = Math.round(WW); bg.height = Math.round(WH);
  function drawSea(c) {
    c.fillStyle = "#2B6777"; c.fillRect(0, 0, WW, WH);
    const sg = c.createRadialGradient(WW / 2, WH / 2, 300, WW / 2, WH / 2, WW * 0.68);
    sg.addColorStop(0, "rgba(255,255,255,.07)"); sg.addColorStop(1, "rgba(8,30,38,.45)");
    c.fillStyle = sg; c.fillRect(0, 0, WW, WH);
    c.strokeStyle = "rgba(225,240,240,.14)"; c.lineWidth = 1.2;
    for (let row = 0, y = 14; y < WH; row++, y += 26) {
      const off = row % 2 ? 12 : 0; c.beginPath();
      for (let x = off; x < WW + 24; x += 24) { c.moveTo(x - 12, y); c.arc(x, y, 12, Math.PI, 0, false); }
      c.stroke();
    }
    [project(-32, -148), project(22, -36), project(-30, 86)].forEach((r) => {
      for (let i = 0; i < 32; i++) {
        const a = (i * Math.PI) / 16;
        c.strokeStyle = i % 4 === 0 ? "rgba(170,50,50,.26)" : i % 2 ? "rgba(15,35,45,.14)" : "rgba(140,190,140,.18)";
        c.lineWidth = i % 4 === 0 ? 1.4 : 1;
        c.beginPath(); c.moveTo(r.x, r.y); c.lineTo(r.x + Math.cos(a) * 5000, r.y + Math.sin(a) * 5000); c.stroke();
      }
    });
    c.fillStyle = "rgba(235,245,240,.72)"; c.textAlign = "center";
    Data.oceans.forEach(([name, lat, lng]) => {
      const p = project(lat, lng);
      c.font = (name.indexOf("Hic") === 0 ? "22px " : "30px ") + MAPF;
      c.fillText(name, p.x, p.y);
    });
  }
  function drawSerpentAndShip(c) {
    const sp = project(-41, 140);
    c.save(); c.translate(sp.x, sp.y);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(i * 64 - 64, 0, 30, Math.PI, 0); c.lineWidth = 11; c.strokeStyle = "#3F6B3A"; c.stroke(); c.lineWidth = 3; c.strokeStyle = "#1F3A1C"; c.stroke(); }
    c.fillStyle = "#3F6B3A"; c.strokeStyle = "#1F3A1C"; c.lineWidth = 3; c.beginPath(); c.ellipse(126, -13, 22, 13, -0.4, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = "#D9A441"; c.beginPath(); c.arc(132, -17, 3.5, 0, Math.PI * 2); c.fill();
    c.restore();
    const sh = project(30, -42);
    c.save(); c.translate(sh.x, sh.y); c.fillStyle = "#5A3A1C"; c.strokeStyle = INK; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-44, 0); c.quadraticCurveTo(0, 28, 44, 0); c.lineTo(38, -11); c.lineTo(-38, -11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(0, -11); c.lineTo(0, -68); c.stroke();
    c.fillStyle = "#F3E8CC"; c.beginPath(); c.moveTo(2, -64); c.lineTo(38, -24); c.lineTo(2, -18); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#7A1F1F"; c.beginPath(); c.moveTo(0, -68); c.lineTo(18, -61); c.lineTo(0, -54); c.closePath(); c.fill();
    c.restore();
  }
  function drawCompassAndBanner(c) {
    const cr = project(-32, -148);
    c.save(); c.translate(cr.x, cr.y);
    c.fillStyle = "rgba(243,232,204,.92)"; c.beginPath(); c.arc(0, 0, 84, 0, Math.PI * 2); c.fill(); c.strokeStyle = "#5A3A1C"; c.lineWidth = 3; c.stroke();
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8 - Math.PI / 2, len = i % 4 === 0 ? 78 : i % 2 === 0 ? 56 : 36;
      c.beginPath(); c.moveTo(Math.cos(a) * len, Math.sin(a) * len); c.lineTo(Math.cos(a + 0.35) * 11, Math.sin(a + 0.35) * 11); c.lineTo(Math.cos(a - 0.35) * 11, Math.sin(a - 0.35) * 11); c.closePath();
      c.fillStyle = i % 4 === 0 ? "#7A1F1F" : i % 2 === 0 ? INK : "#D9A441"; c.fill(); c.strokeStyle = INK; c.lineWidth = 1; c.stroke();
    }
    c.fillStyle = "#D9A441"; c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = INK; c.font = "700 26px " + MAPF; c.textAlign = "center"; c.fillText("N", 0, -96); c.fillText("S", 0, 116); c.fillText("E", 108, 10); c.fillText("W", -108, 10);
    c.restore();
    c.save(); c.translate(WW - 400, WH - 118); c.fillStyle = "#F3E8CC"; c.strokeStyle = "#5A3A1C"; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-320, -52); c.lineTo(320, -52); c.lineTo(290, 0); c.lineTo(320, 52); c.lineTo(-320, 52); c.lineTo(-290, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#7A1F1F"; c.textAlign = "center"; c.font = "700 32px " + MAPF; c.fillText("The Known Football World", 0, -8);
    c.fillStyle = "#3B2A14"; c.font = "20px " + MAPF; c.fillText("Anno 2018 to 2026 · drawn by Logicloomer · Miller projection", 0, 28);
    c.restore();
  }
  function drawFrame(c) {
    c.save();
    c.strokeStyle = "#5A1F1A"; c.lineWidth = 24; c.strokeRect(12, 12, WW - 24, WH - 24);
    c.strokeStyle = "#D9A441"; c.lineWidth = 2; c.strokeRect(4, 4, WW - 8, WH - 8); c.strokeRect(26, 26, WW - 52, WH - 52);
    c.fillStyle = "#D9A441";
    const diamond = (x, y) => { c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + 6, y); c.lineTo(x, y + 6); c.lineTo(x - 6, y); c.closePath(); c.fill(); };
    for (let x = 64; x < WW - 40; x += 52) { diamond(x, 12); diamond(x, WH - 12); }
    for (let y = 64; y < WH - 40; y += 52) { diamond(12, y); diamond(WW - 12, y); }
    [[12, 12], [WW - 12, 12], [12, WH - 12], [WW - 12, WH - 12]].forEach((p) => {
      c.fillStyle = "#7A1F1F"; c.beginPath(); c.arc(p[0], p[1], 24, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "#D9A441"; c.lineWidth = 3; c.stroke();
      c.beginPath(); c.moveTo(p[0] - 11, p[1]); c.lineTo(p[0] + 11, p[1]); c.moveTo(p[0], p[1] - 11); c.lineTo(p[0], p[1] + 11); c.stroke();
    });
    c.restore();
  }
  function drawBg() {
    const c = bg.getContext("2d");
    drawSea(c); drawSerpentAndShip(c); drawCompassAndBanner(c); drawFrame(c);
  }
  drawBg();
  // The sea layer bakes its lettering, so repaint once the map face arrives.
  if (document.fonts && document.fonts.load) {
    document.fonts.load('30px "MedievalSharp"').then(drawBg, () => { /* keep the fallback face */ });
  }

  /* ------------------------------------------------------------------ */
  /* FX layer                                                            */
  /* ------------------------------------------------------------------ */
  const fx = $("fx"), fxc = fx.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  function sizeFx() {
    DPR = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight;
    fx.width = Math.floor(W * DPR); fx.height = Math.floor(H * DPR); fxc.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  let lines = [], lineAlpha = 0, particles = [], fxRunning = false;
  function impact(strength, cx, cy) {
    if (!motionOn) return;
    const ox = cx == null ? W / 2 : cx, oy = cy == null ? H / 2 : cy, R = Math.hypot(W, H);
    lines = [];
    for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2; lines.push({ a, r0: R * (0.15 + Math.random() * 0.25), r1: R, w: 1 + Math.random() * 2.5, ox, oy }); }
    lineAlpha = Math.min(1, strength); runFx();
  }
  function confetti(cx, cy) {
    if (!motionOn) return;
    const colors = ["#D9A441", "#F3E8CC", "#132257", "#3C8C4A", "#7A1F1F"];
    for (let i = 0; i < 140; i++) {
      const a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 11;
      particles.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, life: 1, decay: 0.012 + Math.random() * 0.012, s: 4 + Math.random() * 6, c: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 });
    }
    runFx();
  }
  function runFx() { if (!fxRunning) { fxRunning = true; requestAnimationFrame(tickFx); } }
  function tickFx() {
    fxc.clearRect(0, 0, W, H); let busy = false;
    if (lineAlpha > 0.01) {
      busy = true; fxc.save(); fxc.globalAlpha = lineAlpha * 0.8; fxc.strokeStyle = "#F3E8CC"; fxc.lineCap = "round";
      for (const l of lines) { fxc.lineWidth = l.w; fxc.beginPath(); fxc.moveTo(l.ox + Math.cos(l.a) * l.r0, l.oy + Math.sin(l.a) * l.r0); fxc.lineTo(l.ox + Math.cos(l.a) * l.r1, l.oy + Math.sin(l.a) * l.r1); fxc.stroke(); }
      fxc.restore(); lineAlpha *= 0.86;
    }
    if (particles.length) {
      busy = true;
      particles = particles
        .map((p) => {
          const vy = p.vy + 0.35;
          return Object.assign({}, p, { vy, x: p.x + p.vx, y: p.y + vy, vx: p.vx * 0.985, life: p.life - p.decay, rot: p.rot + p.vr });
        })
        .filter((p) => p.life > 0 && p.y < H + 40);
      for (const p of particles) {
        fxc.save(); fxc.globalAlpha = Math.max(0, p.life); fxc.translate(p.x, p.y); fxc.rotate(p.rot); fxc.fillStyle = p.c; fxc.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); fxc.restore();
      }
    }
    if (busy) requestAnimationFrame(tickFx); else { fxRunning = false; fxc.clearRect(0, 0, W, H); }
  }

  /* ------------------------------------------------------------------ */
  /* Map canvas, camera, state                                           */
  /* ------------------------------------------------------------------ */
  const canvas = $("map"), ctx = canvas.getContext("2d");
  let VW = 0, VH = 0;
  function sizeMap() { VW = canvas.clientWidth; VH = canvas.clientHeight; canvas.width = Math.floor(VW * DPR); canvas.height = Math.floor(VH * DPR); }
  function resizeAll() { sizeFx(); sizeMap(); }
  resizeAll(); window.addEventListener("resize", resizeAll);

  const cam = { x: WAY[0].x, y: WAY[0].y, z: 1, tz: 1 };
  let follow = true;
  let userZoom = null; // set by the wheel; cleared when the walker sets off or on double-click
  const state = { d: 0, target: 0, walking: false, dir: -1, at: 0, pending: 0, visited: new Set([0]), stadium: {}, t: 0, speedMul: 1, tripSpeed: 0 };
  const isNarrow = () => VW < NARROW_PX;
  const baseZoom = () => Math.max(0.55, Math.min(1.0, VW / 1400));
  let cardOpen = false, hover = null;

  /* ------------------------------------------------------------------ */
  /* Drawing: stadium, landmarks, hero, boat                              */
  /* ------------------------------------------------------------------ */
  function drawStadium(c, x, y, s, lit) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = "rgba(0,0,0,.18)"; c.beginPath(); c.ellipse(4, 8, 52, 20, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#9A8A6A"; c.beginPath(); c.ellipse(0, 4, 50, 22, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#C9B98F"; c.beginPath(); c.ellipse(0, -2, 50, 22, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = INK; c.lineWidth = 2.2; c.stroke();
    c.fillStyle = "#A99A75"; c.beginPath(); c.ellipse(0, -2, 38, 15, 0, 0, Math.PI * 2); c.fill(); c.lineWidth = 1.4; c.stroke();
    c.fillStyle = "#3C8C4A"; c.beginPath(); c.ellipse(0, -2, 26, 9, 0, 0, Math.PI * 2); c.fill(); c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = "#F3E8CC"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -11); c.lineTo(0, 7); c.stroke(); c.beginPath(); c.ellipse(0, -2, 5, 2.4, 0, 0, Math.PI * 2); c.stroke();
    [[-44, -18], [44, -18], [-44, 10], [44, 10]].forEach((m) => {
      c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(m[0], m[1]); c.lineTo(m[0], m[1] - 30); c.stroke();
      if (lit) { const g = c.createRadialGradient(m[0], m[1] - 32, 1, m[0], m[1] - 32, 16); g.addColorStop(0, "rgba(242,198,109,.9)"); g.addColorStop(1, "rgba(242,198,109,0)"); c.fillStyle = g; c.beginPath(); c.arc(m[0], m[1] - 32, 16, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = lit ? "#D9A441" : "#6B4F2A"; c.fillRect(m[0] - 6, m[1] - 36, 12, 6);
    });
    c.restore();
  }
  // Each landmark is drawn with its base on the ground line, in the same woodcut style.
  function drawLandmark(c, id, fill, t) {
    c.strokeStyle = INK; c.lineWidth = 2; c.lineJoin = "round"; c.fillStyle = fill;
    const box = (x, y, w, h, f) => { c.fillStyle = f || fill; c.beginPath(); c.rect(x, y, w, h); c.fill(); c.stroke(); };
    const tri = (x1, y1, x2, y2, x3, y3, f) => { c.fillStyle = f || fill; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineTo(x3, y3); c.closePath(); c.fill(); c.stroke(); };
    const dome = (x, y, r, f) => { c.fillStyle = f || fill; c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); c.fill(); c.stroke(); };
    const onion = (x, y, s, f) => { c.fillStyle = f || fill; c.beginPath(); c.moveTo(x - s, y); c.quadraticCurveTo(x - s * 1.3, y - s * 1.4, x, y - s * 2.3); c.quadraticCurveTo(x + s * 1.3, y - s * 1.4, x + s, y); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x, y - s * 2.3); c.lineTo(x, y - s * 3); c.stroke(); };
    switch (id) {
      case "taipei":
        box(-16, -14, 32, 14);
        for (let k = 0; k < 8; k++) { const y0 = -14 - k * 8; c.fillStyle = fill; c.beginPath(); c.moveTo(-7, y0); c.lineTo(7, y0); c.lineTo(9.5, y0 - 8); c.lineTo(-9.5, y0 - 8); c.closePath(); c.fill(); c.stroke(); }
        box(-5, -86, 10, 8); c.beginPath(); c.moveTo(0, -86); c.lineTo(0, -106); c.stroke();
        break;
      case "amsterdam":
        c.fillStyle = fill; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.lineTo(8, -32); c.lineTo(-8, -32); c.closePath(); c.fill(); c.stroke();
        dome(0, -32, 9, "#7A1F1F"); box(-3, -14, 6, 14, INK);
        c.save(); c.translate(0, -34); c.rotate(motionOn ? t * 0.6 : 0.4);
        for (let k = 0; k < 4; k++) { c.save(); c.rotate((k * Math.PI) / 2); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -30); c.lineWidth = 2.5; c.stroke(); c.fillStyle = "rgba(243,232,204,.9)"; c.beginPath(); c.rect(1, -30, 7, 22); c.fill(); c.lineWidth = 1.2; c.stroke(); c.restore(); }
        c.restore(); c.lineWidth = 2;
        break;
      case "rio":
        tri(-34, 0, 0, -36, 34, 0, STONE); box(-5, -40, 10, 4, fill);
        c.lineWidth = 3; c.beginPath(); c.moveTo(0, -40); c.lineTo(0, -56); c.moveTo(-13, -51); c.lineTo(13, -51); c.stroke(); c.lineWidth = 2;
        c.fillStyle = fill; c.beginPath(); c.arc(0, -59, 3.5, 0, Math.PI * 2); c.fill(); c.stroke();
        break;
      case "lusail":
        c.fillStyle = "#D9A441"; c.beginPath(); c.moveTo(-32, 0); c.quadraticCurveTo(-38, -28, -28, -42); c.lineTo(28, -42); c.quadraticCurveTo(38, -28, 32, 0); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = "rgba(27,22,18,.55)"; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-31 + k, -k * 10); c.quadraticCurveTo(0, -k * 10 - 6, 31 - k, -k * 10); c.stroke(); }
        c.strokeStyle = INK; c.fillStyle = "#D9A441"; for (let x = -24; x <= 24; x += 12) { c.beginPath(); c.arc(x, -42, 6, Math.PI, 0); c.fill(); c.stroke(); }
        break;
      case "istanbul":
        box(-26, -18, 52, 18); dome(-20, -18, 9, "#8A5A2B"); dome(20, -18, 9, "#8A5A2B"); box(-16, -22, 32, 4); dome(0, -22, 16, "#8A5A2B");
        [-36, 36].forEach((x) => { box(x - 2.5, -52, 5, 52); tri(x - 4, -52, x, -62, x + 4, -52, "#8A5A2B"); });
        [-30, 30].forEach((x) => { box(x - 2.5, -40, 5, 40); tri(x - 4, -40, x, -50, x + 4, -40, "#8A5A2B"); });
        break;
      case "bilbao":
        box(-32, -10, 64, 10);
        c.fillStyle = SILVER;
        [[-14, -24, 20, 12, -0.6], [8, -22, 18, 11, 0.5], [-2, -34, 16, 9, 0.2], [20, -16, 12, 8, 0.9]].forEach((e) => { c.beginPath(); c.ellipse(e[0], e[1], e[2], e[3], e[4], 0, Math.PI * 2); c.fill(); c.stroke(); });
        box(22, -44, 8, 34, SILVER);
        break;
      case "munich":
        box(-14, -24, 28, 24); tri(-16, -24, 0, -42, 16, -24, "#8A5A2B");
        box(-32, -50, 13, 50); box(19, -50, 13, 50); onion(-25.5, -50, 6, COPPER); onion(25.5, -50, 6, COPPER);
        break;
      case "newjersey":
        box(-14, -14, 28, 14, STONE); box(-10, -24, 20, 10, STONE);
        c.fillStyle = COPPER; c.beginPath(); c.moveTo(-10, -24); c.lineTo(10, -24); c.lineTo(6, -52); c.lineTo(-6, -52); c.closePath(); c.fill(); c.stroke();
        box(-12, -46, 5, 9, COPPER);
        c.lineWidth = 3.5; c.strokeStyle = COPPER; c.beginPath(); c.moveTo(5, -48); c.lineTo(14, -70); c.stroke(); c.strokeStyle = INK; c.lineWidth = 2;
        c.fillStyle = COPPER; c.beginPath(); c.arc(0, -57, 4.5, 0, Math.PI * 2); c.fill(); c.stroke();
        for (let k = -2; k <= 2; k++) { const a = -Math.PI / 2 + k * 0.45; c.beginPath(); c.moveTo(Math.cos(a) * 4.5, -57 + Math.sin(a) * 4.5); c.lineTo(Math.cos(a) * 10, -57 + Math.sin(a) * 10); c.stroke(); }
        c.fillStyle = "#D9A441"; c.beginPath(); c.arc(15, -73, 4, 0, Math.PI * 2); c.fill(); c.stroke();
        break;
      case "london":
        box(-14, -6, 28, 6); box(-8, -60, 16, 54);
        c.fillStyle = "#F3E8CC"; c.beginPath(); c.arc(0, -46, 6.5, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(0, -46); c.lineTo(0, -51); c.moveTo(0, -46); c.lineTo(4, -44); c.stroke();
        tri(-8, -60, 0, -84, 8, -60, COPPER); c.beginPath(); c.moveTo(0, -84); c.lineTo(0, -92); c.stroke();
        break;
      default:
        box(-10, -24, 20, 24);
    }
  }
  function drawBall(c, x, y, r, t) {
    c.fillStyle = "#F3E8CC"; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(x, y, r * 0.34, 0, Math.PI * 2); c.fill();
    for (let i = 0; i < 5; i++) { const a = (i * Math.PI * 2) / 5 + t * 4; c.beginPath(); c.arc(x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68, r * 0.17, 0, Math.PI * 2); c.fill(); }
  }
  // The walker, drawn facing +x with the hips at the origin.
  function drawKnight(c, t, sw, wind) {
    c.lineCap = "round"; c.lineJoin = "round";
    c.fillStyle = "#7A1F1F"; c.strokeStyle = INK; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-6, -24); c.quadraticCurveTo(-16 - wind, -12 + Math.sin(t * 7) * 2, -20 - wind * 1.4, 6 + Math.sin(t * 7 + 1) * 3); c.lineTo(-4, 2); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = "#8A5A2B"; c.lineWidth = 5;
    c.beginPath(); c.moveTo(-2, -2); c.lineTo(-3 - sw * 9, 14); c.moveTo(2, -2); c.lineTo(3 + sw * 9, 14); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.ellipse(-3 - sw * 9, 15, 5, 3, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(4 + sw * 9, 15, 5, 3, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = STEEL2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-5 - sw * 5, 7); c.lineTo(-1 - sw * 5, 7); c.moveTo(1 + sw * 5, 7); c.lineTo(5 + sw * 5, 7); c.stroke();
    c.fillStyle = "#8A5A2B"; c.strokeStyle = INK; c.lineWidth = 1.5;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.rect(k * 4 - 2, -6, 4, 9); c.fill(); c.stroke(); }
    c.fillStyle = STEEL; c.lineWidth = 2; c.beginPath(); c.roundRect(-8, -26, 16, 22, 4); c.fill(); c.stroke();
    c.strokeStyle = STEEL2; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-5, -18); c.quadraticCurveTo(0, -14, 5, -18); c.moveTo(-5, -12); c.quadraticCurveTo(0, -8, 5, -12); c.stroke();
    c.fillStyle = "#D9A441"; c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-8, -8, 16, 3, 1); c.fill(); c.stroke();
    c.fillStyle = STEEL; c.lineWidth = 2; c.beginPath(); c.ellipse(-7, -26, 5, 3.5, 0, Math.PI, 0); c.fill(); c.stroke(); c.beginPath(); c.ellipse(7, -26, 5, 3.5, 0, Math.PI, 0); c.fill(); c.stroke();
    c.strokeStyle = STEEL; c.lineWidth = 5; c.beginPath(); c.moveTo(-6, -22); c.lineTo(-13, -34); c.stroke();
    c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = "#D9A441"; c.beginPath(); c.rect(-17, -36, 8, 3); c.fill(); c.stroke();
    c.fillStyle = "#E6EAEE"; c.beginPath(); c.moveTo(-15.5, -36); c.lineTo(-10.5, -36); c.lineTo(-13, -58); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#5A3A1C"; c.beginPath(); c.rect(-14.5, -33, 3, 6); c.fill(); c.stroke();
    c.strokeStyle = STEEL; c.lineWidth = 5; c.beginPath(); c.moveTo(6, -22); c.lineTo(14, -12); c.stroke();
    drawBall(c, 17, -10, 7, t);
    c.fillStyle = SKIN; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.arc(0, -35, 8, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = STEEL; c.beginPath(); c.arc(0, -36, 9.5, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.rect(-9.5, -36, 4, 8); c.fill(); c.stroke(); c.beginPath(); c.rect(5.5, -36, 4, 8); c.fill(); c.stroke();
    c.fillStyle = "#7A1F1F"; c.beginPath(); c.moveTo(-9, -44); c.quadraticCurveTo(0, -60, 9, -44); c.quadraticCurveTo(0, -49, -9, -44); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(3, -34, 1.4, 0, Math.PI * 2); c.fill();
  }
  function drawWalker(c, t, dir, moving) {
    const ph = t * 10, bob = moving ? Math.abs(Math.sin(ph)) * 3 : Math.sin(t * 2) * 0.8;
    const sw = moving ? Math.sin(ph) : 0;
    c.save();
    c.fillStyle = "rgba(0,0,0,.22)"; c.beginPath(); c.ellipse(0, 2, 18, 5, 0, 0, Math.PI * 2); c.fill();
    c.translate(0, -16 - bob); c.scale(dir, 1);
    drawKnight(c, t, sw, moving ? 6 : 0);
    c.restore();
  }
  function drawBoat(c, t, dir) {
    const rock = Math.sin(t * 3) * 0.06, bob = Math.sin(t * 3) * 2;
    c.save(); c.translate(0, bob); c.rotate(rock); c.scale(dir, 1);
    c.fillStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.ellipse(0, 8, 40, 6, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#5A3A1C"; c.strokeStyle = INK; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-40, -6); c.quadraticCurveTo(0, 22, 40, -6); c.lineTo(34, -14); c.lineTo(-34, -14); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = "#D9A441"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-32, -9); c.quadraticCurveTo(0, 10, 32, -9); c.stroke();
    c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(12, -14); c.lineTo(12, -70); c.stroke();
    c.fillStyle = "#F3E8CC"; c.beginPath(); c.moveTo(14, -66); c.lineTo(44 + Math.sin(t * 4) * 2, -30); c.lineTo(14, -20); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#132257"; c.beginPath(); c.moveTo(12, -70); c.lineTo(28, -64); c.lineTo(12, -58); c.closePath(); c.fill();
    c.save(); c.translate(-12, -30); drawKnight(c, t, 0, 5); c.restore();
    c.restore();
  }

  /* ------------------------------------------------------------------ */
  /* Frame                                                               */
  /* ------------------------------------------------------------------ */
  function stepWalk(hero, dt) {
    const speed = (motionOn ? state.tripSpeed : INSTANT_PX_S) * state.speedMul;
    const sign = Math.sign(state.target - state.d) || 1;
    state.d += sign * speed * dt;
    if (Math.abs(hero.dx) > 0.2) state.dir = sign * Math.sign(hero.dx) || state.dir;
    if ((sign > 0 && state.d >= state.target) || (sign < 0 && state.d <= state.target)) { state.d = state.target; arrive(); }
  }
  // Screen point to hold the walker's feet at: the middle of whatever the open
  // card and the HUD plate leave uncovered, whichever edge the card docks to
  // (right on wide or landscape screens, bottom on phones held upright).
  const plateEl = $("plate");
  function heroScreenTarget() {
    const resting = { x: VW / 2, y: VH / 2 + HERO_LIFT_PX };
    if (!cardOpen) return resting;
    const c = card.getBoundingClientRect();
    if (c.left > VW * 0.3) return { x: c.left / 2, y: resting.y };
    const top = plateEl.getBoundingClientRect().bottom;
    return { x: resting.x, y: Math.min(c.top - HERO_LIFT_PX, (top + c.top) / 2 + HERO_HEIGHT_PX / 2) };
  }
  // Per-frame easing tuned at 60 Hz, rescaled so the camera moves at the same
  // speed on any refresh rate.
  const ease = (perFrame, dt) => (motionOn ? 1 - Math.pow(1 - perFrame, dt * FRAME_RATE_REFERENCE) : 1);
  function stepCamera(hero, dt) {
    const stop = state.walking ? null : WAY[state.at];
    cam.tz = userZoom ?? (stop ? Math.min(2.6, (stop.z || 1.6) * (isNarrow() ? 0.8 : 1)) : baseZoom());
    cam.z += (cam.tz - cam.z) * ease(0.05, dt);
    if (follow) {
      const aim = heroScreenTarget();
      const tx = hero.x - (aim.x - VW / 2) / cam.z, ty = hero.y - (aim.y - VH / 2) / cam.z;
      const k = ease(0.06, dt);
      cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
    }
    cam.x = Math.max(VW / (2 * cam.z) - 200, Math.min(WW - VW / (2 * cam.z) + 200, cam.x));
    cam.y = Math.max(VH / (2 * cam.z) - 200, Math.min(WH - VH / (2 * cam.z) + 200, cam.y));
  }
  function drawCountries(z) {
    if (!COUNTRIES.length) return;
    ctx.save(); ctx.scale(K, K); ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(240,246,242,.26)"; ctx.lineWidth = 2.4; for (const cn of COUNTRIES) ctx.stroke(cn.path);
    for (const cn of COUNTRIES) { ctx.fillStyle = cn === hover ? "#F2C66D" : cn.tint; ctx.fill(cn.path); }
    ctx.strokeStyle = "rgba(74,46,20,.85)"; ctx.lineWidth = 0.32; for (const cn of COUNTRIES) ctx.stroke(cn.path);
    ctx.restore();
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "rgba(70,40,15,.85)";
    ctx.globalAlpha = z > 1.5 ? 0.55 : 0.9;
    for (const cn of COUNTRIES) {
      const px = Math.min(cn.size * K, 26 / z);
      if (px * z < 8.5 || cn.area < 6) continue;
      if (z > 1.3 && WAY.some((w) => Math.hypot(w.x - cn.cx * K, w.y - cn.cy * K) < 190 / Math.sqrt(z))) continue;
      ctx.font = (cn.size >= 5 ? "700 " : "") + px + "px " + MAPF;
      ctx.fillText(cn.name, cn.cx * K, cn.cy * K);
    }
    ctx.globalAlpha = 1; ctx.textBaseline = "alphabetic";
  }
  function drawRoute(hero, z) {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.setLineDash([]); ctx.strokeStyle = "#A3261E"; ctx.lineWidth = 3.2 / Math.sqrt(z); ctx.beginPath();
    let started = false;
    for (const r of route) { if (r.d > state.d) break; if (!started) { ctx.moveTo(r.x, r.y); started = true; } else ctx.lineTo(r.x, r.y); }
    if (started) { ctx.lineTo(hero.x, hero.y); ctx.stroke(); }
    ctx.setLineDash([2, 10 / Math.sqrt(z)]); ctx.strokeStyle = "rgba(50,30,10,.85)"; ctx.lineWidth = 3 / Math.sqrt(z); ctx.beginPath(); ctx.moveTo(hero.x, hero.y);
    for (const r of route) { if (r.d <= state.d) continue; ctx.lineTo(r.x, r.y); }
    ctx.stroke(); ctx.setLineDash([]);
  }
  function drawStops(z) {
    const pulse = (state.t % 1.4) / 1.4;
    const detail = z >= 1.25;
    const names = [];
    WAY.forEach((w, i) => {
      const isNow = state.at === i && !state.walking, visited = state.visited.has(i), target = state.walking && state.pending === i;
      const big = detail || isNow || target || visited;
      ctx.save(); ctx.translate(w.x, w.y);
      const sc = big ? (detail ? 1 : 0.6) / Math.sqrt(z) : 0.45 / Math.sqrt(z);
      if (isNow && motionOn) { ctx.strokeStyle = "rgba(217,164,65,.95)"; ctx.lineWidth = 3 / z; ctx.globalAlpha = 1 - pulse; ctx.beginPath(); ctx.arc(0, -24 * sc, (40 + pulse * 24) * sc, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
      const s = state.stadium[i];
      if (s) { const v = s.v, e = v < 1 ? 1 + Math.sin(v * Math.PI) * 0.22 : 1; drawStadium(ctx, 92 * sc, -14 * sc, Math.min(1, v * 1.15) * e * sc, isNow); }
      if (big) {
        ctx.save(); ctx.translate(-72 * sc, 0); ctx.scale(sc, sc);
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(0, 2, 30, 6, 0, 0, Math.PI * 2); ctx.fill();
        drawLandmark(ctx, w.id, isNow ? "#D9A441" : visited ? "#D4BC86" : "#F3E8CC", state.t);
        ctx.restore();
      } else {
        ctx.fillStyle = target ? "#D9A441" : "#F3E8CC"; ctx.strokeStyle = INK; ctx.lineWidth = 2 / z; ctx.beginPath(); ctx.arc(0, 0, 6 / z, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 2 * sc, 3 * sc, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (big || target) names.push({ w, sc });
    });
    names.forEach(({ w, sc }) => {
      const fs = 19 / Math.sqrt(z);
      ctx.save(); ctx.translate(w.x, w.y);
      ctx.textAlign = "center"; ctx.font = "700 " + fs + "px " + MAPF;
      ctx.lineWidth = 4 / Math.sqrt(z); ctx.strokeStyle = "rgba(243,232,204,.9)"; ctx.strokeText(w.name, 0, 26 * sc + fs * 0.4); ctx.fillStyle = INK; ctx.fillText(w.name, 0, 26 * sc + fs * 0.4);
      ctx.font = fs * 0.8 + "px " + MAPF; ctx.strokeText(w.year, 0, 26 * sc + fs * 1.35); ctx.fillStyle = "#7A1F1F"; ctx.fillText(w.year, 0, 26 * sc + fs * 1.35);
      ctx.restore();
    });
  }
  let last = performance.now();
  function frame(now) {
    // Schedule first, so one bad frame cannot stop the loop for good.
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(MAX_FRAME_S, (now - last) / 1000)); last = now; state.t += dt;
    const hero = posAt(state.d);
    if (state.walking) stepWalk(hero, dt);
    Object.keys(state.stadium).forEach((k) => { const s = state.stadium[k]; if (s.v < 1) s.v = Math.min(1, s.v + dt * (motionOn ? 2.2 : 50)); });
    stepCamera(hero, dt);
    const z = cam.z;
    ctx.setTransform(DPR * z, 0, 0, DPR * z, DPR * (VW / 2 - cam.x * z), DPR * (VH / 2 - cam.y * z));
    ctx.fillStyle = "#241711"; ctx.fillRect(cam.x - VW / z, cam.y - VH / z, (VW / z) * 2, (VH / z) * 2);
    ctx.drawImage(bg, 0, 0);
    drawCountries(z);
    const heroNow = posAt(state.d);
    drawRoute(heroNow, z);
    drawStops(z);
    ctx.save(); ctx.translate(heroNow.x, heroNow.y); const hs = 1 / Math.sqrt(z); ctx.scale(hs, hs);
    if (!heroNow.sailing || !state.walking) drawWalker(ctx, state.t, state.dir, state.walking && motionOn);
    else drawBoat(ctx, state.t, state.dir);
    ctx.restore();
  }
  requestAnimationFrame(frame);

  /* ------------------------------------------------------------------ */
  /* Travel, HUD, card                                                   */
  /* ------------------------------------------------------------------ */
  const card = $("card"), goBtn = $("goBtn"), contBtn = $("contBtn"), backBtn = $("backBtn"), statusEl = $("status");
  // Timers that belong to one moment (the intro, an arrival) live in a group,
  // so a newer action can cancel them before they fire on stale state.
  function timerGroup() {
    let ids = [];
    return {
      after(ms, fn) {
        const id = setTimeout(() => { ids = ids.filter((x) => x !== id); fn(); }, ms);
        ids = ids.concat(id);
      },
      clear() { ids.forEach(clearTimeout); ids = []; },
    };
  }
  const introTimers = timerGroup(), arrivalTimers = timerGroup();
  const setHud = (badge, title, where) => { $("hudBadge").textContent = badge; $("hudT").textContent = title; $("hudWhere").textContent = where; };
  const announce = (text) => { statusEl.textContent = text; };
  const setButton = (button, text, symbol) => {
    button.replaceChildren(text + " ", Core.el(document, "span", { "aria-hidden": "true" }, symbol));
  };

  function travelTo(index) {
    const i = Math.max(0, Math.min(WAY.length - 1, index));
    if (i === state.at && !state.walking) {
      follow = true; userZoom = null;
      if (i > 0) openCard(i);
      return;
    }
    if (state.walking && i === state.pending) return; // already on the way there
    arrivalTimers.clear();
    closeCard(false);
    follow = true; userZoom = null;
    const tripSpeed = Core.tripSpeed(stopD[i] - state.d, state.walking ? state.tripSpeed : 0);
    Object.assign(state, { target: stopD[i], walking: true, speedMul: 1, tripSpeed, at: -1, pending: i });
    setHud("EN ROUTE", "to " + WAY[i].name, "Press the button again to hurry.");
    setButton(goBtn, "Hurry", "»");
    announce("Walking to " + WAY[i].name + ".");
    paintRail();
  }
  function arrive() {
    state.walking = false; state.at = state.pending; state.visited.add(state.at);
    const arrivedAt = state.at, w = WAY[arrivedAt];
    if (arrivedAt > 0) {
      state.stadium[arrivedAt] = state.stadium[arrivedAt] || { v: 0 };
      const sx = (w.x - cam.x) * cam.z + VW / 2, sy = (w.y - cam.y) * cam.z + VH / 2;
      impact(0.5, sx, sy);
      if (w.mood === "joy") arrivalTimers.after(CONFETTI_DELAY_MS, () => confetti(sx, sy - 30));
      announce("Arrived at " + w.name + ", " + w.year + ". Episode " + w.ep + ": " + w.title + ".");
      arrivalTimers.after(motionOn ? CARD_OPEN_DELAY_MS : 0, () => {
        if (!state.walking && state.at === arrivedAt) openCard(arrivedAt);
      });
    } else {
      setHud("START", WAY[0].title, WAY[0].where);
      announce("Back at the start: " + WAY[0].title + ".");
    }
    paintRail(); paintGo();
  }
  function paintGo() {
    if (state.walking) return;
    const label = Core.goLabel(WAY, state.at);
    goBtn.disabled = false;
    setButton(goBtn, label.text, label.symbol);
  }
  function wireCopy() {
    const copyBtn = $("copyBtn");
    if (!copyBtn) return;
    const resetLabel = () => setTimeout(() => { copyBtn.textContent = "Copy"; }, COPY_RESET_MS);
    copyBtn.addEventListener("click", () => {
      const email = $("emailText");
      const done = () => { copyBtn.textContent = "Copied"; announce("Email address copied."); resetLabel(); };
      const fallback = () => {
        const range = document.createRange(); range.selectNodeContents(email);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        copyBtn.textContent = "Select + copy"; announce("Copy blocked by the browser. The address is selected; copy it by hand.");
        resetLabel();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email.textContent).then(done, fallback);
      else fallback();
    });
  }
  function openCard(i) {
    const s = WAY[i];
    if (!s || i === 0) return;
    cardOpen = true; card.hidden = false; goBtn.hidden = true;
    requestAnimationFrame(() => card.classList.add("open"));
    setHud("EP." + s.ep, s.name + ", " + s.year, s.title + " · checkpoint " + i + " of " + STOP_COUNT);
    $("cardK").textContent = "Episode " + s.ep + " · " + s.name + ", " + s.year;
    $("cardTitle").textContent = s.title;
    $("cardSub").textContent = s.when;
    const body = $("cardBody");
    body.replaceChildren(Core.renderCardBody(document, s, { contact: Data.contact, sources: Data.sources }));
    body.scrollTop = 0;
    wireCopy();
    backBtn.disabled = i <= 1;
    const next = Core.goLabel(WAY, i);
    setButton(contBtn, i + 1 < WAY.length ? "Continue to " + WAY[i + 1].name : next.text, next.symbol);
    contBtn.focus({ preventScroll: true });
  }
  function closeCard(refocus) {
    if (!cardOpen) return;
    cardOpen = false; card.classList.remove("open"); goBtn.hidden = false;
    setTimeout(() => { if (!cardOpen) card.hidden = true; }, CARD_HIDE_MS);
    // Focus inside the card would drop to <body> once it hides, so move it.
    if (refocus || card.contains(document.activeElement)) goBtn.focus({ preventScroll: true });
  }
  function next() {
    if (state.walking) { state.speedMul = HURRY_FACTOR; return; }
    const n = state.at + 1;
    travelTo(n < WAY.length ? n : 0);
  }
  const back = () => { if (!state.walking && state.at > 1) travelTo(state.at - 1); };
  goBtn.addEventListener("click", next);
  contBtn.addEventListener("click", next);
  backBtn.addEventListener("click", back);
  $("closeBtn").addEventListener("click", () => closeCard(true));

  // The rail is built once and then restyled in place, so a focused rail
  // button keeps focus when it is activated.
  const rail = $("rail");
  rail.replaceChildren(...Core.renderRail(document, WAY, state));
  function paintRail() {
    Array.from(rail.children).forEach((button, i) => {
      const look = Core.railButtonState(i, state);
      button.className = look.className;
      if (look.current) button.setAttribute("aria-current", look.current);
      else button.removeAttribute("aria-current");
    });
  }
  rail.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) travelTo(Number(b.dataset.i)); });
  paintGo();

  let introDone = false;
  document.addEventListener("keydown", (e) => {
    if (!introDone || e.altKey || e.ctrlKey || e.metaKey) return;
    // A held key would otherwise walk on and flash every card past.
    if (e.repeat && e.key !== "Escape") return;
    const onControl = e.target && ["BUTTON", "A", "SUMMARY"].includes(e.target.tagName);
    const activate = (e.key === "Enter" || e.key === " ") && !onControl;
    if (e.key === "ArrowRight" || activate) { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); back(); }
    else if (e.key === "Escape") closeCard(true);
  });

  /* drag to pan, click a stop, hover a country, wheel to zoom */
  const tip = $("tip");
  let drag = null;
  function worldFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left - VW / 2) / cam.z + cam.x, y: (e.clientY - r.top - VH / 2) / cam.z + cam.y, sx: e.clientX - r.left, sy: e.clientY - r.top };
  }
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) { drag.moved = true; follow = false; canvas.classList.add("drag"); cam.x = drag.cx - dx / cam.z; cam.y = drag.cy - dy / cam.z; }
      return;
    }
    if (e.pointerType !== "mouse") return;
    const p = worldFromEvent(e);
    hover = COUNTRIES.length ? countryAt(p.x, p.y) : null;
    if (hover) { tip.hidden = false; tip.textContent = hover.name; tip.style.left = p.sx + "px"; tip.style.top = p.sy + "px"; } else tip.hidden = true;
  });
  canvas.addEventListener("pointerleave", () => { hover = null; tip.hidden = true; });
  canvas.addEventListener("pointerup", (e) => {
    canvas.classList.remove("drag");
    if (drag && !drag.moved) {
      const p = worldFromEvent(e);
      let hitStop = -1;
      WAY.forEach((w, i) => { if (Math.hypot(w.x - p.x, w.y - p.y) < 44 / Math.sqrt(cam.z) + 10) hitStop = i; });
      if (hitStop >= 0) travelTo(hitStop); else if (cardOpen) closeCard(false);
    }
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => { drag = null; canvas.classList.remove("drag"); });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const dy = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * WHEEL_LINE_PX : e.deltaY;
    userZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (userZoom ?? cam.z) * Math.exp(-dy * WHEEL_ZOOM_RATE)));
    follow = false;
  }, { passive: false });
  canvas.addEventListener("dblclick", () => { follow = true; userZoom = null; });

  /* ------------------------------------------------------------------ */
  /* Intro                                                               */
  /* ------------------------------------------------------------------ */
  const intro = $("intro"), stage = $("stage");
  function closeIntro() {
    if (introDone) return;
    introDone = true;
    introTimers.clear();
    stage.inert = false;
    intro.style.transition = motionOn ? "transform .7s cubic-bezier(.76,0,.24,1)" : "none";
    intro.style.transform = "translateY(-100%)";
    setTimeout(() => {
      intro.hidden = true;
      goBtn.focus({ preventScroll: true });
      impact(0.5);
      // Only start walking if the visitor has not already set off.
      setTimeout(() => { if (state.at === 0 && !state.walking) travelTo(1); }, motionOn ? 600 : 0);
    }, motionOn ? 700 : 0);
  }
  $("startBtn").addEventListener("click", closeIntro);
  (function runIntro() {
    const words = intro.querySelectorAll(".intro-title .w");
    const sub = $("introSub"), cta = $("introCta");
    const reveal = (node) => { node.style.opacity = 1; node.style.transform = "none"; node.style.visibility = "visible"; };
    if (!motionOn) { words.forEach(reveal); reveal(sub); reveal(cta); return; }
    words.forEach((w, i) => {
      introTimers.after(500 + i * 520, () => {
        w.style.transition = "transform .38s cubic-bezier(.2,.8,.2,1), opacity .2s";
        w.style.opacity = 1; w.style.transform = "scale(1)";
        impact(0.9); intro.classList.remove("shake"); void intro.offsetWidth; intro.classList.add("shake");
      });
    });
    introTimers.after(2300, () => { sub.style.transition = "opacity .5s"; sub.style.opacity = 1; });
    introTimers.after(2600, () => { cta.style.transition = "opacity .5s"; cta.style.visibility = "visible"; cta.style.opacity = 1; });
  })();

  // boot.js shows a fallback on window load unless this line was reached.
  window.__journeyReady = true;
})();
