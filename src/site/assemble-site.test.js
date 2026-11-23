// Tests for scripts/assemble-site.js, which lays out the deployable site: the
// React build (the portfolio) at the root, and the map from home/ under /map/.
import fs from "fs";
import os from "os";
import path from "path";

const { assembleSite, MAP_SUBPATH, SHARED_FROM_APP } = require("../../scripts/assemble-site.js");

const REPO = path.join(__dirname, "..", "..");
const CV = "Pravy_CV.pdf";
// Addresses that have moved; each keeps a redirect page, published from public/.
const OLD_ADDRESSES = ["journey", "in-short"];

const write = (file, text = "x") => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
const read = (...parts) => fs.readFileSync(path.join(...parts), "utf8");
const exists = (...parts) => fs.existsSync(path.join(...parts));

let tmp;
beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "assemble-site-"));
});
afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

// A minimal home folder and app build, shaped like the real ones.
const fixture = () => {
  const dirs = {
    homeDir: path.join(tmp, "home"),
    appBuildDir: path.join(tmp, "build"),
    outDir: path.join(tmp, "dist"),
  };
  write(path.join(dirs.homeDir, "index.html"), "map");
  write(path.join(dirs.homeDir, "vendor", "world.js"), "world");
  write(path.join(dirs.appBuildDir, "index.html"), "app");
  write(path.join(dirs.appBuildDir, "static", "js", "main.js"), "bundle");
  write(path.join(dirs.appBuildDir, CV), "%PDF-");
  OLD_ADDRESSES.forEach((name) => write(path.join(dirs.appBuildDir, name, "index.html"), `moved from ${name}`));
  SHARED_FROM_APP.forEach((file) => write(path.join(dirs.appBuildDir, file), `shared ${file}`));
  return dirs;
};

