import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { Work } from '../data/WorkData';

const ProjectsContainer = styled.section`
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? props.theme.accent : props.theme.border};
  background: ${props => props.active ? props.theme.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accent};
    background: ${props => props.active ? props.theme.accent : props.theme.background};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const ProjectCard = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow};
    border-color: ${props => props.theme.accent};
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${props => props.theme.accent} 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ProjectContent = styled.div`
  padding: 24px;
`;

const ProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 12px;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const ProjectTag = styled.span`
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.border};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const ProjectLink = styled.a`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  &.primary {
    background: ${props => props.theme.accent};
    color: white;
    border-color: ${props => props.theme.accent};

    &:hover {
      background: ${props => props.theme.accentHover};
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.border};

    &:hover {
      background: ${props => props.theme.background};
      border-color: ${props => props.theme.accent};
    }
  }
`;

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState('All');

  const allTags = ['All', ...new Set(Work.flatMap(project => project.tags))];
  
  const filteredProjects = activeFilter === 'All' 
    ? Work 
    : Work.filter(project => project.tags.includes(activeFilter));

  const getProjectIcon = (projectName) => {
    if (projectName.includes('AI Sales') || projectName.includes('Multi-Agent')) return '🤖';
    if (projectName.includes('Graph') || projectName.includes('GNN')) return '🕸️';
    if (projectName.includes('Object Detection') || projectName.includes('Computer Vision')) return '👁️';
    if (projectName.includes('Model') || projectName.includes('Distillation')) return '⚡';
    if (projectName.includes('Distributed') || projectName.includes('Kubernetes')) return '☸️';
    if (projectName.includes('Reinforcement') || projectName.includes('Pose')) return '🎯';
    if (projectName.includes('Heat Map') || projectName.includes('OpenVino')) return '🔥';
    if (projectName.includes('Speech') || projectName.includes('Sign')) return '🗣️';
    if (projectName.includes('Edge') || projectName.includes('License')) return '📱';
    if (projectName.includes('Variational') || projectName.includes('Anomaly')) return '🔍';
    if (projectName.includes('Industrial') || projectName.includes('Process')) return '🏭';
    return '💻';
  };

  return (
    <ProjectsContainer id="projects">
      <Container>
        <SectionTitle
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A showcase of my recent work in AI, machine learning, and software development
        </SectionSubtitle>

        <FilterContainer>
          {allTags.map((tag, index) => (
            <FilterButton
              key={index}
              active={activeFilter === tag}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </FilterButton>
          ))}
        </FilterContainer>

        <ProjectsGrid>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <ProjectImage>
                {getProjectIcon(project.name)}
              </ProjectImage>
              <ProjectContent>
                <ProjectTitle>{project.name}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectTags>
                  {project.tags.map((tag, tagIndex) => (
                    <ProjectTag key={tagIndex}>{tag}</ProjectTag>
                  ))}
                </ProjectTags>
                <ProjectLinks>
                  <ProjectLink className="primary" href={project.demo} target="_blank">
                    Live Demo
                  </ProjectLink>
                  <ProjectLink className="secondary" href={project.github} target="_blank">
                    GitHub
                  </ProjectLink>
                </ProjectLinks>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Container>
    </ProjectsContainer>
  );
};

export default Projects;
