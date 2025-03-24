import { motion } from 'framer-motion';
import React, { useState } from 'react'; // Added useState import
import styled from 'styled-components';



const Box = styled(motion.li)`
width: 16rem;
height: ${props => props.expanded ? '60vh' : '40vh'}; /* Dynamically adjust height based on expansion */
background-color: ${props => props.theme.text};
color:${props => props.theme.body};
padding: 1.5rem 2rem;
margin-right: 8rem;
border-radius: 0 50px 0 50px;
display: flex;
flex-direction: column;
justify-content: space-between;
border: 1px solid ${props => props.theme.body};
transition: all 0.2s ease;
overflow: ${props => props.expanded ? 'auto' : 'hidden'};

&:hover{
background-color: ${props => props.theme.body};
color:${props => props.theme.text};
border: 1px solid ${props => props.theme.text};
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 85%;
    max-width: 350px;
    margin-right: 0;
    margin-bottom: 2rem;
    height: ${props => props.expanded ? 'auto' : 'auto'};
    min-height: ${props => props.expanded ? '400px' : '300px'};
    padding: 1.2rem 1.5rem;
}
`
const Title = styled.h2`
font-size: calc(1em + 0.5vw);

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 1.2rem;
}
`

const Description = styled.h2`
font-size: calc(0.8em + 0.3vw);
font-family: 'Karla',sans-serif;
font-weight: 500;

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0.8rem 0;
}
`
const Tags = styled.div`
border-top: 2px solid ${props =>props.theme.body};
padding-top: 0.5rem;
display:flex;
flex-wrap:wrap;
${Box}:hover &{
border-top: 2px solid ${props =>props.theme.text};
}
`
const Tag = styled.span`
margin-right:1rem;
font-size:calc(0.8em + 0.3vw);

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 0.7rem;
    margin-right: 0.7rem;
    margin-bottom: 0.5rem;
}
`

const Footer = styled.footer`
display: flex;
justify-content: center;
margin-top: 1rem;
`

const Link = styled.button`
background-color: ${props =>props.theme.body};
color: ${props =>props.theme.text};
text-decoration: none;
padding:0.5rem calc(2rem + 2vw);
border-radius: 0 0 0 50px;
font-size:calc(1em + 0.5vw);
border: none;
cursor: pointer;

${Box}:hover &{
    background-color: ${props =>props.theme.text};
    color: ${props =>props.theme.body};
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    margin-top: 0.5rem;
}
`

const ExpandedContent = styled.div`
margin-top: 1rem;
padding-top: 1rem;
border-top: 1px dashed ${props => props.theme.body};
font-size: calc(0.7em + 0.3vw);
line-height: 1.5;

${Box}:hover &{
    border-top: 1px dashed ${props =>props.theme.text};
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: 0.85rem;
    margin-top: 0.8rem;
    padding-top: 0.8rem;
}
`

// Framer motion configuration
const Item = {
    hidden:{
        scale:0
    },
    show:{
        scale:1,
        transition: {
            type: 'spring',
            duration: 0.5
        }
    }
}

const Card = (props) => {
    const [expanded, setExpanded] = useState(false);
    const {id, name, description, tags, expandedContent} = props.data;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <Box key={id} variants={Item} expanded={expanded}>
            <Title>{name}</Title>
            <Description>
                {description}
            </Description>
            <Tags>
            {
                    tags.map((t,id) => {
                        return <Tag key={id}>#{t}</Tag>
                    })
                }
            </Tags>
            
            {/* Expanded content section */}
            {expanded && (
                <ExpandedContent>
                    <p>{expandedContent}</p>
                </ExpandedContent>
            )}
            
            <Footer>
                <Link onClick={toggleExpanded}>
                    {expanded ? 'View Less' : 'View More'}
                </Link>
            </Footer>
        </Box>
    )
}

export default Card
