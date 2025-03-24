import { motion } from "framer-motion";
import React from "react";
// import { NavLink } from 'react-router-dom'
import styled from "styled-components";
import { GitLab, LinkedIn, Instagram, Github } from "../components/AllSvgs";
import { DarkTheme } from "../components/Themes";

const Icons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  bottom: 0;
  left: 2rem;

  z-index: 3;

  & > *:not(:last-child) {
    margin: 0.5rem 0;
  }
  
  /* Improved mobile responsiveness */
  @media (max-width: 768px) {
    left: 0.8rem; /* Slightly closer to the edge */
    bottom: 0.5rem; /* Slightly higher from bottom */
    z-index: 10; /* Higher z-index to stay above other elements */
    
    & > *:not(:last-child) {
      margin: 0.3rem 0;
    }
  }
`;

const Line = styled(motion.span)`
  width: 2px;
  height: 8rem;
  background-color: ${(props) =>
    props.color === "dark" ? DarkTheme.text : DarkTheme.body};
    
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    height: 3rem; /* Shorter line on mobile */
  }
`;

const SocialIcons = (props) => {
  // Default to 'light' theme if no theme prop is provided
  const theme = props.theme || 'light';
  
  return (
    <Icons>
      <motion.div
        initial={{scale:0 }}
        animate={{ scale: [0, 1, 1.5, 1] }}
        transition={{ type: "spring", duration: 1, delay: 1 }}
      >
        <a
          style={{ color: "inherit" }}
          target="_blank"
          rel="noreferrer"
          href={"https://github.com/impravin22"}
        >
          <Github
            width={25}
            height={25}
            fill={theme === "dark" ? DarkTheme.text : DarkTheme.body}
          />
        </a>
      </motion.div>
      <motion.div
        initial={{scale:0 }}
        animate={{ scale: [0, 1, 1.5, 1] }}
        transition={{ type: "spring", duration: 1, delay: 1.2 }}
      >
        <a
          style={{ color: "inherit" }}
          target="_blank"
          rel="noreferrer"
          href={"https://gitlab.com/impravin22"}
        >
          <GitLab
            width={25}
            height={25}
            fill={theme === "dark" ? DarkTheme.text : DarkTheme.body}
          />
        </a>
      </motion.div>
      <motion.div
        initial={{scale:0 }}
        animate={{ scale: [0, 1, 1.5, 1] }}
        transition={{ type: "spring", duration: 1, delay: 1.4 }}
      >
        <a
          style={{ color: "inherit" }}
          target="_blank"
          rel="noreferrer"
          href={"https://www.linkedin.com/in/praveen-chittem-b78b4a160/"}
        >
          <LinkedIn
            width={25}
            height={25}
            fill={theme === "dark" ? DarkTheme.text : DarkTheme.body}
          />
        </a>
      </motion.div>
      <motion.div
        initial={{scale:0 }}
        animate={{ scale: [0, 1, 1.5, 1] }}
        transition={{ type: "spring", duration: 1, delay: 1.6 }}
      >
        <a
          style={{ color: "inherit" }}
          target="_blank"
          rel="noreferrer"
          href={"https://www.instagram.com/arctic_monk_/"}
        >
          <Instagram
            width={25}
            height={25}
            fill={theme === "dark" ? DarkTheme.text : DarkTheme.body}
          />
        </a>
      </motion.div>

      <Line
        color={theme}
        initial={{
          height: 0,
        }}
        animate={{
          height: "8rem",
        }}
        transition={{
          type: "spring",
          duration: 1,
          delay: 0.8,
        }}
      />
    </Icons>
  );
};

export default SocialIcons;
