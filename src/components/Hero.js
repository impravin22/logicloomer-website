import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import profileImg from '../assets/Images/profile-img.png';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 100px 20px 80px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const TextContent = styled.div`
  z-index: 2;
`;

const Greeting = styled(motion.div)`
  font-size: 18px;
  color: ${props => props.theme.accent};
  font-weight: 500;
  margin-bottom: 16px;
`;

const Name = styled(motion.h1)`
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  background: linear-gradient(135deg, ${props => props.theme.text} 0%, ${props => props.theme.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled(motion.h2)`
  font-size: clamp(24px, 4vw, 36px);
  color: ${props => props.theme.textSecondary};
  font-weight: 600;
  margin-bottom: 24px;
`;

const Description = styled(motion.p)`
  font-size: 18px;
  line-height: 1.7;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 32px;
  max-width: 500px;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.a`
  display: inline-block;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &.primary {
    background: ${props => props.theme.accent};
    color: white;
    
    &:hover {
      background: ${props => props.theme.accentHover};
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(88, 166, 255, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.background};
      border-color: ${props => props.theme.accent};
      color: ${props => props.theme.accent};
    }
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    order: -1;
  }
`;

const ProfileImage = styled.div`
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.accent} 0%, #764ba2 100%);
  padding: 4px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.background};
    border-radius: 50%;
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: ${props => props.theme.accent};
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;

  &:nth-child(1) {
    width: 60px;
    height: 60px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 40px;
    height: 40px;
    top: 60%;
    right: 20%;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer id="hero">
      <FloatingElements>
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
      </FloatingElements>
      
      <HeroContent>
        <TextContent>
          <Greeting
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Hi, my name is
          </Greeting>
          
          <Name
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pravy
          </Name>
          
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Sr. AI Software Developer
          </Title>
          
          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Research-oriented ML/Deep Learning Engineer with 5+ years in state-of-the-art AI techniques including multi-agent systems, LLMs and vector databases. Expert in end-to-end ML pipelines from problem framing to production deployment.
          </Description>
          
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button className="primary" onClick={scrollToProjects}>
              View My Work
            </Button>
            <Button className="secondary" onClick={scrollToContact}>
              Get In Touch
            </Button>
          </ButtonGroup>
        </TextContent>
        
        <ImageContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ProfileImage>
            <img src={profileImg} alt="Praveen Kumar Chittem" />
          </ProfileImage>
        </ImageContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
