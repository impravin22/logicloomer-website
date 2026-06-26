import React from "react";
import styled from "styled-components";
import { Block, Shell, Opener, Reveal } from "./_dossier";

const ROLES = [
  {
    title: "Senior AI Systems Architect",
    org: "ViewSonic · CEO Office",
    when: "Mar 2022 to now",
    body: (
      <>
        Sole architect of the enterprise AI platform above, plus the evaluation frameworks behind
        it: Doerr-style OKR criteria encoded into LLM-validated rubrics and an L1 to L5 competency
        model. Earlier, a 2× distillation, the 8-GPU training cluster, and object detection across
        500K images.
      </>
    ),
  },
  {
    title: "AI Software Developer",
    org: "Neurelli",
    when: "Aug 2020 to Mar 2022",
    body: "Shipped industrial computer vision to production: licence-plate recognition on TensorRT/CUDA, and LCD-defect detection via a variational autoencoder, at 85% accuracy in the wild.",
  },
  {
    title: "M.Sc. Electrical Engineering & Computer Science",
    org: "National Taipei University of Technology",
    when: "2018 to 2020",
    body: (
      <>
        Thesis: GPU-accelerated flood simulation with CUDA, a <b>15× speedup, published at IEEE</b>.
      </>
    ),
  },
];

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 20px;
  padding: 16px 0;
  border-bottom: 1px solid ${(p) => p.theme.hair};

  &:last-child {
    border-bottom: none;
  }

  h3 {
    font-family: ${(p) => p.theme.grot};
    font-weight: 600;
    font-size: 18px;
    letter-spacing: -0.015em;
  }
  .org {
    font-size: 15px;
    color: ${(p) => p.theme.pine};
    font-weight: 500;
  }
  .when {
    font-family: ${(p) => p.theme.mono};
    font-size: 13px;
    color: ${(p) => p.theme.stone2};
    text-align: right;
  }
  p {
    grid-column: 1 / -1;
    font-size: 15px;
    color: ${(p) => p.theme.stone};
    line-height: 1.55;
    margin-top: 6px;
    max-width: 62ch;
  }
  p b {
    color: ${(p) => p.theme.ink};
    font-weight: 600;
  }
`;

const Experience = () => (
  <Block id="experience" aria-labelledby="exp-h">
    <Shell>
      <Opener index="03" id="exp-h" title="Where I've been" />
      <Reveal>
        <List>
          {ROLES.map((r) => (
            <Row key={r.title}>
              <h3>{r.title}</h3>
              <span className="when">{r.when}</span>
              <span className="org">{r.org}</span>
              <p>{r.body}</p>
            </Row>
          ))}
        </List>
      </Reveal>
    </Shell>
  </Block>
);

export default Experience;
