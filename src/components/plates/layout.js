// Lays a system design chart out on its grid. Pure: a spec in, coordinates out.
//
// A spec places each node in a cell (col, row) of a small grid and names the
// edges between nodes. This module turns that into SVG coordinates and path
// strings, so no chart carries hand-set numbers.
//
// spec = {
//   id, label, cols, rows,
//   lanes?: [{ title, from, to }],        tiers, as column ranges
//   nodes: [{ id, label, col, row, span?, kind?, tech?, accent? }],
//   edges: [{ from, to, arc?, label? }],  arc: loop over the top
// }
// A node label breaks with "\n" where a narrow cell needs two lines.
//
// One spec draws at two densities: "compact" for a narrow card (names and
// shapes only) and "full" for a wide one (the technology under each name,
// labelled edges, tier boundaries).

export const KINDS = ["service", "store", "model", "person", "external"];

export const DENSITIES = {
  compact: {
    width: 360,
    height: 224,
    padX: 16,
    gapX: 18,
    gapXDense: 18,
    gapY: 34,
    nodeHeight: 40,
    nameSize: 14,
    techSize: 0,
    noteSize: 0,
    lineHeight: 16,
    laneHead: 0,
    arcRise: 30,
  },
  full: {
    width: 640,
    height: 360,
    padX: 28,
    gapX: 72,
    gapXDense: 52,
    gapY: 46,
    nodeHeight: 52,
    nameSize: 15,
    techSize: 13,
    noteSize: 13,
    lineHeight: 17,
    laneHead: 30,
    arcRise: 36,
  },
};

/**
 * The measurements a density name stands for.
 *
 * @param {string} name "compact" or "full".
 * @returns {object} That density; the compact one for any other name, the
 *     names every object inherits (such as "toString") included.
 */
export const densityOf = (name) =>
  Object.prototype.hasOwnProperty.call(DENSITIES, name) ? DENSITIES[name] : DENSITIES.compact;

// Geist Mono's advance, in em, and the room kept each side of a label.
export const TEXT_ADVANCE = 0.6;
export const LABEL_PAD = 6;

const DENSE_COLS = 4;
const MAX_COLS = 4;
const MAX_ROWS = 3;
const ARC_FLOOR = 3;
const LANE_INSET = 6;
const NOTE_LIFT = 7;
const ELBOW_NOTE_AT = 0.3;

const round = (value) => Math.round(value * 10) / 10;

const fail = (spec, message) => {
  throw new Error(`Plate "${spec && spec.id}": ${message}`);
};

const checkSpec = (spec) => {
  if (!spec || !Array.isArray(spec.nodes) || !Array.isArray(spec.edges)) {
    fail(spec, "needs nodes and edges");
  }
  if (spec.nodes.length === 0) fail(spec, "needs at least one node");
  if (!Number.isInteger(spec.cols) || spec.cols < 1 || spec.cols > MAX_COLS) {
    fail(spec, `cols must be 1 to ${MAX_COLS}`);
  }
  if (!Number.isInteger(spec.rows) || spec.rows < 1 || spec.rows > MAX_ROWS) {
    fail(spec, `rows must be 1 to ${MAX_ROWS}`);
  }
  const ids = spec.nodes.map((node) => node.id);
  ids.forEach((id, index) => {
    if (ids.indexOf(id) !== index) fail(spec, `node "${id}" appears twice`);
  });
  spec.nodes.forEach((node) => {
    const span = node.span || 1;
    const inside =
      Number.isInteger(node.col) &&
      Number.isInteger(node.row) &&
      node.col >= 0 &&
      node.row >= 0 &&
      node.col + span <= spec.cols &&
      node.row < spec.rows;
    if (!inside) fail(spec, `node "${node.id}" is outside the grid`);
    if (node.kind && !KINDS.includes(node.kind)) fail(spec, `node "${node.id}" has an unknown kind`);
  });
  spec.edges.forEach((edge) => {
    if (!ids.includes(edge.from) || !ids.includes(edge.to)) {
      fail(spec, `edge "${edge.from}" to "${edge.to}" names a missing node`);
    }
  });
  (spec.lanes || []).forEach((lane) => {
    if (lane.from < 0 || lane.to >= spec.cols || lane.from > lane.to) {
      fail(spec, `lane "${lane.title}" is outside the grid`);
    }
  });
};

