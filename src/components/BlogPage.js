import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import img from "../assets/Images/patrick-tomasso-Oaqk7qqNh_c-unsplash.jpg"
import LogoComponent from '../subComponents/LogoComponent'
import SocialIcons from '../subComponents/SocialIcons'
import PowerButton from '../subComponents/PowerButton'

import { Blogs } from '../data/BlogData';
import AnchorComponent from '../subComponents/Anchor'
import BigTitle from "../subComponents/BigTitlte"
import { motion } from 'framer-motion'
import { Design, Develope, Github, Link, YinYang, PowerBtn, Anchor } from '../components/AllSvgs'

const MainContainer = styled(motion.div)`
background-image: url(${img});
background-size: cover;
background-repeat: no-repeat;
background-attachment: fixed;
background-position: center;
`
const Container = styled.div`
background-color: ${props => `rgba(${props.theme.bodyRgba},0.8)`};
width: 100%;
height:auto;
position: relative;
padding-bottom: 5rem;
`

const Center = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 10rem;
width: 70%;
margin: 0 auto;

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 85%;
    padding-top: 8rem;
}
`

const Heading = styled.h2`
font-size: 2.5rem;
margin-bottom: 2rem;
color: ${props => props.theme.text};
text-align: center;

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}
`

const SubHeading = styled.h3`
font-size: 1.8rem;
margin: 2rem 0 1rem;
color: ${props => props.theme.text};

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
}
`

const Text = styled.p`
font-size: 1.2rem;
line-height: 1.8;
color: ${props => props.theme.text};
margin-bottom: 2rem;
text-align: justify;

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    text-align: left;
}
`

const ServicesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin-bottom: 3rem;
`;

const ServiceBox = styled.div`
  width: 16rem;
  height: 40vh;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  padding: 1.5rem 2rem;
  border-radius: 0 50px 0 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${props => props.theme.body};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: ${props => props.theme.body};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.text};
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 85%;
    max-width: 350px;
    margin-right: 0;
    margin-bottom: 2rem;
    height: auto;
    min-height: 250px;
    padding: 1.2rem 1.5rem;
  }
`;

const ServiceIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    top: 0.8rem;
    right: 0.8rem;
  }
`;

const ServiceTitle = styled.h2`
  font-size: calc(1em + 0.5vw);
  margin-top: 2rem;
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-top: 1.5rem;
  }
`;

const ServiceDescription = styled.p`
  font-size: calc(0.8em + 0.3vw);
  font-family: 'Karla', sans-serif;
  font-weight: 500;
  margin-top: 1rem;
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-top: 0.8rem;
  }
`;

const PublicationList = styled.ul`
list-style-type: none;
padding: 0;
width: 100%;
`

const PublicationItem = styled.li`
margin-bottom: 2rem;
padding: 1.5rem;
background-color: rgba(255, 255, 255, 0.1);
border-radius: 10px;
transition: all 0.3s ease;

&:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
}
`

const PublicationTitle = styled.h4`
font-size: 1.4rem;
margin-bottom: 0.5rem;
color: ${props => props.theme.text};

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 1.2rem;
}
`

const PublicationLink = styled.a`
color: #00bfff;
text-decoration: none;
font-weight: bold;
display: inline-block;
margin-top: 0.5rem;

&:hover {
  text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    margin-top: 0.8rem;
    padding: 0.5rem 0;
    display: block;
}
`

const TagContainer = styled.div`
display: flex;
flex-wrap: wrap;
margin: 1rem 0;
`

const Tag = styled.span`
background-color: rgba(0, 0, 0, 0.3);
color: ${props => props.theme.text};
padding: 0.3rem 0.8rem;
border-radius: 5px;
margin-right: 0.5rem;
margin-bottom: 0.5rem;
font-size: 0.9rem;

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
}
`

// Framer-motion config
const container = {

    hidden: {opacity:0},
    show: {
      opacity:1,
      transition:{
        staggerChildren: 0.5,
        duration: 0.5,
      }
    }
}

const BlogPage = () => {
    const [numbers, setNumbers] = useState(0);

    useEffect(() => {
        let num = (window.innerHeight - 70)/30;
        setNumbers(parseInt(num));
    }, [])

    const educationEntry = Blogs.find(blog => blog.id === 1);
    const publications = Blogs.filter(blog => blog.id !== 1);

    return (
        <MainContainer
        variants={container}
        initial='hidden'
        animate='show'
        exit={{
            opacity:0, transition:{duration: 0.5}
        }}
        >
            <Container>
                <LogoComponent />
                <PowerButton />
                <SocialIcons />
                <AnchorComponent number={numbers}/>
                <Center>
                    <Heading>What I Offer</Heading>
                    
                    {/* Services Section */}
                    <ServicesGrid>
                        <ServiceBox>
                            <ServiceIcon>
                                <Github width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Custom LLMs integrations</ServiceTitle>
                            <ServiceDescription>
                                Seamlessly integrate large language models into your applications for enhanced functionality.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Design width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Agentic RAG</ServiceTitle>
                            <ServiceDescription>
                                Advanced retrieval-augmented generation systems with autonomous capabilities.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <YinYang width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Computer Vision</ServiceTitle>
                            <ServiceDescription>
                                Machine learning systems that can process, analyze, and understand visual data.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Design width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Image Processing</ServiceTitle>
                            <ServiceDescription>
                                Advanced techniques for enhancing and extracting information from digital images.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Link width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Data Management and Processing</ServiceTitle>
                            <ServiceDescription>
                                Comprehensive solutions for data storage, organization, and analysis at scale.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Anchor width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Infrastructure as a service</ServiceTitle>
                            <ServiceDescription>
                                Cloud-based infrastructure solutions tailored to your specific requirements.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Develope width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Software as a service</ServiceTitle>
                            <ServiceDescription>
                                Custom SaaS solutions designed to meet your business needs.
                            </ServiceDescription>
                        </ServiceBox>
                        
                        <ServiceBox>
                            <ServiceIcon>
                                <Design width={25} height={25} />
                            </ServiceIcon>
                            <ServiceTitle>Customized Website Building</ServiceTitle>
                            <ServiceDescription>
                                Professional, responsive website development tailored to your specific needs and brand identity.
                            </ServiceDescription>
                        </ServiceBox>
                    </ServicesGrid>
                    
                    {/* Education Section */}
                    <SubHeading>Education</SubHeading>
                    <Text>{educationEntry.description}</Text>
                    
                    {/* Publications Section */}
                    <SubHeading>Publications</SubHeading>
                    <PublicationList>
                        {publications.map(pub => (
                            <PublicationItem key={pub.id}>
                                <PublicationTitle>{pub.name}</PublicationTitle>
                                <Text>{pub.description}</Text>
                                <TagContainer>
                                    {pub.tags.map((tag, index) => (
                                        <Tag key={index}>#{tag}</Tag>
                                    ))}
                                </TagContainer>
                                <PublicationLink href={pub.link} target="_blank" rel="noreferrer">
                                    View Publication
                                </PublicationLink>
                            </PublicationItem>
                        ))}
                    </PublicationList>
                </Center>

                <BigTitle text="SERVICES" top="5rem" left="5rem" />
            </Container>
        </MainContainer>
    )
}

export default BlogPage
