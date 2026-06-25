import React from "react";
import styled from "styled-components";
import { Wrap, Section, Idx, TwoCol, Reveal } from "./_dossier";

const Ledger = styled.div`
  border-left: 1px solid ${(props) => props.theme.rule};
  margin-left: 8px;
  padding-left: 36px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const Job = styled.div`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -42px;
    top: 7px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) => props.theme.ink};
    border: 2px solid ${(props) => props.theme.gold};
  }
`;

const JobTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
`;

const JobTitle = styled.h3`
  font-weight: 600;
  font-size: 23px;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.text};
`;

const Org = styled.div`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 12.5px;
  color: ${(props) => props.theme.gold};
  letter-spacing: 0.03em;
  font-weight: 500;
`;

const When = styled.div`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 12px;
  color: ${(props) => props.theme.text3};
  letter-spacing: 0.05em;
`;

const Points = styled.ul`
  list-style: none;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Point = styled.li`
  position: relative;
  padding-left: 22px;
  color: ${(props) => props.theme.text2};
  font-size: 15px;
  line-height: 1.62;
  max-width: 74ch;
  font-weight: 400;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 9px;
    width: 7px;
    height: 1px;
    background: ${(props) => props.theme.gold};
  }

  b {
    color: ${(props) => props.theme.text};
    font-weight: 600;
  }
`;

const ledger = [
  {
    title: "Senior AI Systems Architect",
    org: "ViewSonic · CEO Office — Taipei",
    when: "MAR 2022 — PRESENT",
    points: [
      <>
        <b>Sole architect</b> of an enterprise AI platform, blank repo to 1,300+
        users — converts company strategy into AI-native workflows for
        goal-setting, evaluation and workforce AI-maturity.
      </>,
      <>
        <b>Security &amp; AI-safety lead.</b> OWASP middleware, rate limiting,
        CSP/HSTS, SQL-injection AST validation, ethics-policy versioning; full
        OWASP LLM Top 10 compliance.
      </>,
      <>
        <b>Evaluation frameworks.</b> Encoded Doerr-style OKR criteria into
        LLM-validated rubrics and an L1–L5 competency model — moving delivery
        from "feature shipped" to measured quality.
      </>,
      <>
        <b>Earlier impact.</b> Six-layer VLM pipeline; distilled a 600M teacher
        to a 2× faster student at parity; 8-GPU Kubernetes for distributed
        PyTorch; object detection at mAP 0.82 over 500K images.
      </>,
    ],
  },
  {
    title: "AI Software Developer",
    org: "Neurelli — Taipei",
    when: "AUG 2020 — MAR 2022",
    points: [
      <>
        Shipped industrial computer vision to production: licence-plate
        recognition accelerated with TensorRT/CUDA and LCD-defect detection via
        a variational autoencoder — full cycle at 85% production accuracy.
      </>,
    ],
  },
  {
    title: "M.Sc. Electrical Engineering & Computer Science",
    org: "National Taipei University of Technology",
    when: "2018 — 2020",
    points: [
      <>
        Thesis: GPU acceleration of flood simulation with HPC and CUDA —{" "}
        <b>15× speedup, published at IEEE</b>.
      </>,
    ],
  },
];

const Experience = () => (
  <Section id="experience" aria-labelledby="experience-heading">
    <Wrap>
      <TwoCol>
        <Idx as="h2" id="experience-heading">
          04 — Experience
        </Idx>
        <Reveal>
          <Ledger>
            {ledger.map((job) => (
              <Job key={job.title}>
                <JobTop>
                  <div>
                    <JobTitle>{job.title}</JobTitle>
                    <Org>{job.org}</Org>
                  </div>
                  <When>{job.when}</When>
                </JobTop>
                <Points>
                  {job.points.map((point, i) => (
                    <Point key={i}>{point}</Point>
                  ))}
                </Points>
              </Job>
            ))}
          </Ledger>
        </Reveal>
      </TwoCol>
    </Wrap>
  </Section>
);

export default Experience;
