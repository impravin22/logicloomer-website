import { layoutPlate, KINDS, DENSITIES, densityOf, labelFits } from "./layout";
import { PLATES } from "./specs";

// layoutPlate is pure: a spec in, coordinates out. These tests pin the
// geometry every chart relies on at both densities, the refusals for a broken
// spec, and the fall-back for a density it does not know.

const DENSITY_NAMES = Object.keys(DENSITIES);
const CHART_CASES = Object.values(PLATES).flatMap((spec) => DENSITY_NAMES.map((density) => [spec.id, density]));
const NUMBER = /-?\d+(?:\.\d+)?|NaN|Infinity/g;
const DRAWABLE_PATH = /^M-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)? (?:L|C)/;

const clone = (value) => JSON.parse(JSON.stringify(value));

const deepFreeze = (value) => {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const insideCanvas = (x, y, drawn) => x >= 0 && y >= 0 && x <= drawn.width && y <= drawn.height;

// A small valid chart to break one way at a time.
const baseSpec = () => ({
  id: "probe",
  label: "A probe chart",
  cols: 3,
  rows: 2,
  nodes: [
    { id: "a", label: "Alpha", col: 0, row: 0 },
    { id: "b", label: "Beta", col: 1, row: 0, tech: "a tech line" },
    { id: "c", label: "Gamma", col: 2, row: 1, accent: true },
  ],
  edges: [
    { from: "a", to: "b", label: "first" },
    { from: "b", to: "c" },
  ],
});

describe("layoutPlate on every chart", () => {
  it("has charts and densities to check", () => {
    // Arrange
    const charts = Object.keys(PLATES);

    // Act
    const cases = CHART_CASES.length;

    // Assert
    expect(charts).toHaveLength(20);
    expect(DENSITY_NAMES).toEqual(["compact", "full"]);
    expect(cases).toBe(40);
  });

  it.each(CHART_CASES)("keeps every node of %s inside its %s canvas", (id, density) => {
    // Arrange
    const spec = PLATES[id];

    // Act
    const drawn = layoutPlate(spec, density);
    const outside = drawn.nodes
      .filter((node) => node.x < 0 || node.y < 0 || node.x + node.w > drawn.width || node.y + node.h > drawn.height)
      .map((node) => node.id);

    // Assert
    expect(drawn.width).toBe(DENSITIES[density].width);
    expect(drawn.height).toBe(DENSITIES[density].height);
    expect(drawn.nodes).toHaveLength(spec.nodes.length);
    expect(outside).toEqual([]);
  });

  it.each(CHART_CASES)("never lets two nodes of %s overlap at %s density", (id, density) => {
    // Arrange
    const drawn = layoutPlate(PLATES[id], density);

    // Act
    const clashes = drawn.nodes.flatMap((a, index) =>
      drawn.nodes.slice(index + 1).filter((b) => overlaps(a, b)).map((b) => `${a.id} and ${b.id}`)
    );

    // Assert
    expect(clashes).toEqual([]);
  });

  it.each(CHART_CASES)("gives every edge of %s a drawable path inside the %s canvas", (id, density) => {
    // Arrange
    const spec = PLATES[id];

    // Act
    const drawn = layoutPlate(spec, density);
    const broken = drawn.paths.filter((edgePath) => {
      const numbers = edgePath.d.match(NUMBER).map(Number);
      const finite = numbers.every(Number.isFinite);
      const pointsInside = numbers.every((value, index) =>
        index % 2 === 0 ? insideCanvas(value, numbers[index + 1], drawn) : true
      );
      return !DRAWABLE_PATH.test(edgePath.d) || !finite || numbers.length % 2 !== 0 || !pointsInside;
    });

    // Assert
    expect(drawn.paths).toHaveLength(spec.edges.length);
    expect(new Set(drawn.paths.map((edgePath) => edgePath.key)).size).toBe(spec.edges.length);
    expect(broken.map((edgePath) => edgePath.key)).toEqual([]);
  });

  it.each(CHART_CASES)("returns new objects for %s at %s density and leaves a frozen spec as it was", (id, density) => {
    // Arrange
    const frozen = deepFreeze(clone(PLATES[id]));
    const before = clone(frozen);

    // Act: writing to a frozen spec would throw, since modules run in strict mode
    const drawn = layoutPlate(frozen, density);

    // Assert
    expect(frozen).toEqual(before);
    expect(drawn.nodes).not.toBe(frozen.nodes);
    drawn.nodes.forEach((node, index) => expect(node).not.toBe(frozen.nodes[index]));
    expect(Object.isFrozen(drawn)).toBe(false);
    expect(layoutPlate(frozen, density)).toEqual(drawn);
  });
});

describe("layoutPlate densities", () => {
  it("shows technology lines, edge labels and tiers only at full density", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    const compact = layoutPlate(spec, "compact");
    const full = layoutPlate(spec, "full");

    // Assert
    expect(compact.nodes.every((node) => node.tech === null)).toBe(true);
    expect(compact.paths.every((edgePath) => edgePath.note === null)).toBe(true);
    expect(compact.lanes).toEqual([]);
    expect(full.nodes.find((node) => node.id === "sso").tech).toBe("Azure AD");
    expect(full.paths.find((edgePath) => edgePath.key === "claude-sso").note).toMatchObject({ text: "OAuth" });
    expect(full.lanes.map((lane) => lane.title)).toEqual(["Client", "Gateway", "Products"]);
  });

  it("keeps lanes and edge labels inside the full canvas", () => {
    // Arrange
    const withLanes = Object.values(PLATES).filter((spec) => spec.lanes);

    // Act
    const outside = withLanes.flatMap((spec) => {
      const drawn = layoutPlate(spec, "full");
      const lanes = drawn.lanes.filter((lane) => lane.x < 0 || lane.y < 0 || lane.x + lane.w > drawn.width || lane.y + lane.h > drawn.height);
      const notes = drawn.paths.filter((edgePath) => edgePath.note && !insideCanvas(edgePath.note.x, edgePath.note.y, drawn));
      return [...lanes.map((lane) => `${spec.id} lane ${lane.title}`), ...notes.map((edgePath) => `${spec.id} note ${edgePath.key}`)];
    });

    // Assert
    expect(withLanes.length).toBeGreaterThan(0);
    expect(outside).toEqual([]);
  });

  it("draws a node with no kind as a service, and keeps each node's accent", () => {
    // Arrange
    const spec = baseSpec();

    // Act
    const drawn = layoutPlate(spec);

    // Assert
    expect(drawn.nodes.map((node) => node.kind)).toEqual(["service", "service", "service"]);
    expect(drawn.nodes.map((node) => node.accent)).toEqual([false, false, true]);
    expect(KINDS).toContain("service");
  });

  it("lays a chart out at compact density when no density is given", () => {
    // Arrange
    const spec = PLATES.autofix;

    // Act
    const unnamed = layoutPlate(spec);

    // Assert
    expect(unnamed).toEqual(layoutPlate(spec, "compact"));
  });

  it("falls back to compact density for a density it does not know", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    const unknown = layoutPlate(spec, "poster");

    // Assert
    expect(unknown).toEqual(layoutPlate(spec, "compact"));
    expect(unknown.width).toBe(DENSITIES.compact.width);
  });

  it("measures label fit at compact density for a density it does not know", () => {
    // Arrange
    const node = layoutPlate(PLATES.autofix, "compact").nodes[0];

    // Act
    const unknown = labelFits(node, "poster");

    // Assert
    expect(unknown).toBe(labelFits(node, "compact"));
  });

  // A plain lookup would read these names off Object.prototype and lay the
  // chart out with a function for its measurements: every coordinate NaN.
  it.each(["toString", "constructor", "hasOwnProperty", "__proto__"])(
    "falls back to compact density for a density named like the inherited object key %s",
    (name) => {
      // Arrange
      const spec = PLATES.lpr;
      const node = layoutPlate(spec, "compact").nodes[0];

      // Act
      const drawn = layoutPlate(spec, name);

      // Assert
      expect(drawn).toEqual(layoutPlate(spec, "compact"));
      expect(drawn.paths[0].d).not.toContain("NaN");
      expect(labelFits(node, name)).toBe(labelFits(node, "compact"));
    }
  );
});

