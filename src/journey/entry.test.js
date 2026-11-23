// Tests for how visitors enter the map page: boot.js, which runs in <head>,
// and the redirect pages left at the two addresses that have moved.
import fs from "fs";
import path from "path";
import vm from "vm";

const HOME_DIR = path.join(__dirname, "..", "..", "home");
const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");

describe("boot script", () => {
  const source = fs.readFileSync(path.join(HOME_DIR, "boot.js"), "utf8");
  const SITE = "https://impravin22.github.io/logicloomer-website/";
  const MAP_PAGE = `${SITE}map/`;
  const boot = (hash) => {
    const replace = jest.fn();
    const classes = new Set();
    const listeners = {};
    const sandbox = {
      document: { documentElement: { classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) } } },
      location: { hash, replace },
      addEventListener: (type, fn) => {
        listeners[type] = fn;
      },
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);
    return { replace, classes, listeners, sandbox };
  };

  it.each(["#work", "#about", "#contact", "#top", "#experience"])(
    "forwards the section anchor %s to the portfolio, one level up",
    (hash) => {
      const { replace, classes } = boot(hash);
      expect(replace).toHaveBeenCalledWith("../" + hash);
      expect(classes.has("armed")).toBe(false);
    }
  );

  it("stays on the map when there is no anchor", () => {
    const { replace, classes } = boot("");
    expect(replace).not.toHaveBeenCalled();
    expect(classes.has("armed")).toBe(true);
  });

  it("keeps a hostile anchor inside the fragment of a same-site path", () => {
    const { replace } = boot("#javascript:alert(1)//https://evil.example/");
    const url = new URL(replace.mock.calls[0][0], MAP_PAGE);
    expect(url.origin).toBe("https://impravin22.github.io");
    expect(url.pathname).toBe("/logicloomer-website/");
    expect(url.hash).toBe("#javascript:alert(1)//https://evil.example/");
  });

  it("swaps in the readable fallback when the map never reports ready", () => {
    const { classes, listeners } = boot("");
    listeners.load();
    expect(classes.has("failed")).toBe(true);
    expect(classes.has("armed")).toBe(false);
  });

  it("leaves a map that started alone", () => {
    const { classes, listeners, sandbox } = boot("");
    sandbox.__journeyReady = true;
    listeners.load();
    expect(classes.has("failed")).toBe(false);
  });
});

describe.each([
  ["the map's first address", "journey", "../map/", "The map has moved · Pravy Chittem"],
  ["the portfolio's earlier address", "in-short", "../", "The portfolio has moved · Pravy Chittem"],
])("old address: %s", (what, folder, target, title) => {
  const html = fs.readFileSync(path.join(PUBLIC_DIR, folder, "index.html"), "utf8");
  const doc = new DOMParser().parseFromString(html, "text/html");

  it("sends visitors on at once, with a link as backup", () => {
    expect(doc.querySelector('meta[http-equiv="refresh"]').getAttribute("content")).toBe(`0; url=${target}`);
    expect(doc.querySelector(`a[href="${target}"]`)).not.toBeNull();
  });

  it("stays out of search results and runs no code", () => {
    expect(doc.querySelector('meta[name="robots"]').getAttribute("content")).toBe("noindex");
    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp).toContain("default-src 'none'");
    expect(doc.querySelectorAll("script")).toHaveLength(0);
  });

  it("has its own title and declares British English", () => {
    expect(doc.documentElement.getAttribute("lang")).toBe("en-GB");
    expect(doc.title).toBe(title);
  });

  it("never points above the site", () => {
    // Read from the page itself, not from the table above.
    const written = doc.querySelector('meta[http-equiv="refresh"]').getAttribute("content").replace(/^0; url=/, "");
    const landing = new URL(written, `https://impravin22.github.io/logicloomer-website/${folder}/`);
    expect(written.startsWith("../../")).toBe(false);
    expect(landing.origin).toBe("https://impravin22.github.io");
    expect(landing.pathname).toMatch(/^\/logicloomer-website\//);
  });
});