const textWidth = (text, size) => text.length * size * TEXT_ADVANCE;

// The grid for one spec at one density: where each column starts, how wide a
// cell is, and where the first row sits.
const measure = (spec, d) => {
  const gapX = spec.cols >= DENSE_COLS ? d.gapXDense : d.gapX;
  const cell = (d.width - 2 * d.padX - (spec.cols - 1) * gapX) / spec.cols;
  const head = d.laneHead > 0 && spec.lanes ? d.laneHead : 0;
  const block = spec.rows * d.nodeHeight + (spec.rows - 1) * d.gapY;
  return { gapX, cell, top: head + (d.height - head - block) / 2 };
};

// A label written on two lines is set on one where the cell is wide enough.
const nameLines = (label, width, d) => {
  const parts = String(label).split("\n");
  const joined = parts.reduce((text, part) => (text.endsWith("-") ? text + part : `${text} ${part}`));
  return textWidth(joined, d.nameSize) + 2 * LABEL_PAD <= width ? [joined] : parts;
};

const placeNodes = (spec, d, grid) =>
  spec.nodes.map((node) => {
    const span = node.span || 1;
    const w = round(grid.cell * span + grid.gapX * (span - 1));
    const lines = nameLines(node.label, w, d);
    return {
      id: node.id,
      label: node.label,
      lines,
      // The technology line shows only at full density, under a one-line name.
      tech: d.techSize > 0 && lines.length === 1 && node.tech ? node.tech : null,
      kind: node.kind || "service",
      accent: Boolean(node.accent),
      x: round(d.padX + node.col * (grid.cell + grid.gapX)),
      y: round(grid.top + node.row * (d.nodeHeight + d.gapY)),
      w,
      h: d.nodeHeight,
    };
  });

const centre = (node) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });

const line = (x1, y1, x2, y2) => ({
  d: `M${round(x1)},${round(y1)} L${round(x2)},${round(y2)}`,
  mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 },
  upright: x1 === x2,
});

const bezier = (a, b, c, d, t) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

// `at` is how far along the curve its label sits; `upright` says the curve is
// still running vertically there, so the label goes beside it.
const curve = (x1, y1, cx1, cy1, cx2, cy2, x2, y2, at = 0.5, upright = false) => ({
  d: `M${round(x1)},${round(y1)} C${round(cx1)},${round(cy1)} ${round(cx2)},${round(cy2)} ${round(x2)},${round(y2)}`,
  mid: { x: bezier(x1, cx1, cx2, x2, at), y: bezier(y1, cy1, cy2, y2, at) },
  upright,
});

// Same row: a straight run between facing sides, or an arc over the top.
const routeRow = (a, b, arc, d) => {
  const ca = centre(a);
  const cb = centre(b);
  if (arc) {
    const lift = Math.max(ARC_FLOOR, a.y - d.arcRise);
    return curve(ca.x, a.y, ca.x, lift, cb.x, lift, cb.x, b.y);
  }
  const toRight = b.x > a.x;
  return line(toRight ? a.x + a.w : a.x, ca.y, toRight ? b.x : b.x + b.w, cb.y);
};

