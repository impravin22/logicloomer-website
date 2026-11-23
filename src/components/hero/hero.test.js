import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import theme from "../Themes";
import Hero from "../Hero";
import Systems from "./Systems";
import { MotionProvider } from "../motion";
import { PROJECTS } from "../projects/data";
import { PLATES } from "../plates/specs";
import { CV_URL, EMAIL, GITHUB_URL } from "../site";

// The first screen: the page's one heading, its actions, the control that
// stops the moving background, and the newest systems with the chart of the
// one in hand. The chart sits in an aria-hidden panel (the note the link goes
// to draws the same chart), so it is queried with `hidden: true`.

const LISTED = 5;
const MAX_TABS = 20;
const IN_HAND = "data-in-hand";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const ORIGINAL_MATCH_MEDIA = window.matchMedia;

const inTheme = (ui) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
const withTheme = (ui) => render(inTheme(ui));
const withMotion = (ui) => render(inTheme(<MotionProvider>{ui}</MotionProvider>));

const newestList = () => screen.getByRole("list", { name: "Newest systems" });
const listLinks = () => within(newestList()).getAllByRole("link");
const linksInHand = () => listLinks().filter((link) => link.getAttribute(IN_HAND) === "true");
const chartLabelOf = (project) => PLATES[project.sketch].label;
const shownCharts = () => screen.queryAllByRole("img", { hidden: true });
const relTokens = (link) => (link.getAttribute("rel") ?? "").split(/\s+/);
const motionControl = () => screen.queryByRole("button", { name: /background motion$/ });
// A link that opens a new tab says so after its name, for screen readers. The
// name computation used in tests may put a space before the hidden words.
const inNewTab = (name) => new RegExp(`^${name}\\s?, opens in a new tab$`);

// Answers the reduced-motion question as a reader's system would.
const askForLessMotion = () => {
  window.matchMedia = (query) => ({ ...ORIGINAL_MATCH_MEDIA(query), matches: query === REDUCE_QUERY });
};

// Moves focus with the Tab key, as a keyboard reader would, until it lands.
const tabTo = async (user, target) => {
  for (let step = 0; step < MAX_TABS && !target.matches(":focus"); step += 1) {
    await user.tab();
  }
};

// Small stand-in notes, newest first, each with a chart unless stated.
const NOTES = [
  { id: "alpha", title: "Alpha System", year: "2026", sketch: "lpr" },
  { id: "beta", title: "Beta System", year: "2025", sketch: "sales" },
  { id: "gamma", title: "Gamma System", year: "2024", sketch: "vlm" },
];

afterEach(() => {
  window.matchMedia = ORIGINAL_MATCH_MEDIA;
});

describe("Hero heading", () => {
  it("holds the page's one h1: who is speaking, then the sentence", () => {
    // Arrange
    const ui = <Hero />;

    // Act
    withTheme(ui);
    const headings = screen.getAllByRole("heading", { level: 1 });

    // Assert
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(/^Pravy Chittem/);
    expect(headings[0]).toHaveAccessibleName(/AI forward deployment lead/);
    expect(headings[0]).toHaveAccessibleName(/Taipei, Taiwan/);
    expect(headings[0]).toHaveAccessibleName(/I build production AI end to end\.$/);
  });

  it("says production AI exactly once", () => {
    // Arrange
    const ui = <Hero />;

    // Act
    withTheme(ui);

    // Assert
    expect(screen.getAllByText(/production AI/i)).toHaveLength(1);
  });
});

describe("Hero actions", () => {
  it("makes the one filled action a mailto link to the address", () => {
    // Arrange
    withTheme(<Hero />);

    // Act
    const primary = screen.getAllByRole("link").filter((link) => link.classList.contains("primary"));

    // Assert
    expect(primary).toHaveLength(1);
    expect(primary[0]).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(primary[0]).toHaveAccessibleName(`Email ${EMAIL}`);
  });

  it("links the CV at the site root in a new tab, says so, and sets noreferrer and noopener", () => {
    // Arrange
    withTheme(<Hero />);

    // Act
    const cv = screen.getByRole("link", { name: inNewTab("Read the CV") });

    // Assert
    expect(CV_URL).toBe("../Pravy_CV.pdf");
    expect(cv).toHaveAttribute("href", "../Pravy_CV.pdf");
    expect(cv).toHaveAttribute("target", "_blank");
    expect(relTokens(cv)).toEqual(expect.arrayContaining(["noreferrer", "noopener"]));
  });

  it("links GitHub in a new tab, says so, and sets noreferrer and noopener", () => {
    // Arrange
    withTheme(<Hero />);

    // Act
    const github = screen.getByRole("link", { name: inNewTab("GitHub") });

    // Assert
    expect(github).toHaveAttribute("href", GITHUB_URL);
    expect(github).toHaveAttribute("target", "_blank");
    expect(relTokens(github)).toEqual(expect.arrayContaining(["noreferrer", "noopener"]));
  });
});

