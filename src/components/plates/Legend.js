import React from "react";
import styled from "styled-components";
import { PlateSurface, role } from "../_dossier";

// How to read a chart: one mark per kind of node, in the charts' own strokes.
const Strip = styled(PlateSurface)`
  /* as wide as its marks, never a bar across the page */
  width: fit-content;
  max-width: 100%;
  margin-bottom: ${(p) => p.theme.space.xl};
`;

const List = styled.ul`
  ${role("small")}
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.space.xs} ${(p) => p.theme.space.lg};
  padding: ${(p) => p.theme.space.sm} ${(p) => p.theme.space.md};
  color: ${(p) => p.theme.stone};

  li {
    display: inline-flex;
    align-items: center;
    gap: ${(p) => p.theme.space.xs};
  }
  svg {
    flex-shrink: 0;
  }
  .mark {
    fill: ${(p) => p.theme.card};
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
  }
  .mark.dashed {
    fill: ${(p) => p.theme.paper};
    stroke-dasharray: 4 3;
  }
  .mark.lit {
    fill: ${(p) => p.theme.pine};
    stroke: ${(p) => p.theme.hair};
  }
  .lid {
    fill: none;
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
  }
`;

const Mark = ({ children }) => (
  <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const ITEMS = [
  ["A service", <rect key="m" className="mark" x="1" y="1" width="26" height="16" rx="0" />],
  [
    "A store",
    <React.Fragment key="m">
      <path className="mark" d="M1,4 A13,3 0 0 1 27,4 V14 A13,3 0 0 1 1,14 Z" />
      <path className="lid" d="M1,4 A13,3 0 0 0 27,4" />
    </React.Fragment>,
  ],
  ["A model or agent", <path key="m" className="mark" d="M6,1 H22 L27,9 L22,17 H6 L1,9 Z" />],
  ["A person", <rect key="m" className="mark" x="1" y="1" width="26" height="16" rx="8" />],
  ["An outside system", <rect key="m" className="mark dashed" x="1" y="1" width="26" height="16" rx="0" />],
  ["The decision that mattered", <rect key="m" className="mark lit" x="1" y="1" width="26" height="16" rx="0" />],
];

/**
 * The key to the charts' shapes.
 *
 * @returns {React.ReactElement}
 */
const Legend = () => (
  <Strip>
    <List role="list" aria-label="How to read a chart">
      {ITEMS.map(([label, mark]) => (
        <li key={label}>
          <Mark>{mark}</Mark>
          {label}
        </li>
      ))}
    </List>
  </Strip>
);

export default Legend;