describe("densityOf", () => {
  it.each(DENSITY_NAMES)("gives the %s density its own measurements", (name) => {
    // Arrange
    const expected = DENSITIES[name];

    // Act
    const found = densityOf(name);

    // Assert
    expect(found).toBe(expected);
  });

  it.each([
    ["a name it does not know", "poster"],
    ["no name", undefined],
    ["null", null],
    ["an empty name", ""],
    ["an inherited object key", "toString"],
    ["the prototype key", "__proto__"],
  ])("gives the compact density for %s", (what, name) => {
    // Arrange
    const expected = DENSITIES.compact;

    // Act
    const found = densityOf(name);

    // Assert
    expect(found).toBe(expected);
  });
});

describe("layoutPlate refuses a broken spec", () => {
  it("throws when an edge names a node that is not in the chart", () => {
    // Arrange
    const spec = { ...baseSpec(), edges: [{ from: "a", to: "ghost" }] };

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(draw).toThrow('Plate "probe": edge "a" to "ghost" names a missing node');
  });

  it.each([
    ["a column past the last one", { col: 3, row: 0 }],
    ["a row past the last one", { col: 0, row: 2 }],
    ["a negative column", { col: -1, row: 0 }],
    ["a column that is not a whole number", { col: 0.5, row: 0 }],
    ["a span that runs off the grid", { col: 2, row: 0, span: 2 }],
  ])("throws when a node sits outside the grid: %s", (where, place) => {
    // Arrange
    const spec = baseSpec();
    const nodes = [{ ...spec.nodes[0], ...place }, ...spec.nodes.slice(1)];

    // Act
    const draw = () => layoutPlate({ ...spec, nodes });

    // Assert
    expect(draw).toThrow('Plate "probe": node "a" is outside the grid');
  });

  it("throws when a spec has no nodes list", () => {
    // Arrange
    const { nodes, ...spec } = baseSpec();

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(nodes).toHaveLength(3);
    expect(draw).toThrow('Plate "probe": needs nodes and edges');
  });

  it("throws when a spec has no edges list", () => {
    // Arrange
    const { edges, ...spec } = baseSpec();

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(edges).toHaveLength(2);
    expect(draw).toThrow("needs nodes and edges");
  });

  it("throws for a missing spec without failing on the missing id", () => {
    // Arrange
    const missing = [undefined, null];

    // Act and Assert
    missing.forEach((spec) => expect(() => layoutPlate(spec)).toThrow(`Plate "${spec}": needs nodes and edges`));
  });

  it("throws when a spec has an empty nodes list, so no chart is drawn with nothing in it", () => {
    // Arrange
    const spec = { ...baseSpec(), nodes: [], edges: [] };

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(draw).toThrow('Plate "probe": needs at least one node');
  });

  it("throws when two nodes share an id", () => {
    // Arrange
    const spec = baseSpec();
    const nodes = [...spec.nodes, { id: "a", label: "Again", col: 0, row: 1 }];

    // Act
    const draw = () => layoutPlate({ ...spec, nodes });

    // Assert
    expect(draw).toThrow('node "a" appears twice');
  });

  it("throws when a node names a kind the charts do not draw", () => {
    // Arrange
    const spec = baseSpec();
    const nodes = [{ ...spec.nodes[0], kind: "cloud" }, ...spec.nodes.slice(1)];

    // Act
    const draw = () => layoutPlate({ ...spec, nodes });

    // Assert
    expect(KINDS).not.toContain("cloud");
    expect(draw).toThrow('node "a" has an unknown kind');
  });

  it.each([
    ["no columns", { cols: 0 }],
    ["more than four columns", { cols: 5 }],
    ["no rows", { rows: 0 }],
    ["more than three rows", { rows: 4 }],
    ["a column count that is not a number", { cols: "3" }],
  ])("throws for a grid with %s", (what, grid) => {
    // Arrange
    const spec = { ...baseSpec(), ...grid };

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(draw).toThrow(/(cols must be 1 to 4|rows must be 1 to 3)/);
  });

  it.each([
    ["starts before the first column", { title: "Early", from: -1, to: 0 }],
    ["ends past the last column", { title: "Late", from: 1, to: 3 }],
    ["runs backwards", { title: "Back", from: 2, to: 1 }],
  ])("throws for a lane that %s", (what, lane) => {
    // Arrange
    const spec = { ...baseSpec(), lanes: [lane] };

    // Act
    const draw = () => layoutPlate(spec);

    // Assert
    expect(draw).toThrow(`lane "${lane.title}" is outside the grid`);
  });
});

describe("labelFits", () => {
  it("says a label fits when the widest line leaves room each side, and not when it does not", () => {
    // Arrange
    const roomy = { lines: ["Ok"], tech: null, w: 100 };
    const cramped = { lines: ["A label far too long for its box"], tech: null, w: 60 };
    const longTech = { lines: ["Ok"], tech: "a technology line that is far too long", w: 100 };

    // Act
    const results = [labelFits(roomy, "full"), labelFits(cramped, "full"), labelFits(longTech, "full")];

    // Assert
    expect(results).toEqual([true, false, false]);
  });
});
