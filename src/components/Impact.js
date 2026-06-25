import React from "react";
import styled from "styled-components";
import { Wrap, Idx, Reveal } from "./_dossier";

const METRICS = [
  { value: "1,300+", caption: "Platform users · sole architect" },
  { value: "2×", caption: "Faster distilled model @ parity" },
  { value: "15×", caption: "HPC speedup · published IEEE" },
  { value: "8-GPU", caption: "Distributed training cluster" },
];

const Band = styled.section`
  position: relative;
  overflow: hidden;
  background: ${(props) => props.theme.ink2};
  border-top: 1px solid ${(props) => props.theme.rule};
  border-bottom: 1px solid ${(props) => props.theme.rule};

  /* Faint blueprint grid, radially faded so it dissolves at the edges. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.45;
    background-image: linear-gradient(
        ${(props) => props.theme.rule} 1px,
        transparent 1px
      ),
      linear-gradient(90deg, ${(props) => props.theme.rule} 1px, transparent 1px);
    background-size: 46px 46px;
    -webkit-mask-image: radial-gradient(circle at 50% 50%, #000, transparent 76%);
    mask-image: radial-gradient(circle at 50% 50%, #000, transparent 76%);
  }
`;

const BandInner = styled(Wrap)`
  padding-top: 64px;
  padding-bottom: 64px;
`;

const Metrics = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
    gap: 34px 20px;
  }
`;

const Metric = styled.div`
  border-left: 1px solid ${(props) => props.theme.rule2};
  padding-left: 20px;

  b {
    display: block;
    font-weight: 600;
    font-size: clamp(38px, 6vw, 62px);
    line-height: 1;
    letter-spacing: -0.03em;
    color: ${(props) => props.theme.text};
  }

  span {
    display: block;
    margin-top: 12px;
    font-family: ${(props) => props.theme.fontMono};
    font-size: 12px;
    letter-spacing: 0.04em;
    color: ${(props) => props.theme.text3};
  }
`;

const Impact = () => (
  <Band id="impact" aria-labelledby="impact-idx">
    <BandInner>
      <Idx id="impact-idx">05 — Impact</Idx>
      <Metrics>
        {METRICS.map((metric, i) => (
          <Reveal key={metric.value} delay={i * 0.08}>
            <Metric>
              <b>{metric.value}</b>
              <span>{metric.caption}</span>
            </Metric>
          </Reveal>
        ))}
      </Metrics>
    </BandInner>
  </Band>
);

export default Impact;
