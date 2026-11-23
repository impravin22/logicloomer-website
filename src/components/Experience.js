import React from "react";
import styled from "styled-components";
import { Block, Shell, Opener, role } from "./_dossier";

// Newest first.
const ROLES = [
  {
    title: "Forward Deployment Pod Lead",
    org: "ViewSonic, CEO Office",
    when: "Jul 2026 to now",
    body: (
      <>
        I lead the forward-deployed AI pod. We sit with marketing, supply chain, legal and the
        business units, find where the work actually stalls, and ship the fix into their day. The{" "}
        <b>auto issue solver, the one-login MCP gateway and the workflow-health read</b> in Field
        notes all come out of this pod.
      </>
    ),
  },
  {
    title: "Senior AI Systems Architect",
    org: "ViewSonic, CEO Office",
    when: "Mar 2022 to Jun 2026",
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
    body: "Smart manufacturing, from factory data to the production line. Boosted-tree models that help large manufacturers hold precision on their parts, deployed on the client's site; LCD-defect detection with a variational autoencoder, 85% accurate in production; licence-plate recognition at line speed on TensorRT and CUDA. Models trained on a Docker, Kubernetes and Kubeflow cluster.",
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

// Four roles, two by two, newest first, parted by space alone.
const List = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: ${(p) => p.theme.layout.gap};
  row-gap: ${(p) => p.theme.space.xl};

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: ${(p) => p.theme.space["2xl"]};
  }
`;

const Row = styled.div`

  h3 {
    ${role("title")}
  }
  .facts {
    ${role("small")}
    margin-top: ${(p) => p.theme.space.xs};
    display: flex;
    flex-wrap: wrap;
    gap: ${(p) => p.theme.space["2xs"]} ${(p) => p.theme.space.md};
  }
  .org {
    color: ${(p) => p.theme.pine};
    font-weight: 500;
  }
  .when {
    color: ${(p) => p.theme.stone2};
  }
  p:not(.facts) {
    color: ${(p) => p.theme.stone};
    margin-top: ${(p) => p.theme.space.sm};
    max-width: 62ch;
  }
  p b {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }
`;

const Experience = () => (
  <Block id="experience" aria-labelledby="exp-h" $gap="l">
    <Shell>
      <Opener id="exp-h" title="Where I've been" />
      <List>
        {ROLES.map((r) => (
          <Row key={r.title}>
            <h3>{r.title}</h3>
            <p className="facts">
              <span className="org">{r.org}</span>
              <span className="when">{r.when}</span>
            </p>
            <p>{r.body}</p>
          </Row>
        ))}
      </List>
    </Shell>
  </Block>
);

export default Experience;
