// Shared "Systems Dossier" primitives — reused across every section so the
// scaffolding (container, section rhythm, mono index labels, scroll reveal)
// stays consistent.
import React from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

export const Wrap = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 36px;

  @media (max-width: 600px) {
    padding: 0 22px;
  }
`;

export const Section = styled.section`
  position: relative;
  padding: 118px 0;
  border-top: 1px solid ${(props) => props.theme.rule};

  @media (max-width: 768px) {
    padding: 84px 0;
  }
`;

export const Idx = styled.div`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.gold};
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 34px;

  &::before {
    content: "";
    width: 26px;
    height: 1px;
    background: ${(props) => props.theme.gold};
  }
`;

export const SectionTitle = styled.h2`
  font-weight: 600;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: ${(props) => props.theme.text};
`;

export const Lead = styled.p`
  color: ${(props) => props.theme.text2};
  font-size: clamp(16px, 1.6vw, 18px);
  max-width: 60ch;
  font-weight: 400;
`;

// Rail (mono index) + body, the editorial two-column used by Profile / Experience / Contact.
export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 48px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const REVEAL_EASE = [0.16, 1, 0.3, 1];

// Scroll-triggered fade + rise. Honours prefers-reduced-motion (renders static).
export const Reveal = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: REVEAL_EASE, delay }}
    >
      {children}
    </motion.div>
  );
};
