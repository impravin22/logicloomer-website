import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import Hero from "./Hero";
import Orchestrator, { STEP_MS } from "./Orchestrator";
import Projects from "./Projects";
import Navigation from "./Navigation";
import About from "./About";
import Contact from "./Contact";
import Experience from "./Experience";

// Most tests force the reduced-motion branch so the orchestrator resolves
// synchronously (full trace, no packet timers) and stays deterministic. The
// timer/race tests flip mockFlags.reduce to false to exercise the real
// setTimeout schedule. Prefixed "mock" so jest's hoist guard allows it; the
// closure defers the read to call time, past the const's initialisation.
const mockFlags = { reduce: true };
jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return { __esModule: true, ...actual, useReducedMotion: () => mockFlags.reduce };
});

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Hero", () => {
  it("renders Pravy as the h1 with the real-voice intro", () => {
    withTheme(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: /pravy/i })).toBeInTheDocument();
    expect(screen.getByText(/production AI/i)).toBeInTheDocument();
    expect(screen.getByText(/open to building the next one/i)).toBeInTheDocument();
  });

  it("leads with the current forward-deployed role, not the old architect one", () => {
    withTheme(<Hero />);
    expect(screen.getByText(/now i lead a forward-deployed AI pod/i)).toBeInTheDocument();
    expect(screen.queryByText(/most recently i was sole architect/i)).toBeNull();
  });

  it("links email (mailto) and GitHub, opened safely", () => {
    withTheme(<Hero />);
    expect(screen.getByRole("link", { name: /impravin22@gmail.com/i })).toHaveAttribute(
      "href",
      "mailto:impravin22@gmail.com"
    );
    const gh = screen.getByRole("link", { name: /github/i });
    expect(gh).toHaveAttribute("href", expect.stringContaining("github.com/impravin22"));
    expect(gh).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});

describe("Orchestrator", () => {
  it("offers the request chips and the failure toggle", () => {
    withTheme(<Orchestrator />);
    expect(screen.getByRole("button", { name: /summarise a pdf/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /debug a stack trace/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /what is our q3 revenue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /inject failure/i })).toBeInTheDocument();
  });

  it("draws every stage of the system", () => {
    withTheme(<Orchestrator />);
    ["Request", "Router", "Retriever", "Code-exec", "Analyst", "Validator", "Answer"].forEach(
      (n) => expect(screen.getByText(n)).toBeInTheDocument()
    );
  });

  it("routes a picked request and streams the matching trace", () => {
    withTheme(<Orchestrator />);
    fireEvent.click(screen.getByRole("button", { name: /what is our q3 revenue/i }));
    expect(screen.getByText(/intent classified: analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/route: analyst/i)).toBeInTheDocument();
  });

  it("reroutes through a fallback when failure is injected", () => {
    withTheme(<Orchestrator />);
    fireEvent.click(screen.getByRole("button", { name: /inject failure/i }));
    fireEvent.click(screen.getByRole("button", { name: /debug a stack trace/i }));
    expect(screen.getByText(/timeout injected/i)).toBeInTheDocument();
    expect(screen.getByText(/fallback to retriever/i)).toBeInTheDocument();
    expect(screen.getByText(/flagged degraded/i)).toBeInTheDocument();
  });

  it("matches free-text to the nearest intent", () => {
    withTheme(<Orchestrator />);
    fireEvent.change(screen.getByRole("textbox", { name: /type a request/i }), {
      target: { value: "please debug this python error" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /^route$/i }).closest("form"));
    expect(screen.getByText(/intent classified: code/i)).toBeInTheDocument();
  });

  it("discards a stale run when a new request fires mid-animation", () => {
    mockFlags.reduce = false;
    jest.useFakeTimers();
    try {
      withTheme(<Orchestrator />);
      // the mount kicks off the default "summarise" run; advance one hop in
      act(() => jest.advanceTimersByTime(STEP_MS + 40));
      // interrupt with a different request before the first finishes
      fireEvent.click(screen.getByRole("button", { name: /what is our q3 revenue/i }));
      act(() => jest.advanceTimersByTime(STEP_MS * 7));
      // only the second run's trace should have painted; the stale one is gone
      expect(screen.getByText(/intent classified: analytics/i)).toBeInTheDocument();
      expect(screen.queryByText(/intent classified: retrieval/i)).toBeNull();
    } finally {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      mockFlags.reduce = true;
    }
  });

  it("cancels pending timers on unmount without a late state update", () => {
    mockFlags.reduce = false;
    jest.useFakeTimers();
    try {
      const { unmount } = withTheme(<Orchestrator />);
      act(() => jest.advanceTimersByTime(STEP_MS + 40));
      unmount();
      expect(() => act(() => jest.advanceTimersByTime(STEP_MS * 7))).not.toThrow();
    } finally {
      jest.useRealTimers();
      mockFlags.reduce = true;
    }
  });
});

