import React from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import {DarkTheme} from './Themes';


import LogoComponent from '../subComponents/LogoComponent';
import SocialIcons from '../subComponents/SocialIcons';
import PowerButton from '../subComponents/PowerButton';
import ParticleComponent from '../subComponents/ParticleComponent';
import BigTitle from '../subComponents/BigTitlte'
import astronaut from '../assets/Images/spaceman.png'

const Box = styled.div`
background-color: ${props => props.theme.body};
width: 100vw;
height:100vh;
position: relative;
overflow: hidden;

/* Mobile responsiveness */
@media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
}
`
const float = keyframes`
0% { transform: translateY(-10px) }
50% { transform: translateY(15px) translateX(15px) }
100% { transform: translateY(-10px) }

`
const Spaceman = styled.div`
position: absolute;
top: 10%;
right: 5%;
width: 20vw;
animation: ${float} 4s ease infinite;
img{
    width: 100%;
    height: auto;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 30vw;
    top: 10%;
    right: 5%;
    opacity: 0.6;
}
`
const Main =  styled.div`
  border: 2px solid ${(props) => props.theme.text};
  color: ${(props) => props.theme.text};
  padding: 2rem;
  width: 50vw;
  height: 60vh;
  z-index: 3;
  line-height: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: calc(0.6rem + 1vw);
  backdrop-filter: blur(4px);
  
  position: absolute;
  left: calc(5rem + 5vw);
  top: 10rem;
  font-family: 'Ubuntu Mono', monospace;
  font-style: italic;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    width: 80vw;
    height: auto;
    min-height: 50vh;
    left: 50%;
    transform: translateX(-50%);
    top: 15rem;
    padding: 1.5rem;
    font-size: calc(0.6rem + 0.8vw);
  }
`




const AboutPage = () => {
    return (
        <ThemeProvider theme={DarkTheme}>
<Box>

<LogoComponent theme='dark'/>
<SocialIcons theme='dark'/>
<PowerButton />
<ParticleComponent theme='dark' />

        <Spaceman>
            <img src={astronaut} alt="spaceman" />
        </Spaceman>    
        <Main>
        Research-oriented ML/Deep Learning Engineer with 5+ years in state-of-the-art AI techniques including multi-agent systems, LLMs and vector databases. Expert in end-to-end ML pipelines from problem framing to production deployment.
<br /> <br/>
Proven track record in intelligent sales support systems, large-scale data processing, and translating cutting-edge AI research into business applications. Strong foundation in both theoretical AI and practical implementation with distributed computing experience.
<br/> <br/>
Currently based in Taipei, Taiwan, working as a Sr. AI Software Developer at ViewSonic, leading the development of comprehensive multi-agent AI systems for sales support and intelligent automation.
        </Main>

        <BigTitle text="ABOUT" top="10%" left="5%" />


        </Box>

        </ThemeProvider>
        
    )
}

export default AboutPage
