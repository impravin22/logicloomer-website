import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "./Themes";
import GlobalStyle from "../globalStyles";

import Navigation from "./Navigation";
import Hero from "./Hero";
import Projects from "./Projects";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Footer from "./Footer";

const Main = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Navigation />
    <main>
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Contact />
    </main>
    <Footer />
  </ThemeProvider>
);

export default Main;
