import React, { useState } from "react";
import styled from "styled-components";
import { role } from "../_dossier";
import { Plate } from "../plates/Plate";
import { PLATES } from "../plates/specs";

// The newest systems on a panel: a list on the left and, on the right, the
// chart of the one in hand. Pointing at a row, or tabbing to it, takes it in
// hand; following it goes to its note.
const Panel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${(p) => p.theme.space.md} ${(p) => p.theme.space.lg};
  padding: ${(p) => p.theme.space.md};
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: ${(p) => p.theme.radiusPlate};
  background: ${(p) => p.theme.card};

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    align-items: center;
    padding: ${(p) => p.theme.space.lg};
  }

  /* Glass, where the screen is wide and the machine can spare it: the ground
     thinned so the threads show through, softened. A phone keeps it solid,
     since softening a moving picture every frame is costly there. */
  @media (min-width: ${(p) => p.theme.bp.stage}) {
    background: color-mix(in srgb, ${(p) => p.theme.card} 72%, transparent);
    backdrop-filter: blur(18px);
  }
`;

const Head = styled.span`
  ${role("label")}
  grid-column: 1 / -1;
  color: ${(p) => p.theme.stone2};
  text-transform: uppercase;
`;

const List = styled.ol`
  list-style: none;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${(p) => p.theme.space.sm};
    min-height: ${(p) => p.theme.layout.control};
    padding: ${(p) => p.theme.space["2xs"]} ${(p) => p.theme.space.sm};
    border-radius: ${(p) => p.theme.radius};
    color: ${(p) => p.theme.stone};
    transition:
      color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease},
      background-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};
  }
  /* a long name goes to a second line; it is never cut short */
  .name {
    ${role("small")}
    text-wrap: balance;
  }
  .year {
    ${role("label")}
    color: ${(p) => p.theme.stone2};
  }
  /* The one in hand. It is marked for the eye only: the chart it brings up is
     a second showing of the one in its note. */
  a[data-in-hand="true"],
  a:hover {
    color: ${(p) => p.theme.ink};
    background: ${(p) => p.theme.surfaces.well.card};
  }
  a[data-in-hand="true"] .year {
    color: ${(p) => p.theme.accent};
  }
`;

const Chart = styled.div`
  min-width: 0;
  border-radius: ${(p) => p.theme.radius};
  overflow: hidden;
`;

/**
 * The newest systems as a list, with the chart of the one in hand. The first
 * is in hand until the reader points at another or tabs to it.
 *
 * @param {{projects: Array<object>}} props The systems to list, newest first.
 *     One without a chart is listed and shows no chart.
 * @returns {?React.ReactElement} Null when there is nothing to list.
 */
const Systems = ({ projects }) => {
  const [taken, setTaken] = useState(null);
  if (!projects || projects.length === 0) return null;
  // A system taken earlier and since dropped from the list gives way to the first.
  const current = projects.find((project) => project.id === taken) || projects[0];
  const spec = PLATES[current.sketch];

  return (
    <Panel>
      <Head>Newest systems</Head>
      {/* list-style: none makes Safari drop a list's role; say it again */}
      <List role="list" aria-label="Newest systems">
        {projects.map((project) => (
          <li key={project.id}>
            <a
              href={`#note-${project.id}`}
              aria-label={`${project.title}, ${project.year}`}
              data-in-hand={project.id === current.id ? "true" : undefined}
              onPointerEnter={() => setTaken(project.id)}
              onFocus={() => setTaken(project.id)}
            >
              <span className="name">{project.title}</span>
              <span className="year">{project.year}</span>
            </a>
          </li>
        ))}
      </List>
      {/* The same chart is in the note the link goes to. Each
          row's chart is its own (the key): one that fails while it is drawn
          costs that row's chart, never the next row's. */}
      <Chart aria-hidden="true">{spec ? <Plate key={current.id} spec={spec} density="compact" /> : null}</Chart>
    </Panel>
  );
};

export default Systems;
