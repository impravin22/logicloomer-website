import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Block, Shell, Grid, Lnk, Primary, role, NewTab } from "./_dossier";
import { EMAIL, GITHUB_URL, GITLAB_URL, PHONE, PHONE_URL } from "./site";
import ThreadField from "./ThreadField";

const COPIED_MS = 1600;

// The close runs over the same threads the page opened on, fainter.
const Close = styled(Block)`
  isolation: isolate;
  overflow: hidden;
  padding-bottom: ${(p) => p.theme.space["2xl"]};
`;

// The field starts where the words do: the space that parts this section from
// the one above stays empty.
const Field = styled.div`
  position: absolute;
  inset: ${(p) => p.theme.gap.l} 0 0;
  z-index: -1;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent, black 24%, black 68%, transparent);
`;

// The close: one sentence set large on the left, the way to reach me on the right.
const Cols = styled(Grid)`
  row-gap: ${(p) => p.theme.space.xl};

  > .say,
  > .reach {
    grid-column: 1 / -1;
  }

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    align-items: end;

    > .say {
      grid-column: 1 / span 7;
    }
    > .reach {
      grid-column: 8 / span 5;
    }
  }
`;

const Statement = styled.h2`
  ${role("displayS")}
  max-width: 18ch;
`;

const Copy = styled.p`
  ${role("lead")}
  color: ${(p) => p.theme.stone};
  max-width: 42ch;
  margin-top: ${(p) => p.theme.space.lg};
`;

const MailRow = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(p) => p.theme.space.sm} ${(p) => p.theme.space.md};
`;

const CopyBtn = styled.button`
  ${role("small")}
  font-weight: 500;
  min-height: ${(p) => p.theme.layout.control};
  padding-inline: ${(p) => p.theme.space.md};
  border: 1px solid ${(p) => p.theme.rim};
  border-radius: ${(p) => p.theme.pill};
  background: ${(p) => p.theme.paper};
  color: ${(p) => p.theme.ink};
  cursor: pointer;
  white-space: nowrap;
  transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease},
    background-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease},
    border-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};

  &:hover {
    border-color: ${(p) => p.theme.pine};
    color: ${(p) => p.theme.pine};
  }
  &:active {
    transform: translateY(1px);
  }
  &.done {
    background: ${(p) => p.theme.pine};
    color: ${(p) => p.theme.paper};
    border-color: ${(p) => p.theme.pine};
  }
`;

// Reserved height, so a message arriving never moves what is under it.
const Status = styled.p`
  ${role("small")}
  color: ${(p) => p.theme.ink};
  min-height: 1lh;
  margin-top: ${(p) => p.theme.space.xs};
`;

const Socials = styled.div`
  margin-top: ${(p) => p.theme.space.md};
  display: flex;
  gap: ${(p) => p.theme.space.xs} ${(p) => p.theme.space.lg};
  flex-wrap: wrap;
  align-items: center;

  a {
    display: inline-flex;
    align-items: center;
    min-height: ${(p) => p.theme.layout.control};
  }
`;

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [refused, setRefused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setRefused(false);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch (err) {
      // The clipboard is unavailable (an insecure context, a refused
      // permission). The address stays on screen; say so and say what to do.
      setCopied(false);
      setRefused(true);
    }
  };

  return (
    <Close id="contact" aria-labelledby="contact-h" $gap="l">
      <Field aria-hidden="true">
        <ThreadField quiet />
      </Field>
      <Shell>
        <Cols>
          <div className="say">
            <Statement id="contact-h">Let's build something worth shipping.</Statement>
            <Copy>
              If you are working on AI that has to actually hold up in production, I would like to
              hear about it.
            </Copy>
          </div>
          <div className="reach">
            <MailRow>
              <Primary href={`mailto:${EMAIL}`}>{EMAIL}</Primary>
              <CopyBtn
                type="button"
                onClick={onCopy}
                className={copied ? "done" : ""}
                aria-label={copied ? "Email address copied" : "Copy email address"}
              >
                {copied ? "Copied ✓" : "Copy"}
              </CopyBtn>
            </MailRow>
            <Status role="status">
              {refused ? "Could not copy the address. Select it and copy it by hand." : ""}
              {copied ? <span className="sr-only">Email address copied.</span> : null}
            </Status>
            <Socials>
              <Lnk href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                GitHub
                <NewTab />
              </Lnk>
              <Lnk href={GITLAB_URL} target="_blank" rel="noreferrer noopener">
                GitLab
                <NewTab />
              </Lnk>
              <Lnk href={PHONE_URL}>{PHONE}</Lnk>
            </Socials>
          </div>
        </Cols>
      </Shell>
    </Close>
  );
};

export default Contact;
