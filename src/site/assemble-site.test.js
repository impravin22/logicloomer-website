// Tests for scripts/assemble-site.js, which lays out the deployable site: the
// map from home/ at the root, and the React build under /in-short/.
import fs from "fs";
import os from "os";
import path from "path";

const { assembleSite, APP_SUBPATH, SHARED_FROM_APP } = require("../../scripts/assemble-site.js");

const REPO = path.join(__dirname, "..", "..");
const CV = "Praveen_Chittem_CV_2026.pdf";

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
  write(path.join(dirs.homeDir, "journey", "index.html"), "moved");
  write(path.join(dirs.homeDir, CV), "%PDF-");
  write(path.join(dirs.appBuildDir, "index.html"), "app");
  write(path.join(dirs.appBuildDir, "static", "js", "main.js"), "bundle");
  write(path.join(dirs.appBuildDir, "favicon.svg"), "<svg/>");
  return dirs;
};

describe("assembleSite", () => {
  it("puts the map at the root and the app under the sub-path", () => {
    const dirs = fixture();
    assembleSite(dirs);
    expect(read(dirs.outDir, "index.html")).toBe("map");
    expect(read(dirs.outDir, APP_SUBPATH, "index.html")).toBe("app");
    expect(read(dirs.outDir, APP_SUBPATH, "static", "js", "main.js")).toBe("bundle");
  });

  it("publishes the CV and the old map address from the root", () => {
    const dirs = fixture();
    assembleSite(dirs);
    expect(read(dirs.outDir, CV)).toBe("%PDF-");
    expect(read(dirs.outDir, "journey", "index.html")).toBe("moved");
  });

  it("copies the shared app files to the root for the map", () => {
    const dirs = fixture();
    assembleSite(dirs);
    SHARED_FROM_APP.forEach((file) => expect(read(dirs.outDir, file)).toBe(read(dirs.appBuildDir, file)));
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
    expect(exists(dirs.outDir, "vendor", ".DS_Store")).toBe(false);
    expect(exists(dirs.outDir, APP_SUBPATH, ".DS_Store")).toBe(false);
  });

  it("refuses to run without an app build", () => {
    const dirs = fixture();
    fs.rmSync(dirs.appBuildDir, { recursive: true });
    expect(() => assembleSite(dirs)).toThrow(/react-scripts build/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("refuses to run without a home page", () => {
    const dirs = fixture();
    fs.rmSync(path.join(dirs.homeDir, "index.html"));
    expect(() => assembleSite(dirs)).toThrow(/home page/);
  });

  it("refuses a home folder that would collide with the app sub-path", () => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, APP_SUBPATH, "index.html"));
    expect(() => assembleSite(dirs)).toThrow(new RegExp(APP_SUBPATH));
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("refuses a home file that a shared app file would overwrite", () => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, SHARED_FROM_APP[0]));
    expect(() => assembleSite(dirs)).toThrow(new RegExp(SHARED_FROM_APP[0]));
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
    write(path.join(dirs.appBuildDir, "favicon.svg"), "<svg/>");
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

  it.each([".env", "design.psd", "notes.docx"])("refuses %s in the home folder", (name) => {
    const dirs = fixture();
    write(path.join(dirs.homeDir, name));
    expect(() => assembleSite(dirs)).toThrow(/not a site file type/);
    expect(exists(dirs.outDir)).toBe(false);
  });

  it("accepts every file in the real home folder", () => {
    const dirs = { ...fixture(), homeDir: path.join(REPO, "home") };
    expect(() => assembleSite(dirs)).not.toThrow();
    expect(exists(dirs.outDir, "vendor", "world.js")).toBe(true);
  });
});

describe("site layout in the repo", () => {
  const pkg = JSON.parse(read(REPO, "package.json"));
  const pdfsIn = (dir) => fs.readdirSync(path.join(REPO, dir)).filter((f) => /\.pdf$/i.test(f));

  it("builds the app for the same sub-path the assembler uses", () => {
    expect(pkg.homepage).toBe(`https://impravin22.github.io/logicloomer-website/${APP_SUBPATH}`);
  });

  it("assembles after the app build and deploys the assembled folder", () => {
    expect(pkg.scripts.build).toBe("react-scripts build && node scripts/assemble-site.js");
    expect(pkg.scripts.deploy).toBe("gh-pages -d dist");
  });

  it("keeps exactly one CV in the repo, published from the root", () => {
    expect(pdfsIn("home")).toEqual([CV]);
    expect(pdfsIn("public")).toEqual([]);
    expect(pdfsIn(".")).toEqual([]);
    expect(fs.readFileSync(path.join(REPO, "home", CV)).subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("keeps the assembled folder out of git", () => {
    expect(read(REPO, ".gitignore")).toMatch(/^\/dist$/m);
  });
});
