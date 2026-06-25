import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import { lightTheme, darkTheme } from "./Themes";
import { ThemeToggleContext } from "./themeContext";
import GlobalStyle from "../globalStyles";

import Navigation from "./Navigation";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Impact from "./Impact";
import Contact from "./Contact";
import Footer from "./Footer";

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  position: relative;
  transition: background 0.4s ease, color 0.4s ease;
`;

const readInitialTheme = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
  } catch (err) {
    /* localStorage unavailable (private mode) — fall back to default */
  }
  return true; // dark by default
};

const Main = () => {
  const [isDark, setIsDark] = useState(readInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (err) {
      /* ignore persistence failure */
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <ThemeToggleContext.Provider value={{ isDark, toggleTheme }}>
        <GlobalStyle />
        <AppContainer>
          <Navigation />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Impact />
            <Contact />
          </motion.main>
          <Footer />
        </AppContainer>
      </ThemeToggleContext.Provider>
    </ThemeProvider>
  );
};

export default Main;
