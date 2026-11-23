import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "../Themes";
import { Plate } from "./Plate";
import { PLATES } from "./specs";
import { layoutPlate, labelFits, KINDS, DENSITIES } from "./layout";
import { PROJECTS, OPEN } from "../projects/data";

// The chart specs, the data that names them, the Plate that draws them, and a
// scan of the component sources for ways to write raw HTML or run strings.

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const DENSITY_NAMES = Object.keys(DENSITIES);
const CHARTS = Object.values(PLATES);
const CHART_CASES = CHARTS.flatMap((spec) => DENSITY_NAMES.map((density) => [spec.id, density]));

describe("Chart specs and the data that names them", () => {
  it("names a chart that exists for every project and repo that names one", () => {
    // Arrange
    const entries = [...PROJECTS, ...OPEN];

    // Act
    const unknown = entries.filter((entry) => entry.sketch && !PLATES[entry.sketch]).map((entry) => entry.id);

    // Assert
    expect(unknown).toEqual([]);
  });

  it("leaves only the Blend n Bubbles note without a chart, and gives every open-source build one", () => {
    // The brief for these tests expected an open-source entry without a
    // chart; the data has none. The one entry without `sketch` is the field
    // note "blend", which is set in type across the row.
    // Arrange
    const entries = [...PROJECTS, ...OPEN];

    // Act
    const withoutChart = entries.filter((entry) => !entry.sketch).map((entry) => entry.id);

    // Assert
    expect(withoutChart).toEqual(["blend"]);
    expect(OPEN.every((repo) => Boolean(PLATES[repo.sketch]))).toBe(true);
  });

  it("keys every chart by its own id", () => {
    // Arrange
    const entries = Object.entries(PLATES);

    // Act
    const mismatched = entries.filter(([key, spec]) => spec.id !== key).map(([key]) => key);

    // Assert
    expect(entries).toHaveLength(20);
    expect(mismatched).toEqual([]);
  });

  it.each(CHARTS.map((spec) => [spec.id, spec]))(
    "gives %s exactly one accent node, at least two nodes and at least one edge",
    (id, spec) => {
      // Arrange
      const accents = spec.nodes.filter((node) => node.accent);

      // Act
      const counts = { accents: accents.length, nodes: spec.nodes.length, edges: spec.edges.length };

      // Assert
      expect(counts.accents).toBe(1);
      expect(counts.nodes).toBeGreaterThanOrEqual(2);
      expect(counts.edges).toBeGreaterThanOrEqual(1);
    }
  );

  it.each(CHARTS.map((spec) => [spec.id, spec]))("gives %s a label and draws only known kinds", (id, spec) => {
    // Arrange
    const kinds = spec.nodes.map((node) => node.kind).filter(Boolean);

    // Act
    const unknown = kinds.filter((kind) => !KINDS.includes(kind));

    // Assert
    expect(spec.label.trim().length).toBeGreaterThan(0);
    expect(unknown).toEqual([]);
  });

  it.each(CHART_CASES)("fits every label of %s inside its node at %s density", (id, density) => {
    // Arrange
    const drawn = layoutPlate(PLATES[id], density);

    // Act
    const tooWide = drawn.nodes.filter((node) => !labelFits(node, density)).map((node) => node.id);

    // Assert
    expect(tooWide).toEqual([]);
  });
});

