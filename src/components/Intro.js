import React from 'react'
import styled from 'styled-components'
import {motion} from 'framer-motion'
import Me from '../assets/Images/profile-img.png' // Changed back to original profile image


const Box = styled(motion.div)`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);

width: 65vw;
height:55vh;
display: flex;

background: linear-gradient(
    to right,
    ${props => props.theme.body} 50%,
    ${props => props.theme.text} 50%) bottom,
    linear-gradient(
    to right,
    ${props => props.theme.body} 50%,
    ${props => props.theme.text} 50%) top;
    background-repeat: no-repeat;
background-size: 100% 2px;
    border-left: 2px solid ${props => props.theme.body};
    border-right: 2px solid ${props => props.theme.text};

z-index:1;

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 85vw;
    min-height: 80vh; /* Set a minimum height instead of auto */
    height: auto;
    flex-direction: column;
    padding: 2rem 0;
    overflow: visible; /* Prevent content from being cut off */
}
`
const SubBox = styled.div`
width: 50%;
position: relative;
display: flex;

.pic{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%,0%);
    width: 100%;
    height: auto;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 100%;
    height: auto;
    
    &:nth-child(2) { /* Target the image container */
        margin-top: 2rem;
        order: -1; /* Move image to top on mobile */
        height: auto;
        
        .pic {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            width: 60%;
            max-width: 250px;
            margin: 0 auto;
            display: block;
        }
    }
}
`

const Text = styled.div`
font-size: calc(1em + 1.5vw);
color: ${props => props.theme.body};
padding: 2rem;
cursor: pointer;

display: flex;
flex-direction: column;
justify-content: space-evenly;

&>*:last-child{
    color: ${props => `rgba(${props.theme.bodyRgba},0.6)` };
    font-size: calc(0.5rem + 1.5vw);
    font-weight:300;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    padding: 1rem;
    text-align: center;
    margin-top: 1.5rem; /* Add space after the image */
    
    h1, h3 {
        margin-bottom: 0.5rem; /* Add some spacing between text elements */
    }
    
    h6 {
        margin-top: 1rem;
        line-height: 1.5;
    }
}
`

const Intro = () => {
    return (
        <Box
        initial={{height:0}}
        animate={{height: '55vh'}}
        transition={{ type: 'spring', duration:2, delay:1 }}
        >
            <SubBox>
                <Text>
                    <h1>Hi,</h1>
                    <h3>I'm Pravy.</h3>
                    <h6>I'm an AI Software Developer specializing in Computer Vision and LLMs.</h6>
                </Text>
            </SubBox>
            <SubBox right>
                <motion.div
                initial={{opacity:0}}
                animate={{opacity: 1}}
                transition={{ duration:1, delay:2 }}
                >
                    <img className="pic" src={Me} alt="Profile Pic" />
                </motion.div>
            </SubBox>
        </Box>
    )
}

export default Intro
