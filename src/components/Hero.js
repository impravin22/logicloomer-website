import React from "react";
import styled, { keyframes } from "styled-components";
import { Shell, Lnk, Reveal } from "./_dossier";

const ping = keyframes`
  0% { transform: scale(0.6); opacity: 0.6; }
  80%, 100% { transform: scale(1.5); opacity: 0; }
`;

const Intro = styled.section`
  padding: 64px 0 18px;
`;

const Avail = styled.p`
  font-family: ${(p) => p.theme.mono};
  font-size: 12.5px;
  color: ${(p) => p.theme.pine};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 26px;
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
  font-size: clamp(46px, 8.5vw, 76px);
  line-height: 0.98;
  letter-spacing: -0.035em;
  margin-bottom: 26px;
`;

const Blurb = styled.p`
  font-size: clamp(19px, 2.4vw, 22px);
  line-height: 1.55;
  max-width: 34ch;
  color: ${(p) => p.theme.ink};

  b {
    font-weight: 700;
  }
`;

const Sub = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: ${(p) => p.theme.stone};
  max-width: 46ch;
  line-height: 1.6;
`;

const Meta = styled.div`
  margin-top: 34px;
  display: flex;
  gap: 10px 22px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 15.5px;

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
          I build <b>production AI</b> end to end — model selection, orchestration, security,
          the UI it all lands in.
        </Blurb>
      </Reveal>
      <Reveal delay={0.12}>
        <Sub>
          Most recently I was sole architect of an enterprise AI platform that 1,300+ people use
          to turn company strategy into how they actually work, day to day.
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
    </Shell>
  </Intro>
);

export default Hero;
