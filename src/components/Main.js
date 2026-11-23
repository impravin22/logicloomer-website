import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./Themes";
import GlobalStyle from "../globalStyles";

import { Shell, Lnk, NewTab, role } from "./_dossier";
import ErrorBoundary from "./ErrorBoundary";
import { MotionProvider } from "./motion";
import { CV_URL, EMAIL } from "./site";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Projects from "./Projects";
import Sandbox from "./Sandbox";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Footer from "./Footer";

const Down = styled.main`
  display: grid;
  align-content: center;
  min-height: 100dvh;
  padding-block: ${(p) => p.theme.space["2xl"]};

  h1 {
    ${role("section")}
    margin: 0;
  }
  p {
    ${role("lead")}
    max-width: 46ch;
    margin: ${(p) => p.theme.space.md} 0 0;
    color: ${(p) => p.theme.stone};
  }
`;

// What the reader gets in place of the page if any part of it throws while it
// is drawn: what happened, what to do next, and the two ways to reach me. The
// error itself goes to the log.
const PageDown = () => (
  <Down>
    <Shell>
      <h1>This page could not be shown.</h1>
      <p>
        Reload it to try again. To reach me in the meantime, email{" "}
        <Lnk href={`mailto:${EMAIL}`}>{EMAIL}</Lnk> or{" "}
        <Lnk href={CV_URL} target="_blank" rel="noreferrer noopener">
          read the CV
          <NewTab />
        </Lnk>
        .
      </p>
    </Shell>
  </Down>
);

/**
 * The /in-short/ page: the theme, then every section behind one boundary,
 * with one answer for all of them to "is the background motion paused?".
 *
 * @returns {React.ReactElement}
 */
const Main = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <ErrorBoundary fallback={<PageDown />}>
      <MotionProvider>
        <Navigation />
        <main>
          <Hero />
          <Projects />
          <Sandbox />
          <About />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </MotionProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default Main;
