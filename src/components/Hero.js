import React from "react";
import styled from "styled-components";
import { Wrap, Reveal } from "./_dossier";

const CV_URL = `${process.env.PUBLIC_URL}/Praveen_Chittem_CV_2026.pdf`;

const HeroSection = styled.header`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 66px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  align-items: center;
  width: 100%;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 44px;
  }
`;

const Kicker = styled.p`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${(p) => p.theme.text2};
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 30px;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${(p) => p.theme.gold};
    flex: none;
  }
`;

const Name = styled.h1`
  font-weight: 700;
  font-size: clamp(46px, 8vw, 92px);
  line-height: 0.97;
  letter-spacing: -0.04em;
  color: ${(p) => p.theme.text};
  margin-bottom: 28px;
`;

const Statement = styled.p`
  font-size: clamp(19px, 2.2vw, 25px);
  line-height: 1.48;
  color: ${(p) => p.theme.text2};
  max-width: 34ch;
  margin-bottom: 30px;

  strong {
    color: ${(p) => p.theme.text};
    font-weight: 600;
  }
`;

const Credo = styled.p`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 38px;
  font-family: ${(p) => p.theme.fontMono};
  font-size: 13px;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.text2};

  &::before {
    content: "";
    width: 30px;
    height: 1px;
    background: ${(p) => p.theme.gold};
    flex: none;
  }
`;

const Chips = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
`;

const Chip = styled.li`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 12px;
  letter-spacing: 0.02em;
  color: ${(p) => p.theme.text2};
  border: 1px solid ${(p) => p.theme.rule};
  background: ${(p) => p.theme.ink2};
  padding: 9px 14px;
  border-radius: 7px;
  transition: border-color 0.25s ease, transform 0.25s ease;

  b {
    color: ${(p) => p.theme.gold};
    font-weight: 600;
  }

  &:hover {
    border-color: ${(p) => p.theme.rule2};
    transform: translateY(-2px);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

const Btn = styled.a`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 14px 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
  border: 1px solid ${(p) => (p.$primary ? p.theme.gold : p.theme.rule2)};
  background: ${(p) => (p.$primary ? p.theme.gold : "transparent")};
  color: ${(p) => (p.$primary ? "#10243A" : p.theme.text)};

  &:hover {
    transform: translateY(-2px);
    background: ${(p) => (p.$primary ? p.theme.goldSoft : "transparent")};
    border-color: ${(p) => p.theme.gold};
    color: ${(p) => (p.$primary ? "#10243A" : p.theme.gold)};
  }
`;

const SpecCard = styled.aside`
  border: 1px solid ${(p) => p.theme.rule};
  border-radius: 12px;
  background: ${(p) => p.theme.ink2};
  padding: 8px 24px 18px;

  @media (max-width: 880px) {
    max-width: 440px;
  }
`;

const SpecHead = styled.p`
  font-family: ${(p) => p.theme.fontMono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => p.theme.gold};
  padding: 16px 0 4px;
`;

const SpecList = styled.dl`
  margin: 0;
`;

const SpecRow = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 14px;
  align-items: baseline;
  padding: 13px 0;
  border-top: 1px solid ${(p) => p.theme.rule};

  &:first-of-type {
    border-top: none;
  }

  dt {
    font-family: ${(p) => p.theme.fontMono};
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${(p) => p.theme.text3};
    margin: 0;
  }

  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${(p) => (p.$accent ? p.theme.gold : p.theme.text)};
  }
`;

const Hero = () => (
  <HeroSection id="top">
    <Wrap>
      <Grid>
        <div>
          <Reveal>
            <Kicker>AI Systems Architect — Taipei, Taiwan</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Name>Praveen Kumar Chittem</Name>
          </Reveal>
          <Reveal delay={0.1}>
            <Statement>
              I architect <strong>production AI</strong> end-to-end — from a blank repo to a
              platform serving <strong>1,300+</strong> users.
            </Statement>
          </Reveal>
          <Reveal delay={0.15}>
            <Credo>prompts for judgment, code for determinism</Credo>
          </Reveal>
          <Reveal delay={0.2}>
            <Chips>
              <Chip><b>1,300+</b> users · sole architect</Chip>
              <Chip><b>2×</b> faster @ parity</Chip>
              <Chip><b>15×</b> HPC speedup · IEEE</Chip>
              <Chip><b>8-GPU</b> training cluster</Chip>
            </Chips>
          </Reveal>
          <Reveal delay={0.25}>
            <Actions>
              <Btn href="#work" $primary>View work →</Btn>
              <Btn href={CV_URL} target="_blank" rel="noreferrer noopener">
                Download résumé ↓
              </Btn>
            </Actions>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <SpecCard aria-label="At a glance">
            <SpecHead>{"// At a glance"}</SpecHead>
            <SpecList>
              <SpecRow>
                <dt>Role</dt>
                <dd>AI Systems Architect</dd>
              </SpecRow>
              <SpecRow>
                <dt>Based</dt>
                <dd>Taipei, Taiwan</dd>
              </SpecRow>
              <SpecRow>
                <dt>Focus</dt>
                <dd>LLM &amp; agent orchestration</dd>
              </SpecRow>
              <SpecRow>
                <dt>Stack</dt>
                <dd>Python · FastAPI · Next.js</dd>
              </SpecRow>
              <SpecRow $accent>
                <dt>Status</dt>
                <dd>Open to build</dd>
              </SpecRow>
            </SpecList>
          </SpecCard>
        </Reveal>
      </Grid>
    </Wrap>
  </HeroSection>
);

export default Hero;
