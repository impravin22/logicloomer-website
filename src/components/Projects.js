import React from "react";
import styled from "styled-components";
import { Block, Shell, Eyebrow, Reveal } from "./_dossier";

const FEATURED = {
  tag: "Lead architect · platform",
  title: "Rapid-OKR — an AI platform 1,300 people rely on",
  body: "Sole architect, blank repo to production. Three deployable services, a 24-table schema with vector search, an AI coach grounded in retrieval, and the whole OWASP LLM safety surface. Turns company strategy into AI-native workflows for goal-setting and evaluation.",
};

const WORK = [
  { title: "AI Sales Assistant", year: "2023", body: "A multi-agent system that gives a sales floor real product answers, fast." },
  { title: "VLM Document Pipeline", year: "2022", body: "Six layers of vision-language + an AI auditor loop for brand-compliant output." },
  { title: "Model Distillation", year: "2022", body: "Squeezed a 600M-param teacher into a student that's 2× faster at the same quality." },
  { title: "Large-Scale Object Detection", year: "2021", body: "Half a million images, mAP 0.82, the whole data-to-deployment loop in PyTorch." },
  { title: "Blend n Bubbles", year: "2021", body: "A bubble-tea brand I founded and built — because not everything is a model.", href: "https://github.com/impravin22/blendnbubbles" },
];

const Feat = styled.div`
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: ${(p) => p.theme.radius};
  background: ${(p) => p.theme.card};
  padding: 26px 26px 24px;
  margin: 0 -14px 10px;

  .tag {
    font-family: ${(p) => p.theme.mono};
    font-size: 11.5px;
    color: ${(p) => p.theme.pine};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h3 {
    font-weight: 700;
    font-size: clamp(23px, 3.4vw, 30px);
    letter-spacing: -0.02em;
    margin: 8px 0 10px;
    line-height: 1.08;
  }

  p {
    font-size: 16px;
    color: ${(p) => p.theme.stone};
    line-height: 1.6;
    max-width: 58ch;
  }
`;

const WList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 20px;
  align-items: baseline;
  padding: 18px 14px;
  margin: 0 -14px;
  border-radius: ${(p) => p.theme.radius};
  color: inherit;
  text-decoration: none;
  transition: background 0.2s ${(p) => p.theme.ease}, padding-left 0.2s ${(p) => p.theme.ease};

  h4 {
    grid-column: 1;
    font-family: ${(p) => p.theme.grot};
    font-weight: 600;
    font-size: 19px;
    letter-spacing: -0.015em;
  }

  .yr {
    grid-column: 2;
    grid-row: 1;
    font-family: ${(p) => p.theme.mono};
    font-size: 13px;
    color: ${(p) => p.theme.stone2};
  }

  p {
    grid-column: 1;
    font-size: 15px;
    color: ${(p) => p.theme.stone};
    line-height: 1.5;
  }

  &[href] {
    cursor: pointer;
  }
  &[href]:hover {
    background: ${(p) => p.theme.card};
    padding-left: 18px;
  }
  &[href]:hover h4 {
    color: ${(p) => p.theme.pine};
  }
  &[href] h4::after {
    content: " ↗";
    color: ${(p) => p.theme.pine};
    font-size: 14px;
  }
`;

const Projects = () => (
  <Block id="work" aria-labelledby="work-h">
    <Shell>
      <Eyebrow as="h2" id="work-h">
        <b>Selected work</b> — things I've shipped end to end
      </Eyebrow>

      <Reveal>
        <Feat>
          <span className="tag">{FEATURED.tag}</span>
          <h3>{FEATURED.title}</h3>
          <p>{FEATURED.body}</p>
        </Feat>
      </Reveal>

      <WList>
        {WORK.map((w, i) => {
          const linked = Boolean(w.href);
          return (
            <Reveal key={w.title} delay={i * 0.04}>
              <Item
                as={linked ? "a" : "div"}
                href={w.href}
                target={linked ? "_blank" : undefined}
                rel={linked ? "noreferrer noopener" : undefined}
                aria-label={linked ? `${w.title} (opens in a new tab)` : undefined}
              >
                <h4>{w.title}</h4>
                <span className="yr">{w.year}</span>
                <p>{w.body}</p>
              </Item>
            </Reveal>
          );
        })}
      </WList>
    </Shell>
  </Block>
);

export default Projects;
