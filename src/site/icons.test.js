// Tests for the site icon set in public/: the Route P favicon, its raster
// fallbacks, and the tags and manifest entries that point at them. The map at
// the site root borrows the same files (see scripts/assemble-site.js).
import fs from "fs";
import path from "path";
import zlib from "zlib";

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const RGB = 2;
const RGBA = 6;
const ICO_SIZES = [16, 32, 48];
const WOOD = "#241711";
const GOLD = "#F2C66D";
// Where the gold waypoint sits on the SVG's 64-unit grid.
const WAYPOINT = { x: 34, y: 36 };

const readPublic = (file) => fs.readFileSync(path.join(PUBLIC_DIR, file));
const rgba = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(255);

/** The IHDR fields these tests rely on; throws on anything that is not a PNG. */
function pngHeader(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error("not a PNG");
  if (buffer.toString("ascii", 12, 16) !== "IHDR") throw new Error("IHDR is not the first chunk");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer.readUInt8(24),
    colourType: buffer.readUInt8(25),
    interlace: buffer.readUInt8(28),
  };
}

function pngSize(buffer) {
  const { width, height } = pngHeader(buffer);
  return { width, height };
}

/** The PNG filter predictor from the byte to the left (a), above (b) and above-left (c). */
function predict(filter, a, b, c) {
  if (filter === 0) return 0;
  if (filter === 1) return a;
  if (filter === 2) return b;
  if (filter === 3) return Math.floor((a + b) / 2);
  if (filter !== 4) throw new Error(`unknown PNG filter ${filter}`);
  const p = a + b - c;
  const [pa, pb, pc] = [Math.abs(p - a), Math.abs(p - b), Math.abs(p - c)];
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/** RGBA of pixel (x, y) in an 8-bit, non-interlaced RGB or RGBA PNG. */
function pixelAt(buffer, x, y) {
  const { width, bitDepth, colourType, interlace } = pngHeader(buffer);
  if (bitDepth !== 8 || interlace !== 0 || (colourType !== RGB && colourType !== RGBA)) {
    throw new Error(`unsupported PNG: depth ${bitDepth}, colour type ${colourType}, interlace ${interlace}`);
  }
  const chunks = [];
  for (let at = 8; at < buffer.length; at += 12 + buffer.readUInt32BE(at)) {
    if (buffer.toString("ascii", at + 4, at + 8) === "IDAT") {
      chunks.push(buffer.subarray(at + 8, at + 8 + buffer.readUInt32BE(at)));
    }
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const channels = colourType === RGBA ? 4 : 3;
  const stride = width * channels;
  let above = new Uint8Array(stride);
  let row = above;
  for (let r = 0; r <= y; r += 1) {
    const start = r * (stride + 1);
    row = new Uint8Array(stride);
    for (let i = 0; i < stride; i += 1) {
      const left = i >= channels ? row[i - channels] : 0;
      const aboveLeft = i >= channels ? above[i - channels] : 0;
      row[i] = (raw[start + 1 + i] + predict(raw[start], left, above[i], aboveLeft)) & 0xff;
    }
    above = row;
  }
  const pixel = [...row.subarray(x * channels, (x + 1) * channels)];
  return colourType === RGBA ? pixel : pixel.concat(255);
}

/** Each image in an ICO file, as its declared size and its PNG payload. */
function icoImages(buffer) {
  expect(buffer.readUInt16LE(0)).toBe(0);
  expect(buffer.readUInt16LE(2)).toBe(1);
  const count = buffer.readUInt16LE(4);
  return Array.from({ length: count }, (_, i) => {
    const entry = 6 + i * 16;
    const declared = buffer.readUInt8(entry) || 256;
    const size = buffer.readUInt32LE(entry + 8);
    const offset = buffer.readUInt32LE(entry + 12);
    expect(offset + size).toBeLessThanOrEqual(buffer.length);
    return { declared, png: buffer.subarray(offset, offset + size) };
  });
}

/** The pixel under the centre of the gold waypoint in a square icon of `size`. */
const waypointPixel = (png, size) =>
  pixelAt(png, Math.floor((size * WAYPOINT.x) / 64), Math.floor((size * WAYPOINT.y) / 64));

describe("favicon.svg", () => {
  const svg = readPublic("favicon.svg").toString("utf8");
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;

  it("is a well-formed SVG on the 64-unit grid", () => {
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(root.nodeName).toBe("svg");
    expect(root.getAttribute("viewBox")).toBe("0 0 64 64");
  });

  it("draws the Route P: a wood tile, one stroked route and a gold waypoint", () => {
    expect(root.querySelector("rect").getAttribute("fill")).toBe(WOOD);
    const route = root.querySelector("path");
    expect(route.getAttribute("fill")).toBe("none");
    expect(route.getAttribute("stroke-linecap")).toBe("round");
    expect(root.querySelector("circle").getAttribute("fill")).toBe(GOLD);
  });

  it("names itself for assistive tech", () => {
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toMatch(/pravy/i);
  });

  it("contains no script, event handler or outside reference", () => {
    expect(svg).not.toMatch(/<script|<foreignObject|\son\w+=|href=|url\(/i);
  });
});

describe("raster icons", () => {
  const RASTERS = [
    ["apple-touch-icon.png", 180],
    ["logo192.png", 192],
    ["logo512.png", 512],
  ];

  it.each(RASTERS)("%s is a %i px square PNG", (file, size) => {
    expect(pngSize(readPublic(file))).toEqual({ width: size, height: size });
  });

  it.each(RASTERS)("%s is rendered from the Route P: wood tile, gold waypoint", (file, size) => {
    const png = readPublic(file);
    expect(pixelAt(png, Math.floor(size / 2), Math.floor(size * 0.05))).toEqual(rgba(WOOD));
    expect(waypointPixel(png, size)).toEqual(rgba(GOLD));
  });

  it("keeps the tile's rounded corners transparent on the manifest icons", () => {
    ["logo192.png", "logo512.png"].forEach((file) => expect(pixelAt(readPublic(file), 0, 0)[3]).toBe(0));
  });

  it("fills the apple touch icon to every edge with no alpha, since iOS rounds it itself", () => {
    const png = readPublic("apple-touch-icon.png");
    const last = 179;
    expect(pngHeader(png).colourType).toBe(RGB);
    [[0, 0], [last, 0], [0, last], [last, last]].forEach(([x, y]) => expect(pixelAt(png, x, y)).toEqual(rgba(WOOD)));
  });

  it("packs 16, 32 and 48 px PNGs of the same drawing into favicon.ico", () => {
    const images = icoImages(readPublic("favicon.ico"));
    expect(images.map((i) => i.declared)).toEqual(ICO_SIZES);
    images.forEach(({ declared, png }) => expect(pngSize(png)).toEqual({ width: declared, height: declared }));
    const largest = images[images.length - 1];
    expect(waypointPixel(largest.png, largest.declared)).toEqual(rgba(GOLD));
  });

  it("no longer ships the old 64 px PNG", () => {
    expect(fs.existsSync(path.join(PUBLIC_DIR, "favicon.png"))).toBe(false);
  });
});

describe("icon tags and manifest", () => {
  const html = readPublic("index.html").toString("utf8");
  const doc = new DOMParser().parseFromString(html, "text/html");
  const iconLinks = [...doc.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')];
  const fileOf = (href) => href.replace("%PUBLIC_URL%/", "");

  it("offers the ICO at 32 px, the SVG, and the apple touch icon", () => {
    const tags = iconLinks.map((l) => [l.getAttribute("rel"), fileOf(l.getAttribute("href")), l.getAttribute("sizes") ?? l.getAttribute("type")]);
    expect(tags).toEqual([
      ["icon", "favicon.ico", "32x32"],
      ["icon", "favicon.svg", "image/svg+xml"],
      ["apple-touch-icon", "apple-touch-icon.png", null],
    ]);
  });

  it("points every icon tag at a file that exists", () => {
    iconLinks.forEach((l) => expect(fs.existsSync(path.join(PUBLIC_DIR, fileOf(l.getAttribute("href"))))).toBe(true));
  });

  it("declares manifest icon sizes that match the files", () => {
    const manifest = JSON.parse(readPublic("manifest.json").toString("utf8"));
    manifest.icons.forEach((icon) => {
      const file = readPublic(icon.src);
      const squares = icon.src.endsWith(".ico") ? icoImages(file).map((i) => i.declared) : [pngSize(file).width];
      const actual = squares.map((s) => `${s}x${s}`).sort();
      expect(icon.sizes.split(" ").sort()).toEqual(actual);
    });
  });
});
