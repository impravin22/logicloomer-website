// Pure helpers for the map page: projection, path geometry, the route, and the
// DOM builders for the side card and the progress rail. Nothing is drawn and no
// page state is read here (only the standard URL class), so Jest can require
// this file directly.
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.JourneyCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // The jsvectormap world inset (Miller projection, 900 x 440.7 base units),
  // used when the vendored map data has not loaded.
  const DEFAULT_INSET = Object.freeze({
    width: 900,
    height: 440.70631074413296,
    bbox: [
      { y: -12671671.123330014, x: -20004297.151525836 },
      { y: 6930392.025135122, x: 20026572.39474939 },
    ],
  });
  const EARTH_RADIUS_M = 6381372;
  const CENTRAL_MERIDIAN_DEG = 11.5;
  const MILLER_LAT_FACTOR = 0.4;
  const MILLER_DIVISOR = 0.8;
  const DEG_TO_RAD = Math.PI / 180;
  const ROUTE_SAMPLES_PER_LEG = 80;
  // Walking pace in world pixels per second, and the shortest and longest a
  // trip between checkpoints may take, so a short hop never blinks past and an
  // ocean crossing never drags.
  const WALK_PACE_PX_S = 180;
  const TRIP_MIN_S = 3;
  const TRIP_MAX_S = 7;
  // The walker boards a ship only on a stretch of open sea at least this long.
  // On this route the ocean crossings run 570 to 770 px and every strait, gulf
  // and inland sea 75 px at most, so 200 sits well clear of both.
  const MIN_SEAWAY_PX = 200;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const RELATIVE_URL = /^\.{1,2}\//;
  const EXTERNAL_REL = "noreferrer noopener";
  const PATH_COMMAND = /^[A-Za-z]$/;
  // Attributes el() may set. Anything else (src, style, srcdoc, on*) is refused,
  // and href must also pass safeHref().
  const ALLOWED_ATTRIBUTE = /^(class|id|type|role|hidden|target|rel|href|data-[a-z-]+|aria-[a-z-]+)$/;

  /**
   * Returns a projector from latitude and longitude to world pixels.
   * @param {{width: number, height: number, bbox: Array<{x: number, y: number}>}} inset
   * @param {number} scale World pixels per map base unit.
   * @returns {(lat: number, lng: number) => {x: number, y: number}}
   */
  function makeProjection(inset, scale) {
    const [min, max] = inset.bbox;
    const worldWidth = inset.width * scale;
    const worldHeight = inset.height * scale;
    return function project(lat, lng) {
      const px = EARTH_RADIUS_M * (lng - CENTRAL_MERIDIAN_DEG) * DEG_TO_RAD;
      const py =
        (-EARTH_RADIUS_M * Math.log(Math.tan((45 + MILLER_LAT_FACTOR * lat) * DEG_TO_RAD))) /
        MILLER_DIVISOR;
      return {
        x: ((px - min.x) / (max.x - min.x)) * worldWidth,
        y: ((py - min.y) / (max.y - min.y)) * worldHeight,
      };
    };
  }

  // Splits an SVG path into subpaths of end points (curve control points are
  // skipped: the outline is only used for area and a label position).
  function pathToSubpaths(d) {
    const tokens = d.match(/[MmLlHhVvZzCcSsQqTtAa]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
    const subpaths = [];
    let current = null;
    let cmd = "";
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    let i = 0;
    const num = () => parseFloat(tokens[i++]);
    const skip = (count) => {
      i += count;
    };
    const moveBy = (nx, ny, relative) => {
      x = relative ? x + nx : nx;
      y = relative ? y + ny : ny;
      if (current) current.push([x, y]);
    };
    while (i < tokens.length) {
      const token = tokens[i];
      if (PATH_COMMAND.test(token)) {
        cmd = token;
        i++;
        if (cmd === "Z" || cmd === "z") {
          x = startX;
          y = startY;
          continue;
        }
      }
      const relative = cmd === cmd.toLowerCase();
      switch (cmd.toUpperCase()) {
        case "M": {
          const nx = num();
          const ny = num();
          x = relative ? x + nx : nx;
          y = relative ? y + ny : ny;
          startX = x;
          startY = y;
          current = [[x, y]];
          subpaths.push(current);
          cmd = relative ? "l" : "L";
          break;
        }
        case "L":
        case "T":
          moveBy(num(), num(), relative);
          break;
        case "H":
          moveBy(num(), relative ? 0 : y, relative);
          break;
        case "V": {
          const ny = num();
          moveBy(relative ? 0 : x, ny, relative);
          break;
        }
        case "C":
          skip(4);
          moveBy(num(), num(), relative);
          break;
        case "S":
        case "Q":
          skip(2);
          moveBy(num(), num(), relative);
          break;
        case "A":
          skip(5);
          moveBy(num(), num(), relative);
          break;
        default:
          i++;
      }
    }
    return subpaths;
  }

  /**
   * Measures a country outline: total area of all islands and the centroid of
   * the largest one, in path units. Arc flags must be comma or space separated
   * (the compact "0110,0" form is not tokenised); the vendored outlines use
   * only M, l and Z.
   * @param {string} d SVG path data.
   * @returns {{area: number, cx: number, cy: number}}
   */
  function analysePath(d) {
    let best = null;
    let bestArea = 0;
    let total = 0;
    pathToSubpaths(d).forEach((pts) => {
      if (pts.length < 3) return;
      let signed = 0;
      let cx = 0;
      let cy = 0;
      for (let j = 0; j < pts.length; j++) {
        const p = pts[j];
        const q = pts[(j + 1) % pts.length];
        const cross = p[0] * q[1] - q[0] * p[1];
        signed += cross;
        cx += (p[0] + q[0]) * cross;
        cy += (p[1] + q[1]) * cross;
      }
      signed /= 2;
      const area = Math.abs(signed);
      total += area;
      if (area > bestArea) {
        bestArea = area;
        best = { cx: cx / (6 * signed), cy: cy / (6 * signed) };
      }
    });
    return { area: total, cx: best ? best.cx : 0, cy: best ? best.cy : 0 };
  }

  const catmullRom = (p0, p1, p2, p3, t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    );
  };

  /**
   * Samples a Catmull-Rom curve through the waypoints, with the running
   * distance along the curve on every sample.
   * @param {Array<{x: number, y: number}>} points
   * @param {number} samplesPerLeg
   * @returns {Array<{x: number, y: number, d: number}>}
   */
  function buildRoute(points, samplesPerLeg) {
    const padded = [points[0], ...points, points[points.length - 1]];
    const samples = [];
    for (let i = 1; i < padded.length - 2; i++) {
      const [p0, p1, p2, p3] = [padded[i - 1], padded[i], padded[i + 1], padded[i + 2]];
      for (let s = 0; s < samplesPerLeg; s++) {
        const t = s / samplesPerLeg;
        samples.push({ x: catmullRom(p0.x, p1.x, p2.x, p3.x, t), y: catmullRom(p0.y, p1.y, p2.y, p3.y, t) });
      }
    }
    const last = points[points.length - 1];
    samples.push({ x: last.x, y: last.y });
    let d = 0;
    return samples.map((p, i) => {
      if (i > 0) d += Math.hypot(p.x - samples[i - 1].x, p.y - samples[i - 1].y);
      return { x: p.x, y: p.y, d };
    });
  }

  /**
   * Distance along the route of the sample nearest each waypoint; the last
   * waypoint is pinned to the end of the route.
   * @param {Array<{x: number, y: number, d: number}>} route From buildRoute().
   * @param {Array<{x: number, y: number}>} points The waypoints.
   * @returns {number[]}
   */
  function stopDistances(route, points) {
    const total = route[route.length - 1].d;
    return points.map((w, i) => {
      if (i === points.length - 1) return total;
      let best = 0;
      let bestGap = Infinity;
      route.forEach((r) => {
        const gap = Math.hypot(r.x - w.x, r.y - w.y);
        if (gap < bestGap) {
          bestGap = gap;
          best = r.d;
        }
      });
      return best;
    });
  }

  /**
   * Speed for a trip of `distance` world pixels: the walking pace, slowed or
   * sped up so the trip takes between TRIP_MIN_S and TRIP_MAX_S seconds.
   * A change of plan mid-walk never slows the walker down: the result is at
   * least `currentSpeed`.
   * @param {number} distance signed distance along the route
   * @param {number} [currentSpeed] speed the walker already has, if moving
   * @returns {number} pixels per second, or 0 when there is nowhere to go
   */
  function tripSpeed(distance, currentSpeed = 0) {
    const length = Math.abs(distance);
    if (!Number.isFinite(length) || length === 0) return 0;
    const seconds = Math.min(TRIP_MAX_S, Math.max(TRIP_MIN_S, length / WALK_PACE_PX_S));
    return Math.max(length / seconds, Number.isFinite(currentSpeed) ? currentSpeed : 0);
  }

  /**
   * Marks the route samples that belong to a stretch of sea at least
   * `minLength` long, measured along the route. Shorter stretches are walked.
   * @param {Array<{d: number}>} route samples from buildRoute
   * @param {boolean[]} land one flag per sample, true where it is over land
   * @param {number} [minLength]
   * @returns {boolean[]} a new array, true where the walker sails
   */
  function seaways(route, land, minLength = MIN_SEAWAY_PX) {
    if (land.length !== route.length) throw new Error("Expected one land flag per route sample.");
    const sail = route.map(() => false);
    let start = -1;
    for (let i = 0; i <= route.length; i++) {
      const atSea = i < route.length && !land[i];
      if (atSea && start < 0) start = i;
      if (!atSea && start >= 0) {
        if (route[i - 1].d - route[start].d >= minLength) sail.fill(true, start, i);
        start = -1;
      }
    }
    return sail;
  }

  /**
   * Interpolated position at a distance along the route, clamped to its ends.
   * `nearest` is the index of the closer neighbouring sample.
   * @param {Array<{x: number, y: number, d: number}>} route From buildRoute().
   * @param {number} distance
   * @returns {{x: number, y: number, dx: number, nearest: number}}
   */
  function positionAt(route, distance) {
    const total = route[route.length - 1].d;
    const d = Math.max(0, Math.min(total, distance));
    let lo = 0;
    let hi = route.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (route[mid].d <= d) lo = mid;
      else hi = mid;
    }
    const a = route[lo];
    const b = route[hi];
    const k = (d - a.d) / (b.d - a.d || 1);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, dx: b.x - a.x, nearest: k < 0.5 ? lo : hi };
  }

  /**
   * Returns a link target that is safe to render, else null. Allowed: https
   * URLs without credentials (returned normalised, so a bare origin gains a
   * trailing slash) and paths starting with ./ or ../ (returned as given).
   * @param {unknown} href
   * @returns {string|null}
   */
  function safeHref(href) {
    if (typeof href !== "string") return null;
    const trimmed = href.trim();
    if (RELATIVE_URL.test(trimmed)) return trimmed;
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "https:" || url.username || url.password) return null;
      return url.href;
    } catch (error) {
      return null;
    }
  }

  /**
   * Creates an element. String children become text nodes, so data is never
   * parsed as HTML. Only allowlisted attributes are accepted, and an href must
   * pass safeHref(); anything else throws.
   * @param {Document} doc
   * @param {string} tag
   * @param {Object<string, string|number|boolean|null|undefined>} [attrs]
   * @param {Array<Node|string|null|undefined|false>|Node|string} [children]
   * @returns {HTMLElement}
   */
  function el(doc, tag, attrs, children) {
    const node = doc.createElement(tag);
    Object.entries(attrs || {}).forEach(([name, value]) => {
      if (!ALLOWED_ATTRIBUTE.test(name)) throw new Error("Refusing attribute outside the allowlist: " + name);
      if (value === null || value === undefined || value === false) return;
      if (name === "href" && safeHref(value) === null) throw new Error("Refusing unsafe href");
      node.setAttribute(name, value === true ? "" : String(value));
    });
    [].concat(children ?? []).forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      node.append(child);
    });
    return node;
  }

  // A link, or null when the href is not safe. External links open in a new
  // tab without the opener; site-relative links stay in this tab.
  function link(doc, label, href, className) {
    const safe = safeHref(href);
    if (!safe) return null;
    const external = !RELATIVE_URL.test(safe);
    return el(
      doc,
      "a",
      { class: className, href: safe, target: external ? "_blank" : null, rel: external ? EXTERNAL_REL : null },
      label
    );
  }

  function chevron(doc) {
    const svg = doc.createElementNS(SVG_NS, "svg");
    [["width", "16"], ["height", "16"], ["viewBox", "0 0 24 24"], ["fill", "none"], ["stroke", "currentColor"],
      ["stroke-width", "2.5"], ["stroke-linecap", "round"], ["stroke-linejoin", "round"], ["focusable", "false"]]
      .forEach(([k, v]) => svg.setAttribute(k, v));
    const pathNode = doc.createElementNS(SVG_NS, "path");
    pathNode.setAttribute("d", "M6 9l6 6 6-6");
    svg.append(pathNode);
    return svg;
  }

  function renderProject(doc, project, index) {
    const links = (project.links ?? []).map((l) => link(doc, l.label + " ↗", l.href, "plink"));
    return el(doc, "article", { class: "proj" }, [
      el(doc, "span", { class: "n", "aria-hidden": "true" }, String(index + 1)),
      project.k ? el(doc, "p", { class: "pk" }, project.k) : null,
      el(doc, "h3", {}, project.h),
      el(doc, "p", { class: "what" }, project.what),
      el(doc, "p", { class: "res" }, project.res),
      el(doc, "div", { class: "chips" }, [...project.chips.map((c) => el(doc, "span", { class: "chip" }, c)), ...links]),
    ]);
  }

  function renderMatch(doc, stop) {
    const summary = el(doc, "summary", {}, [
      el(doc, "span", { class: "s1" }, [
        el(doc, "span", { class: "venue" }, stop.venue),
        el(doc, "span", { class: "score" }, stop.s1 + " · " + stop.s2),
      ]),
      el(doc, "span", { class: "chev", "aria-hidden": "true" }, chevron(doc)),
    ]);
    const notes = stop.more.map((m) => el(doc, "li", {}, [el(doc, "b", {}, m.label), " " + m.text]));
    return el(doc, "section", { class: "sec" }, [
      el(doc, "p", { class: "label" }, "Meanwhile, in football"),
      el(doc, "details", { class: "match" }, [
        summary,
        el(doc, "div", { class: "mb" }, [
          el(doc, "span", { class: "res" }, stop.res),
          el(doc, "p", {}, stop.story),
          el(doc, "ul", {}, notes),
        ]),
      ]),
    ]);
  }

  // "A, B, C and D" from the links that survive safeHref().
  function joinWithAnd(items) {
    return items.flatMap((item, i) => {
      if (i === 0) return [item];
      return [i === items.length - 1 ? " and " : ", ", item];
    });
  }

  function renderContact(doc, contact, sources) {
    const sourceLinks = joinWithAnd(sources.map((s) => link(doc, s.label, s.href)).filter(Boolean));
    return el(doc, "section", { class: "sec" }, [
      el(doc, "p", { class: "label" }, "Write the next episode"),
      el(doc, "div", { class: "email" }, [
        el(doc, "code", { id: "emailText" }, contact.email),
        el(doc, "button", { class: "copy", id: "copyBtn", type: "button" }, "Copy"),
      ]),
      el(doc, "div", { class: "links" }, contact.links.map((l) => link(doc, l.label, l.href))),
      el(doc, "p", { class: "src" }, [
        contact.factCheck + " ",
        ...sourceLinks,
        ". " + contact.credits,
      ]),
    ]);
  }

  /**
   * Builds the body of the side card for one checkpoint.
   * @param {Document} doc
   * @param {Object} stop A checkpoint from JourneyData.stops.
   * @param {{contact: Object, sources: Array<{label: string, href: string}>}} extras
   * @returns {DocumentFragment}
   */
  function renderCardBody(doc, stop, extras) {
    const fragment = doc.createDocumentFragment();
    fragment.append(
      el(doc, "section", { class: "sec" }, [
        el(doc, "p", { class: "label" }, "What I shipped"),
        ...stop.projects.map((p, i) => renderProject(doc, p, i)),
      ]),
      el(doc, "div", { class: "par" }, [
        el(doc, "p", { class: "label" }, "The parallel"),
        el(doc, "p", { class: "big" }, stop.par.big),
        el(doc, "p", {}, stop.par.p),
      ]),
      renderMatch(doc, stop)
    );
    if (stop.final) fragment.append(renderContact(doc, extras.contact, extras.sources));
    return fragment;
  }

  /**
   * How one rail button looks for the current progress.
   * @param {number} i Waypoint index.
   * @param {{at: number, visited: Set<number>}} state
   * @returns {{className: string, current: string|null}}
   */
  function railButtonState(i, state) {
    const isNow = state.at === i;
    return { className: isNow ? "now" : state.visited.has(i) ? "done" : "", current: isNow ? "step" : null };
  }

  /**
   * Builds the progress rail: one button per waypoint, the current one marked
   * with aria-current. Built once; later updates go through railButtonState()
   * so a focused button is never replaced.
   * @param {Document} doc
   * @param {Array<{name: string, year: string}>} waypoints
   * @param {{at: number, visited: Set<number>}} state
   * @returns {HTMLButtonElement[]}
   */
  function renderRail(doc, waypoints, state) {
    return waypoints.map((w, i) => {
      const look = railButtonState(i, state);
      return el(
        doc,
        "button",
        {
          type: "button",
          "data-i": i,
          class: look.className,
          "aria-label": w.name + ", " + w.year,
          "aria-current": look.current,
        },
        [
          el(doc, "i", { "aria-hidden": "true" }),
          el(doc, "span", { class: "y" }, w.year),
          el(doc, "span", { class: "c" }, w.name),
        ]
      );
    });
  }

  /**
   * Label for the main button when standing at a waypoint.
   * @param {Array<{name: string}>} waypoints
   * @param {number} at Index of the waypoint the walker stands at.
   * @returns {{text: string, symbol: string}}
   */
  function goLabel(waypoints, at) {
    const next = at + 1;
    return next < waypoints.length
      ? { text: "March to " + waypoints[next].name, symbol: "▸" }
      : { text: "Back to " + waypoints[0].name, symbol: "↺" };
  }

  return Object.freeze({
    DEFAULT_INSET,
    ROUTE_SAMPLES_PER_LEG,
    WALK_PACE_PX_S,
    TRIP_MIN_S,
    TRIP_MAX_S,
    MIN_SEAWAY_PX,
    makeProjection,
    analysePath,
    buildRoute,
    stopDistances,
    positionAt,
    tripSpeed,
    seaways,
    safeHref,
    el,
    renderCardBody,
    renderRail,
    railButtonState,
    goLabel,
  });
});
