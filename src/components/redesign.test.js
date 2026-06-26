import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import Hero from "./Hero";
import Projects from "./Projects";
import Navigation from "./Navigation";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";

const withTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Hero", () => {
  it("renders Pravy as the h1 with the real-voice intro", () => {
    withTheme(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /pravy/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/production AI/i)).toBeInTheDocument();
    expect(screen.getByText(/open to building the next one/i)).toBeInTheDocument();
  });

  it("links email (mailto) and GitHub, opened safely", () => {
    withTheme(<Hero />);
    expect(
      screen.getByRole("link", { name: /impravin22@gmail.com/i })
    ).toHaveAttribute("href", "mailto:impravin22@gmail.com");
    const gh = screen.getByRole("link", { name: /github/i });
    expect(gh).toHaveAttribute("href", expect.stringContaining("github.com/impravin22"));
    expect(gh).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});

describe("Projects", () => {
  it("renders the featured platform and the curated index", () => {
    withTheme(<Projects />);
    expect(screen.getByText(/Rapid-OKR/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /AI Sales Assistant/i })
    ).toBeInTheDocument();
  });

  it("links real projects and never renders a '#' placeholder", () => {
    withTheme(<Projects />);
    expect(
      screen.getByRole("link", { name: /Blend n Bubbles/i })
    ).toHaveAttribute("href", expect.stringContaining("github.com/impravin22/blendnbubbles"));
    screen
      .queryAllByRole("link")
      .forEach((l) => expect(l).not.toHaveAttribute("href", "#"));
  });
});

describe("Navigation", () => {
  it("links the CV to the bundled PDF in a new tab, with no theme toggle", () => {
    withTheme(<Navigation />);
    const cv = screen.getByRole("link", { name: /^cv$/i });
    expect(cv).toHaveAttribute(
      "href",
      expect.stringContaining("Praveen_Chittem_CV_2026.pdf")
    );
    expect(cv).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("About + Experience", () => {
  it("renders the capability list and the roles", () => {
    withTheme(
      <>
        <About />
        <Experience />
      </>
    );
    expect(screen.getByText(/AI architecture/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Senior AI Systems Architect/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Neurelli/i)).toBeInTheDocument();
  });
});

describe("Contact", () => {
  it("copies the email on click and never invents a LinkedIn link", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    withTheme(<Contact />);
    expect(screen.queryByText(/linkedin/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));
    expect(writeText).toHaveBeenCalledWith("impravin22@gmail.com");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument()
    );
  });
});
