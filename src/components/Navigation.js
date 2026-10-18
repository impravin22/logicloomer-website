import React from "react";
import styled from "styled-components";
import { Shell, Lnk } from "./_dossier";

// This app is published under /in-short/. The map (home/) is the site's home
// page and the CV sits beside it, one level up. The app uses a HashRouter, so
// the document URL never goes deeper than /in-short/ and "../" stays the root.
const CV_URL = "../Praveen_Chittem_CV_2026.pdf";
const MAP_URL = "../";

const Bar = styled.header`
  padding: 34px 0 0;
`;

const Row = styled(Shell)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const Mark = styled.a`
  font-family: ${(p) => p.theme.grot};
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.ink};
  text-decoration: none;

  span {
    color: ${(p) => p.theme.pine};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 22px;
  font-size: 15px;
  color: ${(p) => p.theme.stone};

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ${(p) => p.theme.ease};
  }
  a:not([class]):hover {
    color: ${(p) => p.theme.ink};
  }

  @media (max-width: 560px) {
    gap: 16px;
    font-size: 14px;
  }
`;

const Navigation = () => (
  <Bar>
    <Row as="div">
      <Mark href="#top" aria-label="Pravy, home">
        pravy<span>.</span>
      </Mark>
      <Nav aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href={MAP_URL}>Map</a>
        <Lnk href={CV_URL} target="_blank" rel="noreferrer noopener">
          CV
        </Lnk>
      </Nav>
    </Row>
  </Bar>
);

export default Navigation;
