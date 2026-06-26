import React from "react";
import styled from "styled-components";
import { Block, Shell, Opener, Reveal } from "./_dossier";

const List = styled.dl`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 22px;
  padding: 18px 0;
  border-bottom: 1px solid ${(p) => p.theme.hair};

  &:last-child {
    border-bottom: none;
  }

  dt {
    font-family: ${(p) => p.theme.grot};
    font-weight: 600;
    font-size: 17px;
    letter-spacing: -0.01em;
    margin: 0;
  }

  dd {
    margin: 0;
    font-size: 15.5px;
    color: ${(p) => p.theme.stone};
    line-height: 1.55;
  }

  dd b {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const DOMAINS = [
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
        Vision-language document pipelines, large-scale object detection, graph neural nets.{" "}
        <b>Gemini Vision · PyTorch</b>.
      </>
    ),
  },
  {
    term: "Optimisation & infra",
    body: (
      <>
        Quantisation, distillation, and an 8-GPU Kubernetes cluster for distributed training.{" "}
        <b>TensorRT · CUDA · OpenVINO</b>.
      </>
    ),
  },
  {
    term: "Security & safety",
    body: "I treat internal AI like an external product: full OWASP LLM Top 10, AST validation, ethics gating.",
  },
];

const About = () => (
  <Block id="about" aria-labelledby="about-h">
    <Shell>
      <Opener index="02" id="about-h" title="What I do" lede="The layers I actually own." />
      <Reveal>
        <List>
          {DOMAINS.map((d) => (
            <Row key={d.term}>
              <dt>{d.term}</dt>
              <dd>{d.body}</dd>
            </Row>
          ))}
        </List>
      </Reveal>
    </Shell>
  </Block>
);

export default About;
