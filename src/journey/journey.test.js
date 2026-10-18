// Tests for the static map page in public/journey/. The page ships as plain
// scripts (no bundler), so its pure core and data are UMD modules that Jest can
// require directly; the canvas engine is exercised in a real browser instead.
import crypto from "crypto";
import fs from "fs";
import path from "path";
import vm from "vm";

const JOURNEY_DIR = path.join(__dirname, "..", "..", "public", "journey");
const WORLD_SHA256 = "de3c2c21cf63bdd95a4cfc477a566a4b189579daeb26157e8ecb101000224edd";
const WORLD_COUNTRY_COUNT = 176;
const core = require("../../public/journey/journey-core.js");
const data = require("../../public/journey/journey-data.js");

const STOP_COUNT = 8;
const waypoints = [data.start, ...data.stops];

// Every human-readable string in a stop, flattened for copy checks.
const copyOf = (stop) =>
  [
    stop.name,
    stop.title,
    stop.when,
    stop.venue,
    stop.s1,
    stop.s2,
    stop.res,
    stop.story,
    stop.par?.big,
    stop.par?.p,
    ...(stop.more ?? []).flatMap((m) => [m.label, m.text]),
    ...(stop.projects ?? []).flatMap((p) => [p.k, p.h, p.what, p.res, ...p.chips]),
  ].filter(Boolean);

const allCopy = [data.start.where, ...data.stops.flatMap(copyOf)];

describe("journey data", () => {
  it("has a start and eight checkpoints with unique ids", () => {
    expect(data.stops).toHaveLength(STOP_COUNT);
    const ids = waypoints.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers the episodes 01 to 08 in order", () => {
    expect(data.stops.map((s) => s.ep)).toEqual(["01", "02", "03", "04", "05", "06", "07", "08"]);
  });

  it("places every waypoint at a valid latitude and longitude", () => {
    waypoints.forEach((w) => {
      expect(w.lat).toBeGreaterThanOrEqual(-90);
      expect(w.lat).toBeLessThanOrEqual(90);
      expect(w.lng).toBeGreaterThanOrEqual(-180);
      expect(w.lng).toBeLessThanOrEqual(180);
    });
  });

  it("gives every checkpoint its story, its match and at least one project", () => {
    data.stops.forEach((s) => {
      ["title", "when", "venue", "s1", "s2", "res", "story"].forEach((field) => {
        expect(typeof s[field]).toBe("string");
        expect(s[field].trim()).not.toBe("");
      });
      expect(["joy", "pain"]).toContain(s.mood);
      expect(s.par.big.trim()).not.toBe("");
      expect(s.projects.length).toBeGreaterThan(0);
      s.projects.forEach((p) => {
        expect(p.h.trim()).not.toBe("");
        expect(p.what.trim()).not.toBe("");
        expect(p.res.trim()).not.toBe("");
        expect(p.chips.length).toBeGreaterThan(0);
      });
    });
  });

  it("marks only the last checkpoint as the final one", () => {
    const finals = data.stops.filter((s) => s.final);
    expect(finals).toHaveLength(1);
    expect(data.stops[STOP_COUNT - 1].final).toBe(true);
  });

  it("only links to https pages or to this site", () => {
    const hrefs = [
      ...data.stops.flatMap((s) => s.projects.flatMap((p) => (p.links ?? []).map((l) => l.href))),
      ...data.contact.links.map((l) => l.href),
      ...data.sources.map((l) => l.href),
    ];
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => expect(core.safeHref(href)).not.toBeNull());
  });

  it("keeps the owner-confirmed LinkedIn link on the contact card", () => {
    const linkedIn = data.contact.links.find((l) => /linkedin/i.test(l.label));
    expect(linkedIn?.href).toBe("https://www.linkedin.com/in/praveen-chittem-b78b4a160");
  });

  it("points the CV and the plain site at this site, not an absolute host", () => {
    const cv = data.contact.links.find((l) => /cv/i.test(l.label));
    expect(cv.href).toBe("../Praveen_Chittem_CV_2026.pdf");
    expect(data.contact.links.some((l) => l.href === "../")).toBe(true);
  });

  it("speaks in the first person, never 'Pravy shipped' or 'Pravy joins'", () => {
    allCopy.forEach((text) => {
      expect(text).not.toMatch(/\bPravy (shipped|joins|is)\b/);
    });
  });

  it("ships no bracketed placeholders", () => {
    allCopy.forEach((text) => expect(text).not.toMatch(/\[[^\]]*\]/));
  });

  it("uses British spelling in the copy", () => {
    const american = /\b(color|organiz|optimiz|behavior|center|favorite|analyz|customiz|containeriz|recogniz|normaliz|summariz|initializ|utiliz|judgment|catalog\b)\w*/i;
    allCopy.forEach((text) => expect(text).not.toMatch(american));
  });
});

