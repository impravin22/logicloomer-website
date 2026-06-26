import React from "react";
import styled from "styled-components";
import { Shell } from "./_dossier";

const FootRoot = styled.footer`
  padding: 40px 0 56px;
  border-top: 1px solid ${(p) => p.theme.hair};
  margin-top: 48px;
`;

const Row = styled(Shell)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  font-family: ${(p) => p.theme.mono};
  font-size: 12.5px;
  color: ${(p) => p.theme.stone2};
`;

const Footer = () => (
  <FootRoot>
    <Row as="div">
      <span>© 2026 Praveen &ldquo;Pravy&rdquo; Chittem</span>
      <span>Taipei · Set in Bricolage &amp; Satoshi</span>
    </Row>
  </FootRoot>
);

export default Footer;
