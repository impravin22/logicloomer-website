// Shared primitives: one wide container on a twelve-column grid, type roles,
// an underlined link, the page's two buttons, and the surfaces a chart or a
// field sits on.
import React from "react";
import styled, { css, ThemeProvider } from "styled-components";

// A type role sets size, leading, tracking, weight and width together, and
// may name its face. Components pick a role; none of them sets tracking by
// hand.
export const role = (name) => css`
  ${(p) => (p.theme.type[name].face ? `font-family: ${p.theme.type[name].face};` : "")}
  font-size: ${(p) => p.theme.type[name].size};
  line-height: ${(p) => p.theme.type[name].line};
  letter-spacing: ${(p) => p.theme.type[name].track};
  font-weight: ${(p) => p.theme.type[name].weight};
  font-stretch: ${(p) => p.theme.type[name].width};
`;

export const Shell = styled.div`
  width: 100%;
  max-width: ${(p) => p.theme.layout.container};
  margin-inline: auto;
  padding-inline: ${(p) => p.theme.layout.gutter};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: ${(p) => p.theme.layout.gap};
`;

// Sections part by space alone. $gap picks the step: "s", "m" (default) or "l".
export const Block = styled.section`
  position: relative;
  padding-top: ${(p) => p.theme.gap[p.$gap || "m"]};
`;

const OpenerHead = styled.div`
  margin-bottom: ${(p) => p.theme.space.xl};

  h2 {
    ${role("section")}
    max-width: 30ch;
  }
  .lede {
    ${role("lead")}
    color: ${(p) => p.theme.stone};
    margin-top: ${(p) => p.theme.space.md};
    max-width: 52ch;
  }

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    margin-bottom: ${(p) => p.theme.space["2xl"]};
  }
`;

// A section's heading and, at most, one line under it.
export const Opener = ({ title, lede, id }) => (
  <OpenerHead>
    <h2 id={id}>{title}</h2>
    {lede ? <p className="lede">{lede}</p> : null}
  </OpenerHead>
);

// a text link: underlined at rest, the accent on hover
export const Lnk = styled.a`
  color: ${(p) => p.theme.pine};
  font-weight: 500;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.32em;
  transition: color ${(p) => p.theme.dur.short} ${(p) => p.theme.ease};

  &:hover {
    color: ${(p) => p.theme.pineDeep};
  }
  &:active {
    color: ${(p) => p.theme.ink};
  }
`;

// What the page's two buttons share: a pill tall enough to press. A label
// too long for a narrow screen wraps inside it; it is never cut off when the
// reader sets the text larger.
const pill = css`
  display: inline-flex;
  align-items: center;
  min-height: ${(p) => p.theme.layout.primary};
  padding: ${(p) => p.theme.space.xs} ${(p) => p.theme.space.lg};
  border-radius: ${(p) => p.theme.pill};
  font-weight: 500;
  text-align: center;
  overflow-wrap: anywhere;

  &:active {
    transform: translateY(1px);
  }
  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    white-space: nowrap;
  }
`;

// The page's filled button: a pill in the accent.
export const Primary = styled.a`
  ${pill}
  background: ${(p) => p.theme.accent};
  color: ${(p) => p.theme.onPine};
  transition: background-color ${(p) => p.theme.dur.short} ${(p) => p.theme.ease};

  &:hover {
    background: ${(p) => p.theme.accentSoft};
  }
`;

// A quieter action: an outlined pill. Its ground is solid, so anything
// moving behind it passes behind its label and never through it.
export const Ghost = styled.a`
  ${pill}
  border: 1px solid ${(p) => p.theme.rim};
  background: ${(p) => p.theme.paper};
  color: ${(p) => p.theme.ink};
  transition:
    border-color ${(p) => p.theme.dur.short} ${(p) => p.theme.ease},
    color ${(p) => p.theme.dur.short} ${(p) => p.theme.ease};

  &:hover {
    border-color: ${(p) => p.theme.accent};
    color: ${(p) => p.theme.accent};
  }
`;

const PlateBox = styled.div`
  background: ${(p) => p.theme.paper};
  color: ${(p) => p.theme.ink};
  border-radius: ${(p) => p.theme.radiusPlate};
  min-width: 0;

  /* each surface names the ring that shows on it */
  & :focus-visible {
    outline-color: ${(p) => p.theme.focus};
  }
`;

// A surface: "well" (a chart's ground) or "field" (the sandbox). Inside it
// the theme's colour keys are re-mapped (theme.surfaces), so a child styled
// with theme.paper or theme.pine draws correctly without a second set of styles.
// Each surface has one theme function, made once, so it hands its children the
// same theme on every render.
const TONES = {
  well: (outer) => ({ ...outer, ...outer.surfaces.well }),
  field: (outer) => ({ ...outer, ...outer.surfaces.field }),
};

export const PlateSurface = ({ children, className, tone = "well" }) => (
  <ThemeProvider theme={TONES[tone] || TONES.well}>
    <PlateBox className={className}>{children}</PlateBox>
  </ThemeProvider>
);

// Said after the name of a link that opens a new tab, for screen readers only.
export const NewTab = () => <span className="sr-only">, opens in a new tab</span>;
