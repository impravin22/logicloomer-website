import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Lnk, role, NewTab } from "../_dossier";
import { Plate } from "../plates/Plate";
import { PLATES } from "../plates/specs";

const noteIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
`;

// Three shapes of one card:
//   default  the plate, then the text, in one grid cell
//   $lead    the featured case: plate and text side by side across the row
//   $coda    a project with no plate: set in type across the row
const Item = styled.li`
  list-style: none;
  min-width: 0;
  ${(p) =>
    (p.$lead || p.$coda) &&
    css`
      grid-column: 1 / -1;
    `}
`;

const Body = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: ${(p) => p.theme.space.md};

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    ${(p) =>
      (p.$lead || p.$coda) &&
      css`
        grid-template-columns: repeat(12, minmax(0, 1fr));
        column-gap: ${p.theme.layout.gap};
        align-items: start;
      `}
    ${(p) =>
      p.$lead &&
      css`
        > .plate {
          grid-column: 1 / span 7;
        }
        > .text {
          grid-column: 8 / span 5;
        }
      `}
    ${(p) =>
      p.$coda &&
      css`
        > .text {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: ${p.theme.layout.gap};
        }
        > .text > h3 {
          grid-column: 1 / span 5;
        }
        > .text > .rest {
          grid-column: 7 / -1;
        }
      `}
  }

  h3 {
    ${role("title")}
    max-width: 24ch;
  }
  .rest {
    margin-top: ${(p) => p.theme.space.xs};
  }
  .what {
    color: ${(p) => p.theme.stone};
    max-width: 46ch;
  }
  .meta,
  .stack {
    ${role("small")}
    color: ${(p) => p.theme.stone2};
  }
  .meta {
    margin-top: ${(p) => p.theme.space.sm};
  }
`;

const Toggle = styled.button`
  ${role("small")}
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  min-height: ${(p) => p.theme.layout.control};
  margin-top: ${(p) => p.theme.space["2xs"]};
  background: none;
  border: 0;
  cursor: pointer;
  color: ${(p) => p.theme.pine};
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};

  &:hover {
    color: ${(p) => p.theme.pineDeep};
    text-decoration-thickness: 2px;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Note = styled.div`
  margin-top: ${(p) => p.theme.space.xs};

  &.fresh {
    animation: ${noteIn} ${(p) => p.theme.dur.short} ${(p) => p.theme.ease} both;
  }

  dt {
    ${role("small")}
    font-weight: 500;
    color: ${(p) => p.theme.ink};
    margin-top: ${(p) => p.theme.space.md};
  }
  dt:first-child {
    margin-top: 0;
  }
  dd {
    color: ${(p) => p.theme.stone};
    margin-top: ${(p) => p.theme.space["2xs"]};
    max-width: 62ch;
  }
  dd b {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }
  dd.out {
    color: ${(p) => p.theme.ink};
  }
  .repo {
    display: inline-flex;
    align-items: center;
    min-height: ${(p) => p.theme.layout.control};
    margin-top: ${(p) => p.theme.space.xs};
  }
`;

const metaLine = (project) => [project.role, project.year].filter(Boolean).join(", ");

const hasNote = (project) =>
  Boolean(project.brief || project.decision || project.outcome || project.href);

const NoteBody = ({ project }) => (
  <>
    <dl>
      {project.brief ? (
        <>
          <dt>The brief</dt>
          <dd>{project.brief}</dd>
        </>
      ) : null}
      {project.decision ? (
        <>
          <dt>The decision that mattered</dt>
          <dd>{project.decision}</dd>
        </>
      ) : null}
      {project.outcome ? (
        <>
          <dt>The outcome</dt>
          <dd className="out">{project.outcome}</dd>
        </>
      ) : null}
    </dl>
    {project.href ? (
      <Lnk className="repo" href={project.href} target="_blank" rel="noreferrer noopener">
        View repo
        <NewTab />
      </Lnk>
    ) : null}
  </>
);

/**
 * One field note as a card: its system design chart, what it is, and a note
 * (brief, decision, outcome) that opens in place.
 *
 * @param {{project: object, open: boolean, onToggle: function(string): void, density: ("compact"|"full"), wide: boolean}} props
 *     `wide` sets the card across the row, chart beside text.
 * @returns {React.ReactElement}
 */
const ProjectCard = ({ project, open, onToggle, density = "compact", wide = false }) => {
  // The note fades in only after a click, never on first paint.
  const [touched, setTouched] = useState(false);
  const spec = PLATES[project.sketch];
  const lead = Boolean(project.defaultOpen);
  // set across the row: the lead, and a card that would be alone on its row
  const spread = lead || wide;
  const coda = !project.sketch;
  const noteId = `note-${project.id}-more`;
  const titleId = `note-${project.id}-t`;
  const stack = project.stack || [];

  const onClick = () => {
    setTouched(true);
    onToggle(project.id);
  };

  return (
    <Item $lead={spread} $coda={coda}>
      <Body id={`note-${project.id}`} aria-labelledby={titleId} $lead={spread} $coda={coda}>
        {spec ? (
          <div className="plate">
            <Plate spec={spec} density={density} caption={lead} />
          </div>
        ) : null}
        <div className="text">
          <h3 id={titleId}>{project.title}</h3>
          <div className="rest">
            <p className="what">{project.what}</p>
            {metaLine(project) ? <p className="meta">{metaLine(project)}</p> : null}
            {stack.length > 0 ? <p className="stack">{stack.join(", ")}</p> : null}
            {hasNote(project) ? (
              <>
                <Toggle type="button" aria-expanded={open} aria-controls={noteId} onClick={onClick}>
                  {open ? "Hide the note" : "Read the note"}
                  <span className="sr-only"> on {project.title}</span>
                </Toggle>
                <Note id={noteId} hidden={!open} className={touched ? "fresh" : undefined}>
                  <NoteBody project={project} />
                </Note>
              </>
            ) : null}
          </div>
        </div>
      </Body>
    </Item>
  );
};

export default React.memo(ProjectCard);
