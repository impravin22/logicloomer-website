import React from "react";
import styled from "styled-components";
import { Wrap, Section, Idx, TwoCol, Reveal } from "./_dossier";

const SrOnly = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Body = styled.div`
  p {
    font-size: clamp(20px, 2.3vw, 26px);
    line-height: 1.4;
    color: ${(props) => props.theme.text};
    max-width: 26ch;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
`;

const Sub = styled.p`
  font-size: 16.5px;
  color: ${(props) => props.theme.text2};
  max-width: 66ch;
  margin-top: 24px;
  line-height: 1.75;
  font-weight: 400;
`;

const U = styled.span`
  color: ${(props) => props.theme.text};
  border-bottom: 1px solid ${(props) => props.theme.rule2};
  padding-bottom: 1px;
  font-weight: 500;
`;

const About = () => (
  <Section id="profile" aria-labelledby="profile-heading">
    <SrOnly id="profile-heading">Profile</SrOnly>
    <Wrap>
      <TwoCol>
        <Idx>01 — Profile</Idx>
        <Reveal>
          <Body>
            <p>
              Six years shipping production AI — owning every layer, from model
              selection to UI.
            </p>
            <Sub>
              Senior AI Systems Architect who sets the architecture principles
              and engineering standards teams build against. Recently sole
              architect of a CEO-office enterprise AI platform turning company
              strategy into <U>AI-native workflows</U> for 1,300+ users. Deep
              range across <U>LLM &amp; agent orchestration</U>,{" "}
              <U>vision-language models</U>, <U>model optimisation</U> and{" "}
              <U>distributed training</U> — with security and evaluation treated
              as first-class.
            </Sub>
          </Body>
        </Reveal>
      </TwoCol>
    </Wrap>
  </Section>
);

export default About;
