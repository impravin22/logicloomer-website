import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import theme from "../Themes";
import Projects, { aloneOnTheirRow } from "../Projects";
import Main from "../Main";
import { PROJECTS, OPEN } from "./data";
import { PLATES } from "../plates/specs";

// The page renders the Orchestrator through Main, so the reduced-motion branch
// is forced here as in redesign.test.js: the run resolves synchronously, with
// no packet timers. Prefixed "mock" so jest's hoist guard allows it.
const mockFlags = { reduce: true };
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return { __esModule: true, ...actual, useReducedMotion: () => mockFlags.reduce };
});

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const EMPTY_MESSAGE = "No field notes yet. They appear here when a project is added.";
const MAX_TABS = 60;
// Two real clicks on each of the seventeen cards: more than Jest's five
// seconds when the whole suite shares the machine.
const WHOLE_LIST_TIMEOUT_MS = 20000;

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The field-note cards come first in the document, then the open-source ones.
const projectArticles = () => screen.getAllByRole("article").slice(0, PROJECTS.length);
const openArticles = () => screen.getAllByRole("article").slice(PROJECTS.length);
const toggleFor = (title) =>
  screen.getByRole("button", { name: new RegExp(`^(Read|Hide) the note on ${escapeRegExp(title)}$`) });
// A repo link's name is its title, then the visually hidden ", on GitHub, opens
// in a new tab". The name computation used in tests puts a space before the
// hidden span, so the space is optional here.
const repoLinkName = (title) => new RegExp(`^${escapeRegExp(title)}\\s?, on GitHub, opens in a new tab$`);

// Moves focus with the Tab key, as a keyboard reader would, until it lands.
const tabTo = async (user, target) => {
  for (let step = 0; step < MAX_TABS && !target.matches(":focus"); step += 1) {
    await user.tab();
  }
};