describe("Field notes", () => {
  it("opens the featured Auto Issue Solver by default with its human gate", () => {
    withTheme(<Projects />);
    expect(screen.getByRole("button", { name: /Auto Issue Solver/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText(/reproduce the error with a failing test first/i)).toBeInTheDocument();
    expect(screen.getByText(/production still needs a human approval/i)).toBeInTheDocument();
  });

  it("keeps exactly one note open at a time", () => {
    withTheme(<Projects />);
    const expanded = () =>
      screen.getAllByRole("button").filter((b) => b.getAttribute("aria-expanded") === "true");
    expect(expanded()).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /Rapid-OKR/i }));
    expect(expanded()).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Rapid-OKR/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText(/prompts for judgment, code for determinism/i)).toBeInTheDocument();
  });

  it("closes the open note when its header is clicked again, leaving none open", () => {
    withTheme(<Projects />);
    const btn = screen.getByRole("button", { name: /Auto Issue Solver/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getAllByRole("button").filter((b) => b.getAttribute("aria-expanded") === "true")
    ).toHaveLength(0);
  });

  it("explains the MCP gateway and the workflow read when opened", () => {
    withTheme(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: /One-Login MCP Gateway/i }));
    expect(screen.getByText(/each product plugs in its own credential/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /one login in front of many/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Workflow Intelligence/i }));
    expect(screen.getByText(/no name ever reaches the analysis/i)).toBeInTheDocument();
  });

  it("draws an accessible sketch for every note that has one", () => {
    withTheme(<Projects />);
    // [note header, the sketch's accessible name]. The exiting panel can linger
    // for a frame under AnimatePresence, so each sketch is found by its own name.
    const sketched = [
      [/Auto Issue Solver/i, /auto-fix loop/i],
      [/One-Login MCP Gateway/i, /one login in front of many/i],
      [/Workflow Intelligence/i, /identity stripped at extraction/i],
      [/Rapid-OKR/i, /rapid-okr data flow/i],
      [/AI Sales Assistant/i, /multi-agent fan-out/i],
      [/SensAI Sketch Recognition/i, /sketch recognition pipeline/i],
      [/Human-Centric Vision/i, /pose, gaze and expression/i],
      [/VLM Document Pipeline/i, /auditor loop/i],
    ];
    sketched.forEach(([note, sketch]) => {
      const btn = screen.getByRole("button", { name: note });
      if (btn.getAttribute("aria-expanded") !== "true") fireEvent.click(btn);
      const img = screen.getByRole("img", { name: sketch });
      expect(img.querySelectorAll("rect").length).toBeGreaterThan(0);
      expect(img.querySelectorAll("path").length).toBeGreaterThan(0);
    });
  });

  it("lists every project as a heading", () => {
    withTheme(<Projects />);
    [
      "Auto Issue Solver",
      "One-Login MCP Gateway",
      "Workflow Intelligence",
      "Rapid-OKR",
      "AI Sales Assistant",
      "SensAI Sketch Recognition",
      "Human-Centric Vision",
      "VLM Document Pipeline",
      "Large-Scale Object Detection",
      "Model Distillation",
      "Licence-Plate Recognition",
      "LCD Defect Detection",
      "Blend n Bubbles",
    ].forEach(
      (t) => expect(screen.getByRole("heading", { name: new RegExp(t, "i") })).toBeInTheDocument()
    );
  });

  it("opens a computer-vision note and reveals its decision", () => {
    withTheme(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: /SensAI Sketch Recognition/i }));
    expect(screen.getByText(/sequence of strokes you draw/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /LCD Defect Detection/i }));
    expect(screen.getByText(/variational autoencoder trained only on good panels/i)).toBeInTheDocument();
  });

  it("toggles a row open and reveals its repo link with safe rel", async () => {
    withTheme(<Projects />);
    const btn = screen.getByRole("button", { name: /Blend n Bubbles/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    const repo = await screen.findByRole("link", { name: /view repo/i });
    expect(repo).toHaveAttribute(
      "href",
      expect.stringContaining("github.com/impravin22/blendnbubbles")
    );
    expect(repo).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links the open-source repos as real, safe proof", () => {
    withTheme(<Projects />);
    ["MedBuddy", "Pravy's Market Bot", "Outfit Recommender", "Medical Summary Builder"].forEach(
      (t) => expect(screen.getByRole("link", { name: new RegExp(t, "i") })).toBeInTheDocument()
    );
    const med = screen.getByRole("link", { name: /medbuddy/i });
    expect(med).toHaveAttribute("href", "https://github.com/impravin22/medbuddy");
    expect(med).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(med).toHaveAttribute("target", "_blank");
  });

  it("never renders a '#' placeholder href", () => {
    withTheme(<Projects />);
    screen.queryAllByRole("link").forEach((l) => expect(l).not.toHaveAttribute("href", "#"));
  });
});

