import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Block, Shell, Opener, Lnk } from "./_dossier";

const EMAIL = "impravin22@gmail.com";

const Copy = styled.p`
  font-size: 18px;
  color: ${(p) => p.theme.stone};
  max-width: 42ch;
  line-height: 1.6;
  margin: 0 0 26px;
`;

const MailRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: ${(p) => p.theme.radius};
  padding: 11px 12px 11px 16px;
  background: ${(p) => p.theme.card};
  transition: border-color 0.2s ${(p) => p.theme.ease};

  &:hover {
    border-color: ${(p) => p.theme.pine};
  }

  .em {
    font-family: ${(p) => p.theme.grot};
    font-weight: 600;
    font-size: clamp(17px, 3vw, 21px);
    letter-spacing: -0.01em;
  }
`;

const CopyBtn = styled.button`
  font-family: ${(p) => p.theme.mono};
  font-size: 12px;
  border: 1px solid ${(p) => p.theme.hair};
  background: ${(p) => p.theme.paper};
  color: ${(p) => p.theme.stone};
  padding: 6px 10px;
  border-radius: ${(p) => p.theme.radius};
  cursor: pointer;
  transition: all 0.15s ${(p) => p.theme.ease};

  &:hover {
    border-color: ${(p) => p.theme.pine};
    color: ${(p) => p.theme.pine};
  }
  &:active {
    transform: scale(0.95);
  }
  &.done {
    background: ${(p) => p.theme.pine};
    color: ${(p) => p.theme.paper};
    border-color: ${(p) => p.theme.pine};
  }
`;

const Socials = styled.div`
  margin-top: 26px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 15.5px;
  align-items: center;

  .ph {
    color: ${(p) => p.theme.stone2};
  }
`;

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      /* clipboard unavailable: the address is visible to copy manually */
    }
  };

  return (
    <Block id="contact" aria-labelledby="contact-h">
      <Shell>
        <Opener index="04" id="contact-h" title="Let's build something worth shipping." />
        <Copy>
          If you are working on AI that has to actually hold up in production, I would like to hear
          about it.
        </Copy>
        <MailRow>
          <span className="em">{EMAIL}</span>
          <CopyBtn
            type="button"
            onClick={onCopy}
            className={copied ? "done" : ""}
            aria-label={copied ? "Email address copied" : "Copy email address"}
          >
            {copied ? "Copied ✓" : "Copy"}
          </CopyBtn>
        </MailRow>
        <Socials>
          <Lnk href="https://github.com/impravin22" target="_blank" rel="noreferrer noopener">
            GitHub
          </Lnk>
          <Lnk href="https://gitlab.com/impravin22" target="_blank" rel="noreferrer noopener">
            GitLab
          </Lnk>
          <span className="ph">+886 958 605 515</span>
        </Socials>
      </Shell>
    </Block>
  );
};

export default Contact;