describe("safeHref", () => {
  it.each([
    ["https://github.com/impravin22", "https://github.com/impravin22"],
    ["../", "../"],
    ["./vendor/world.js", "./vendor/world.js"],
    ["HTTPS://github.com", "https://github.com/"],
  ])("allows %s", (input, expected) => {
    expect(core.safeHref(input)).toBe(expected);
  });

  it.each([
    // eslint-disable-next-line no-script-url -- hostile input under test
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
    "//evil.example",
    "mailto:someone@example.com",
    "java\tscript:alert(1)",
    "\u0000javascript:alert(1)",
    "vbscript:msgbox(1)",
    "blob:https://example.com/id",
    "file:///etc/passwd",
    "\\\\evil.example",
    "https://user:pw@evil.example/",
    "https://github.com@evil.example/",
    "",
    null,
    undefined,
    42,
  ])("rejects %p", (input) => {
    expect(core.safeHref(input)).toBeNull();
  });
});

describe("el", () => {
  it("builds an element with attributes and text children", () => {
    const node = core.el(document, "a", { href: "../", class: "x", hidden: false }, ["Home"]);
    expect(node.tagName).toBe("A");
    expect(node.getAttribute("href")).toBe("../");
    expect(node.hasAttribute("hidden")).toBe(false);
    expect(node.textContent).toBe("Home");
  });

  it("treats markup in strings as text, never as HTML", () => {
    const node = core.el(document, "p", {}, ['<img src=x onerror="alert(1)">']);
    expect(node.querySelector("img")).toBeNull();
    expect(node.textContent).toBe('<img src=x onerror="alert(1)">');
  });

  it.each(["onclick", "ONCLICK", "src", "style", "srcdoc", "formaction", "xlink:href"])(
    "refuses the %s attribute",
    (name) => {
      expect(() => core.el(document, "a", { [name]: "x" })).toThrow(/refusing attribute/i);
    }
  );

  it("refuses an unsafe href even through the allowlist", () => {
    // eslint-disable-next-line no-script-url -- hostile input under test
    expect(() => core.el(document, "a", { href: "javascript:alert(1)" })).toThrow(/unsafe href/i);
  });

  it("skips null, undefined and false children", () => {
    const node = core.el(document, "div", {}, [null, "a", undefined, false, "b"]);
    expect(node.textContent).toBe("ab");
  });
});

describe("makeProjection", () => {
  const project = core.makeProjection(core.DEFAULT_INSET, 4);
  const worldWidth = core.DEFAULT_INSET.width * 4;
  const worldHeight = core.DEFAULT_INSET.height * 4;

  it("keeps every waypoint inside the world bounds", () => {
    waypoints.forEach((w) => {
      const p = project(w.lat, w.lng);
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(worldWidth);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(worldHeight);
    });
  });

  it("puts west on the left and north at the top", () => {
    const rio = project(-22.91, -43.23);
    const amsterdam = project(52.31, 4.94);
    const taipei = project(25.04, 121.56);
    expect(rio.x).toBeLessThan(amsterdam.x);
    expect(amsterdam.x).toBeLessThan(taipei.x);
    expect(amsterdam.y).toBeLessThan(taipei.y);
    expect(taipei.y).toBeLessThan(rio.y);
  });
});

