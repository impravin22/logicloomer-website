import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import { MotionProvider, useMotion } from "./motion";
import ThreadField from "./ThreadField";

// The page's background motion: one shared answer to "is it paused?", the
// threads that follow it, and what a reader who asked for less motion gets.

// The vendored WebGL component is replaced by a stand-in that records what it
// was given, and can be told to fail. Prefixed "mock" for jest's hoist guard.
const mockThreads = { calls: [], fail: false };
jest.mock("./vendor/react-bits/Threads", () => {
  const { createElement } = jest.requireActual("react");
  const Threads = (props) => {
    if (mockThreads.fail) throw new Error("The drawing failed on purpose in this test.");
    mockThreads.calls.push(props);
    return createElement("canvas", { "data-testid": "threads" });
  };
  return { __esModule: true, default: Threads };
});

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const ORIGINAL_MATCH_MEDIA = window.matchMedia;

// Answers the reduced-motion question as a reader's system would.
const askForLessMotion = () => {
  window.matchMedia = (query) => ({ ...ORIGINAL_MATCH_MEDIA(query), matches: query === REDUCE_QUERY });
};

const inTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
const givenToThreads = () => mockThreads.calls[mockThreads.calls.length - 1];

// Reads the hook as a component would: says the state and, where there is
// something to flip, offers the button that flips it.
const Probe = ({ name = "flip" }) => {
  const { paused, toggle } = useMotion();
  return (
    <p>
      <output>{paused ? "paused" : "moving"}</output>
      {toggle ? (
        <button type="button" onClick={toggle}>
          {name}
        </button>
      ) : null}
    </p>
  );
};

const states = () => screen.getAllByRole("status").map((output) => output.textContent);

afterEach(() => {
  window.matchMedia = ORIGINAL_MATCH_MEDIA;
  mockThreads.calls.length = 0;
  mockThreads.fail = false;
});

describe("MotionProvider", () => {
  it("starts moving and flips between paused and moving", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>
    );
    const flip = screen.getByRole("button", { name: "flip" });

    // Act and Assert
    expect(states()).toEqual(["moving"]);

    await user.click(flip);
    expect(states()).toEqual(["paused"]);

    await user.click(flip);
    expect(states()).toEqual(["moving"]);
  });

  it("gives everything under it the same answer, whichever one flips it", async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <MotionProvider>
        <Probe name="first" />
        <Probe name="second" />
      </MotionProvider>
    );

    // Act
    await user.click(screen.getByRole("button", { name: "second" }));

    // Assert
    expect(states()).toEqual(["paused", "paused"]);
  });

  it("holds still, with nothing to flip, for a reader who asked their system for less motion", () => {
    // Arrange
    askForLessMotion();

    // Act
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>
    );

    // Assert
    expect(states()).toEqual(["paused"]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("useMotion outside a provider", () => {
  it("is moving, with nothing to flip", () => {
    // Arrange
    const ui = <Probe />;

    // Act
    render(ui);

    // Assert
    expect(states()).toEqual(["moving"]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("holds still for a reader who asked their system for less motion", () => {
    // Arrange
    askForLessMotion();

    // Act
    render(<Probe />);

    // Assert
    expect(states()).toEqual(["paused"]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("ThreadField", () => {
  it("draws the threads in the theme's own colours, moving and answering the pointer", () => {
    // Arrange
    const ui = (
      <MotionProvider>
        <ThreadField />
      </MotionProvider>
    );

    // Act
    inTheme(ui);

    // Assert
    expect(screen.getByTestId("threads")).toBeInTheDocument();
    expect(givenToThreads()).toMatchObject({
      color: theme.ink,
      accentColor: theme.accent,
      opacity: 1,
      paused: false,
      enableMouseInteraction: true,
    });
    expect(givenToThreads().parting).toBeGreaterThan(0);
  });

  it("draws a quiet field fainter, and deaf to the pointer, but still moving", () => {
    // Arrange
    const ui = (
      <MotionProvider>
        <ThreadField quiet />
      </MotionProvider>
    );

    // Act
    inTheme(ui);

    // Assert
    expect(givenToThreads()).toMatchObject({ paused: false, enableMouseInteraction: false, parting: 0 });
    expect(givenToThreads().opacity).toBeGreaterThan(0);
    expect(givenToThreads().opacity).toBeLessThan(1);
  });

  it("stops, and stops answering the pointer, when the page's motion is paused", async () => {
    // Arrange
    const user = userEvent.setup();
    inTheme(
      <MotionProvider>
        <Probe />
        <ThreadField />
      </MotionProvider>
    );

    // Act
    await user.click(screen.getByRole("button", { name: "flip" }));

    // Assert
    expect(givenToThreads()).toMatchObject({ paused: true, enableMouseInteraction: false, parting: 0 });

    // Act: play again
    await user.click(screen.getByRole("button", { name: "flip" }));

    // Assert
    expect(givenToThreads()).toMatchObject({ paused: false, enableMouseInteraction: true });
  });

  it("stops every field on the page at once", async () => {
    // Arrange
    const user = userEvent.setup();
    inTheme(
      <MotionProvider>
        <Probe />
        <ThreadField />
        <ThreadField quiet />
      </MotionProvider>
    );
    mockThreads.calls.length = 0;

    // Act
    await user.click(screen.getByRole("button", { name: "flip" }));

    // Assert: both fields were drawn again, and both paused
    expect(mockThreads.calls).toHaveLength(2);
    mockThreads.calls.forEach((given) => expect(given.paused).toBe(true));
  });

  it("is paused from the start for a reader who asked their system for less motion", () => {
    // Arrange
    askForLessMotion();

    // Act
    inTheme(
      <MotionProvider>
        <ThreadField />
      </MotionProvider>
    );

    // Assert
    expect(givenToThreads()).toMatchObject({ paused: true, enableMouseInteraction: false, parting: 0 });
  });

  it("costs only the threads when the drawing fails, and logs why", () => {
    // Arrange
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockThreads.fail = true;

    // Act
    inTheme(
      <MotionProvider>
        <p>The words are still here.</p>
        <ThreadField />
      </MotionProvider>
    );

    // Assert
    expect(screen.getByText("The words are still here.")).toBeInTheDocument();
    expect(screen.queryByTestId("threads")).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith("A section failed to render", expect.any(Error), expect.anything());
    consoleError.mockRestore();
  });
});
