import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? props.theme.navbarBackground : 'transparent'};
  backdrop-filter: blur(10px);
  border-bottom: ${props => props.scrolled ? `1px solid ${props.theme.border}` : 'none'};
  transition: all 0.3s ease;
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.background};
    border-top: 1px solid ${props => props.theme.border};
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 200ms ease;
  position: relative;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.accent};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => props.theme.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ResumeButton = styled.a`
  background: ${props => props.theme.accent};
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 250ms cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.accentHover};
    transform: translateY(-2px);
  }
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <NavContainer scrolled={scrolled}>
      <NavContent>
        <Logo onClick={() => scrollToSection('hero')}>
          Pravy
        </Logo>
        
        <NavLinks isOpen={isOpen}>
          <NavLink onClick={() => scrollToSection('about')}>
            About
          </NavLink>
          <NavLink onClick={() => scrollToSection('skills')}>
            Skills
          </NavLink>
          <NavLink onClick={() => scrollToSection('projects')}>
            Projects
          </NavLink>
          <NavLink onClick={() => scrollToSection('experience')}>
            Experience
          </NavLink>
          <NavLink onClick={() => scrollToSection('contact')}>
            Contact
          </NavLink>
          <ResumeButton href="/Praveen%20Kumar%20Chittem%20CV.pdf" target="_blank">
            Resume
          </ResumeButton>
        </NavLinks>

        <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
          ☰
        </MobileMenuButton>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