describe("analysePath", () => {
  it("measures a square drawn with absolute commands", () => {
    const info = core.analysePath("M0,0L10,0L10,10L0,10Z");
    expect(info.area).toBeCloseTo(100);
    expect(info.cx).toBeCloseTo(5);
    expect(info.cy).toBeCloseTo(5);
  });

  it("measures the same square drawn with relative commands", () => {
    const info = core.analysePath("m0,0l10,0l0,10l-10,0z");
    expect(info.area).toBeCloseTo(100);
    expect(info.cx).toBeCloseTo(5);
    expect(info.cy).toBeCloseTo(5);
  });

  it("sums the area of every island and centres on the largest", () => {
    const info = core.analysePath("M0,0h2v2h-2Z M10,10L30,10L30,30L10,30Z");
    expect(info.area).toBeCloseTo(404);
    expect(info.cx).toBeCloseTo(20);
    expect(info.cy).toBeCloseTo(20);
  });

  it.each([
    ["cubic and smooth curves with a vertical line", "M0,0C1,1 9,1 10,0V10S5,12 0,10Z"],
    ["quadratic, arc and smooth quadratic curves", "M0,0Q5,-2 10,0A5,5 0 0 1 10,10T0,10Z"],
    ["relative curves", "M0,0c1,1 9,1 10,0v10s-5,2 -10,0z"],
  ])("follows the end points of %s", (_name, d) => {
    const info = core.analysePath(d);
    expect(info.area).toBeCloseTo(100);
    expect(info.cx).toBeCloseTo(5);
    expect(info.cy).toBeCloseTo(5);
  });

  it.each([
    ["implicit line-to after a move", "M0,0 10,0 10,10 0,10Z", 5],
    ["exponent numbers", "M0,0L1e1,0L1e1,1e1L0,1e1Z", 5],
    ["leading-dot decimals", "M-.5,-.5L9.5,-.5L9.5,9.5L-.5,9.5Z", 4.5],
  ])("parses %s", (_name, d, centre) => {
    const info = core.analysePath(d);
    expect(info.area).toBeCloseTo(100);
    expect(info.cx).toBeCloseTo(centre);
    expect(info.cy).toBeCloseTo(centre);
  });

  it("returns zero area for an empty or degenerate path", () => {
    expect(core.analysePath("")).toEqual({ area: 0, cx: 0, cy: 0 });
    expect(core.analysePath("M0,0L5,5")).toEqual({ area: 0, cx: 0, cy: 0 });
  });
});

describe("route", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
  ];
  const route = core.buildRoute(points, 10);

  it("samples every leg and ends on the last waypoint", () => {
    expect(route).toHaveLength(2 * 10 + 1);
    expect(route[0]).toMatchObject({ x: 0, y: 0, d: 0 });
    expect(route[10]).toMatchObject({ x: 100, y: 0 });
    expect(route[route.length - 1]).toMatchObject({ x: 100, y: 100 });
  });

  it("accumulates distance without ever going backwards", () => {
    for (let i = 1; i < route.length; i++) {
      expect(route[i].d).toBeGreaterThanOrEqual(route[i - 1].d);
    }
  });

  it("finds each stop's distance along the route in order", () => {
    const distances = core.stopDistances(route, points);
    expect(distances[0]).toBe(0);
    expect(distances[1]).toBeGreaterThan(0);
    expect(distances[2]).toBe(route[route.length - 1].d);
  });

  it("clamps positions outside the route to its ends", () => {
    expect(core.positionAt(route, -50)).toMatchObject({ x: 0, y: 0, nearest: 0 });
    const end = core.positionAt(route, 1e9);
    expect(end.x).toBeCloseTo(100);
    expect(end.y).toBeCloseTo(100);
    expect(end.nearest).toBe(route.length - 1);
  });

  it("interpolates between samples", () => {
    const a = route[3];
    const b = route[4];
    const mid = core.positionAt(route, (a.d + b.d) / 2);
    expect(mid.x).toBeCloseTo((a.x + b.x) / 2);
    expect(mid.y).toBeCloseTo((a.y + b.y) / 2);
  });

  it("builds a route that passes every real checkpoint", () => {
    const project = core.makeProjection(core.DEFAULT_INSET, 4);
    const projected = waypoints.map((w) => project(w.lat, w.lng));
    const real = core.buildRoute(projected, core.ROUTE_SAMPLES_PER_LEG);
    const distances = core.stopDistances(real, projected);
    expect(distances).toHaveLength(waypoints.length);
    for (let i = 1; i < distances.length; i++) {
      expect(distances[i]).toBeGreaterThan(distances[i - 1]);
    }
  });
});

describe("goLabel", () => {
  it("names the next checkpoint", () => {
    expect(core.goLabel(waypoints, 0)).toEqual({ text: "March to Amsterdam", symbol: "▸" });
    expect(core.goLabel(waypoints, 3)).toEqual({ text: "March to Istanbul", symbol: "▸" });
  });

  it("offers the way home from the last checkpoint", () => {
    expect(core.goLabel(waypoints, waypoints.length - 1)).toEqual({
      text: "Back to Taipei",
      symbol: "↺",
    });
  });
});

describe("renderRail", () => {
  it("renders one labelled button per waypoint and marks progress", () => {
    const buttons = core.renderRail(document, waypoints, { at: 2, visited: new Set([0, 1, 2]) });
    expect(buttons).toHaveLength(waypoints.length);
    expect(buttons[1].getAttribute("aria-label")).toBe("Amsterdam, 2019");
    expect(buttons[1].className).toBe("done");
    expect(buttons[2].className).toBe("now");
    expect(buttons[2].getAttribute("aria-current")).toBe("step");
    expect(buttons[3].className).toBe("");
    expect(buttons[3].hasAttribute("aria-current")).toBe(false);
    expect(buttons[3].dataset.i).toBe("3");
  });
});

