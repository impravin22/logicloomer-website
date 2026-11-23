import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import theme from "../Themes";
import Systems from "./Systems";

// One chart that fails while it is drawn costs its own row's chart and no
// other row's. The real Plate sits behind an error boundary that stays failed
// once it has caught, so the panel must give each row a chart of its own.

// A stand-in Plate built the way the real one is: a boundary around a drawing
// that throws for the spec a test names. Prefixed "mock" for jest's hoist guard.
const mockBroken = { sketch: null };
jest.mock("../plates/Plate", () => {
  const { createElement } = jest.requireActual("react");
  const Boundary = jest.requireActual("../ErrorBoundary").default;
  const Drawing = ({ spec }) => {
    if (spec.id === mockBroken.sketch) throw new Error("This chart failed on purpose in this test.");
    return createElement("svg", { role: "img", "aria-label": spec.label });
  };
  const Plate = (props) => createElement(Boundary, { fallback: null }, createElement(Drawing, props));
  return { __esModule: true, Plate, default: Plate };
});

const NOTES = [
  { id: "alpha", title: "Alpha System", year: "2026", sketch: "lpr" },
  { id: "beta", title: "Beta System", year: "2025", sketch: "sales" },
  { id: "gamma", title: "Gamma System", year: "2024", sketch: "vlm" },
];

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
const listLinks = () => within(screen.getByRole("list", { name: "Newest systems" })).getAllByRole("link");
const shownCharts = () => screen.queryAllByRole("img", { hidden: true });

describe("Systems when one chart fails while it is drawn", () => {
  let consoleError;

  beforeEach(() => {
    // The boundary logs the error for the developer; React logs it too.
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
    mockBroken.sketch = null;
  });

  it("still shows the next row's chart after the first row's chart failed", async () => {
    // Arrange
    const user = userEvent.setup();
    mockBroken.sketch = NOTES[0].sketch;
    withTheme(<Systems projects={NOTES} />);
    expect(shownCharts()).toHaveLength(0);

    // Act
    await user.hover(listLinks()[1]);

    // Assert
    expect(shownCharts()).toHaveLength(1);
    expect(listLinks()).toHaveLength(NOTES.length);
    expect(consoleError).toHaveBeenCalledWith("A section failed to render", expect.any(Error), expect.anything());
  });

  it("shows a working row's chart again after a failing row was in hand", async () => {
    // Arrange
    const user = userEvent.setup();
    mockBroken.sketch = NOTES[1].sketch;
    withTheme(<Systems projects={NOTES} />);
    expect(shownCharts()).toHaveLength(1);

    // Act: the failing row, then back to a working one
    await user.hover(listLinks()[1]);
    const whileBroken = shownCharts().length;
    await user.hover(listLinks()[2]);

    // Assert
    expect(whileBroken).toBe(0);
    expect(shownCharts()).toHaveLength(1);
  });
});