describe("Background motion control", () => {
  it("pauses and plays the background from one button, named for what it will do", async () => {
    // Arrange
    const user = userEvent.setup();
    withMotion(<Hero />);

    // Act and Assert: moving at first, so the button offers to pause
    expect(motionControl()).toHaveAccessibleName("Pause background motion");

    await user.click(motionControl());
    expect(motionControl()).toHaveAccessibleName("Play background motion");

    await user.click(motionControl());
    expect(motionControl()).toHaveAccessibleName("Pause background motion");
  });

  it("is reached and worked with the keyboard", async () => {
    // Arrange
    const user = userEvent.setup();
    withMotion(<Hero />);

    // Act
    await tabTo(user, motionControl());
    await user.keyboard("{Enter}");

    // Assert
    expect(motionControl()).toHaveFocus();
    expect(motionControl()).toHaveAccessibleName("Play background motion");
  });

  it("is left out for a reader who asked their system for less motion, since nothing moves", () => {
    // Arrange
    askForLessMotion();

    // Act
    withMotion(<Hero />);

    // Assert
    expect(motionControl()).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("is left out when the hero is drawn outside a motion provider, where there is nothing to flip", () => {
    // Arrange
    const ui = <Hero />;

    // Act
    withTheme(ui);

    // Assert
    expect(motionControl()).not.toBeInTheDocument();
  });
});

describe("Newest systems", () => {
  it("lists the newest five projects as links to their notes, each named by title and year", () => {
    // Arrange
    const newest = PROJECTS.slice(0, LISTED);

    // Act
    withTheme(<Hero />);
    const links = listLinks();

    // Assert
    expect(PROJECTS.length).toBeGreaterThan(LISTED);
    expect(links).toHaveLength(LISTED);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute("href", `#note-${newest[index].id}`);
      expect(link).toHaveAccessibleName(`${newest[index].title}, ${newest[index].year}`);
    });
  });

  it("starts with the first listed project in hand and shows its chart", () => {
    // Arrange
    const first = PROJECTS[0];

    // Act
    withTheme(<Hero />);
    const links = listLinks();

    // Assert
    expect(links[0]).toHaveAttribute(IN_HAND, "true");
    links.slice(1).forEach((link) => expect(link).not.toHaveAttribute(IN_HAND));
    expect(shownCharts()).toHaveLength(1);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(first) })).toBeInTheDocument();
  });

  it("marks the one in hand for the eye only, never as the current page", () => {
    // Arrange
    withTheme(<Hero />);

    // Act
    const links = listLinks();

    // Assert: every link leads to another part of the page; none is "current"
    links.forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });

  it("takes another project in hand when the pointer rests on it, and shows that project's chart", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Hero />);
    const links = listLinks();
    const target = PROJECTS[2];

    // Act
    await user.hover(links[2]);

    // Assert
    expect(links[2]).toHaveAttribute(IN_HAND, "true");
    expect(links[0]).not.toHaveAttribute(IN_HAND);
    expect(shownCharts()).toHaveLength(1);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(target) })).toBeInTheDocument();
    expect(screen.queryByRole("img", { hidden: true, name: chartLabelOf(PROJECTS[0]) })).not.toBeInTheDocument();
  });

  it("takes another project in hand when the keyboard focuses it, and shows that project's chart", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Hero />);
    const links = listLinks();
    const target = PROJECTS[3];

    // Act
    await tabTo(user, links[3]);

    // Assert
    expect(links[3]).toHaveFocus();
    expect(links[3]).toHaveAttribute(IN_HAND, "true");
    expect(linksInHand()).toHaveLength(1);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(target) })).toBeInTheDocument();
    expect(shownCharts()).toHaveLength(1);
  });

  it("keeps the chart out of the accessibility tree, since the note carries the same chart", () => {
    // Arrange
    withTheme(<Hero />);

    // Act
    const visibleImages = screen.queryAllByRole("img");

    // Assert
    expect(visibleImages).toHaveLength(0);
    expect(shownCharts()).toHaveLength(1);
  });
});

