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
                    <Heading>Education & Publications</Heading>
                    
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

                <BigTitle text="EDUCATION" top="5rem" left="5rem" />
            </Container>
        </MainContainer>
    )
}

export default BlogPage
