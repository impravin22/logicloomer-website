import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Block, Shell, Opener, Lnk } from "./_dossier";

const EASE = [0.2, 0.8, 0.2, 1];

// Small pine-on-paper system sketches, same visual language as the hero graph.
const SKETCHES = {
  rapidokr: {
    label: "Rapid-OKR data flow",
    nodes: [
      { x: 14, y: 24, w: 72, h: 32, label: "Next.js" },
      { x: 160, y: 24, w: 120, h: 32, label: "FastAPI · DDD" },
      { x: 160, y: 64, w: 120, h: 32, label: "Dagster" },
      { x: 340, y: 24, w: 68, h: 32, label: "pgvector" },
    ],
    edges: ["M86,40 L160,40", "M86,40 C120,40 120,80 160,80", "M280,40 L340,40", "M280,80 C312,80 312,40 340,40"],
  },
  sales: {
    label: "Multi-agent fan-out",
    nodes: [
      { x: 14, y: 44, w: 72, h: 32, label: "Router" },
      { x: 200, y: 8, w: 118, h: 30, label: "Product" },
      { x: 200, y: 45, w: 118, h: 30, label: "Competitor" },
      { x: 200, y: 82, w: 118, h: 30, label: "General" },
    ],
    edges: ["M86,60 C140,60 150,23 200,23", "M86,60 L200,60", "M86,60 C140,60 150,97 200,97"],
  },
  vlm: {
    label: "Vision-language pipeline with auditor loop",
    nodes: [
      { x: 14, y: 44, w: 60, h: 32, label: "Image" },
      { x: 104, y: 44, w: 74, h: 32, label: "VLM ×6" },
      { x: 208, y: 44, w: 74, h: 32, label: "Schema" },
      { x: 312, y: 44, w: 92, h: 32, label: "Auditor" },
    ],
    edges: ["M74,60 L104,60", "M178,60 L208,60", "M282,60 L312,60", "M358,44 C358,14 141,14 141,44"],
  },
};

const PROJECTS = [
  {
    id: "rapid-okr",
    title: "Rapid-OKR",
    what: "An enterprise AI platform 1,300 people rely on.",
    role: "Lead architect",
    year: "2024",
    stack: ["FastAPI", "Next.js", "pgvector", "DSPy"],
    brief: "Turn company strategy into how 1,300 people actually set goals and get evaluated, without a wall of forms.",
    decision: (
      <>
        I split the system on one rule: <b>prompts for judgment, code for determinism</b>. The LLM
        elicits and scores; a deterministic core aggregates and gates. That is why the output never
        flickers run to run.
      </>
    ),
    sketch: "rapidokr",
    outcome: "Goal-setting went from weeks of spreadsheets to one guided session, shipped to 1,300+ on AWS ECS.",
    defaultOpen: true,
  },
  {
    id: "ai-sales",
    title: "AI Sales Assistant",
    what: "A multi-agent system that gives a sales floor real answers, fast.",
    role: "Lead developer",
    year: "2023",
    stack: ["Multi-agent", "Qdrant", "FastAPI"],
    decision: "A router that picks the right specialist agent per query beat one do-everything prompt. Accuracy went up, latency came down.",
    sketch: "sales",
    outcome: "Reps stopped pinging product teams for answers the system now gives in seconds.",
  },
  {
    id: "vlm",
    title: "VLM Document Pipeline",
    what: "Six layers of vision-language with an AI-auditor loop.",
    year: "2022",
    stack: ["Gemini Vision", "Pydantic"],
    decision: "An auditor model checks every extraction against the schema before it ships, so the output stays brand-compliant without a human in the loop.",
    sketch: "vlm",
    outcome: "Manual brand review dropped from every document to the exceptions only.",
  },
  {
    id: "object-detection",
    title: "Large-Scale Object Detection",
    what: "Half a million images, organised and trained to mAP 0.82.",
    year: "2021",
    stack: ["PyTorch", "Computer vision"],
    outcome: "Built the whole loop from raw data to a deployed detector at mAP 0.82 over 500K images.",
  },
  {
    id: "distillation",
    title: "Model Distillation",
    what: "A 600M-parameter teacher squeezed into a faster student.",
    year: "2022",
    stack: ["Optimisation", "NLP"],
    outcome: (
      <>
        Same quality at <b>2× the speed</b>. The model that was too slow for production became the
        one in production.
      </>
    ),
  },
  {
    id: "blend",
    title: "Blend n Bubbles",
    what: "A bubble-tea brand I founded and built, because not everything is a model.",
    role: "Founder",
    year: "2021",
    stack: ["React"],
    outcome: "Took it from an idea to a real storefront and brand.",
    href: "https://github.com/impravin22/blendnbubbles",
  },
];

