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
`
const Title = styled.h2`
font-size: calc(1em + 0.5vw);
`

const Description = styled.h2`
font-size: calc(0.8em + 0.3vw);
font-family: 'Karla',sans-serif;
font-weight: 500;
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
`

const Footer = styled.footer`
display: flex;
justify-content: center;
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
