import React from "react";
import styled from "styled-components";
import { Shell, role, NewTab } from "./_dossier";
import { CV_URL, MAP_URL, GITHUB_URL, GITLAB_URL } from "./site";

// One short block: the wordmark and the page's own links, then the legal line.
const FootRoot = styled.footer`
  margin-top: ${(p) => p.theme.gap.l};
  padding-block: ${(p) => p.theme.space["2xl"]};
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${(p) => p.theme.space.lg} ${(p) => p.theme.space["2xl"]};
`;

const Mark = styled.a`
  font-family: ${(p) => p.theme.grot};
  ${role("title")}
  color: ${(p) => p.theme.ink};
  display: inline-flex;
  align-items: center;
  min-height: ${(p) => p.theme.layout.control};
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 ${(p) => p.theme.space.lg};
  color: ${(p) => p.theme.stone};

  a {
    display: inline-flex;
    align-items: center;
    min-height: ${(p) => p.theme.layout.control};
    transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};
  }
  a:hover {
    color: ${(p) => p.theme.ink};
  }
`;

const Legal = styled.div`
  ${role("small")}
  margin-top: ${(p) => p.theme.space.xl};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.space.xs} ${(p) => p.theme.space.lg};
  color: ${(p) => p.theme.stone2};
`;

const Footer = () => (
  <FootRoot>
    <Shell>
      <Top>
        <Mark href="#top" aria-label="Pravy, back to the top">
          pravy.
        </Mark>
        <Links aria-label="Footer">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href={MAP_URL}>Map</a>
          <a href={CV_URL} target="_blank" rel="noreferrer noopener">
            CV
            <NewTab />
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
            GitHub
            <NewTab />
          </a>
          <a href={GITLAB_URL} target="_blank" rel="noreferrer noopener">
            GitLab
            <NewTab />
          </a>
        </Links>
      </Top>
      <Legal>
        <span>© 2026 Pravy Chittem</span>
        <span>Taipei, Taiwan</span>
      </Legal>
    </Shell>
  </FootRoot>
);

export default Footer;