describe("assembleSite", () => {
  it("puts the portfolio at the root and the map under its sub-path", () => {
    const dirs = fixture();
    assembleSite(dirs);
    expect(read(dirs.outDir, "index.html")).toBe("app");
    expect(read(dirs.outDir, "static", "js", "main.js")).toBe("bundle");
    expect(read(dirs.outDir, MAP_SUBPATH, "index.html")).toBe("map");
    expect(read(dirs.outDir, MAP_SUBPATH, "vendor", "world.js")).toBe("world");
  });

  it("publishes the CV and both old addresses from the root", () => {
    const dirs = fixture();
    assembleSite(dirs);
    expect(read(dirs.outDir, CV)).toBe("%PDF-");
    OLD_ADDRESSES.forEach((name) => expect(read(dirs.outDir, name, "index.html")).toBe(`moved from ${name}`));
  });

  it("copies the shared app files beside the map", () => {
    const dirs = fixture();
    assembleSite(dirs);
    SHARED_FROM_APP.forEach((file) => expect(read(dirs.outDir, MAP_SUBPATH, file)).toBe(read(dirs.appBuildDir, file)));
  });

  it("says where each part went", () => {
    const dirs = fixture();
    expect(assembleSite(dirs)).toEqual({ outDir: dirs.outDir, mapDir: path.join(dirs.outDir, MAP_SUBPATH) });
  });

  it("clears the previous output before assembling", () => {
    const dirs = fixture();
    write(path.join(dirs.outDir, "stale.pdf"));
    assembleSite(dirs);
    expect(exists(dirs.outDir, "stale.pdf")).toBe(false);
  });

  it("leaves macOS folder metadata out of the site", () => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, ".DS_Store"));
    write(path.join(dirs.homeDir, "vendor", ".DS_Store"));
    write(path.join(dirs.appBuildDir, ".DS_Store"));
    assembleSite(dirs);
    expect(exists(dirs.outDir, ".DS_Store")).toBe(false);
    expect(exists(dirs.outDir, MAP_SUBPATH, ".DS_Store")).toBe(false);
    expect(exists(dirs.outDir, MAP_SUBPATH, "vendor", ".DS_Store")).toBe(false);
  });

  it("refuses to run without an app build", () => {
    const dirs = fixture();
    fs.rmSync(dirs.appBuildDir, { recursive: true });
    expect(() => assembleSite(dirs)).toThrow(/react-scripts build/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("refuses to run without the map page", () => {
    const dirs = fixture();
    fs.rmSync(path.join(dirs.homeDir, "index.html"));
    expect(() => assembleSite(dirs)).toThrow(/No map page/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("refuses an app build that would collide with the map's sub-path", () => {
    const dirs = fixture();
    write(path.join(dirs.appBuildDir, MAP_SUBPATH, "index.html"));
    expect(() => assembleSite(dirs)).toThrow(`must not contain ${MAP_SUBPATH}/`);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it.each(SHARED_FROM_APP)("refuses a home %s that the shared app file would overwrite", (file) => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, file));
    expect(() => assembleSite(dirs)).toThrow(`must not contain ${file}`);
  });

  it.each(SHARED_FROM_APP)("stops before deleting anything when the app build lacks %s", (file) => {
    const dirs = fixture();
    write(path.join(dirs.outDir, "previous.txt"), "kept");
    fs.rmSync(path.join(dirs.appBuildDir, file));
    expect(() => assembleSite(dirs)).toThrow(`No ${file} in`);
    expect(read(dirs.outDir, "previous.txt")).toBe("kept");
  });

  it.each([
    ["is the home folder", (d) => d.homeDir],
    ["holds the home folder", (d) => path.dirname(d.homeDir)],
    ["is the app build", (d) => d.appBuildDir],
    ["sits inside the home folder", (d) => path.join(d.homeDir, "dist")],
    ["sits inside the home folder under a name starting with two dots", (d) => path.join(d.homeDir, "..x", "dist")],
    ["is not named dist", (d) => path.join(tmp, "out")],
  ])("refuses an output folder that %s, so it never deletes its own sources", (_, pickOut) => {
    const dirs = fixture();
    expect(() => assembleSite({ ...dirs, outDir: pickOut(dirs) })).toThrow(/output folder/);
    expect(read(dirs.homeDir, "index.html")).toBe("map");
    expect(read(dirs.appBuildDir, "index.html")).toBe("app");
  });
});

describe("assembleSite refuses what should never be published", () => {
  it("refuses sources inside the output under a name starting with two dots", () => {
    const outDir = path.join(tmp, "dist");
    const dirs = { homeDir: path.join(outDir, "..keep", "home"), appBuildDir: path.join(outDir, "..keep", "build"), outDir };
    write(path.join(dirs.homeDir, "index.html"), "map");
    write(path.join(dirs.appBuildDir, "index.html"), "app");
    SHARED_FROM_APP.forEach((file) => write(path.join(dirs.appBuildDir, file)));
    expect(() => assembleSite(dirs)).toThrow(/overlaps/);
    expect(read(dirs.homeDir, "index.html")).toBe("map");
  });

  it("refuses a link in the home folder, which gh-pages would follow", () => {
    const dirs = fixture();
    write(path.join(tmp, "secret", "id_rsa"), "SECRET");
    fs.symlinkSync(path.join(tmp, "secret", "id_rsa"), path.join(dirs.homeDir, "key.txt"));
    expect(() => assembleSite(dirs)).toThrow(/Refusing to publish the link/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("refuses a linked folder in the app build", () => {
    const dirs = fixture();
    write(path.join(tmp, "secret", "id_rsa"), "SECRET");
    fs.symlinkSync(path.join(tmp, "secret"), path.join(dirs.appBuildDir, "static", "linked"));
    expect(() => assembleSite(dirs)).toThrow(/Refusing to publish the link/);
  });

  it.each([".env", "design.psd", "notes.docx", "old-cv.pdf"])("refuses %s in the home folder", (name) => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, name));
    expect(() => assembleSite(dirs)).toThrow(/not a site file type/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("accepts every file in the real home folder", () => {
    const dirs = { ...fixture(), homeDir: path.join(REPO, "home") };
    expect(() => assembleSite(dirs)).not.toThrow();
    expect(exists(dirs.outDir, MAP_SUBPATH, "vendor", "world.js")).toBe(true);
  });
});

describe("site layout in the repo", () => {
  const pkg = JSON.parse(read(REPO, "package.json"));
  const pdfsIn = (dir) => fs.readdirSync(path.join(REPO, dir)).filter((f) => /\.pdf$/i.test(f));

  it("builds the app for the site root, where the assembler puts it", () => {
    expect(pkg.homepage).toBe("https://impravin22.github.io/logicloomer-website");
    expect(MAP_SUBPATH).toBe("map");
  });

  it("assembles after the app build and deploys the assembled folder", () => {
    expect(pkg.scripts.build).toBe("react-scripts build && node scripts/assemble-site.js");
    expect(pkg.scripts.deploy).toBe("gh-pages -d dist");
  });

  it("keeps exactly one CV in the repo, published from the root", () => {
    expect(pdfsIn("public")).toEqual([CV]);
    expect(pdfsIn("home")).toEqual([]);
    expect(pdfsIn(".")).toEqual([]);
    expect(fs.readFileSync(path.join(REPO, "public", CV)).subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it.each(OLD_ADDRESSES)("keeps a redirect page for the old address %s, published from the root", (name) => {
    expect(exists(REPO, "public", name, "index.html")).toBe(true);
    expect(exists(REPO, "home", name)).toBe(false);
  });

  it("keeps the map's sub-path free in public/, so nothing collides with the map", () => {
    expect(exists(REPO, "public", MAP_SUBPATH)).toBe(false);
  });

  it("keeps the assembled folder out of git", () => {
    expect(read(REPO, ".gitignore")).toMatch(/^\/dist$/m);
  });
});
