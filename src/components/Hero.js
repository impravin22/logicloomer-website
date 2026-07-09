import React from "react";
import styled, { keyframes } from "styled-components";
import { Shell, Lnk, Reveal } from "./_dossier";
import Orchestrator from "./Orchestrator";

const ping = keyframes`
  0% { transform: scale(0.6); opacity: 0.6; }
  80%, 100% { transform: scale(1.5); opacity: 0; }
`;

const Intro = styled.header`
  padding: 62px 0 8px;
`;

const Avail = styled.p`
  font-family: ${(p) => p.theme.mono};
  font-size: 12.5px;
  color: ${(p) => p.theme.pine};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const Pip = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.pine};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid ${(p) => p.theme.pine};
    opacity: 0.5;
    animation: ${ping} 2.4s ${(p) => p.theme.ease} infinite;
  }
`;

const Name = styled.h1`
  font-weight: 700;
  font-size: clamp(48px, 9vw, 82px);
  line-height: 0.98;
  letter-spacing: -0.04em;
  margin-bottom: 22px;
`;

const Blurb = styled.p`
  font-size: clamp(19px, 2.4vw, 23px);
  line-height: 1.5;
  max-width: 34ch;

  b {
    font-weight: 700;
  }
`;

const Sub = styled.p`
  margin-top: 18px;
  font-size: 17px;
  color: ${(p) => p.theme.stone};
  max-width: 48ch;
  line-height: 1.6;
`;

const Meta = styled.div`
  margin-top: 28px;
  display: flex;
  gap: 10px 20px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 15px;

  .where {
    color: ${(p) => p.theme.stone2};
  }
`;

const Hero = () => (
  <Intro id="top">
    <Shell>
      <Reveal>
        <Avail>
          <Pip aria-hidden="true" />
          Open to building the next one
        </Avail>
      </Reveal>
      <Reveal delay={0.04}>
        <Name>Pravy</Name>
      </Reveal>
      <Reveal delay={0.08}>
        <Blurb>
          I build <b>production AI</b> end to end: model selection, orchestration, security, and
          the UI it all lands in.
        </Blurb>
      </Reveal>
      <Reveal delay={0.12}>
        <Sub>
          Most recently I was sole architect of an enterprise AI platform that 1,300+ people use to
          turn company strategy into how they actually work, day to day.
        </Sub>
      </Reveal>
      <Reveal delay={0.16}>
        <Meta>
          <Lnk href="mailto:impravin22@gmail.com">impravin22@gmail.com</Lnk>
          <Lnk href="https://github.com/impravin22" target="_blank" rel="noreferrer noopener">
            GitHub
          </Lnk>
          <span className="where">Taipei, Taiwan</span>
        </Meta>
      </Reveal>
      <Reveal delay={0.2}>
        <Orchestrator />
      </Reveal>
    </Shell>
  </Intro>
);

export default Hero;