describe("Field-note cards", () => {
  it("lists the cards in data order, each with the id note-<project id> and named by its title", () => {
    // Arrange
    const expectedIds = PROJECTS.map((project) => `note-${project.id}`);

    // Act
    withTheme(<Projects />);
    const everyArticle = screen.getAllByRole("article");
    const articles = everyArticle.slice(0, PROJECTS.length);

    // Assert
    expect(everyArticle).toHaveLength(PROJECTS.length + OPEN.length);
    expect(articles.map((article) => article.getAttribute("id"))).toEqual(expectedIds);
    articles.forEach((article, index) => expect(article).toHaveAccessibleName(PROJECTS[index].title));
  });

  it("gives every project title a real level-three heading", () => {
    // Arrange
    const titles = PROJECTS.map((project) => project.title);

    // Act
    withTheme(<Projects />);

    // Assert
    titles.forEach((title) =>
      expect(screen.getByRole("heading", { level: 3, name: title })).toBeInTheDocument()
    );
  });

  it("keeps every heading outside the toggle buttons", () => {
    // Arrange
    withTheme(<Projects />);

    // Act
    const buttons = screen.getAllByRole("button");

    // Assert
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => expect(within(button).queryByRole("heading")).not.toBeInTheDocument());
  });

  it("names each toggle by its project's title and points it at that project's note", () => {
    // Arrange
    withTheme(<Projects />);

    // Act
    const buttons = screen.getAllByRole("button");

    // Assert: every project in the data has a note, so each has one toggle
    expect(buttons).toHaveLength(PROJECTS.length);
    buttons.forEach((button, index) => {
      const project = PROJECTS[index];
      expect(button).toHaveAccessibleName(new RegExp(`^(Read|Hide) the note on ${escapeRegExp(project.title)}$`));
      expect(button).toHaveAttribute("aria-controls", `note-${project.id}-more`);
    });
  });

  it("starts with the first card open and every other card closed", () => {
    // Arrange
    withTheme(<Projects />);

    // Act
    const expanded = screen.getAllByRole("button").map((button) => button.getAttribute("aria-expanded"));

    // Assert
    expect(PROJECTS[0].defaultOpen).toBe(true);
    expect(expanded[0]).toBe("true");
    expect(expanded.slice(1).every((value) => value === "false")).toBe(true);
    expect(within(projectArticles()[0]).getByText("The outcome")).toBeVisible();
    expect(within(projectArticles()[1]).getByText("The outcome")).not.toBeVisible();
  });

  it("opens and closes each note on its own by click, keeping focus on its button", async () => {
    // Arrange: the buttons are found once; React keeps the same nodes
    const user = userEvent.setup({ delay: null });
    withTheme(<Projects />);
    const buttons = PROJECTS.map((project) => toggleFor(project.title));
    const expandedStates = () => buttons.map((button) => button.getAttribute("aria-expanded"));
    const others = (states, index) => states.filter((value, other) => other !== index);

    for (const [index, button] of buttons.entries()) {
      const before = expandedStates();
      const flipped = before[index] === "true" ? "false" : "true";

      // Act: flip this note
      await user.click(button);

      // Assert: only this note changed, and focus stayed on its button
      expect(button).toHaveAttribute("aria-expanded", flipped);
      expect(others(expandedStates(), index)).toEqual(others(before, index));
      expect(button).toHaveFocus();

      // Act: flip it back
      await user.click(button);

      // Assert: every note is as it was
      expect(expandedStates()).toEqual(before);
      expect(button).toHaveFocus();
    }
  }, WHOLE_LIST_TIMEOUT_MS);

  it("hides a closed note and shows an opened one", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Projects />);
    const button = toggleFor(PROJECTS[1].title);
    const outcome = within(projectArticles()[1]).getByText("The outcome");
    expect(outcome).not.toBeVisible();

    // Act
    await user.click(button);

    // Assert
    expect(outcome).toBeVisible();
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("opens and closes a note with %s on its focused button", async (keyName, keys) => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Projects />);
    const project = PROJECTS[1];
    const button = toggleFor(project.title);
    const outcome = within(projectArticles()[1]).getByText("The outcome");
    await tabTo(user, button);

    expect(button).toHaveFocus();

    // Act: open it from the keyboard
    await user.keyboard(keys);

    // Assert
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(outcome).toBeVisible();
    expect(button).toHaveFocus();

    // Act: close it again
    await user.keyboard(keys);

    // Assert: closed, focus kept, and the first card untouched
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(outcome).not.toBeVisible();
    expect(button).toHaveFocus();
    expect(toggleFor(PROJECTS[0].title)).toHaveAttribute("aria-expanded", "true");
  });

  it("says what the toggle will do: read the note when closed, hide it when open", async () => {
    // Arrange
    const user = userEvent.setup();
    withTheme(<Projects />);
    const button = toggleFor(PROJECTS[1].title);

    // Act
    await user.click(button);

    // Assert
    expect(button).toHaveAccessibleName(`Hide the note on ${PROJECTS[1].title}`);
    expect(toggleFor(PROJECTS[2].title)).toHaveAccessibleName(`Read the note on ${PROJECTS[2].title}`);
  });

  it("marks a note as freshly opened only after its button is used, never on first paint", async () => {
    // Arrange
    const user = userEvent.setup();
    const lead = PROJECTS[0];
    const other = PROJECTS[1];
    // The note's own opening tag, read from the card's markup.
    const noteTag = (project) => {
      const card = projectArticles()[PROJECTS.indexOf(project)];
      return new RegExp(`<div[^>]*id="note-${project.id}-more"[^>]*>`).exec(card.innerHTML)[0];
    };
    withTheme(<Projects />);

    // Assert: the lead's note is open on first paint and does not fade in
    expect(lead.defaultOpen).toBe(true);
    expect(noteTag(lead)).not.toContain("fresh");
    expect(noteTag(other)).not.toContain("fresh");

    // Act
    await user.click(toggleFor(other.title));

    // Assert: only the note whose button was used fades in
    expect(noteTag(other)).toContain("fresh");
    expect(noteTag(lead)).not.toContain("fresh");
  });

  it("opens whichever cards the data marks as open by default", () => {
    // Arrange
    const projects = [
      { id: "first", title: "First Note", what: "The first one.", year: "2026", outcome: "Shipped." },
      { id: "second", title: "Second Note", what: "The second one.", year: "2025", outcome: "Also shipped.", defaultOpen: true },
    ];

    // Act
    withTheme(<Projects projects={projects} repos={[]} />);

    // Assert
    expect(toggleFor("First Note")).toHaveAttribute("aria-expanded", "false");
    expect(toggleFor("Second Note")).toHaveAttribute("aria-expanded", "true");
  });
});

