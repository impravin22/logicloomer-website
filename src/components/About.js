import React from "react";
import styled from "styled-components";
import { Block, Shell, Grid, Opener, role } from "./_dossier";

// The heading sits beside its rows and stays in view while they scroll past.
const Cols = styled(Grid)`
  > .head,
  > .rows {
    grid-column: 1 / -1;
  }

  @media (min-width: ${(p) => p.theme.bp.stage}) {
    > .head {
      grid-column: 1 / span 4;
      align-self: start;
      position: sticky;
      top: calc(${(p) => p.theme.layout.nav} + ${(p) => p.theme.space.xl});
    }
    > .rows {
      grid-column: 5 / span 8;
    }
  }
`;

const List = styled.dl`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${(p) => p.theme.space.xs} ${(p) => p.theme.layout.gap};
  padding-block: ${(p) => p.theme.space.lg};
  border-top: 1px solid ${(p) => p.theme.hair};

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  dt {
    font-family: ${(p) => p.theme.grot};
    ${role("title")}
  }

  dd {
    color: ${(p) => p.theme.stone};
    max-width: 62ch;
  }

  dd b {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 5fr);
    align-items: baseline;
  }
`;

const DOMAINS = [
  {
    term: "Forward deployment",
    body: (
      <>
        Sit with the team, find the bottleneck in the data, ship the fix, then make it stick.{" "}
        <b>Claude, Claude Code, MCP</b>, agents wired into CI, and a human sign-off wherever
        production is at stake.
      </>
    ),
  },
  {
    term: "AI architecture",
    body: (
      <>
        AI-native workflows from a blank repo to an org-wide platform:{" "}
        <b>elicitation, scoring, deterministic aggregation, then narrative</b>. Agent
        orchestration, RAG, domain-driven design.
      </>
    ),
  },
  {
    term: "LLM engineering",
    body: (
      <>
        DSPy signatures with behavioural anchors so scores stop flickering. <b>LangGraph</b>,
        structured output, LLM-as-judge evaluation, distillation.
      </>
    ),
  },
  {
    term: "Vision & ML",
    body: (
      <>
        Vision-language document pipelines, large-scale object detection, graph neural nets, LCD
        defect detection, and smart-manufacturing models deployed in the plant.{" "}
        <b>Gemini Vision, PyTorch</b>.
      </>
    ),
  },
  {
    term: "Optimisation & infra",
    body: (
      <>
        Quantisation, distillation, and an 8-GPU Kubernetes cluster for distributed training.{" "}
        <b>TensorRT, CUDA, OpenVINO</b>.
      </>
    ),
  },
  {
    term: "Security & safety",
    body: "I treat internal AI like an external product: full OWASP LLM Top 10, AST validation, ethics gating.",
  },
];

const About = () => (
  <Block id="about" aria-labelledby="about-h" $gap="l">
    <Shell>
      <Cols>
        <div className="head">
          <Opener id="about-h" title="What I do" lede="The layers I actually own." />
        </div>
        <List className="rows">
          {DOMAINS.map((d) => (
            <Row key={d.term}>
              <dt>{d.term}</dt>
              <dd>{d.body}</dd>
            </Row>
          ))}
        </List>
      </Cols>
    </Shell>
  </Block>
);

export default About;
