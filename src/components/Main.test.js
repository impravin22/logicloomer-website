import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Main from "./Main";
import { CV_URL, EMAIL } from "./site";

// The whole page sits behind one boundary: if any section throws while it is
// drawn, the reader gets a written message and a way to reach the owner, never
// a blank screen.

// Force the reduced-motion branch, as in redesign.test.js, so the sandbox's run
// resolves synchronously. Prefixed "mock" for jest's hoist guard.
const mockFlags = { reduce: true };
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return { __esModule: true, ...actual, useReducedMotion: () => mockFlags.reduce };
});

// Main takes no props, so one of its sections is wrapped: when a test sets
// `mockAbout.fail`, that section throws while it is drawn, inside the real page.
const mockAbout = { fail: false };
jest.mock("./About", () => {
  const actual = jest.requireActual("./About");
  const { createElement } = jest.requireActual("react");
  const AboutOrThrow = (props) => {
    if (mockAbout.fail) throw new Error("A section failed on purpose in this test.");
    return createElement(actual.default, props);
  };
  return { __esModule: true, ...actual, default: AboutOrThrow };
});

// The vendored WebGL component is replaced by a stand-in that records what
// each thread field on the page was given.
const mockThreads = { calls: [] };
jest.mock("./vendor/react-bits/Threads", () => {
  const { createElement } = jest.requireActual("react");
  const Threads = (props) => {
    mockThreads.calls.push(props);
    return createElement("canvas");
  };
  return { __esModule: true, default: Threads };
});

const PAGE_DOWN = "This page could not be shown.";
const SECTION_ERROR = "A section failed on purpose in this test.";
const relTokens = (link) => (link.getAttribute("rel") ?? "").split(/\s+/);

afterEach(() => {
  mockAbout.fail = false;
  mockThreads.calls.length = 0;
});

describe("Main", () => {
  it("shows the page, and no failure message, when nothing fails", () => {
    // Arrange
    const ui = <Main />;

    // Act
    render(ui);

    // Assert
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Pravy Chittem/);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.queryByText(PAGE_DOWN)).not.toBeInTheDocument();
  });

  it("pauses every thread field on the page from the hero's one control", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Main />);
    const fields = new Set(mockThreads.calls.map((given) => given.opacity));
    mockThreads.calls.length = 0;

    // Act
    await user.click(screen.getByRole("button", { name: "Pause background motion" }));

    // Assert: two fields, the hero's and the fainter closing one, and both stop
    expect(fields.size).toBe(2);
    expect(mockThreads.calls).toHaveLength(2);
    mockThreads.calls.forEach((given) => expect(given.paused).toBe(true));
  });

  describe("when a section throws while it is drawn", () => {
    let consoleError;

    beforeEach(() => {
      // The boundary logs the error for the developer; React logs it too.
      consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
      mockAbout.fail = true;
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it("says so in words, under the page's one heading, and never shows the error", () => {
      // Arrange
      const ui = <Main />;

      // Act
      render(ui);

      // Assert
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(PAGE_DOWN);
      expect(screen.getByRole("main")).toHaveTextContent("Reload it to try again.");
      expect(screen.queryByText(SECTION_ERROR)).not.toBeInTheDocument();
      expect(consoleError).toHaveBeenCalledWith("A section failed to render", expect.any(Error), expect.anything());
    });

    it("still gives the two ways to reach the owner: the address and the CV", () => {
      // Arrange
      render(<Main />);

      // Act
      const mail = screen.getByRole("link", { name: EMAIL });
      const cv = screen.getByRole("link", { name: /^read the CV\s?, opens in a new tab$/ });

      // Assert
      expect(mail).toHaveAttribute("href", `mailto:${EMAIL}`);
      expect(cv).toHaveAttribute("href", CV_URL);
      expect(cv).toHaveAttribute("target", "_blank");
      expect(relTokens(cv)).toEqual(expect.arrayContaining(["noreferrer", "noopener"]));
    });

    it("leaves nothing of the failed page on screen", () => {
      // Arrange
      render(<Main />);

      // Act
      const sections = screen.queryAllByRole("region");

      // Assert
      expect(sections).toHaveLength(0);
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });
});
