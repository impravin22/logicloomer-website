import React from "react";
import styled from "styled-components";
import { Wrap, Section, Idx, Reveal } from "./_dossier";

const SrOnly = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
`;

const TileReveal = styled(Reveal)`
  grid-column: span ${(props) => props.$span};

  @media (max-width: 880px) {
    grid-column: span ${(props) => (props.$span === 2 ? 3 : 6)};
  }

  @media (max-width: 560px) {
    grid-column: span 6;
  }
`;

const Tile = styled.article`
  height: 100%;
  border: 1px solid ${(props) => props.theme.rule};
  background: ${(props) => props.theme.ink2};
  padding: 28px;
  border-radius: 10px;
  transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.rule2};
    transform: translateY(-3px);
    background: ${(props) => props.theme.ink3};
  }
`;

const TileCode = styled.div`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 11px;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.gold};
`;

const TileTitle = styled.h3`
  font-weight: 600;
  font-size: 21px;
  margin: 12px 0;
  letter-spacing: -0.018em;
  color: ${(props) => props.theme.text};
`;

const TileBody = styled.p`
  font-size: 14.5px;
  line-height: 1.62;
  color: ${(props) => props.theme.text2};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 18px;
`;

const Tag = styled.span`
  font-family: ${(props) => props.theme.fontMono};
  font-size: 11px;
  color: ${(props) => props.theme.text3};
  border: 1px solid ${(props) => props.theme.rule};
  padding: 4px 9px;
  border-radius: 5px;
`;

const tiles = [
  {
    code: "A.01",
    title: "AI Architecture",
    body: "AI-native workflows from blank repo to org-wide platform. Conversational elicitation → structured scoring → deterministic aggregation → narrative generation.",
    tags: ["agent orchestration", "multi-agent", "RAG", "domain-driven design"],
    span: 3,
  },
  {
    code: "A.02",
    title: "LLM Engineering",
    body: "DSPy signatures with behavioural anchors and hysteresis to kill score flicker. LLM-as-judge evaluation and distillation.",
    tags: ["LangGraph", "DSPy", "structured output", "prompt design"],
    span: 3,
  },
  {
    code: "A.03",
    title: "Vision & ML",
    body: "VLM document pipelines, object detection, GNNs.",
    tags: ["Gemini Vision", "PyTorch", "GNN · VAE"],
    span: 2,
  },
  {
    code: "A.04",
    title: "Optimisation & Infra",
    body: "Quantisation, distillation, 8-GPU Kubernetes.",
    tags: ["TensorRT", "CUDA", "OpenVINO"],
    span: 2,
  },
  {
    code: "A.05",
    title: "Security & Safety",
    body: "Internal AI treated as an external-facing product.",
    tags: ["OWASP LLM Top 10", "SAST/AST", "WCAG 2.1 AA"],
    span: 2,
  },
];

const Skills = () => (
  <Section id="expertise" aria-labelledby="expertise-title">
    <Wrap>
      <Idx>02 — Core Expertise</Idx>
      <SrOnly id="expertise-title">Core Expertise</SrOnly>
      <Bento>
        {tiles.map((tile, index) => (
          <TileReveal key={tile.code} $span={tile.span} delay={index * 0.08}>
            <Tile>
              <TileCode>{tile.code}</TileCode>
              <TileTitle>{tile.title}</TileTitle>
              <TileBody>{tile.body}</TileBody>
              <Tags>
                {tile.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
            </Tile>
          </TileReveal>
        ))}
      </Bento>
    </Wrap>
  </Section>
);

export default Skills;
