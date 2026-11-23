import React from "react";
import styled, { keyframes } from "styled-components";
import { Shell, role, NewTab } from "./_dossier";
import { CV_URL, MAP_URL } from "./site";

const travel = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// One line that stays on screen, so every section is one tap away from anywhere.
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 300;
  /* glass, so the hero's threads run on behind it; solid where a browser
     cannot mix a colour */
  background: ${(p) => p.theme.paper};
  background: color-mix(in srgb, ${(p) => p.theme.paper} 64%, transparent);
  backdrop-filter: blur(14px);
`;

const Row = styled(Shell)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: ${(p) => p.theme.layout.nav};
`;

const Mark = styled.a`
  font-family: ${(p) => p.theme.grot};
  ${role("title")}
  color: ${(p) => p.theme.ink};
  display: inline-flex;
  align-items: center;
  min-height: ${(p) => p.theme.layout.control};
`;

const Nav = styled.nav`
  ${role("small")}
  display: flex;
  align-items: center;
  gap: clamp(${(p) => p.theme.space.sm}, 3vw, ${(p) => p.theme.space.lg});
  color: ${(p) => p.theme.stone};

  a {
    display: inline-flex;
    align-items: center;
    min-height: ${(p) => p.theme.layout.control};
    white-space: nowrap;
  }
  a:not([class]) {
    transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};
  }
  a:not([class]):hover {
    color: ${(p) => p.theme.ink};
  }
`;

// The route travelled: a line under the nav that runs from one edge of the
// page to the other as the reader moves from its top to its end. It is left
// out where the browser cannot tie an animation to scrolling, and where
// motion is reduced.
const Travelled = styled.div`
  display: none;

  @supports (animation-timeline: scroll()) {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${(p) => p.theme.space["3xs"]};
    background: ${(p) => p.theme.mark};
    transform-origin: left center;
    animation: ${travel} linear both;
    animation-timeline: scroll(root block);
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Navigation = () => (
  <Bar>
    <Travelled aria-hidden="true" />
    <Row as="div">
      <Mark href="#top" aria-label="Pravy, home">
        pravy.
      </Mark>
      <Nav aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href={MAP_URL}>Map</a>
        <a href={CV_URL} target="_blank" rel="noreferrer noopener">
          CV
          <NewTab />
        </a>
      </Nav>
    </Row>
  </Bar>
);

export default Navigation;
