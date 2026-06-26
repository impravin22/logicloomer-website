import React from "react";
import styled from "styled-components";
import { Section, Idx, Wrap, Reveal } from "./_dossier";
import { Work } from "../data/WorkData";

const FEATURED_STATS = [
  { value: "1,300+", label: "Employees served" },
  { value: "60+", label: "API endpoints" },
  { value: "150+", label: "Unit tests" },
];

const roleOf = (work) => {
  const i = work.description.indexOf(" — ");
  return i > -1 ? work.description.slice(0, i) : work.category;
};

const linkOf = (work) => {
  if (work.github && work.github !== "#") return work.github;
  if (work.demo && work.demo !== "#") return work.demo;
  return null;
};

const Feature = styled.div`
  border: 1px solid ${(p) => p.theme.rule2};
  background: ${(p) => p.theme.ink2};
  padding: 38px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 34px;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding: 28px;
  }
`;

const FeatureTag = styled.p`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.theme.gold};
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-weight: 600;
  font-size: clamp(23px, 3vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.022em;
  color: ${(p) => p.theme.text};
  margin-bottom: 14px;
`;

const FeatureDesc = styled.p`
  color: ${(p) => p.theme.text2};
  font-size: 15.5px;
  max-width: 60ch;
`;

const FeatureStats = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-left: 1px solid ${(p) => p.theme.rule};
  padding-left: 26px;
  margin: 0;

  @media (max-width: 760px) {
    flex-direction: row;
    flex-wrap: wrap;
    border-left: none;
    border-top: 1px solid ${(p) => p.theme.rule};
    padding: 20px 0 0;
    gap: 26px;
  }

  dt {
    font-weight: 600;
    font-size: 30px;
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${(p) => p.theme.gold};
  }

  dd {
    margin: 6px 0 0;
    font-family: ${(p) => p.theme.fontMono};
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${(p) => p.theme.text3};
  }
`;

const PList = styled.div`
  border-top: 1px solid ${(p) => p.theme.rule};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 26px 16px;
  border-bottom: 1px solid ${(p) => p.theme.rule};
  color: inherit;
  cursor: ${(p) => (p.$link ? "pointer" : "default")};
  transition: background 0.28s ease, padding-left 0.28s ease;

  &:hover {
    background: ${(p) => p.theme.ink2};
    padding-left: 26px;
  }

  &:hover .pn {
    color: ${(p) => p.theme.gold};
  }

  &:hover .arrow {
    opacity: 1;
    transform: none;
  }

  @media (max-width: 680px) {
    grid-template-columns: 34px 1fr;
  }
`;

const Num = styled.span`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 13px;
  color: ${(p) => p.theme.text3};
  transition: color 0.28s ease;
`;

const RowTitle = styled.h4`
  font-weight: 600;
  font-size: clamp(18px, 2.1vw, 22px);
  letter-spacing: -0.018em;
  color: ${(p) => p.theme.text};
`;

const RowRole = styled.p`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: ${(p) => p.theme.text3};
  margin-top: 6px;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 300px;

  span {
    font-family: ${(p) => p.theme.fontMono};
    font-size: 10.5px;
    color: ${(p) => p.theme.text2};
    border: 1px solid ${(p) => p.theme.rule};
    padding: 3px 8px;
    border-radius: 4px;
  }

  @media (max-width: 680px) {
    display: none;
  }
`;

const Arrow = styled.span`
  color: ${(p) => p.theme.gold};
  font-size: 17px;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.28s ease, transform 0.28s ease;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;

  @media (max-width: 680px) {
    display: none;
  }
`;

const Projects = () => {
  const featured = Work.find((work) => work.id === 1);
  const rest = Work.filter((work) => work.id !== 1);

  return (
    <Section id="work" aria-labelledby="work-heading">
      <Wrap>
        <Idx>03 — Selected Work</Idx>
        <h2 id="work-heading" className="sr-only">
          Selected work
        </h2>

        {featured && (
          <Reveal>
            <Feature>
              <div>
                <FeatureTag>★ Featured — Platform</FeatureTag>
                <FeatureTitle>{featured.name}</FeatureTitle>
                <FeatureDesc>{featured.description}</FeatureDesc>
              </div>
              <FeatureStats>
                {FEATURED_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </FeatureStats>
            </Feature>
          </Reveal>
        )}

        <PList>
          {rest.map((work, index) => {
            const href = linkOf(work);
            const num = String(index + 2).padStart(2, "0");
            return (
              <Reveal key={work.id} delay={index * 0.04}>
                <Row
                  as={href ? "a" : "div"}
                  href={href || undefined}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noreferrer noopener" : undefined}
                  aria-label={href ? `${work.name} (opens in a new tab)` : undefined}
                  $link={!!href}
                >
                  <Num className="pn">{num}</Num>
                  <div>
                    <RowTitle>{work.name}</RowTitle>
                    <RowRole>{roleOf(work)}</RowRole>
                  </div>
                  <Meta>
                    <Tags>
                      {work.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>
                    <Arrow className="arrow" aria-hidden="true">
                      →
                    </Arrow>
                  </Meta>
                </Row>
              </Reveal>
            );
          })}
        </PList>
      </Wrap>
    </Section>
  );
};

export default Projects;