describe("railButtonState", () => {
  const state = { at: 2, visited: new Set([0, 1, 2]) };

  it("marks the current, visited and unvisited checkpoints", () => {
    expect(core.railButtonState(2, state)).toEqual({ className: "now", current: "step" });
    expect(core.railButtonState(1, state)).toEqual({ className: "done", current: null });
    expect(core.railButtonState(5, state)).toEqual({ className: "", current: null });
  });

  it("marks nothing as current while walking", () => {
    expect(core.railButtonState(2, { at: -1, visited: state.visited })).toEqual({ className: "done", current: null });
  });
});

describe("renderCardBody", () => {
  const extras = { contact: data.contact, sources: data.sources };
  const render = (stop) => {
    const host = document.createElement("div");
    host.append(core.renderCardBody(document, stop, extras));
    return host;
  };

  it("lists what I shipped, the parallel and the match", () => {
    const amsterdam = data.stops[0];
    const host = render(amsterdam);
    expect(host.textContent).toContain("What I shipped");
    expect(host.querySelectorAll("article.proj h3")).toHaveLength(amsterdam.projects.length);
    expect(host.querySelector(".par .big").textContent).toBe(amsterdam.par.big);
    expect(host.querySelector("details.match .venue").textContent).toBe(amsterdam.venue);
    expect(host.querySelector("details.match .score").textContent).toBe("Ajax 2 · Spurs 3");
    expect(host.querySelectorAll("details.match li")).toHaveLength(amsterdam.more.length);
  });

  it("bolds each football note's label", () => {
    const host = render(data.stops[0]);
    expect(host.querySelector("details.match li b").textContent).toBe(data.stops[0].more[0].label);
  });

  it("opens project links in a new tab without leaking the opener", () => {
    const bilbao = data.stops.find((s) => s.id === "bilbao");
    const link = render(bilbao).querySelector("a.plink");
    expect(link.getAttribute("href")).toBe("https://blendnbubbles.com/");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer noopener");
  });

  it("renders hostile copy as text and drops unsafe links", () => {
    const hostile = {
      ...data.stops[0],
      projects: [
        {
          h: "<img src=x onerror=alert(1)>",
          what: "w",
          res: "r",
          chips: ["c"],
          // eslint-disable-next-line no-script-url -- hostile input under test
          links: [{ label: "bad", href: "javascript:alert(1)" }],
        },
      ],
    };
    const host = render(hostile);
    expect(host.querySelector("img")).toBeNull();
    expect(host.querySelector("h3").textContent).toBe("<img src=x onerror=alert(1)>");
    expect(host.querySelector("a.plink")).toBeNull();
  });

  it("shows the contact block only on the final checkpoint", () => {
    expect(render(data.stops[0]).querySelector("#copyBtn")).toBeNull();
    const host = render(data.stops[STOP_COUNT - 1]);
    expect(host.querySelector("#emailText").textContent).toBe("impravin22@gmail.com");
    expect(host.querySelector("#copyBtn")).not.toBeNull();
    const labels = [...host.querySelectorAll(".links a")].map((a) => a.textContent);
    expect(labels).toEqual(expect.arrayContaining(["GitHub", "GitLab", "LinkedIn", "CV (PDF)"]));
  });

  it("joins the fact-check sources as 'A, B, C and D'", () => {
    const text = render(data.stops[STOP_COUNT - 1]).querySelector(".src").textContent;
    expect(text).toContain("against Wikipedia, bundesliga.com, Football360 and beIN Sports. ");
  });

  it("keeps the 'and' when an unsafe last source is dropped", () => {
    const host = document.createElement("div");
    const sources = [...data.sources.slice(0, 3), { label: "Bad", href: "http://insecure.example" }];
    host.append(core.renderCardBody(document, data.stops[STOP_COUNT - 1], { contact: data.contact, sources }));
    const text = host.querySelector(".src").textContent;
    expect(text).toContain("against Wikipedia, bundesliga.com and Football360. ");
    expect(text).not.toContain("Bad");
  });

  it("opens site-relative links in the same tab", () => {
    const host = render(data.stops[STOP_COUNT - 1]);
    const plain = [...host.querySelectorAll(".links a")].find((a) => a.getAttribute("href") === "../");
    expect(plain.hasAttribute("target")).toBe(false);
  });
});

