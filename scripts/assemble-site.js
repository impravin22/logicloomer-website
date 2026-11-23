// Lays out the deployable site after `react-scripts build`: the React build
// (the portfolio) goes to the root, and the map page in home/ goes under
// /map/. The React app's `homepage` in package.json must be the site root (a
// test keeps the two in step).

const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const MAP_SUBPATH = "map";
const OUTPUT_NAME = "dist";
// Files the map borrows from the app build instead of keeping a copy.
const SHARED_FROM_APP = Object.freeze(["favicon.svg", "favicon.ico", "apple-touch-icon.png"]);
// File types home/ may publish. Anything else (a stray .env, a design file, a
// PDF: the CV is published from public/) stops the build rather than going
// public by accident.
const HOME_FILE_TYPES = new Set([".html", ".js", ".css", ".md", ".txt"]);
const IGNORED_NAMES = new Set([".DS_Store"]);

const keep = (source) => !IGNORED_NAMES.has(path.basename(source));

/** True when `inner` is `outer` or sits anywhere inside it. */
function isWithin(outer, inner) {
  const relative = path.relative(outer, inner);
  const outside = relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  return !outside;
}

/** Every entry under `dir`, folder metadata left out. */
function listTree(dir) {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => !IGNORED_NAMES.has(entry.name))
    .map((entry) => ({ entry, file: path.join(entry.parentPath, entry.name) }));
}

/**
 * Checks the folders themselves: both sources exist, nothing collides with the
 * map's sub-path or the shared files, and the output overlaps neither source.
 * @param {{homeDir: string, appBuildDir: string, outDir: string}} dirs
 */
function checkLayout({ homeDir, appBuildDir, outDir }) {
  if (!fs.existsSync(path.join(appBuildDir, "index.html"))) {
    throw new Error(`No app build in ${appBuildDir}. Run react-scripts build first.`);
  }
  if (!fs.existsSync(path.join(homeDir, "index.html"))) {
    throw new Error(`No map page at ${path.join(homeDir, "index.html")}.`);
  }
  if (fs.existsSync(path.join(appBuildDir, MAP_SUBPATH))) {
    throw new Error(`${appBuildDir} must not contain ${MAP_SUBPATH}/, which is where the map goes.`);
  }
  SHARED_FROM_APP.forEach((file) => {
    if (fs.existsSync(path.join(homeDir, file))) {
      throw new Error(`${homeDir} must not contain ${file}; it is copied from the app build.`);
    }
    if (!fs.existsSync(path.join(appBuildDir, file))) {
      throw new Error(`No ${file} in ${appBuildDir}; the map borrows it from the app build.`);
    }
  });
  if (path.basename(outDir) !== OUTPUT_NAME) {
    throw new Error(`The output folder must be named ${OUTPUT_NAME}, not ${path.basename(outDir)}.`);
  }
  [homeDir, appBuildDir].forEach((source) => {
    if (isWithin(outDir, source) || isWithin(source, outDir)) {
      throw new Error(`The output folder ${outDir} overlaps the source ${source}.`);
    }
  });
}

/**
 * Checks what would be published. gh-pages follows links when it copies, so a
 * link could publish a file from anywhere on this machine; refuse them all.
 * @param {{homeDir: string, appBuildDir: string}} dirs
 */
function checkContents({ homeDir, appBuildDir }) {
  [homeDir, appBuildDir].forEach((dir) =>
    listTree(dir).forEach(({ entry, file }) => {
      if (entry.isSymbolicLink()) throw new Error(`Refusing to publish the link ${file}.`);
    })
  );
  listTree(homeDir).forEach(({ entry, file }) => {
    if (entry.isFile() && !HOME_FILE_TYPES.has(path.extname(entry.name).toLowerCase())) {
      throw new Error(`Refusing to publish ${file}: not a site file type.`);
    }
  });
}

/**
 * Replaces `outDir` with the assembled site. Every check runs before anything
 * is deleted, so a bad call never leaves a half-built or emptied folder.
 * @param {{homeDir: string, appBuildDir: string, outDir: string}} dirs
 * @returns {{outDir: string, mapDir: string}}
 */
function assembleSite(dirs) {
  checkLayout(dirs);
  checkContents(dirs);
  const { homeDir, appBuildDir, outDir } = dirs;
  const mapDir = path.join(outDir, MAP_SUBPATH);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(appBuildDir, outDir, { recursive: true, filter: keep });
  fs.cpSync(homeDir, mapDir, { recursive: true, filter: keep });
  SHARED_FROM_APP.forEach((file) => fs.copyFileSync(path.join(appBuildDir, file), path.join(mapDir, file)));
  return { outDir, mapDir };
}

if (require.main === module) {
  const { outDir, mapDir } = assembleSite({
    homeDir: path.join(REPO, "home"),
    appBuildDir: path.join(REPO, "build"),
    outDir: path.join(REPO, OUTPUT_NAME),
  });
  process.stdout.write(`Assembled ${path.relative(REPO, outDir)}/: the portfolio at the root, the map in ${path.relative(REPO, mapDir)}/\n`);
}

module.exports = Object.freeze({ assembleSite, MAP_SUBPATH, SHARED_FROM_APP });
