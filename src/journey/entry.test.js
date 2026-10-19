// Tests for how visitors enter the map page: boot.js, which runs in <head>,
// and the stub left at the map's first address, home/journey/.
import fs from "fs";
import path from "path";
import vm from "vm";

const HOME_DIR = path.join(__dirname, "..", "..", "home");

describe("boot script", () => {
  const source = fs.readFileSync(path.join(HOME_DIR, "boot.js"), "utf8");
  const SITE = "https://impravin22.github.io/logicloomer-website/";
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
    "forwards the old home-page anchor %s to the short version",
    (hash) => {
      const { replace, classes } = boot(hash);
      expect(replace).toHaveBeenCalledWith("./in-short/" + hash);
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
    const url = new URL(replace.mock.calls[0][0], SITE);
    expect(url.origin).toBe("https://impravin22.github.io");
    expect(url.pathname).toBe("/logicloomer-website/in-short/");
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

describe("old map address", () => {
  const html = fs.readFileSync(path.join(HOME_DIR, "journey", "index.html"), "utf8");
  const doc = new DOMParser().parseFromString(html, "text/html");

  it("sends visitors from /journey/ to the home page at once, with a link as backup", () => {
    expect(doc.querySelector('meta[http-equiv="refresh"]').getAttribute("content")).toBe("0; url=../");
    expect(doc.querySelector('a[href="../"]')).not.toBeNull();
  });

  it("stays out of search results and runs no code", () => {
    expect(doc.querySelector('meta[name="robots"]').getAttribute("content")).toBe("noindex");
    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp).toContain("default-src 'none'");
    expect(doc.querySelectorAll("script")).toHaveLength(0);
  });

  it("has its own title and declares British English", () => {
    expect(doc.documentElement.getAttribute("lang")).toBe("en-GB");
    expect(doc.title).toBe("The map has moved · Pravy Chittem");
  });
});
