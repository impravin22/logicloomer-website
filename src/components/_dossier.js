// Shared "Instrument Lab" primitives: a narrow content column, calm section
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

// Oversized section opener with a mono index hung in the left gutter (depth move).
const OpenerGrid = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 18px;
  align-items: baseline;
  margin-bottom: 26px;

  .ix {
    font-family: ${(p) => p.theme.mono};
    font-size: 12px;
    color: ${(p) => p.theme.stone2};
    padding-top: 14px;
  }
  h2 {
    font-weight: 700;
    font-size: clamp(30px, 4.6vw, 46px);
    letter-spacing: -0.03em;
    line-height: 1.04;
  }
  .lede {
    grid-column: 2;
    color: ${(p) => p.theme.stone};
    font-size: 16px;
    margin-top: 6px;
    max-width: 54ch;
  }

  @media (max-width: 560px) {
    grid-template-columns: 40px 1fr;
    gap: 12px;
  }
`;

export const Opener = ({ index, title, lede, id }) => (
  <OpenerGrid>
    <span className="ix">{index}</span>
    <h2 id={id}>{title}</h2>
    {lede ? <p className="lede">{lede}</p> : null}
  </OpenerGrid>
);

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
