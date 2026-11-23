import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Main from "./Main";
import { PROJECTS, OPEN } from "./projects/data";
import { CV_URL, EMAIL, GITHUB_URL, GITLAB_URL, MAP_URL, PHONE, PHONE_URL } from "./site";

// The whole /in-short/ page, as Main renders it: its outline, its links, what
// it does when the sandbox fails, and how the sandbox treats hostile text.

// Force the reduced-motion branch, as in redesign.test.js, so a run resolves
// synchronously with no packet timers. Prefixed "mock" for jest's hoist guard.
const mockFlags = { reduce: true };
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return { __esModule: true, ...actual, useReducedMotion: () => mockFlags.reduce };
});

// Main takes no props, so the page's own Sandbox is wrapped: when a test sets
// `mockSandbox.override`, the real Sandbox receives it through its `sandbox`
// prop, inside the real page. Read at render time, after initialisation.
const mockSandbox = { override: null };
jest.mock("./Sandbox", () => {
  const actual = jest.requireActual("./Sandbox");
  const { createElement } = jest.requireActual("react");
  const SandboxWithOverride = (props) =>
    createElement(actual.default, mockSandbox.override ? { ...props, sandbox: mockSandbox.override } : props);
  return { __esModule: true, ...actual, default: SandboxWithOverride };
});

const SANDBOX_DOWN = "The sandbox could not start. The work above shows the same systems.";
const SANDBOX_ERROR = "The sandbox failed on purpose in this test.";
const LONG_REQUEST_LENGTH = 10000;
// A link that runs script, in any case and after any leading space.
const SCRIPT_SCHEME = /^\s*javascript:/i;
const REGION_NAMES = ["Field notes", "The orchestrator", "What I do", "Where I've been", "Let's build something worth shipping."];

const Thrower = () => {
  throw new Error(SANDBOX_ERROR);
};

// The page's fixed addresses, from site.js and the components: the address,
// the phone number, the owner's GitHub and GitLab, each repo the data links,
// the in-page sections and notes, the map and the CV.
const SECTION_ANCHORS = ["#top", "#work", "#about", "#contact"];
const NOTE_ANCHORS = PROJECTS.map((project) => `#note-${project.id}`);
const REPO_URLS = [...PROJECTS, ...OPEN].map((entry) => entry.href).filter(Boolean);
const ALLOWED_HREFS = new Set([
  `mailto:${EMAIL}`,
  PHONE_URL,
  GITHUB_URL,
  GITLAB_URL,
  ...REPO_URLS,
  ...SECTION_ANCHORS,
  ...NOTE_ANCHORS,
  MAP_URL,
  CV_URL,
]);

// Every link, including those inside a closed note.
const allLinks = () => screen.getAllByRole("link", { hidden: true });
const hrefOf = (link) => link.getAttribute("href") ?? "";
const relTokens = (link) => (link.getAttribute("rel") ?? "").split(/\s+/);
// An element's words as a reader gets them, the visually hidden ones included.
const wordsOf = (element) => element.textContent.replace(/\s+/g, " ").trim();
const levelOf =(heading) => Number(heading.getAttribute("aria-level") ?? heading.tagName.slice(1));
// Every id the page carries, read from its markup.
const pageIds = () => [...document.body.innerHTML.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1]);

const orchestrator = () => screen.getByRole("group", { name: /^Interactive agent orchestrator/ });
const requestBox = () => within(orchestrator()).getByRole("textbox", { name: "Type a request to route" });
const routeButton = () => within(orchestrator()).getByRole("button", { name: "Route" });

const routeRequest = async (user, text) => {
  await user.click(requestBox());
  await user.paste(text);
  await user.click(routeButton());
};

afterEach(() => {
  mockSandbox.override = null;
});

