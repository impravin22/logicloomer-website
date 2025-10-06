import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {lightTheme} from './Themes';
import { Design, Develope} from './AllSvgs';


import LogoComponent from '../subComponents/LogoComponent';
import SocialIcons from '../subComponents/SocialIcons';
import PowerButton from '../subComponents/PowerButton';
import ParticleComponent from '../subComponents/ParticleComponent';
import BigTitle from '../subComponents/BigTitlte'

const Box = styled.div`
background-color: ${props => props.theme.body};
width: 100vw;
height:100vh;
position: relative;
display: flex;
justify-content: space-evenly;
align-items: center;

/* Mobile responsiveness */
@media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem 0;
    height: auto;
    min-height: 100vh;
}
`

const Main = styled.div`
border: 2px solid ${props => props.theme.text};
color: ${props => props.theme.text};
background-color: ${props => props.theme.body};
padding: 2rem;
width: 30vw;
min-height: 60vh; /* Changed from fixed height to min-height */
max-height: 75vh; /* Added max-height */
overflow-y: auto; /* Added overflow handling */
z-index:3;
line-height: 1.5;
cursor: pointer;

font-family: 'Ubuntu Mono',monospace;
display: flex;
flex-direction: column;
justify-content: flex-start; /* Changed from space-between to flex-start */
gap: 1rem; /* Added gap for spacing between elements */

&:hover{
    color: ${props => props.theme.body};
    background-color: ${props => props.theme.text};
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    width: 80vw;
    max-width: 400px;
    min-height: auto;
    margin: 1rem 0;
    padding: 1.5rem;
    max-height: none;
}
`

const Title = styled.h2`
display: flex;
justify-content: center;
align-items: center;
font-size: calc(1em + 1vw);
margin-bottom: 1rem; /* Added margin at the bottom */

${Main}:hover &{
    &>*{
        fill:${props => props.theme.body};
    }
}

&>*:first-child{
margin-right: 1rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: calc(0.8em + 1vw);
}
`

const Description = styled.div`
color: ${props => props.theme.text};
font-size: calc(0.55em + 0.8vw); /* Slightly reduced font size */
padding: 0.3rem 0; /* Reduced padding */


${Main}:hover &{
   
        color:${props => props.theme.body};
    
}

strong{
    margin-bottom: 0.5rem; /* Reduced margin */
    text-transform: uppercase;
}
ul,p{
    margin-left: 1.5rem; /* Reduced margin */
    margin-top: 0.5rem; /* Added top margin */
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    font-size: calc(0.6em + 0.8vw);
}
`

const MySkillsPage = () => {
    return (
        <ThemeProvider theme={lightTheme}>
<Box>

<LogoComponent theme='light'/>
<SocialIcons theme='light'/>
<PowerButton />
<ParticleComponent theme='light' />
            <Main>
<Title>
    <Design width={40} height={40} /> AI Systems Specialist
</Title>
<Description>
I specialize in building cutting-edge AI systems including multi-agent systems, LLMs, and vector databases for enterprise applications.
</Description>
<Description>
<strong>AI Systems</strong>
<ul>
    <li>
        Multi-Agent Systems
    </li>
    <li>
        Large Language Models
    </li>
    <li>
        Vector Databases
    </li>
    <li>
        Graph Neural Networks
    </li>
</ul>
</Description>
<Description>
<strong>ML/DL Frameworks</strong>
<ul>
    <li>
       PyTorch, TensorFlow, Keras
    </li>
    <li>
       OpenVino, TensorRT
    </li>
    <li>
       CUDA, Multi-GPU Computing
    </li>
</ul>
</Description>

            </Main>
            <Main>
<Title>
    <Develope width={40} height={40} /> Full-Stack AI Engineer
</Title>
<Description>
I develop scalable and optimized AI systems with comprehensive backend infrastructure and deployment expertise.
</Description>
<Description>
<strong>Programming & Backend</strong>
<p>
Python, C++, SQL, FastAPI, PostgreSQL, Redis, APIs
</p>
</Description>
<Description>
<strong>Infrastructure & Data Engineering</strong>
<p>
Docker, Kubernetes, AWS, Multi-GPU, ETL Pipelines, Qdrant, Data Processing
</p>
</Description>

            </Main>

            <BigTitle text="SKILLS" top="80%" right="30%" />

        </Box>

        </ThemeProvider>
        
    )
}

export default MySkillsPage
