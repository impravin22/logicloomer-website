import React from "react";
import styled from "styled-components";

import { Idx, Lead, Reveal, Section, SectionTitle, TwoCol, Wrap } from "./_dossier";

const Heading = styled(SectionTitle)`
  margin-bottom: 20px;
`;

const Mail = styled.a`
  position: relative;
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
  font-size: clamp(26px, 4.4vw, 44px);
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.text};
  transition: color 0.25s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background: ${(props) => props.theme.gold};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover {
    color: ${(props) => props.theme.gold};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 28px;
  font-family: ${(props) => props.theme.fontMono};
  font-size: 13px;
  color: ${(props) => props.theme.text3};

  a {
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${(props) => props.theme.gold};
  }
`;

const Contact = () => {
  return (
    <Section as="section" id="contact" aria-labelledby="contact-heading">
      <Wrap>
        <TwoCol>
          <Idx>06 — Contact</Idx>
          <Reveal>
            <Heading id="contact-heading">Let&rsquo;s build something that ships.</Heading>
            <Lead>
              Open to senior architecture and AI-platform work. The fastest way to reach me:
            </Lead>
            <Mail href="mailto:impravin22@gmail.com">impravin22@gmail.com</Mail>
            <Meta>
              <span>+886 958 605 515</span>
              <a
                href="https://github.com/impravin22"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile (opens in a new tab)"
              >
                GitHub ↗
              </a>
              <a
                href="https://gitlab.com/impravin22"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitLab profile (opens in a new tab)"
              >
                GitLab ↗
              </a>
              <span>Taipei, Taiwan</span>
            </Meta>
          </Reveal>
        </TwoCol>
      </Wrap>
    </Section>
  );
};

export default Contact;