describe("journey page markup", () => {
  const html = fs.readFileSync(path.join(JOURNEY_DIR, "index.html"), "utf8");
  const doc = new DOMParser().parseFromString(html, "text/html");

  it("is titled with the humbler name", () => {
    expect(doc.title).toBe("The Route So Far · Pravy Chittem");
    expect(doc.querySelector("h1").textContent.replace(/\s+/g, " ").trim()).toBe("The Route So Far");
  });

  it("declares British English", () => {
    expect(doc.documentElement.getAttribute("lang")).toBe("en-GB");
  });

  it("has main and live-status landmarks, and no live region on the card", () => {
    expect(doc.querySelector("main")).not.toBeNull();
    expect(doc.querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
    expect(doc.querySelector("#card").hasAttribute("aria-live")).toBe(false);
  });

  it("locks scripts and styles to this site with a CSP", () => {
    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    [
      "default-src 'self'",
      "script-src 'self'",
      "connect-src 'none'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "require-trusted-types-for 'script'",
      "upgrade-insecure-requests",
    ].forEach((directive) => expect(csp).toContain(directive));
    expect(csp).not.toMatch(/unsafe-(inline|eval)|data:/);
  });

  it("declares the CSP before any script or stylesheet", () => {
    const order = [...doc.head.children].map((n) => n.tagName + (n.getAttribute("http-equiv") ? ":csp" : ""));
    const cspAt = order.indexOf("META:csp");
    expect(cspAt).toBeGreaterThanOrEqual(0);
    expect(cspAt).toBeLessThan(order.indexOf("LINK"));
    expect(cspAt).toBeLessThan(order.indexOf("SCRIPT"));
  });

  it("arms the intro from the head so a failed load can fall back", () => {
    expect(doc.head.querySelector('script[src="./boot.js"]')).not.toBeNull();
    const fail = doc.querySelector("#introFail");
    expect(fail.querySelector('a[href="../"]')).not.toBeNull();
  });

  it("labels the motion toggle by its visible state only", () => {
    expect(doc.querySelector("#motionBtn").hasAttribute("aria-pressed")).toBe(false);
  });

  it("loads only local scripts, with no inline script or style", () => {
    const scripts = [...doc.querySelectorAll("script")];
    expect(scripts.length).toBeGreaterThan(0);
    scripts.forEach((s) => expect(s.getAttribute("src")).toMatch(/^\.\//));
    expect(doc.querySelectorAll("style")).toHaveLength(0);
    expect(doc.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("offers a no-JavaScript fallback that links to the plain site", () => {
    expect(html).toMatch(/<noscript>[\s\S]*href="\.\.\/"[\s\S]*<\/noscript>/);
  });

  it("never mentions the old name anywhere on the page", () => {
    const files = fs
      .readdirSync(JOURNEY_DIR)
      .filter((f) => /\.(html|css|js)$/.test(f))
      .map((f) => fs.readFileSync(path.join(JOURNEY_DIR, f), "utf8"));
    files.forEach((text) => expect(text).not.toMatch(/chronicles/i));
  });
});

describe("vendored world map", () => {
  const readJourney = (file) => fs.readFileSync(path.join(JOURNEY_DIR, file), "utf8");
  const loadWorld = () => {
    const sandbox = {};
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(readJourney("world-shim.js"), sandbox);
    vm.runInContext(readJourney("vendor/world.js"), sandbox);
    return sandbox;
  };

  it("is the pinned jsvectormap 1.6.0 file", () => {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(JOURNEY_DIR, "vendor", "world.js"))).digest("hex");
    expect(hash).toBe(WORLD_SHA256);
  });

  it("registers every country through the shim with a measurable outline", () => {
    const world = loadWorld().__WORLD;
    const codes = Object.keys(world.paths);
    expect(codes).toHaveLength(WORLD_COUNTRY_COUNT);
    codes.forEach((code) => {
      const info = core.analysePath(world.paths[code].path);
      expect(Number.isFinite(info.area)).toBe(true);
      expect(info.area).toBeGreaterThan(0);
      expect(Number.isFinite(info.cx) && Number.isFinite(info.cy)).toBe(true);
    });
  });

  it("matches the fallback inset the page uses without it", () => {
    const inset = loadWorld().__WORLD.insets[0];
    expect(inset.width).toBe(core.DEFAULT_INSET.width);
    expect(inset.height).toBe(core.DEFAULT_INSET.height);
    expect(inset.bbox).toEqual(core.DEFAULT_INSET.bbox);
  });

  it("keeps only the world map and cannot be replaced", () => {
    const sandbox = {};
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(readJourney("world-shim.js"), sandbox);
    sandbox.jsVectorMap.addMap("usa", { paths: {} });
    expect(sandbox.__WORLD).toBeUndefined();
    expect(Object.isFrozen(sandbox.jsVectorMap)).toBe(true);
  });
});
