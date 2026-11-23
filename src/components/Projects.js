import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Block, Shell, Opener, role } from "./_dossier";
import { PROJECTS, OPEN } from "./projects/data";
import ProjectCard from "./projects/ProjectCard";
import OpenSourceCard from "./projects/OpenSourceCard";
import Legend from "./plates/Legend";
import { useChartDensity } from "./plates/useChartDensity";

export { PROJECTS } from "./projects/data";

// Two across from a tablet up, one on a phone. A card is wide enough to carry
// a real chart, and keeps its own height: one that opens never moves a card
// above it.
const CardGrid = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: ${(p) => p.theme.layout.gap};
  row-gap: ${(p) => p.theme.space["2xl"]};
  align-items: start;

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Empty = styled.p`
  ${role("lead")}
  color: ${(p) => p.theme.stone};
  max-width: 46ch;
`;

const OpenWrap = styled.div`
  margin-top: ${(p) => p.theme.gap.s};

  > h3 {
    ${role("section")}
  }
  > p {
    ${role("lead")}
    color: ${(p) => p.theme.stone};
    margin-top: ${(p) => p.theme.space.md};
    margin-bottom: ${(p) => p.theme.space.xl};
  }
`;

// A card takes one cell of the two-across grid, unless it is set across the
// row already: the lead, and a card with no chart.
const takesOneCell = (project) => !project.defaultOpen && Boolean(project.sketch);

/**
 * The cards that would sit alone on a row: the last card of each run of
 * one-cell cards whose count is odd. They are set across the row, as the lead
 * is, so the grid never shows an empty cell.
 *
 * @param {Array<object>} projects The cards, in the order they are drawn.
 * @returns {Set<string>} The ids of the cards to set across their row.
 */
export const aloneOnTheirRow = (projects) => {
  const walked = projects.reduce(
    (seen, project, index) => {
      if (!takesOneCell(project)) return { alone: seen.alone, run: 0 };
      const run = seen.run + 1;
      const next = projects[index + 1];
      const endsRun = !next || !takesOneCell(next);
      return { alone: endsRun && run % 2 === 1 ? [...seen.alone, project.id] : seen.alone, run };
    },
    { alone: [], run: 0 }
  );
  return new Set(walked.alone);
};

const defaultOpenIds = (projects) =>
  new Set(projects.filter((project) => project.defaultOpen).map((project) => project.id));

/**
 * Field notes: the work as a grid of cards, each led by its system design
 * chart, then the open-source builds.
 *
 * @param {{projects: Array<object>, repos: Array<object>}} props Default to the
 *     page's own data; tests and the preview pass their own.
 * @returns {React.ReactElement}
 */
const Projects = ({ projects = PROJECTS, repos = OPEN }) => {
  const [openIds, setOpenIds] = useState(() => defaultOpenIds(projects));
  const density = useChartDensity();
  const wideIds = useMemo(() => aloneOnTheirRow(projects), [projects]);

  // Each note opens and closes on its own. A fresh Set every time: state is
  // never changed in place. One function for the life of the section, so a
  // card that did not change is not drawn again.
  const toggle = useCallback(
    (id) =>
      setOpenIds((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    []
  );

  return (
    <Block id="work" aria-labelledby="work-h" $gap="s">
      <Shell>
        <Opener
          id="work-h"
          title="Field notes"
          lede="Systems I have taken from first commit to production. Open one."
        />
        {projects.length === 0 ? (
          <Empty>No field notes yet. They appear here when a project is added.</Empty>
        ) : (
          <>
            <Legend />
            <CardGrid role="list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  open={openIds.has(project.id)}
                  onToggle={toggle}
                  density={density}
                  wide={wideIds.has(project.id)}
                />
              ))}
            </CardGrid>
          </>
        )}
        {repos.length > 0 ? (
          <OpenWrap>
            <h3>In the open</h3>
            <p>Code you can actually read.</p>
            <CardGrid role="list">
              {repos.map((repo) => (
                <OpenSourceCard key={repo.id} repo={repo} density={density} />
              ))}
            </CardGrid>
          </OpenWrap>
        ) : null}
      </Shell>
    </Block>
  );
};

export default Projects;
