import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import Contact from "./Contact";
import { EMAIL, GITHUB_URL, GITLAB_URL, PHONE, PHONE_URL } from "./site";

// Copying the address: success says so on the button for a moment, and on a
// status line for a screen reader; a refused or missing clipboard says, on that
// line, what to do instead. Then the links beside it.

const CLIPBOARD = "clipboard";
const COPIED_MS = 1600;
const REFUSED = "Could not copy the address. Select it and copy it by hand.";
const COPIED = "Email address copied.";

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
const relTokens = (link) => (link.getAttribute("rel") ?? "").split(/\s+/);
// A link that opens a new tab says so after its name, for screen readers. The
// name computation used in tests may put a space before the hidden words.
const inNewTab = (name) => new RegExp(`^${name}\\s?, opens in a new tab$`);
const copyButton = () => screen.getByRole("button", { name: "Copy email address" });
const setClipboard = (value) => Object.defineProperty(window.navigator, CLIPBOARD, { value, configurable: true });

const ORIGINAL_CLIPBOARD = Object.getOwnPropertyDescriptor(window.navigator, CLIPBOARD);
let savedClipboard;

beforeEach(() => {
  savedClipboard = Object.getOwnPropertyDescriptor(window.navigator, CLIPBOARD);
});

afterEach(() => {
  // Put navigator.clipboard back exactly as it was before the test.
  if (savedClipboard) {
    Object.defineProperty(window.navigator, CLIPBOARD, savedClipboard);
  } else {
    delete window.navigator[CLIPBOARD];
  }
  jest.useRealTimers();
});

describe("Contact copy button", () => {
  it("shows the address as a mailto link whose words are the address alone, so it can be copied by hand", () => {
    // Arrange
    const ui = <Contact />;

    // Act
    withTheme(ui);
    const address = screen.getByRole("link", { name: EMAIL });

    // Assert
    expect(address).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(address).not.toHaveAttribute("target");
    expect(address.textContent).toBe(EMAIL);
    expect(copyButton()).toHaveTextContent("Copy");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("copies the address, says so on the button and tells a screen reader on the status line", async () => {
    // Arrange
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    withTheme(<Contact />);

    // Act
    fireEvent.click(copyButton());
    const copied = await screen.findByRole("button", { name: "Email address copied" });

    // Assert
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(copied).toHaveTextContent("Copied ✓");
    expect(copied).toHaveClass("done");
    expect(screen.getByRole("status").textContent).toBe(COPIED);
  });

  it("returns the button to Copy after a moment", async () => {
    // Arrange
    jest.useFakeTimers();
    setClipboard({ writeText: jest.fn().mockResolvedValue(undefined) });
    withTheme(<Contact />);
    fireEvent.click(copyButton());
    await screen.findByRole("button", { name: "Email address copied" });

    // Act
    act(() => {
      jest.advanceTimersByTime(COPIED_MS);
    });

    // Assert
    expect(copyButton()).toHaveTextContent("Copy");
    expect(screen.queryByRole("button", { name: "Email address copied" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("says what to do on the status line when the clipboard refuses", async () => {
    // Arrange
    const writeText = jest.fn().mockRejectedValue(new Error("Write permission denied."));
    setClipboard({ writeText });
    withTheme(<Contact />);

    // Act
    fireEvent.click(copyButton());
    const message = await screen.findByText(REFUSED);

    // Assert
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(screen.getByRole("status")).toHaveTextContent(REFUSED);
    expect(screen.getByRole("status")).toContainElement(message);
    expect(copyButton()).toHaveTextContent("Copy");
    expect(screen.queryByRole("button", { name: "Email address copied" })).not.toBeInTheDocument();
  });

  it("says the same and throws nothing when the browser has no clipboard", async () => {
    // Arrange
    setClipboard(undefined);
    withTheme(<Contact />);

    // Act
    const click = () => fireEvent.click(copyButton());

    // Assert
    expect(window.navigator.clipboard).toBeUndefined();
    expect(click).not.toThrow();
    expect(await screen.findByText(REFUSED)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(REFUSED);
    expect(copyButton()).toBeInTheDocument();
  });

  it("clears the refusal once a later copy succeeds", async () => {
    // Arrange
    const writeText = jest.fn().mockRejectedValueOnce(new Error("Write permission denied.")).mockResolvedValue(undefined);
    setClipboard({ writeText });
    withTheme(<Contact />);
    fireEvent.click(copyButton());
    await screen.findByText(REFUSED);

    // Act
    fireEvent.click(copyButton());
    await screen.findByRole("button", { name: "Email address copied" });

    // Assert
    expect(writeText).toHaveBeenCalledTimes(2);
    expect(screen.queryByText(REFUSED)).not.toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toBe(COPIED);
  });
});

describe("Contact links", () => {
  it.each([
    ["GitHub", GITHUB_URL],
    ["GitLab", GITLAB_URL],
  ])("links %s in a new tab, says so, and sets noreferrer and noopener", (name, url) => {
    // Arrange
    withTheme(<Contact />);

    // Act
    const link = screen.getByRole("link", { name: inNewTab(name) });

    // Assert
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(relTokens(link)).toEqual(expect.arrayContaining(["noreferrer", "noopener"]));
  });

  it("links the phone number as written, to the same number with no spaces, in the same tab", () => {
    // Arrange
    withTheme(<Contact />);

    // Act
    const phone = screen.getByRole("link", { name: PHONE });

    // Assert
    expect(PHONE_URL).toBe(`tel:${PHONE.replace(/\s/g, "")}`);
    expect(phone).toHaveAttribute("href", PHONE_URL);
    expect(phone).not.toHaveAttribute("target");
  });
});

describe("Restoring the clipboard", () => {
  // Runs after the copy tests above, which Jest runs first, in file order.
  it("leaves navigator.clipboard as it was before any copy test replaced it", () => {
    // Arrange
    const before = ORIGINAL_CLIPBOARD;

    // Act
    const now = Object.getOwnPropertyDescriptor(window.navigator, CLIPBOARD);

    // Assert
    expect(now).toEqual(before);
  });
});