describe("Page outline", () => {
  it("has exactly one h1", () => {
    // Arrange
    const ui = <Main />;

    // Act
    render(ui);

    // Assert
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("never skips a heading level going down the page", () => {
    // Arrange
    render(<Main />);

    // Act
    const levels = screen.getAllByRole("heading").map(levelOf);
    const skips = levels.flatMap((level, index) =>
      index > 0 && level > levels[index - 1] + 1 ? [`h${levels[index - 1]} to h${level} at heading ${index + 1}`] : []
    );

    // Assert
    expect(levels[0]).toBe(1);
    expect(levels.length).toBeGreaterThan(REGION_NAMES.length);
    expect(skips).toEqual([]);
  });

  it("has exactly five labelled regions, one per section", () => {
    // Arrange
    render(<Main />);

    // Act
    const regions = screen.getAllByRole("region");

    // Assert
    expect(regions).toHaveLength(5);
    regions.forEach((region, index) => expect(region).toHaveAccessibleName(REGION_NAMES[index]));
  });

  it("gives every element id once, the chart that the hero and its card both draw included", () => {
    // The hero panel draws the chart of the project in hand and that project's
    // card draws the same chart, so each drawing's arrowhead takes an id of its
    // own. A repeated id fails WCAG 2.1 SC 4.1.1 (Parsing).
    // Arrange
    render(<Main />);

    // Act
    const ids = pageIds();
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const arrowheads = ids.filter((id) => id.startsWith("plate-head-"));

    // Assert
    expect(ids.length).toBeGreaterThan(PROJECTS.length);
    expect(arrowheads.length).toBeGreaterThan(PROJECTS.length);
    expect(duplicates).toEqual([]);
  });
});

describe("Page links", () => {
  it("only links to the allowed addresses, with no javascript: link and no bare #", () => {
    // Arrange
    render(<Main />);

    // Act
    const hrefs = allLinks().map(hrefOf);
    const unexpected = hrefs.filter((href) => !ALLOWED_HREFS.has(href));
    const scripted = hrefs.filter((href) => SCRIPT_SCHEME.test(href));
    const placeholders = hrefs.filter((href) => href.trim() === "#" || href.trim() === "");

    // Assert
    expect(REPO_URLS.every((url) => url.startsWith(`${GITHUB_URL}/`))).toBe(true);
    expect(hrefs.length).toBeGreaterThan(20);
    expect(unexpected).toEqual([]);
    expect(scripted).toEqual([]);
    expect(placeholders).toEqual([]);
  });

  it("opens every new-tab link with noopener and noreferrer", () => {
    // Arrange
    render(<Main />);

    // Act
    const newTab = allLinks().filter((link) => link.getAttribute("target") === "_blank");
    const unsafe = newTab
      .filter((link) => !["noopener", "noreferrer"].every((token) => relTokens(link).includes(token)))
      .map(hrefOf);

    // Assert
    expect(newTab.length).toBeGreaterThan(0);
    expect(unsafe).toEqual([]);
  });

  it("lands every in-page link on an element the page has", () => {
    // Arrange
    render(<Main />);

    // Act
    const ids = new Set(pageIds());
    const dangling = allLinks()
      .map(hrefOf)
      .filter((href) => href.startsWith("#") && !ids.has(href.slice(1)));

    // Assert
    expect(dangling).toEqual([]);
  });

  it("says of every link that opens a new tab that it does, at the end of its words", () => {
    // Arrange
    render(<Main />);

    // Act
    const newTab = allLinks().filter((link) => link.getAttribute("target") === "_blank");
    const silent = newTab.map(wordsOf).filter((words) => !/, opens in a new tab$/.test(words));

    // Assert
    expect(newTab.length).toBeGreaterThan(OPEN.length);
    expect(silent).toEqual([]);
  });

  it("links the phone number as written, to the same number with no spaces, in the same tab", () => {
    // Arrange
    render(<Main />);

    // Act
    const phone = screen.getByRole("link", { name: PHONE });

    // Assert
    expect(PHONE_URL).toMatch(/^tel:\+\d{9,15}$/);
    expect(PHONE_URL).toBe(`tel:${PHONE.replace(/\s/g, "")}`);
    expect(phone).toHaveAttribute("href", PHONE_URL);
    expect(phone).not.toHaveAttribute("target");
  });
});

describe("Page background motion", () => {
  it("has one control that pauses and plays every moving background", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Main />);
    const controls = screen.getAllByRole("button", { name: /background motion$/ });

    // Act
    await user.click(controls[0]);

    // Assert
    expect(controls).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Play background motion" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause background motion" })).not.toBeInTheDocument();
  });
});

