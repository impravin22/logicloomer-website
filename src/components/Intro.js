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
    height: auto;
    flex-direction: column;
    padding: 2rem 0;
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
    height: ${props => props.right ? '50vh' : 'auto'};
    margin-top: ${props => props.right ? '2rem' : '0'};
    
    .pic {
        position: relative;
        width: 70%;
        margin-top: 2rem;
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
}
`

const Intro = () => {
    // Check if we're on mobile for animation adaptations
    const isMobile = window.innerWidth <= 768;
    
    return (
        <Box
        initial={{height:0}}
        animate={{height: isMobile ? 'auto' : '55vh'}}
        transition={{ type: 'spring', duration: isMobile ? 1.5 : 2, delay:1 }}
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
                transition={{ duration:1, delay: isMobile ? 1.5 : 2 }}
                >
                    <img className="pic" src={Me} alt="Profile Pic" />
                </motion.div>
            </SubBox>
        </Box>
    )
}

export default Intro
