import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const AboutContainer = styled.section`
  padding: 100px 20px;
  background: ${props => props.theme.background};
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 18px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const TextContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${props => props.theme.textSecondary};

  p {
    margin-bottom: 20px;
  }

  .highlight {
    color: ${props => props.theme.accent};
    font-weight: 600;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkillItem = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow};
    border-color: ${props => props.theme.accent};
  }
`;

const SkillIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const SkillDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 20px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.theme.accent};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <AboutContainer id="about">
      <Container>
        <SectionTitle
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Passionate about building intelligent systems that solve real-world problems
        </SectionSubtitle>

        <AboutContent>
          <TextContent>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              I'm a <span className="highlight">Research-oriented ML/Deep Learning Engineer</span> with 5+ years of experience in state-of-the-art AI techniques including multi-agent systems, LLMs and vector databases.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Currently based in <span className="highlight">Taipei, Taiwan</span>, working as a <span className="highlight">Sr. AI Software Developer at ViewSonic</span>, leading the development of comprehensive multi-agent AI systems for sales support and intelligent automation.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              I have a proven track record in <span className="highlight">intelligent sales support systems</span>, large-scale data processing, and translating cutting-edge AI research into business applications. My strong foundation in both theoretical AI and practical implementation includes extensive experience with distributed computing.
            </motion.p>
          </TextContent>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <SkillsGrid>
              <SkillItem>
                <SkillIcon>🤖</SkillIcon>
                <SkillName>Multi-Agent Systems</SkillName>
                <SkillDescription>Designing intelligent agent coordination systems</SkillDescription>
              </SkillItem>
              <SkillItem>
                <SkillIcon>🧠</SkillIcon>
                <SkillName>Large Language Models</SkillName>
                <SkillDescription>Expert in LLM fine-tuning and optimization</SkillDescription>
              </SkillItem>
              <SkillItem>
                <SkillIcon>🔍</SkillIcon>
                <SkillName>Vector Databases</SkillName>
                <SkillDescription>Building semantic search systems</SkillDescription>
              </SkillItem>
              <SkillItem>
                <SkillIcon>⚡</SkillIcon>
                <SkillName>Distributed Computing</SkillName>
                <SkillDescription>Kubernetes and multi-GPU systems</SkillDescription>
              </SkillItem>
            </SkillsGrid>
          </motion.div>
        </AboutContent>

        <StatsContainer>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <StatNumber>5+</StatNumber>
            <StatLabel>Years Experience</StatLabel>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <StatNumber>11+</StatNumber>
            <StatLabel>AI Projects</StatLabel>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <StatNumber>2</StatNumber>
            <StatLabel>Research Publications</StatLabel>
          </StatItem>
        </StatsContainer>
      </Container>
    </AboutContainer>
  );
};

export default About;