// Different rows. Stacked nodes take a straight drop; neighbours in adjacent
// columns take an elbow (leave by the top or bottom, arrive at the facing
// side); anything further apart takes a side-to-side S-curve.
const routeAcross = (a, b, gapX) => {
  const ca = centre(a);
  const cb = centre(b);
  const down = b.y > a.y;
  const stacked = a.x < b.x + b.w && b.x < a.x + a.w;
  if (stacked) {
    const x = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2;
    return line(x, down ? a.y + a.h : a.y, x, down ? b.y : b.y + b.h);
  }
  const toRight = b.x > a.x;
  const x2 = toRight ? b.x : b.x + b.w;
  const gap = toRight ? b.x - (a.x + a.w) : a.x - (b.x + b.w);
  if (gap <= gapX + 1) {
    // An elbow's label sits early, beside its vertical leg, so two elbows
    // meeting at one node keep their labels apart.
    return curve(ca.x, down ? a.y + a.h : a.y, ca.x, cb.y, (ca.x + x2) / 2, cb.y, x2, cb.y, ELBOW_NOTE_AT, true);
  }
  const x1 = toRight ? a.x + a.w : a.x;
  const mid = (x1 + x2) / 2;
  return curve(x1, ca.y, mid, ca.y, mid, cb.y, x2, cb.y);
};

// Where an edge's label sits: above the middle of a run, beside a drop.
const placeNote = (label, route, d) => {
  if (!label || d.noteSize === 0) return null;
  return route.upright
    ? { text: label, x: round(route.mid.x + NOTE_LIFT), y: round(route.mid.y + d.noteSize / 3), anchor: "start" }
    : { text: label, x: round(route.mid.x), y: round(route.mid.y - NOTE_LIFT), anchor: "middle" };
};

const placeLanes = (spec, d, grid) => {
  if (d.laneHead === 0 || !spec.lanes) return [];
  const columnX = (col) => d.padX + col * (grid.cell + grid.gapX);
  return spec.lanes.map((lane) => {
    const x = Math.max(LANE_INSET, columnX(lane.from) - grid.gapX / 2 + LANE_INSET);
    const right = Math.min(d.width - LANE_INSET, columnX(lane.to) + grid.cell + grid.gapX / 2 - LANE_INSET);
    return { title: lane.title, x: round(x), y: LANE_INSET, w: round(right - x), h: d.height - 2 * LANE_INSET };
  });
};

/**
 * Lays a chart spec out on its grid.
 *
 * @param {object} spec The chart: id, label, cols, rows, nodes, edges and, optionally, lanes.
 * @param {("compact"|"full")} density How much the chart shows. Defaults to "compact".
 * @returns {{width: number, height: number, nodes: Array<object>, paths: Array<object>, lanes: Array<object>}}
 *     The canvas size, node boxes with their text, one path per edge and the tier boundaries.
 * @throws {Error} When the spec has no nodes, repeats an id, places a node or
 *     lane outside the grid, names an unknown kind or names a missing node in
 *     an edge.
 */
export function layoutPlate(spec, density = "compact") {
  checkSpec(spec);
  const d = densityOf(density);
  const grid = measure(spec, d);
  const nodes = placeNodes(spec, d, grid);
  const find = (id) => nodes.find((node) => node.id === id);
  const paths = spec.edges.map((edge) => {
    const a = find(edge.from);
    const b = find(edge.to);
    const route = a.y === b.y ? routeRow(a, b, Boolean(edge.arc), d) : routeAcross(a, b, grid.gapX);
    return { key: `${edge.from}-${edge.to}`, d: route.d, note: placeNote(edge.label, route, d) };
  });
  return { width: d.width, height: d.height, nodes, paths, lanes: placeLanes(spec, d, grid) };
}

/**
 * Says whether a node's name and technology line fit inside its box.
 *
 * @param {object} node A node from layoutPlate.
 * @param {("compact"|"full")} density The density it was laid out at.
 * @returns {boolean} True when the widest line leaves LABEL_PAD each side.
 */
export function labelFits(node, density = "compact") {
  const d = densityOf(density);
  const name = Math.max(...node.lines.map((text) => textWidth(text, d.nameSize)));
  const tech = node.tech ? textWidth(node.tech, d.techSize) : 0;
  return Math.max(name, tech) + 2 * LABEL_PAD <= node.w;
}
