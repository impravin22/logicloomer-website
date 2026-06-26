import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeToggleContext } from "./themeContext";

const Bar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background: ${(props) => props.theme.navbar};
  border-bottom: 1px solid ${(props) => props.theme.rule};
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;

  @media (max-width: 600px) {
    padding: 0 22px;
  }
`;

const Brand = styled.a`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 13px;
  letter-spacing: 0.12em;
  font-weight: 500;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};

  b {
    color: ${(props) => props.theme.gold};
    font-weight: 600;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 34px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.text2};
`;

const NavLink = styled.a`
  position: relative;
  transition: color 0.2s;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.gold};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: ${(props) => props.theme.text};
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const ResumeLink = styled(NavLink)`
  @media (max-width: 760px) {
    display: inline;
  }
`;

const Toggle = styled.button`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 11px;
  letter-spacing: 0.08em;
  border: 1px solid ${(props) => props.theme.rule};
  color: ${(props) => props.theme.text2};
  background: transparent;
  padding: 8px 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  text-transform: uppercase;

  &:hover {
    border-color: ${(props) => props.theme.gold};
    color: ${(props) => props.theme.gold};
  }
`;

const SECTIONS = [
  { href: "#profile", label: "Profile" },
  { href: "#expertise", label: "Expertise" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const Navigation = () => {
  const { isDark, toggleTheme } = useContext(ThemeToggleContext);
  const resumeHref = `${process.env.PUBLIC_URL}/Praveen_Chittem_CV_2026.pdf`;

  return (
    <Bar aria-label="Primary">
      <Inner>
        <Brand href="#top">
          PRAVEEN<b>/</b>CHITTEM
        </Brand>
        <Links>
          {SECTIONS.map((section) => (
            <NavLink key={section.href} href={section.href}>
              {section.label}
            </NavLink>
          ))}
          <ResumeLink
            href={resumeHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            Résumé ↗
          </ResumeLink>
        </Links>
        <Toggle
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          ◐ Theme
        </Toggle>
      </Inner>
    </Bar>
  );
};

export default Navigation;