describe("Hero at the edges", () => {
  it("still renders its heading and action, and no list, with no projects", () => {
    // Arrange
    const projects = [];

    // Act
    withTheme(<Hero projects={projects} />);

    // Assert
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(/I build production AI end to end\./);
    expect(screen.getByRole("link", { name: `Email ${EMAIL}` })).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(screen.queryByRole("list", { name: "Newest systems" })).not.toBeInTheDocument();
    expect(shownCharts()).toHaveLength(0);
  });

  it("lists fewer than five when fewer are given", () => {
    // Arrange
    const projects = NOTES.slice(0, 2);

    // Act
    withTheme(<Hero projects={projects} />);

    // Assert
    expect(listLinks().map((link) => link.getAttribute("href"))).toEqual(["#note-alpha", "#note-beta"]);
  });

  it("lists a project whose sketch names no chart, and shows no chart while it is in hand", async () => {
    // Arrange
    const user = userEvent.setup();
    const projects = [{ id: "nochart", title: "No Chart Yet", year: "2026", sketch: "no-such-chart" }, NOTES[1]];
    withTheme(<Hero projects={projects} />);

    // Act
    const links = listLinks();

    // Assert: listed and in hand, with no chart
    expect(links[0]).toHaveAccessibleName("No Chart Yet, 2026");
    expect(links[0]).toHaveAttribute(IN_HAND, "true");
    expect(shownCharts()).toHaveLength(0);

    // Act: take the next one, which has a chart
    await user.hover(links[1]);

    // Assert
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(NOTES[1]) })).toBeInTheDocument();
  });

  it("falls back to the first project when the one in hand is no longer listed", async () => {
    // Arrange
    const user = userEvent.setup();
    const view = withTheme(<Hero projects={NOTES} />);
    await user.hover(listLinks()[1]);
    expect(listLinks()[1]).toHaveAttribute(IN_HAND, "true");

    // Act: the list changes and Beta, the one in hand, is gone
    view.rerender(inTheme(<Hero projects={[NOTES[0], NOTES[2]]} />));

    // Assert
    const links = listLinks();
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["#note-alpha", "#note-gamma"]);
    expect(links[0]).toHaveAttribute(IN_HAND, "true");
    expect(links[1]).not.toHaveAttribute(IN_HAND);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(NOTES[0]) })).toBeInTheDocument();
  });
});

describe("Systems", () => {
  it.each([
    ["an empty list", []],
    ["no list at all", undefined],
  ])("renders nothing when given %s", (what, projects) => {
    // Arrange
    const ui = <Systems projects={projects} />;

    // Act
    const view = withTheme(ui);

    // Assert
    expect(view.container).toBeEmptyDOMElement();
  });

  it("keeps the one in hand itself: the first, then whichever the pointer or the keyboard takes", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Systems projects={NOTES} />);
    const links = listLinks();

    // Assert: the first is in hand before anything is touched
    expect(linksInHand()).toEqual([links[0]]);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(NOTES[0]) })).toBeInTheDocument();

    // Act: the pointer rests on the third
    await user.hover(links[2]);

    // Assert
    expect(linksInHand()).toEqual([links[2]]);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(NOTES[2]) })).toBeInTheDocument();

    // Act: the keyboard reaches the second
    await tabTo(user, links[1]);

    // Assert
    expect(links[1]).toHaveFocus();
    expect(linksInHand()).toEqual([links[1]]);
    expect(screen.getByRole("img", { hidden: true, name: chartLabelOf(NOTES[1]) })).toBeInTheDocument();
    expect(shownCharts()).toHaveLength(1);
  });

  it("leaves the pointer's choice in hand after the pointer moves away", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Systems projects={NOTES} />);
    const links = listLinks();
    await user.hover(links[2]);

    // Act
    await user.unhover(links[2]);

    // Assert: the chart does not jump back to the first
    expect(linksInHand()).toEqual([links[2]]);
  });
});
