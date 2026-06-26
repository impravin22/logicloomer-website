// Shared "Instrument Lab" primitives — a narrow content column, calm section
// rhythm, mono eyebrows, a pine underline-grow link, and a reduced-motion-safe reveal.
import React from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

export const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 28px;

  @media (max-width: 560px) {
    padding: 0 22px;
  }
`;

export const Block = styled.section`
  position: relative;
  padding: 56px 0;
  border-top: 1px solid ${(p) => p.theme.hair};
`;

export const Eyebrow = styled.p`
  font-family: ${(p) => p.theme.mono};
  font-size: 12.5px;
  letter-spacing: 0.01em;
  color: ${(p) => p.theme.stone2};
  margin-bottom: 30px;

  b {
    color: ${(p) => p.theme.pine};
    font-weight: 500;
  }
`;

// pine link with an underline that grows on hover + a tactile feel
export const Lnk = styled.a`
  color: ${(p) => p.theme.pine};
  text-decoration: none;
  font-weight: 500;
  background-image: linear-gradient(${(p) => p.theme.pine}, ${(p) => p.theme.pine});
  background-size: 100% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  padding-bottom: 1px;
  transition: background-size 0.25s ${(p) => p.theme.ease}, color 0.2s ${(p) => p.theme.ease};

  &:hover {
    color: ${(p) => p.theme.pineDeep};
    background-size: 100% 2px;
  }
`;

const REVEAL_EASE = [0.2, 0.8, 0.2, 1];

// Scroll-triggered fade + rise. Honours prefers-reduced-motion (renders static).
export const Reveal = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: REVEAL_EASE, delay }}
    >
      {children}
    </motion.div>
  );
};
