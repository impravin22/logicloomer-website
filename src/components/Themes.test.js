import fs from "fs";
import path from "path";
import theme from "./Themes";

// The theme is the one place a colour is named. These tests pin that every key
// the components read is defined, that each surface re-maps the full set of
// colour keys, that the pairs the page draws meet WCAG 2.1 AA, and that no
// component names a colour of its own.

const COMPONENTS_DIR = __dirname;
const GLOBAL_STYLES = path.join(__dirname, "..", "globalStyles.js");
const VENDOR_DIR = "vendor";
const SOURCE_FILE = /\.jsx?$/;
const TEST_FILE = /\.test\.jsx?$/;

// Every .js/.jsx file under a folder, leaving out the vendor folder and tests.
const listSourceFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === VENDOR_DIR ? [] : listSourceFiles(full);
    return SOURCE_FILE.test(entry.name) && !TEST_FILE.test(entry.name) ? [full] : [];
  });

const relative = (file) => path.relative(COMPONENTS_DIR, file);
const readSource = (file) => fs.readFileSync(file, "utf8");

// The component sources that read the theme: every component file and the
// global sheet, but not the theme itself.
const THEME_READERS = [
  ...listSourceFiles(COMPONENTS_DIR).filter((file) => path.basename(file) !== "Themes.js"),
  GLOBAL_STYLES,
];

// ---------------------------------------------------------------------------
// WCAG 2.1 relative luminance and contrast ratio.
// ---------------------------------------------------------------------------
const HEX_COLOUR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const LINEAR_THRESHOLD = 0.03928;
const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

