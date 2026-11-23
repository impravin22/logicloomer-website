import React, { useId } from "react";
import styled, { css } from "styled-components";
import { PlateSurface, role } from "../_dossier";
import ErrorBoundary from "../ErrorBoundary";
import { layoutPlate, densityOf } from "./layout";

const CORNER = 0;
const CUT = 10; // the bevel on a model's box
const LID = 5; // the curve on a store's lid

const Frame = styled.figure`
  margin: 0;
  min-width: 0;

  figcaption {
    ${role("small")}
    color: ${(p) => p.theme.stone};
    margin-top: ${(p) => p.theme.space.sm};
    max-width: 70ch;
  }
`;

// The chart's own margins are in its canvas, so the plate adds none on a
// phone, where every pixel of width is label size.
const Pad = styled.div`
  ${(p) =>
    !p.$full &&
    css`
      @media (min-width: ${p.theme.bp.grid2}) {
        padding: ${p.theme.space.sm};
      }
    `}
`;

// Drawn inside a PlateSurface, so these keys resolve to the well's values.
const Drawing = styled.svg`
  width: 100%;
  height: auto;
  aspect-ratio: ${(p) => p.$width} / ${(p) => p.$height};
  font-family: ${(p) => p.theme.mono};

  .lane {
    fill: none;
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1;
    stroke-dasharray: 2 5;
  }
  .lane-title,
  .note,
  .tech {
    fill: ${(p) => p.theme.stone};
    font-weight: 400;
  }
  /* an edge's label sits on a halo of the ground, so a line never runs through it */
  .note {
    paint-order: stroke;
    stroke: ${(p) => p.theme.paper};
    stroke-width: 5px;
    stroke-linejoin: round;
  }
  .edge {
    fill: none;
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
  }
  .head {
    fill: ${(p) => p.theme.hair};
  }
  .shape {
    fill: ${(p) => p.theme.card};
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
  }
  .lid {
    fill: none;
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
  }
  .external .shape {
    fill: ${(p) => p.theme.paper};
    stroke-dasharray: 4 3;
  }
  .name {
    font-weight: 500;
    fill: ${(p) => p.theme.ink};
  }
  /* The lit node is filled, so it reads without colour too. */
  .lit .shape {
    fill: ${(p) => p.theme.pine};
    stroke-dasharray: none;
  }
  .lit .lid {
    stroke: ${(p) => p.theme.onPine};
  }
  .lit .name,
  .lit .tech {
    fill: ${(p) => p.theme.onPine};
  }
`;

const layoutOrNull = (spec, density) => {
  try {
    return layoutPlate(spec, density);
  } catch (error) {
    // A broken spec costs its chart, never the page. The detail goes to the log.
    console.error("Chart could not be drawn", error);
    return null;
  }
};

// One outline per kind: a box for a service, a drum for a store, a bevelled
// box for a model, a pill for a person, a dashed box for an outside system.
const NodeShape = ({ node }) => {
  const { x, y, w, h } = node;
  if (node.kind === "store") {
    const body = `M${x},${y + LID} A${w / 2},${LID} 0 0 1 ${x + w},${y + LID} V${y + h - LID} A${w / 2},${LID} 0 0 1 ${x},${y + h - LID} Z`;
    const lid = `M${x},${y + LID} A${w / 2},${LID} 0 0 0 ${x + w},${y + LID}`;
    return (
      <>
        <path className="shape" d={body} />
        <path className="lid" d={lid} />
      </>
    );
  }
  if (node.kind === "model") {
    const d = `M${x + CUT},${y} H${x + w - CUT} L${x + w},${y + h / 2} L${x + w - CUT},${y + h} H${x + CUT} L${x},${y + h / 2} Z`;
    return <path className="shape" d={d} />;
  }
  const radius = node.kind === "person" ? h / 2 : CORNER;
  return <rect className="shape" x={x} y={y} width={w} height={h} rx={radius} />;
};

