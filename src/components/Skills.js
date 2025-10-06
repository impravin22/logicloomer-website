import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const SkillsContainer = styled.section`
  padding: 100px 20px;
  background: ${props => props.theme.body};
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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const SkillCategory = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow};
    border-color: ${props => props.theme.accent};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CategoryIcon = styled.div`
  font-size: 32px;
  margin-right: 16px;
`;

const CategoryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 20px;
  line-height: 1.6;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.accent};
    color: white;
    border-color: ${props => props.theme.accent};
  }
`;

const TechnologiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const TechItem = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const TechIcon = styled.div`
  font-size: 24px;
  margin-bottom: 12px;
`;

const TechName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const TechDescription = styled.p`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      icon: "🤖",
      title: "AI Systems",
      description: "Multi-agent systems, LLMs, and vector databases for enterprise applications",
      skills: ["Multi-Agent Systems", "Large Language Models", "Vector Databases", "Graph Neural Networks", "RAG Architecture", "Agent Coordination"]
    },
    {
      icon: "⚙️",
      title: "ML/DL Frameworks",
      description: "Advanced machine learning and deep learning frameworks for production systems",
      skills: ["PyTorch", "TensorFlow", "Keras", "OpenVino", "TensorRT", "CUDA", "Multi-GPU Computing"]
    },
    {
      icon: "💻",
      title: "Programming & Backend",
      description: "Full-stack development with focus on scalable backend systems",
      skills: ["Python", "C++", "SQL", "FastAPI", "PostgreSQL", "Redis", "APIs", "RESTful Services"]
    },
    {
      icon: "☁️",
      title: "Infrastructure & DevOps",
      description: "Cloud infrastructure and deployment automation for AI systems",
      skills: ["Docker", "Kubernetes", "AWS", "Multi-GPU", "ETL Pipelines", "Qdrant", "Data Processing"]
    }
  ];

  const technologies = [
    { icon: "🐍", name: "Python", description: "Primary language" },
    { icon: "⚡", name: "C++", description: "Performance critical" },
    { icon: "🔥", name: "PyTorch", description: "Deep learning" },
    { icon: "🤖", name: "TensorFlow", description: "ML framework" },
    { icon: "🐳", name: "Docker", description: "Containerization" },
    { icon: "☸️", name: "Kubernetes", description: "Orchestration" },
    { icon: "☁️", name: "AWS", description: "Cloud platform" },
    { icon: "🚀", name: "FastAPI", description: "API framework" }
  ];

  return (
    <SkillsContainer id="skills">
      <Container>
        <SectionTitle
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Skills & Technologies
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Comprehensive expertise in AI systems, machine learning, and modern development practices
        </SectionSubtitle>

        <SkillsGrid>
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <CategoryHeader>
                <CategoryIcon>{category.icon}</CategoryIcon>
                <CategoryTitle>{category.title}</CategoryTitle>
              </CategoryHeader>
              <CategoryDescription>{category.description}</CategoryDescription>
              <SkillsList>
                {category.skills.map((skill, skillIndex) => (
                  <SkillTag key={skillIndex}>{skill}</SkillTag>
                ))}
              </SkillsList>
            </SkillCategory>
          ))}
        </SkillsGrid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <SectionTitle style={{ fontSize: '28px', marginBottom: '40px' }}>
            Core Technologies
          </SectionTitle>
          
          <TechnologiesGrid>
            {technologies.map((tech, index) => (
              <TechItem
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                <TechIcon>{tech.icon}</TechIcon>
                <TechName>{tech.name}</TechName>
                <TechDescription>{tech.description}</TechDescription>
              </TechItem>
            ))}
          </TechnologiesGrid>
        </motion.div>
      </Container>
    </SkillsContainer>
  );
};

export default Skills;
