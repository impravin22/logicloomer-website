import React from "react";
import styled from "styled-components";
import { Wrap } from "./_dossier";

const FooterRoot = styled.footer`
  border-top: 1px solid ${(props) => props.theme.rule};
  padding: 32px 0;
`;

const FooterRow = styled(Wrap)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-family: ${(props) => props.theme.fontMono};
  font-size: 12px;
  letter-spacing: 0.04em;
  color: ${(props) => props.theme.text3};
`;

const TopLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.gold};
  }
`;

const Footer = () => {
  return (
    <FooterRoot aria-label="Site footer">
      <FooterRow>
        <span>© 2026 Praveen Kumar Chittem</span>
        <span>Designed &amp; built — Systems Dossier</span>
        <TopLink href="#top">Back to top ↑</TopLink>
      </FooterRow>
    </FooterRoot>
  );
};

export default Footer;
