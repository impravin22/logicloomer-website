import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: ${props => props.theme.body};
  border-top: 1px solid ${props => props.theme.border};
  padding: 40px 20px;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 50%;
  color: ${props => props.theme.text};
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.accent};
    color: white;
    transform: translateY(-2px);
  }
`;

const FooterText = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <Logo>Praveen Kumar Chittem</Logo>
          <SocialLinks>
            <SocialLink href="https://github.com/impravin22" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/praveen-kumar-chittem" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </SocialLink>
            <SocialLink href="mailto:impravin22@gmail.com">
              <i className="fas fa-envelope"></i>
            </SocialLink>
            <SocialLink href="/Pravy_CV.pdf" target="_blank">
              <i className="fas fa-file-pdf"></i>
            </SocialLink>
          </SocialLinks>
        </FooterContent>
        <FooterText>
          © 2024 Praveen Kumar Chittem. All rights reserved. Built with React & Styled Components.
        </FooterText>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
