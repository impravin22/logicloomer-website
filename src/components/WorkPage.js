import React, { useEffect, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { DarkTheme } from "./Themes";
import { motion } from "framer-motion";

import LogoComponent from "../subComponents/LogoComponent";
import SocialIcons from "../subComponents/SocialIcons";
import PowerButton from "../subComponents/PowerButton";

import { Work } from "../data/WorkData";
import Card from "../subComponents/Card";
import { YinYang } from "./AllSvgs";
import BigTitlte from "../subComponents/BigTitlte";

const Box = styled.div`
  background-color: ${(props) => props.theme.body};
  height: 600vh; /* Increased from 400vh to 600vh to provide more scroll space for 8 projects */
  position: relative;
  display: flex;
  align-items: center;

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    height: 400vh;
  }
`;

const Main = styled(motion.ul)`
  position: fixed;
  top: 12rem;
  left: calc(10rem + 15vw);
  height: 60vh; /* Increased from 40vh to 60vh to accommodate expanded cards */
  display: flex;
  overflow-y: auto; /* Added to allow vertical scrolling within the container */
  padding-bottom: 2rem; /* Added some padding at the bottom */
  color: white;

  /* Mobile responsiveness */
  @media (max-width: 1024px) {
    left: calc(8rem + 15vw);
  }
  
  @media (max-width: 768px) {
    left: 1rem;
    top: 10rem;
    height: 70vh;
    right: 1rem;
    width: calc(100% - 2rem);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1rem 2rem;
  }
`;
const Rotate = styled.span`
  display: block;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 80px;
  height: 80px;
  z-index: 1;
`;

// Framer-motion Configuration
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.5,
      duration: 0.5,
    },
  },
};

const WorkPage = () => {
  const ref = useRef(null);
  const yinyang = useRef(null);

  useEffect(() => {
    let element = ref.current;

    const rotate = () => {
      // Only apply horizontal scroll on desktop
      if (window.innerWidth > 768) {
        element.style.transform = `translateX(${-window.pageYOffset}px)`;
      } else {
        // For mobile, ensure the element stays in place
        element.style.transform = 'none';
      }

      // Optimize rotation speed for mobile devices
      const rotationSpeed = window.innerWidth <= 768 ? 0.5 : 1; // Slower rotation on mobile
      
      if (yinyang.current) {
        yinyang.current.style.transform = 
          "rotate(" + (-window.pageYOffset * rotationSpeed) + "deg)";
      }
    };

    // Add resize listener to handle orientation changes on mobile
    const handleResize = () => {
      if (window.innerWidth <= 768 && element) {
        // Reset transform on mobile resize/rotation
        element.style.transform = 'none';
      }
      rotate(); // Re-apply appropriate transforms
    };

    window.addEventListener("scroll", rotate);
    window.addEventListener("resize", handleResize);
    
    // Call once on mount to set initial state
    rotate();
    
    return () => {
      window.removeEventListener("scroll", rotate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ThemeProvider theme={DarkTheme}>
      <Box>
        <LogoComponent theme="dark" />
        <SocialIcons theme="dark" />
        <PowerButton />

        <Main ref={ref} variants={container} initial="hidden" animate="show">
          {Work.map((d) => (
            <Card key={d.id} data={d} />
          ))}
        </Main>
        <Rotate ref={yinyang}>
          <YinYang width={80} height={80} fill={DarkTheme.text} />
        </Rotate>

        <BigTitlte text="WORK" top="10%" right="20%" />
      </Box>
    </ThemeProvider>
  );
};

export default WorkPage;
