import React from "react";
import styled from "styled-components";
import { Block, Shell, Primary, Ghost, role, NewTab } from "./_dossier";
import { CV_URL, EMAIL, GITHUB_URL } from "./site";
import { PROJECTS } from "./projects/data";
import { useMotion } from "./motion";
import Systems from "./hero/Systems";
import ThreadField from "./ThreadField";

// How many of the newest systems the hero lists.
const LISTED = 5;

// The first screen: the page's one sentence over a field of moving threads
// (logic loomer), the one action, and the newest systems on a glass panel
// with the chart of the one in hand. It runs up under the nav, so the threads
// are not cut off by it. No photograph, no figures.
const Intro = styled.header`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-top: calc(-1 * ${(p) => p.theme.layout.nav});
  padding-block: calc(${(p) => p.theme.layout.nav} + ${(p) => p.theme.space.xl}) ${(p) => p.theme.space["2xl"]};

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    display: grid;
    align-content: center;
    min-height: 100dvh;
  }
`;

// The threads fill the screen behind everything, and are held back where the
// words are so the words stay easy to read. A glow is light, so it is the one
// place the page lets a colour thin out.
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    ellipse 46% 52% at 78% 34%,
    color-mix(in oklab, ${(p) => p.theme.accent} 16%, transparent),
    transparent
  );
  mask-image: linear-gradient(to bottom, black 62%, transparent),
    linear-gradient(to right, color-mix(in srgb, black 8%, transparent) 18%, black 66%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
`;

const Stage = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: ${(p) => p.theme.space.xl};

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: ${(p) => p.theme.layout.gap};
    align-items: end;

    > .say {
      grid-column: 1 / span 12;
    }
    > .do {
      grid-column: 1 / span 6;
    }
    > .work {
      grid-column: 7 / -1;
    }
  }
`;

// The page's heading: who is speaking, in one line of small capitals, and
// then the sentence. Both are the heading, so a screen reader hears the name
// with the claim.
const Heading = styled.h1`
  /* the project's normalize sheet gives an h1 a margin and a size of its own */
  margin: 0;
  font-size: inherit;
  font-weight: inherit;

  .who {
    ${role("label")}
    display: flex;
    flex-wrap: wrap;
    gap: ${(p) => p.theme.space["2xs"]} ${(p) => p.theme.space.lg};
    color: ${(p) => p.theme.stone2};
    text-transform: uppercase;
  }
  .who .name {
    color: ${(p) => p.theme.ink};
  }
  .sentence {
    ${role("display")}
    display: block;
    margin-top: ${(p) => p.theme.space.md};
  }

  /* from the stage up the sentence is two lines, broken where it turns */
  @media (min-width: ${(p) => p.theme.bp.stage}) {
    .sentence .line {
      display: block;
    }
  }
`;

const Lead = styled.p`
  ${role("lead")}
  color: ${(p) => p.theme.stone};
  max-width: 34ch;
`;

const Actions = styled.div`
  margin-top: ${(p) => p.theme.space.lg};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(p) => p.theme.space.sm};
`;

const Foot = styled.div`
  margin-top: ${(p) => p.theme.space.md};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 ${(p) => p.theme.space.lg};
`;

const Status = styled.p`
  ${role("label")}
  color: ${(p) => p.theme.stone2};
  text-transform: uppercase;
`;

// Stops and starts the threads. Motion that starts by itself and keeps going
// must come with a way to stop it. It is left out where nothing moves.
const MotionToggle = styled.button`
  ${role("label")}
  display: inline-flex;
  align-items: center;
  min-height: ${(p) => p.theme.layout.control};
  padding: 0;
  border: 0;
  background: none;
  color: ${(p) => p.theme.stone2};
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  cursor: pointer;
  transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};

  &:hover {
    color: ${(p) => p.theme.ink};
  }
`;

// Who is speaking, set as a statement across ten of the twelve columns.
const Sub = styled.p`
  ${role("statement")}

  b {
    font-weight: inherit;
    color: ${(p) => p.theme.accent};
  }

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    max-width: calc(100% * 10 / 12);
  }
`;

// The one action, and the two quieter ones beside it.
const HeroActions = () => (
  <Actions>
    <Primary className="primary" href={`mailto:${EMAIL}`}>
      Email {EMAIL}
    </Primary>
    <Ghost href={CV_URL} target="_blank" rel="noreferrer noopener">
      Read the CV
      <NewTab />
    </Ghost>
    <Ghost href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
      GitHub
      <NewTab />
    </Ghost>
  </Actions>
);

/**
 * The first screen: the page's one sentence over the threads, the one
 * action and the newest systems; then who is speaking.
 *
 * @param {{projects: Array<object>}} props Defaults to the page's own notes,
 *     of which the newest few are listed.
 * @returns {React.ReactElement}
 */
const Hero = ({ projects = PROJECTS }) => {
  const { paused, toggle } = useMotion();
  const listed = projects.slice(0, LISTED);

  return (
    <>
      <Intro id="top">
        <Backdrop aria-hidden="true">
          <ThreadField />
        </Backdrop>
        <Shell>
          <Stage>
            <div className="say">
              <Heading>
                <span className="who">
                  <span className="name">Pravy Chittem</span> <span>AI forward deployment lead</span>{" "}
                  <span>Taipei, Taiwan</span>
                </span>{" "}
                <span className="sentence">
                  <span className="line">I build production AI</span>{" "}
                  <span className="line">end to end.</span>
                </span>
              </Heading>
            </div>
            <div className="do">
              <Lead>Model selection, orchestration, security, and the UI it all lands in.</Lead>
              <HeroActions />
              <Foot>
                <Status>Open to building the next one</Status>
                {toggle ? (
                  <MotionToggle type="button" onClick={toggle}>
                    {paused ? "Play background motion" : "Pause background motion"}
                  </MotionToggle>
                ) : null}
              </Foot>
            </div>
            <div className="work">
              <Systems projects={listed} />
            </div>
          </Stage>
        </Shell>
      </Intro>
      <Block as="div" $gap="s">
        <Shell>
          <Sub>
            Now I lead a forward-deployed AI pod: we sit with a team, find where the work stalls,
            and ship the fix into their day. Before that I was sole architect of an enterprise AI
            platform <b>1,300+ people</b> use every day.
          </Sub>
        </Shell>
      </Block>
    </>
  );
};

export default Hero;