describe("Experience", () => {
  it("lists the Pod Lead role first as the only current role", () => {
    withTheme(<Experience />);
    const roles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(roles[0]).toBe("Forward Deployment Pod Lead");
    expect(screen.getAllByText(/to now$/)).toHaveLength(1);
    expect(screen.getByText("Jul 2026 to now")).toBeInTheDocument();
  });

  it("closes the architect role at June 2026, with no overlap", () => {
    withTheme(<Experience />);
    expect(screen.getByRole("heading", { name: "Senior AI Systems Architect" })).toBeInTheDocument();
    expect(screen.getByText("Mar 2022 to Jun 2026")).toBeInTheDocument();
    expect(screen.queryByText("Mar 2022 to now")).toBeNull();
  });

  it("gives every entry a date range", () => {
    withTheme(<Experience />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    const dates = screen.getAllByText(/\b(19|20)\d{2}\b.* to /);
    expect(dates).toHaveLength(headings.length);
  });
});

describe("Navigation", () => {
  it("links the CV to the bundled PDF in a new tab, with no theme toggle", () => {
    withTheme(<Navigation />);
    const cv = screen.getByRole("link", { name: /^cv$/i });
    expect(cv).toHaveAttribute("href", expect.stringContaining("Praveen_Chittem_CV_2026.pdf"));
    expect(cv).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("About + Contact", () => {
  it("renders the capability list, forward deployment first", () => {
    withTheme(<About />);
    const terms = screen.getAllByRole("term").map((t) => t.textContent);
    expect(terms[0]).toBe("Forward deployment");
    expect(screen.getByText(/AI architecture/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /what i do/i })).toBeInTheDocument();
  });

  it("copies the email on click and never invents a LinkedIn link", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    withTheme(<Contact />);
    expect(screen.queryByText(/linkedin/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));
    expect(writeText).toHaveBeenCalledWith("impravin22@gmail.com");
    await screen.findByRole("button", { name: /copied/i });
  });
});