const linearChannel = (byte) => {
  const value = byte / 255;
  return value <= LINEAR_THRESHOLD ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex) => {
  const match = HEX_COLOUR.exec(hex);
  if (!match) throw new Error(`Not a six-digit hex colour: ${hex}`);
  const [red, green, blue] = match.slice(1).map((pair) => linearChannel(parseInt(pair, 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

/**
 * The WCAG 2.1 contrast ratio between two six-digit hex colours, from 1 to 21.
 *
 * @param {string} hexA A colour such as "#09090B".
 * @param {string} hexB The other colour.
 * @returns {number}
 */
const contrastRatio = (hexA, hexB) => {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

// A surface is drawn the way PlateSurface composes it: the page's theme with
// the surface's keys laid over it.
const SURFACE_NAMES = ["well", "field"];
const onSurface = (name) => ({ ...theme, ...theme.surfaces[name] });

// ---------------------------------------------------------------------------
// The keys the components read, collected by reading them.
// ---------------------------------------------------------------------------
const COLOUR_KEYS = [
  "paper",
  "ink",
  "stone",
  "stone2",
  "pine",
  "pineDeep",
  "onPine",
  "hair",
  "card",
  "focus",
  "mark",
  "accent",
  "accentSoft",
  "rim",
];
const SURFACE_KEYS = ["paper", "ink", "stone", "stone2", "pine", "pineDeep", "onPine", "hair", "card", "focus"];
const TYPE_ROLES = ["display", "displayS", "section", "statement", "title", "lead", "body", "small", "label", "code"];
const TYPE_ROLE_FIELDS = ["size", "line", "track", "weight", "width"];
const GROUPS = {
  space: ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
  layout: ["container", "gutter", "gap", "nav", "control", "controlPlate", "primary"],
  bp: ["grid2", "stage", "hero", "chart"],
  dur: ["micro", "short"],
  gap: ["s", "m", "l"],
};
const SCALAR_KEYS = ["grot", "body", "mono", "ease", "radius", "radiusPlate", "pill"];

// `theme.a.b` and `theme.space["2xl"]`, as written in a styled template or a hook.
const THEME_PATH = /\btheme((?:\.[A-Za-z_$][\w$]*|\["[^"\]]+"\])+)/g;
const PATH_STEP = /\.([A-Za-z_$][\w$]*)|\["([^"\]]+)"\]/g;

const themePathsIn = (source) =>
  [...source.matchAll(THEME_PATH)].map((match) =>
    [...match[1].matchAll(PATH_STEP)].map((step) => step[1] ?? step[2])
  );

const resolves = (keys) =>
  keys.reduce((value, key) => (value != null && typeof value === "object" ? value[key] : undefined), theme) !==
  undefined;

const namedIn = (pattern) =>
  [...new Set(THEME_READERS.flatMap((file) => [...readSource(file).matchAll(pattern)].map((match) => match[1])))];

describe("contrastRatio", () => {
  it("gives 21 for black on white and 1 for a colour on itself", () => {
    // Arrange
    const black = "#000000";
    const white = "#FFFFFF";

    // Act
    const extreme = contrastRatio(black, white);
    const same = contrastRatio(white, white);

    // Assert
    expect(extreme).toBeCloseTo(21, 5);
    expect(same).toBeCloseTo(1, 5);
  });

  it("gives the same ratio whichever colour comes first", () => {
    // Arrange
    const ground = theme.paper;
    const type = theme.ink;

    // Act
    const forward = contrastRatio(type, ground);
    const backward = contrastRatio(ground, type);

    // Assert
    expect(forward).toBeCloseTo(backward, 10);
  });

  it("refuses a value that is not a six-digit hex colour", () => {
    // Arrange
    const malformed = ["#FFF", "red", "#GGGGGG", "", undefined];

    // Act and Assert
    malformed.forEach((value) => expect(() => contrastRatio(value, "#000000")).toThrow(/six-digit hex/));
  });
});

describe("Theme keys", () => {
  it.each(COLOUR_KEYS)("defines the colour key %s as a six-digit hex value", (key) => {
    // Arrange
    const value = theme[key];

    // Act
    const isHex = HEX_COLOUR.test(String(value));

    // Assert
    expect(isHex).toBe(true);
  });

  it.each(TYPE_ROLES)("defines the type role %s with size, leading, tracking, weight and width", (name) => {
    // Arrange
    const typeRole = theme.type[name];

    // Act
    const missing = TYPE_ROLE_FIELDS.filter((field) => typeRole?.[field] === undefined);

    // Assert
    expect(missing).toEqual([]);
  });

  it.each(Object.entries(GROUPS))("defines every %s step the components read", (group, keys) => {
    // Arrange
    const values = theme[group];

    // Act
    const missing = keys.filter((key) => values?.[key] === undefined);

    // Assert
    expect(missing).toEqual([]);
  });

  it.each(SCALAR_KEYS)("defines the shared value %s", (key) => {
    // Arrange
    const value = theme[key];

    // Act
    const isSet = typeof value === "string" && value.length > 0;

    // Assert
    expect(isSet).toBe(true);
  });

  it("reads dotted and bracketed theme paths from source and tells a defined one from a missing one", () => {
    // Arrange
    const source = 'color: (p) => p.theme.stone; gap: (p) => p.theme.space["2xl"]; x: (p) => p.theme.nope.deeper;';

    // Act
    const found = themePathsIn(source);

    // Assert
    expect(found).toEqual([["stone"], ["space", "2xl"], ["nope", "deeper"]]);
    expect(found.map(resolves)).toEqual([true, true, false]);
  });

  it("resolves every theme path written in a component or the global sheet", () => {
    // Arrange
    const used = THEME_READERS.flatMap((file) =>
      themePathsIn(readSource(file)).map((keys) => ({ file: relative(file), keys }))
    );

    // Act
    const unresolved = used
      .filter(({ keys }) => !resolves(keys))
      .map(({ file, keys }) => `${file}: theme.${keys.join(".")}`);

    // Assert: the scan found the components' reads, and every one is defined
    expect(used.length).toBeGreaterThan(100);
    expect(unresolved).toEqual([]);
  });

  it("defines every type role a component names through role()", () => {
    // Arrange
    const named = namedIn(/\brole\("([A-Za-z]+)"\)/g);

    // Act
    const missing = named.filter((name) => theme.type[name] === undefined);

    // Assert
    expect(named.length).toBeGreaterThan(5);
    expect(missing).toEqual([]);
  });

  it("defines every section gap a Block asks for, and the default step", () => {
    // Arrange
    const named = [...namedIn(/\$gap="([a-z]+)"/g), "m"];

    // Act
    const missing = named.filter((step) => theme.gap[step] === undefined);

    // Assert
    expect(missing).toEqual([]);
  });

  it("defines every surface a component draws on", () => {
    // Arrange
    const named = [...namedIn(/\btone="([a-z]+)"/g), "well"];

    // Act
    const missing = named.filter((name) => theme.surfaces[name] === undefined);

    // Assert
    expect(missing).toEqual([]);
  });
});

describe("Surfaces", () => {
  it.each(SURFACE_NAMES)("the %s surface re-maps every colour key a surface carries", (name) => {
    // Arrange
    const surface = theme.surfaces[name];

    // Act
    const missing = SURFACE_KEYS.filter((key) => !HEX_COLOUR.test(String(surface[key])));

    // Assert
    expect(missing).toEqual([]);
  });
});

describe("WCAG 2.1 AA contrast", () => {
  const TEXT_KEYS = ["ink", "stone", "stone2"];

  it.each(TEXT_KEYS)("sets %s text on the page ground at 4.5:1 or more", (key) => {
    // Arrange
    const pair = [theme[key], theme.paper];

    // Act
    const ratio = contrastRatio(...pair);

    // Assert
    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(SURFACE_NAMES.flatMap((name) => TEXT_KEYS.map((key) => [key, name])))(
    "sets %s text on the %s surface at 4.5:1 or more",
    (key, name) => {
      // Arrange
      const surface = onSurface(name);

      // Act
      const ratio = contrastRatio(surface[key], surface.paper);

      // Assert
      expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
    }
  );

  it("sets the label of the filled button (onPine on accent) at 4.5:1 or more", () => {
    // Arrange
    const pair = [theme.onPine, theme.accent];

    // Act
    const ratio = contrastRatio(...pair);

    // Assert
    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(SURFACE_NAMES)("sets text on the lit node (onPine on pine) of the %s surface at 4.5:1 or more", (name) => {
    // Arrange
    const surface = onSurface(name);

    // Act
    const ratio = contrastRatio(surface.onPine, surface.pine);

    // Assert
    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(SURFACE_NAMES)("draws hairlines on the %s surface at 3:1 or more against its ground", (name) => {
    // Arrange
    const surface = onSurface(name);

    // Act
    const ratio = contrastRatio(surface.hair, surface.paper);

    // Assert
    expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });

  it("draws a control's rim on a card at 3:1 or more", () => {
    // Arrange
    const pair = [theme.rim, theme.card];

    // Act
    const ratio = contrastRatio(...pair);

    // Assert
    expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });

  it.each([["page", theme], ...SURFACE_NAMES.map((name) => [`${name} surface`, onSurface(name)])])(
    "draws the focus ring on the %s ground at 3:1 or more",
    (where, palette) => {
      // Arrange
      const pair = [palette.focus, palette.paper];

      // Act
      const ratio = contrastRatio(...pair);

      // Assert
      expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
  );
});

describe("Colours live in one place", () => {
  const COLOUR_LITERALS = [
    { name: "hex colour", pattern: /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi },
    { name: "rgb()", pattern: /\brgba?\(/gi },
    { name: "hsl()", pattern: /\bhsla?\(/gi },
  ];

  const findColourLiterals = (source) =>
    source.split("\n").flatMap((text, index) =>
      COLOUR_LITERALS.filter(({ pattern }) => new RegExp(pattern.source, pattern.flags).test(text)).map(
        ({ name }) => `line ${index + 1}: ${name}`
      )
    );

  it("recognises each kind of colour literal and leaves anchors and ids alone", () => {
    // Arrange
    const literals = ["color: #fff;", "fill: #C6F53D;", "background: rgb(0, 0, 0);", "color: rgba(0,0,0,.5);", "hsl(90 50% 50%)"];
    const harmless = ['href="#top"', 'href="#about"', 'href="#contact"', "url(#plate-head-autofix)", "#note-auto-fix"];

    // Act
    const flagged = literals.map(findColourLiterals);
    const passed = harmless.flatMap(findColourLiterals);

    // Assert
    flagged.forEach((found) => expect(found).toHaveLength(1));
    expect(passed).toEqual([]);
  });

  it("finds no hex, rgb() or hsl() colour in any component outside the theme", () => {
    // Arrange
    const files = THEME_READERS;

    // Act
    const offenders = files.flatMap((file) =>
      findColourLiterals(readSource(file)).map((where) => `${relative(file)} ${where}`)
    );

    // Assert: the scan covered the redesigned components, and none names a colour
    expect(files.map((file) => path.basename(file))).toEqual(
      expect.arrayContaining(["Hero.js", "Projects.js", "Plate.js", "ProjectCard.js", "Contact.js", "globalStyles.js"])
    );
    expect(files.some((file) => file.includes(`${path.sep}${VENDOR_DIR}${path.sep}`))).toBe(false);
    expect(offenders).toEqual([]);
  });
});
