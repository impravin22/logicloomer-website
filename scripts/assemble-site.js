// Lays out the deployable site after `react-scripts build`: the map page in
// home/ goes to the root, and the React build goes under /in-short/. The React
// app's `homepage` in package.json must end in the same sub-path (a test keeps
// the two in step).

const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const APP_SUBPATH = "in-short";
const OUTPUT_NAME = "dist";
// Files the map at the root borrows from the app build instead of keeping a copy.
const SHARED_FROM_APP = Object.freeze(["favicon.svg"]);
// File types home/ may publish. Anything else (a stray .env, a design file)
// stops the build rather than going public by accident.
const HOME_FILE_TYPES = new Set([".html", ".js", ".css", ".pdf", ".md", ".txt"]);
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
 * app sub-path or the shared files, and the output overlaps neither source.
 * @param {{homeDir: string, appBuildDir: string, outDir: string}} dirs
 */
function checkLayout({ homeDir, appBuildDir, outDir }) {
  if (!fs.existsSync(path.join(appBuildDir, "index.html"))) {
    throw new Error(`No app build in ${appBuildDir}. Run react-scripts build first.`);
  }
  if (!fs.existsSync(path.join(homeDir, "index.html"))) {
    throw new Error(`No home page at ${path.join(homeDir, "index.html")}.`);
  }
  if (fs.existsSync(path.join(homeDir, APP_SUBPATH))) {
    throw new Error(`${homeDir} must not contain ${APP_SUBPATH}/, which is where the app goes.`);
  }
  SHARED_FROM_APP.forEach((file) => {
    if (fs.existsSync(path.join(homeDir, file))) {
      throw new Error(`${homeDir} must not contain ${file}; it is copied from the app build.`);
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
 * @returns {{outDir: string, appDir: string}}
 */
function assembleSite(dirs) {
  checkLayout(dirs);
  checkContents(dirs);
  const { homeDir, appBuildDir, outDir } = dirs;
  const appDir = path.join(outDir, APP_SUBPATH);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(homeDir, outDir, { recursive: true, filter: keep });
  fs.cpSync(appBuildDir, appDir, { recursive: true, filter: keep });
  SHARED_FROM_APP.forEach((file) => fs.copyFileSync(path.join(appBuildDir, file), path.join(outDir, file)));
  return { outDir, appDir };
}

if (require.main === module) {
  const { outDir, appDir } = assembleSite({
    homeDir: path.join(REPO, "home"),
    appBuildDir: path.join(REPO, "build"),
    outDir: path.join(REPO, OUTPUT_NAME),
  });
  process.stdout.write(`Assembled ${path.relative(REPO, outDir)}/: the map at the root, the app in ${path.relative(REPO, appDir)}/\n`);
}

module.exports = Object.freeze({ assembleSite, APP_SUBPATH, SHARED_FROM_APP });
