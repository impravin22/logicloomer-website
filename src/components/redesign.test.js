import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import Hero from "./Hero";
import SystemGraph from "./SystemGraph";
import Projects from "./Projects";
import Navigation from "./Navigation";
import About from "./About";
import Contact from "./Contact";

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Hero", () => {
  it("renders Pravy as the h1 with the real-voice intro", () => {
    withTheme(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: /pravy/i })).toBeInTheDocument();
    expect(screen.getByText(/production AI/i)).toBeInTheDocument();
    expect(screen.getByText(/open to building the next one/i)).toBeInTheDocument();
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

describe("SystemGraph", () => {
  it("renders an accessible figure and a Replay control", () => {
    withTheme(<SystemGraph />);
    expect(screen.getByRole("img", { name: /orchestration/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replay/i })).toBeInTheDocument();
  });
});

describe("Field notes", () => {
  it("opens the featured Rapid-OKR by default with its story", () => {
    withTheme(<Projects />);
    expect(screen.getByRole("heading", { name: /Rapid-OKR/i })).toBeInTheDocument();
    expect(
      screen.getByText(/prompts for judgment, code for determinism/i)
    ).toBeInTheDocument();
  });

  it("lists every project as a heading", () => {
    withTheme(<Projects />);
    [
      "Rapid-OKR",
      "AI Sales Assistant",
      "VLM Document Pipeline",
      "Large-Scale Object Detection",
      "Model Distillation",
      "Blend n Bubbles",
    ].forEach(
      (t) => expect(screen.getByRole("heading", { name: new RegExp(t, "i") })).toBeInTheDocument()
    );
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

  it("never renders a '#' placeholder href", () => {
    withTheme(<Projects />);
    screen.queryAllByRole("link").forEach((l) => expect(l).not.toHaveAttribute("href", "#"));
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
  it("renders the capability list", () => {
    withTheme(<About />);
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