const metaLine = (p) => [p.role, p.year, ...p.stack].filter(Boolean).join(" · ");

const SketchBox = styled.div`
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: 6px;
  background: rgba(29, 110, 79, 0.02);
  padding: 12px;
  margin-top: 6px;
  max-width: 440px;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .n rect {
    fill: ${(p) => p.theme.card};
    stroke: ${(p) => p.theme.pine};
    stroke-width: 1.3;
  }
  .n text {
    font-family: ${(p) => p.theme.mono};
    font-size: 11px;
    fill: ${(p) => p.theme.ink};
  }
  .e {
    fill: none;
    stroke: ${(p) => p.theme.pine};
    stroke-width: 1.3;
    opacity: 0.5;
  }
`;

const MiniSketch = ({ spec }) => (
  <SketchBox role="img" aria-label={spec.label}>
    <svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
      {spec.edges.map((d, i) => (
        <path key={`e${i}`} className="e" d={d} />
      ))}
      {spec.nodes.map((n, i) => (
        <g className="n" key={`n${i}`}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="4" />
          <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  </SketchBox>
);

const Notes = styled.div`
  margin-top: 4px;
`;

const Row = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.hair};
`;

const Head = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  align-items: baseline;
  padding: 20px 6px;
  font-family: inherit;
  color: inherit;
  transition: padding-left 0.2s ${(p) => p.theme.ease};

  &:hover {
    padding-left: 10px;
  }

  h3 {
    grid-column: 1;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: -0.02em;
  }
  .what {
    grid-column: 1;
    color: ${(p) => p.theme.stone};
    font-size: 15px;
  }
  .mrow {
    grid-column: 1;
    font-family: ${(p) => p.theme.mono};
    font-size: 11.5px;
    color: ${(p) => p.theme.stone2};
    margin-top: 4px;
  }
  .chev {
    grid-column: 2;
    grid-row: 1;
    color: ${(p) => p.theme.pine};
    font-family: ${(p) => p.theme.mono};
    font-size: 14px;
    transition: transform 0.25s ${(p) => p.theme.ease};
    transform: rotate(${(p) => (p.$open ? "90deg" : "0deg")});
  }
`;

const Beats = styled.div`
  padding: 0 6px 16px;

  .b {
    display: block;
    font-family: ${(p) => p.theme.mono};
    font-size: 10.5px;
    color: ${(p) => p.theme.pine};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 14px 0 5px;
  }
  p {
    color: ${(p) => p.theme.stone};
    font-size: 15px;
    line-height: 1.6;
    max-width: 60ch;
  }
  p b {
    color: ${(p) => p.theme.ink};
    font-weight: 600;
  }
  p.out {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }
  .repo {
    display: inline-block;
    margin-top: 14px;
  }
`;

const ProjectRow = ({ p, open, onToggle }) => {
  const reduce = useReducedMotion();
  return (
    <Row>
      <Head
        type="button"
        $open={open}
        aria-expanded={open}
        onClick={() => onToggle(p.id)}
      >
        <h3>{p.title}</h3>
        <span className="what">{p.what}</span>
        <span className="mrow">{metaLine(p)}</span>
        <span className="chev" aria-hidden="true">›</span>
      </Head>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`note-${p.id}`}
            key="panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <Beats>
              {p.brief && (
                <>
                  <span className="b">The brief</span>
                  <p>{p.brief}</p>
                </>
              )}
              {p.decision && (
                <>
                  <span className="b">The decision that mattered</span>
                  <p>{p.decision}</p>
                </>
              )}
              {p.sketch && (
                <>
                  <span className="b">The shape</span>
                  <MiniSketch spec={SKETCHES[p.sketch]} />
                </>
              )}
              {p.outcome && (
                <>
                  <span className="b">The outcome</span>
                  <p className="out">{p.outcome}</p>
                </>
              )}
              {p.href && (
                <Lnk className="repo" href={p.href} target="_blank" rel="noreferrer noopener">
                  View repo ↗
                </Lnk>
              )}
            </Beats>
          </motion.div>
        )}
      </AnimatePresence>
    </Row>
  );
};

const Projects = () => {
  const [openId, setOpenId] = useState(
    () => (PROJECTS.find((p) => p.defaultOpen) || {}).id || null
  );
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <Block id="work" aria-labelledby="work-h">
      <Shell>
        <Opener
          index="01"
          id="work-h"
          title="Field notes"
          lede="Six systems I took from a blank repo to production. Open one."
        />
        <Notes>
          {PROJECTS.map((p) => (
            <ProjectRow key={p.id} p={p} open={openId === p.id} onToggle={toggle} />
          ))}
        </Notes>
      </Shell>
    </Block>
  );
};

export default Projects;