describe("Field notes at the edges", () => {
  it("shows the empty message, and no legend, when there are no projects", () => {
    // Arrange
    const projects = [];

    // Act
    withTheme(<Projects projects={projects} />);

    // Assert
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "How to read a chart" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "In the open" })).toBeInTheDocument();
  });

  it("leaves the open-source block out when there are no repos", () => {
    // Arrange
    const repos = [];

    // Act
    withTheme(<Projects projects={[]} repos={repos} />);

    // Assert
    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "In the open" })).not.toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("still renders the card of a project whose sketch names no chart, with no chart", () => {
    // Arrange
    const projects = [
      {
        id: "ghost",
        title: "Ghost Chart",
        what: "A project whose chart has not been drawn yet.",
        year: "2026",
        sketch: "no-such-chart",
        outcome: "It still ships.",
      },
    ];

    // Act
    withTheme(<Projects projects={projects} repos={[]} />);

    // Assert
    expect(PLATES["no-such-chart"]).toBeUndefined();
    expect(screen.getByRole("article", { name: "Ghost Chart" })).toHaveAttribute("id", "note-ghost");
    expect(screen.getByRole("heading", { level: 3, name: "Ghost Chart" })).toBeInTheDocument();
    expect(toggleFor("Ghost Chart")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a project with only a title, a one-line summary and a year as a card with no toggle", () => {
    // The card's one-line summary is the `what` field; with no brief, decision,
    // outcome or link there is no note, so the code draws no toggle.
    // Arrange
    const projects = [{ id: "bare", title: "Bare Note", what: "One line about the work.", year: "2024" }];

    // Act
    withTheme(<Projects projects={projects} repos={[]} />);

    // Assert
    expect(screen.getByRole("heading", { level: 3, name: "Bare Note" })).toBeInTheDocument();
    expect(screen.getByText("One line about the work.")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("Cards set across their row", () => {
  // Stand-in notes: one that takes a cell, the lead, and one with no chart.
  const cell = (id) => ({ id, title: id, sketch: "lpr" });
  const lead = (id) => ({ ...cell(id), defaultOpen: true });
  const bare = (id) => ({ id, title: id });

  // Walks the two-across grid as the browser fills it and counts the cells
  // left empty: one each time a lone card is followed by a full row or the end.
  const emptyCells = (projects, wide) => {
    const walked = projects.reduce(
      (seen, project) => {
        const acrossTheRow = Boolean(project.defaultOpen) || !project.sketch || wide.has(project.id);
        return acrossTheRow
          ? { column: 0, empty: seen.empty + seen.column }
          : { column: (seen.column + 1) % 2, empty: seen.empty };
      },
      { column: 0, empty: 0 }
    );
    return walked.empty + walked.column;
  };

  it.each([
    ["no cards", [], []],
    ["an even run", [cell("a"), cell("b")], []],
    ["an odd run", [cell("a"), cell("b"), cell("c")], ["c"]],
    ["a single card", [cell("a")], ["a"]],
    ["an even run after the lead", [lead("l"), cell("a"), cell("b")], []],
    ["an odd run after the lead", [lead("l"), cell("a")], ["a"]],
    ["an even run before a card with no chart", [cell("a"), cell("b"), bare("x")], []],
    ["an odd run before a card with no chart", [cell("a"), bare("x"), cell("b"), cell("c")], ["a"]],
    ["two odd runs", [cell("a"), bare("x"), cell("b")], ["a", "b"]],
    ["only cards that are across the row already", [lead("l"), bare("x")], []],
  ])("picks out each card left alone on its row: %s", (what, projects, expected) => {
    // Arrange
    const before = emptyCells(projects, new Set());

    // Act
    const wide = aloneOnTheirRow(projects);

    // Assert
    expect([...wide]).toEqual(expected);
    expect(before).toBe(expected.length);
    expect(emptyCells(projects, wide)).toBe(0);
  });

  it("draws the card left alone on its row the way it draws the lead, across the row", () => {
    // Arrange
    const projects = [lead("l"), cell("a"), cell("b"), cell("c")];
    // The class a card's list item is styled with: one for a card set across
    // the row, another for a card in a cell.
    const stylingOf = (title) =>
      screen.getAllByRole("listitem").find((item) => within(item).queryByRole("article", { name: title })).className;

    // Act
    withTheme(<Projects projects={projects} repos={[]} />);

    // Assert
    expect(stylingOf("c")).toBe(stylingOf("l"));
    expect(stylingOf("a")).toBe(stylingOf("b"));
    expect(stylingOf("a")).not.toBe(stylingOf("l"));
  });

  it("leaves no empty cell in the page's own field notes", () => {
    // Arrange
    const projects = PROJECTS;

    // Act
    const wide = aloneOnTheirRow(projects);

    // Assert
    expect(emptyCells(projects, wide)).toBe(0);
    wide.forEach((id) => expect(projects.map((project) => project.id)).toContain(id));
  });

  it("does not change the list it is given", () => {
    // Arrange
    const projects = Object.freeze([cell("a"), bare("x"), cell("b")].map(Object.freeze));

    // Act
    const pick = () => aloneOnTheirRow(projects);

    // Assert
    expect(pick).not.toThrow();
    expect(projects.map((project) => project.id)).toEqual(["a", "x", "b"]);
  });
});

describe("Open-source cards", () => {
  it("gives each card exactly one link, named by its title, opening safely in a new tab", () => {
    // Arrange
    withTheme(<Projects />);

    // Act
    const articles = openArticles();

    // Assert
    expect(articles).toHaveLength(OPEN.length);
    articles.forEach((article, index) => {
      const repo = OPEN[index];
      const links = within(article).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAccessibleName(repoLinkName(repo.title));
      expect(links[0]).toHaveAttribute("href", repo.href);
      expect(links[0]).toHaveAttribute("target", "_blank");
      expect(links[0].getAttribute("rel").split(/\s+/)).toEqual(expect.arrayContaining(["noreferrer", "noopener"]));
    });
  });

  it("draws each open-source card's chart, named by the chart's label", () => {
    // Arrange
    withTheme(<Projects />);

    // Act
    const articles = openArticles();

    // Assert
    articles.forEach((article, index) =>
      expect(within(article).getByRole("img")).toHaveAccessibleName(PLATES[OPEN[index].sketch].label)
    );
  });

  it("renders an open-source card with no chart when its entry names none", () => {
    // Arrange
    const repos = [
      { id: "plain", title: "Plain Repo", line: "A build with no chart yet.", href: "https://github.com/impravin22/plain" },
    ];

    // Act
    withTheme(<Projects projects={[]} repos={repos} />);

    // Assert
    expect(screen.getByRole("link", { name: repoLinkName("Plain Repo") })).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("The owner's wording", () => {
  it("shows the Marketing Operations note and never the text GMA anywhere on the page", () => {
    // Arrange
    const ui = <Main />;

    // Act
    render(ui);

    // Assert
    expect(screen.getByRole("heading", { level: 3, name: "Marketing Operations" })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/GMA/);
    screen
      .getAllByRole("img", { hidden: true })
      .forEach((image) => expect(image.getAttribute("aria-label")).not.toMatch(/GMA/));
  });
});