describe("The orchestrator's graph", () => {
  it("says in words that it scrolls sideways, for the narrow screen where it does", () => {
    // Arrange
    render(<Main />);

    // Act
    const graph = within(orchestrator()).getByRole("group", { name: /^Routing graph\./ });

    // Assert
    expect(graph).toHaveAttribute("tabindex", "0");
    expect(within(orchestrator()).getByText("Scroll sideways to see the whole graph.")).toBeInTheDocument();
  });
});

describe("When the sandbox fails", () => {
  let consoleError;

  beforeEach(() => {
    // The boundary logs the error for the developer; React logs it too.
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("still shows the page's heading and says, in words, that the sandbox could not start", () => {
    // Arrange
    mockSandbox.override = <Thrower />;

    // Act
    render(<Main />);

    // Assert
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Pravy Chittem/);
    const sandbox = screen.getByRole("region", { name: "The orchestrator" });
    expect(within(sandbox).getByRole("status")).toHaveTextContent(SANDBOX_DOWN);
    expect(screen.getByText(SANDBOX_DOWN)).toBeInTheDocument();
    expect(screen.queryByText(SANDBOX_ERROR)).not.toBeInTheDocument();
    expect(screen.getAllByRole("region")).toHaveLength(5);
    expect(consoleError).toHaveBeenCalledWith("A section failed to render", expect.any(Error), expect.anything());
  });
});

describe("The orchestrator's request box treats hostile text as text", () => {
  let alertSpy;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("creates no image from an img tag with an onerror handler, and still routes it", async () => {
    // Arrange
    const user = userEvent.setup();
    const hostile = "<img src=x onerror=alert(1)>";
    render(<Main />);
    const imagesBefore = screen.queryAllByRole("img", { hidden: true }).length;
    expect(within(orchestrator()).getByText(/intent classified: retrieval/)).toBeInTheDocument();

    // Act
    await routeRequest(user, hostile);

    // Assert: the text holds, "onerror" read as the word "error", and no img exists
    expect(requestBox()).toHaveValue(hostile);
    expect(within(orchestrator()).getByText(/intent classified: code/)).toBeInTheDocument();
    expect(document.images).toHaveLength(0);
    expect(screen.queryAllByRole("img", { hidden: true })).toHaveLength(imagesBefore);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("creates no script element from a script tag, and still routes it", async () => {
    // Arrange
    const user = userEvent.setup();
    const hostile = "<script>alert(1)</script>";
    render(<Main />);
    await user.click(within(orchestrator()).getByRole("button", { name: "What is our Q3 revenue?" }));
    expect(within(orchestrator()).getByText(/intent classified: analytics/)).toBeInTheDocument();

    // Act
    await routeRequest(user, hostile);

    // Assert: routed as a plain request, and no element holds the script's body
    expect(requestBox()).toHaveValue(hostile);
    expect(within(orchestrator()).getByText(/intent classified: retrieval/)).toBeInTheDocument();
    expect(screen.queryByText("alert(1)", { ignore: false })).not.toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("routes a 10,000-character request without crashing", async () => {
    // Arrange
    const user = userEvent.setup();
    const intentWord = "revenue";
    const long = "x".repeat(LONG_REQUEST_LENGTH - intentWord.length) + intentWord;
    render(<Main />);

    // Act
    await routeRequest(user, long);

    // Assert
    expect(long).toHaveLength(LONG_REQUEST_LENGTH);
    expect(requestBox()).toHaveValue(long);
    expect(within(orchestrator()).getByText(/intent classified: analytics/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("starts no run for a request of spaces alone", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Main />);
    const revenue = within(orchestrator()).getByRole("button", { name: "What is our Q3 revenue?" });
    await user.click(revenue);
    expect(within(orchestrator()).getByText(/intent classified: analytics/)).toBeInTheDocument();

    // Act: a run would reset the trace to the default retrieval route
    await routeRequest(user, "     ");

    // Assert
    expect(within(orchestrator()).getByText(/intent classified: analytics/)).toBeInTheDocument();
    expect(within(orchestrator()).queryByText(/intent classified: retrieval/)).not.toBeInTheDocument();
    expect(revenue).toHaveAttribute("aria-pressed", "true");
  });
});