const NodeText = ({ node, d }) => {
  const x = node.x + node.w / 2;
  const middle = node.y + node.h / 2;
  const rise = d.nameSize * 0.35;
  if (node.tech) {
    return (
      <>
        <text className="name" textAnchor="middle" fontSize={d.nameSize} x={x} y={middle - 3}>
          {node.lines[0]}
        </text>
        <text className="tech" textAnchor="middle" fontSize={d.techSize} x={x} y={middle + d.techSize + 1}>
          {node.tech}
        </text>
      </>
    );
  }
  const first = middle - ((node.lines.length - 1) * d.lineHeight) / 2 + rise;
  return (
    <text className="name" textAnchor="middle" fontSize={d.nameSize}>
      {node.lines.map((text, index) => (
        <tspan key={text} x={x} y={first + index * d.lineHeight}>
          {text}
        </tspan>
      ))}
    </text>
  );
};

// The arrowhead every edge ends in.
const ArrowHead = ({ id }) => (
  <defs>
    <marker id={id} markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="7.5" refY="4" orient="auto">
      <path className="head" d="M0.5,0.8 L7.5,4 L0.5,7.2 z" />
    </marker>
  </defs>
);

// The tiers a chart is split into, each a dotted boundary with its title.
const Lanes = ({ lanes, d }) =>
  lanes.map((lane) => (
    <g key={lane.title}>
      <rect className="lane" x={lane.x} y={lane.y} width={lane.w} height={lane.h} rx={CORNER} />
      <text className="lane-title" fontSize={d.noteSize} x={lane.x + 12} y={lane.y + 20}>
        {lane.title}
      </text>
    </g>
  ));

const Edges = ({ paths, headId }) =>
  paths.map((path) => (
    <path key={path.key} className="edge" d={path.d} markerEnd={`url(#${headId})`} />
  ));

const Nodes = ({ nodes, d }) =>
  nodes.map((node) => (
    <g key={node.id} className={`${node.kind}${node.accent ? " lit" : ""}`}>
      <NodeShape node={node} />
      <NodeText node={node} d={d} />
    </g>
  ));

// What an edge carries, written beside it. Drawn last, over the lines.
const EdgeNotes = ({ paths, d }) =>
  paths
    .filter((path) => path.note)
    .map((path) => (
      <text key={path.key} className="note" fontSize={d.noteSize} textAnchor={path.note.anchor} x={path.note.x} y={path.note.y}>
        {path.note.text}
      </text>
    ));

// The drawing itself. Two charts of one system can be on the page at once
// (the hero's and its card's), so the arrowhead's id is this instance's own.
const Chart = ({ spec, density = "compact", caption = false }) => {
  const headId = `plate-head-${useId().replace(/:/g, "")}`;
  const drawn = spec ? layoutOrNull(spec, density) : null;
  if (!drawn) return null;
  const d = densityOf(density);
  return (
    <Frame>
      <PlateSurface>
        <Pad $full={density === "full"}>
          <Drawing
            $width={drawn.width}
            $height={drawn.height}
            viewBox={`0 0 ${drawn.width} ${drawn.height}`}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={spec.label}
          >
            <ArrowHead id={headId} />
            <Lanes lanes={drawn.lanes} d={d} />
            <Edges paths={drawn.paths} headId={headId} />
            <Nodes nodes={drawn.nodes} d={d} />
            <EdgeNotes paths={drawn.paths} d={d} />
          </Drawing>
        </Pad>
      </PlateSurface>
      {/* The image already carries these words as its name, so a screen reader
          hears them once; the caption is for the eye. */}
      {caption ? <figcaption aria-hidden="true">{spec.label}</figcaption> : null}
    </Frame>
  );
};

/**
 * One system design chart, drawn from its spec on a well. A chart that
 * fails while it is drawn is left out and logged; it never takes the page
 * with it. A chart whose props have not changed is not drawn again.
 *
 * @param {{spec: object, density: ("compact"|"full"), caption: boolean}} props
 *     The chart spec; "full" adds the technology lines, edge labels and tier
 *     boundaries; `caption` shows the chart's label beneath it.
 * @returns {?React.ReactElement} The figure, or nothing when there is no
 *     spec or the spec cannot be laid out.
 */
export const Plate = React.memo((props) => (
  <ErrorBoundary fallback={null}>
    <Chart {...props} />
  </ErrorBoundary>
));
Plate.displayName = "Plate";

export default Plate;
