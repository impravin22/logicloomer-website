import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./Themes";
import { ThemeToggleContext } from "./themeContext";
import Hero from "./Hero";
import Projects from "./Projects";
import Navigation from "./Navigation";
import Contact from "./Contact";
import Impact from "./Impact";

const withTheme = (ui) => render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);

const withNav = (isDark, toggleTheme) =>
  render(
    <ThemeProvider theme={darkTheme}>
      <ThemeToggleContext.Provider value={{ isDark, toggleTheme }}>
        <Navigation />
      </ThemeToggleContext.Provider>
    </ThemeProvider>
  );

describe("Hero", () => {
  it("renders the name as the h1 and the credo", () => {
    withTheme(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /praveen kumar chittem/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/prompts for judgment, code for determinism/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/from a blank repo to a platform serving/i)
    ).toBeInTheDocument();
  });

  it("links the primary CTA to work and the résumé to the CV, opened safely", () => {
    withTheme(<Hero />);
    expect(screen.getByRole("link", { name: /view work/i })).toHaveAttribute(
      "href",
      "#work"
    );
    const cv = screen.getByRole("link", { name: /download résumé/i });
    expect(cv).toHaveAttribute(
      "href",
      expect.stringContaining("Praveen_Chittem_CV_2026.pdf")
    );
    expect(cv).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("shows the at-a-glance spec card", () => {
    withTheme(<Hero />);
    expect(screen.getByText(/at a glance/i)).toBeInTheDocument();
    expect(screen.getByText("AI Systems Architect")).toBeInTheDocument();
    expect(screen.getByText("Open to build")).toBeInTheDocument();
  });
});

describe("Projects", () => {
  it("renders the featured platform with its stat captions", () => {
    withTheme(<Projects />);
    expect(screen.getByText(/Rapid-OKR/i)).toBeInTheDocument();
    expect(screen.getByText(/employees served/i)).toBeInTheDocument();
    expect(screen.getByText(/api endpoints/i)).toBeInTheDocument();
    expect(screen.getByText(/unit tests/i)).toBeInTheDocument();
  });

  it("renders a real external link where one exists, with safe rel", () => {
    withTheme(<Projects />);
    const linked = screen.getByRole("link", { name: /Blend n Bubbles/i });
    expect(linked).toHaveAttribute(
      "href",
      expect.stringContaining("github.com/impravin22/blendnbubbles")
    );
    expect(linked).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(linked).toHaveAttribute("target", "_blank");
  });

  it("never renders a placeholder '#' href", () => {
    withTheme(<Projects />);
    screen
      .queryAllByRole("link")
      .forEach((link) => expect(link).not.toHaveAttribute("href", "#"));
  });
});

describe("Navigation", () => {
  it("calls the theme toggle and exposes the correct accessible label", () => {
    const toggleTheme = jest.fn();
    withNav(true, toggleTheme);
    const btn = screen.getByRole("button", { name: /switch to light theme/i });
    fireEvent.click(btn);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("points the résumé link at the CV pdf in a new tab", () => {
    withNav(true, () => {});
    const cv = screen.getByRole("link", { name: /résumé/i });
    expect(cv).toHaveAttribute(
      "href",
      expect.stringContaining("Praveen_Chittem_CV_2026.pdf")
    );
    expect(cv).toHaveAttribute("target", "_blank");
  });
});

describe("Contact", () => {
  it("exposes the email and does not invent a LinkedIn link", () => {
    withTheme(<Contact />);
    expect(
      screen.getByRole("link", { name: /impravin22@gmail.com/i })
    ).toHaveAttribute("href", "mailto:impravin22@gmail.com");
    expect(screen.queryByText(/linkedin/i)).toBeNull();
  });
});

describe("Impact", () => {
  it("renders all four impact metrics", () => {
    withTheme(<Impact />);
    ["1,300+", "2×", "15×", "8-GPU"].forEach((metric) =>
      expect(screen.getByText(metric)).toBeInTheDocument()
    );
  });
});
