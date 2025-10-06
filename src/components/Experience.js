import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const ExperienceContainer = styled.section`
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

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${props => props.theme.accent};
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 50px;
  display: flex;
  align-items: flex-start;

  &:nth-child(odd) {
    flex-direction: row;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &:nth-child(even) {
    flex-direction: row-reverse;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

const TimelineContent = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 30px;
  width: calc(50% - 30px);
  position: relative;
  box-shadow: ${props => props.theme.shadow};

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
  }

  ${TimelineItem}:nth-child(odd) & {
    margin-right: 30px;

    &::before {
      right: -20px;
      border-left-color: ${props => props.theme.cardBackground};
    }

    @media (max-width: 768px) {
      margin-right: 0;
      margin-left: 50px;
      width: calc(100% - 50px);

      &::before {
        left: -20px;
        right: auto;
        border-left-color: transparent;
        border-right-color: ${props => props.theme.cardBackground};
      }
    }
  }

  ${TimelineItem}:nth-child(even) & {
    margin-left: 30px;

    &::before {
      left: -20px;
      border-right-color: ${props => props.theme.cardBackground};
    }

    @media (max-width: 768px) {
      margin-left: 0;
      margin-left: 50px;
      width: calc(100% - 50px);

      &::before {
        right: -20px;
        left: auto;
        border-right-color: transparent;
        border-left-color: ${props => props.theme.cardBackground};
      }
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 50px);
    margin-left: 50px;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  top: 20px;
  width: 16px;
  height: 16px;
  background: ${props => props.theme.accent};
  border: 4px solid ${props => props.theme.body};
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

const JobTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const Company = styled.h4`
  font-size: 16px;
  color: ${props => props.theme.accent};
  font-weight: 500;
  margin-bottom: 8px;
`;

const Duration = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 16px 0;
`;

const Achievements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
`;

const Achievement = styled.li`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;

  &::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: ${props => props.theme.accent};
    font-size: 10px;
  }
`;

const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const SkillTag = styled.span`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.border};
`;

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      title: "Sr. AI Software Developer",
      company: "ViewSonic (Taiwan)",
      duration: "2022.03 - Present",
      description: "Leading the development of comprehensive multi-agent AI systems for sales support and intelligent automation.",
      achievements: [
        "Designed and led multi-agent AI system for ViewSonic sales teams with product information and competitor analysis",
        "Developed intelligent agent system with specialized agents for product information, software features, and competitor comparison",
        "Built robust data collection pipeline from PostgreSQL, Qdrant databases, Dropbox, and SharePoint APIs",
        "Implemented Python backend with FastAPI framework supporting real-time query processing",
        "Achieved 92% accuracy in stroke-based sketch recognition using GNN architectures",
        "Organized 500K+ image dataset and trained object detection models achieving mAP of 0.82",
        "Fine-tuned 600M parameter model achieving 2x speed improvement while maintaining accuracy",
        "Set up Kubernetes clusters for multi-GPU training and deployed distributed ML workloads"
      ],
      skills: ["Multi-Agent Systems", "LLMs", "FastAPI", "Vector Databases", "Kubernetes", "PyTorch", "GNN", "Distributed Computing"]
    },
    {
      title: "AI Software Developer",
      company: "Neurelli (Taiwan)",
      duration: "2020.08 - 2022.03",
      description: "Developed edge AI solutions and industrial ML pipelines for manufacturing optimization.",
      achievements: [
        "Deployed license plate recognition using TensorRT optimization and CUDA acceleration",
        "Implemented Variational Autoencoder for LCD panel defect detection using PyTorch",
        "Built end-to-end ML solution for casting process optimization achieving 85% prediction accuracy",
        "Reduced manual inspection time by 70% while increasing defect detection rates by 35%",
        "Improved manufacturing precision by 40% and reduced material waste by 25%"
      ],
      skills: ["TensorRT", "CUDA", "Variational Autoencoder", "PyTorch", "Edge Computing", "Manufacturing AI"]
    }
  ];

  return (
    <ExperienceContainer id="experience">
      <Container>
        <SectionTitle
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Professional Experience
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          My journey in AI and software development across leading technology companies
        </SectionSubtitle>

        <Timeline>
          {experiences.map((exp, index) => (
            <TimelineItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
            >
              <TimelineDot />
              <TimelineContent>
                <JobTitle>{exp.title}</JobTitle>
                <Company>{exp.company}</Company>
                <Duration>{exp.duration}</Duration>
                <Description>{exp.description}</Description>
                <Achievements>
                  {exp.achievements.map((achievement, achIndex) => (
                    <Achievement key={achIndex}>{achievement}</Achievement>
                  ))}
                </Achievements>
                <Skills>
                  {exp.skills.map((skill, skillIndex) => (
                    <SkillTag key={skillIndex}>{skill}</SkillTag>
                  ))}
                </Skills>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Container>
    </ExperienceContainer>
  );
};

export default Experience;