describe("Plate", () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("draws one image named by the chart's label", () => {
    // Arrange
    const spec = PLATES.autofix;

    // Act
    withTheme(<Plate spec={spec} />);

    // Assert
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img")).toHaveAccessibleName(spec.label);
  });

  it("draws each node's name inside the image", () => {
    // Arrange
    const spec = PLATES.lpr;

    // Act
    withTheme(<Plate spec={spec} />);

    // Assert
    spec.nodes.forEach((node) => expect(screen.getByText(node.label)).toBeInTheDocument());
  });

  it("shows no caption unless one is asked for", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} />);

    // Assert
    expect(screen.queryByText(spec.label)).not.toBeInTheDocument();
  });

  it("shows the chart's label as a caption when asked", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} caption />);

    // Assert
    expect(screen.getByText(spec.label)).toBeInTheDocument();
    expect(screen.getByRole("figure")).toContainElement(screen.getByText(spec.label));
  });

  it("keeps a shown caption out of the accessibility tree, since the image already says the same words", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} caption />);

    // Assert: one reading for a screen reader, the caption still on screen
    expect(screen.getByRole("img")).toHaveAccessibleName(spec.label);
    expect(screen.getByText(spec.label)).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(spec.label)).toBeVisible();
  });

  it("leaves out technology lines, edge labels and tiers at compact density", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} density="compact" />);

    // Assert
    expect(screen.queryByText("Azure AD")).not.toBeInTheDocument();
    expect(screen.queryByText("OAuth")).not.toBeInTheDocument();
    expect(screen.queryByText("Gateway")).not.toBeInTheDocument();
  });

  it("adds technology lines, edge labels and tiers at full density", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} density="full" />);

    // Assert
    expect(screen.getByText("Azure AD")).toBeInTheDocument();
    expect(screen.getByText("OAuth")).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
  });

  it.each([
    ["no spec", undefined],
    ["a null spec", null],
  ])("renders nothing for %s", (what, spec) => {
    // Arrange
    const ui = <Plate spec={spec} />;

    // Act
    const view = withTheme(ui);

    // Assert
    expect(view.container).toBeEmptyDOMElement();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("renders nothing for a spec that cannot be laid out, and logs why without throwing", () => {
    // Arrange
    const broken = { ...PLATES.lpr, edges: [{ from: "frame", to: "ghost" }] };

    // Act
    const draw = () => withTheme(<Plate spec={broken} />);

    // Assert
    expect(draw).not.toThrow();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith("Chart could not be drawn", expect.any(Error));
  });

  it("renders nothing for a chart with no nodes, rather than an empty image that still announces its label", () => {
    // Arrange
    const empty = { ...PLATES.lpr, nodes: [], edges: [] };

    // Act
    withTheme(<Plate spec={empty} />);

    // Assert
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith("Chart could not be drawn", expect.any(Error));
  });

  it("draws at compact density for a density named like an inherited object key", () => {
    // Arrange
    const spec = PLATES.mcp;

    // Act
    withTheme(<Plate spec={spec} density="toString" />);
    const image = screen.getByRole("img");

    // Assert
    expect(image).toHaveAttribute("viewBox", `0 0 ${DENSITIES.compact.width} ${DENSITIES.compact.height}`);
    expect(screen.queryByText("Azure AD")).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("gives each drawing of one chart an arrowhead id of its own", () => {
    // Arrange
    const spec = PLATES.autofix;
    const headOf = (markup) => (/<marker id="([^"]+)"/.exec(markup) || [])[1];
    const headsUsedIn = (markup) => [...markup.matchAll(/marker-end="url\(#([^)]+)\)"/g)].map((match) => match[1]);

    // Act
    withTheme(
      <>
        <Plate spec={spec} />
        <Plate spec={spec} />
      </>
    );
    const drawings = screen.getAllByRole("img").map((image) => image.innerHTML);
    const heads = drawings.map(headOf);

    // Assert: two ids, different, and each drawing's edges end in its own
    expect(heads).toHaveLength(2);
    heads.forEach((id) => expect(id).toMatch(/^plate-head-[\w-]+$/));
    expect(new Set(heads).size).toBe(2);
    drawings.forEach((markup, index) => {
      expect(headsUsedIn(markup)).toHaveLength(spec.edges.length);
      expect(new Set(headsUsedIn(markup))).toEqual(new Set([heads[index]]));
    });
  });
});

describe("No raw HTML or string evaluation in the components", () => {
  const COMPONENTS_DIR = path.join(__dirname, "..");
  const SOURCE_FILE = /\.jsx?$/;
  const TEST_FILE = /\.test\.jsx?$/;
  const UNSAFE = [
    { name: "dangerouslySetInnerHTML", pattern: /dangerouslySetInnerHTML/ },
    { name: "innerHTML", pattern: /\binnerHTML\b/ },
    { name: "eval(", pattern: /\beval\s*\(/ },
    { name: "new Function", pattern: /\bnew\s+Function\b/ },
  ];

  const listSourceFiles = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === "vendor" ? [] : listSourceFiles(full);
      return SOURCE_FILE.test(entry.name) && !TEST_FILE.test(entry.name) ? [full] : [];
    });

  const findUnsafe = (source) =>
    source.split("\n").flatMap((text, index) =>
      UNSAFE.filter(({ pattern }) => pattern.test(text)).map(({ name }) => `line ${index + 1}: ${name}`)
    );

  it("recognises each unsafe call it scans for", () => {
    // Arrange: inert sample lines for the scanner; nothing here is ever run
    const samples = [
      "<div dangerouslySetInnerHTML={{ __html: text }} />",
      "node.innerHTML = text;",
      "eval (text);",
      "const run = new Function('return 1');",
    ];

    // Act
    const found = samples.map(findUnsafe);

    // Assert
    found.forEach((hits) => expect(hits).toHaveLength(1));
    expect(findUnsafe("const evaluation = medieval(text);")).toEqual([]);
  });

  it("finds none of them in any component outside the vendor folder", () => {
    // Arrange
    const files = listSourceFiles(COMPONENTS_DIR);

    // Act
    const offenders = files.flatMap((file) =>
      findUnsafe(fs.readFileSync(file, "utf8")).map((where) => `${path.relative(COMPONENTS_DIR, file)} ${where}`)
    );

    // Assert
    expect(files.map((file) => path.basename(file))).toEqual(
      expect.arrayContaining(["Orchestrator.js", "Plate.js", "ProjectCard.js", "Systems.js", "data.js"])
    );
    expect(files.some((file) => file.includes(`${path.sep}vendor${path.sep}`))).toBe(false);
    expect(offenders).toEqual([]);
  });
});
