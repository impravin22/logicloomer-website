import React from "react";
import styled from "styled-components";
import { role } from "../_dossier";
import { Plate } from "../plates/Plate";
import { PLATES } from "../plates/specs";

const Item = styled.li`
  list-style: none;
  min-width: 0;
`;

// The title is the card's one link; its hit area is stretched over the card,
// so the plate and the text are clickable without a second link to announce.
const Body = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: ${(p) => p.theme.space.sm};

  h4 {
    ${role("title")}
    margin-top: ${(p) => p.theme.space["2xs"]};
  }
  h4 a {
    transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};
  }
  h4 a::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: ${(p) => p.theme.radiusPlate};
  }
  h4 a:focus-visible {
    outline: none;
  }
  h4 a:focus-visible::after {
    outline: 2px solid ${(p) => p.theme.pine};
    outline-offset: ${(p) => p.theme.space["2xs"]};
  }
  &:hover h4 a {
    color: ${(p) => p.theme.pine};
  }
  &:active h4 a {
    color: ${(p) => p.theme.pineDeep};
  }

  .line {
    color: ${(p) => p.theme.stone};
  }
  .stack {
    ${role("small")}
    color: ${(p) => p.theme.stone2};
  }
  .go {
    ${role("small")}
    font-weight: 500;
    color: ${(p) => p.theme.pine};
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }
`;

/**
 * One open-source build as a card that links to its repository.
 *
 * @param {{repo: object, density: ("compact"|"full")}} props The repo entry
 *     (title, line, stack, href and the key of its chart) and the chart density.
 * @returns {React.ReactElement}
 */
const OpenSourceCard = ({ repo, density = "compact" }) => {
  const stack = repo.stack || [];
  return (
    <Item>
      <Body>
        <Plate spec={PLATES[repo.sketch]} density={density} />
        <h4>
          <a href={repo.href} target="_blank" rel="noreferrer noopener">
            {repo.title}
            <span className="sr-only">, on GitHub, opens in a new tab</span>
          </a>
        </h4>
        <p className="line">{repo.line}</p>
        {stack.length > 0 ? <p className="stack">{stack.join(", ")}</p> : null}
        {/* Said by the link's own name for a screen reader; shown here for the eye. */}
        <p className="go" aria-hidden="true">
          View on GitHub
        </p>
      </Body>
    </Item>
  );
};

export default React.memo(OpenSourceCard);
