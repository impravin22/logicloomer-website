import React, { useState } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.2, 0.8, 0.2, 1];

// Hand-placed coordinates in a fixed viewBox. No layout engine, no maths libs.
const NODES = [
  { id: "planner", label: "Planner", x: 20, y: 115, w: 96, h: 38, role: "The Planner decomposes the request into a typed plan." },
  { id: "retriever", label: "Retriever", x: 250, y: 33, w: 118, h: 38, role: "Retriever: RAG over pgvector, grounded and cited." },
  { id: "codeexec", label: "Code-exec", x: 250, y: 115, w: 118, h: 38, role: "Code-exec runs the deterministic, sandboxed steps." },
  { id: "validator", label: "Validator", x: 250, y: 197, w: 118, h: 38, role: "Validator: schema, policy and OWASP-LLM gate." },
  { id: "synth", label: "Synthesiser", x: 452, y: 115, w: 120, h: 38, role: "Synthesiser turns the scored parts into one narrative." },
  { id: "answer", label: "Answer", x: 600, y: 115, w: 62, h: 38, role: "A deterministic, audited Answer, every time.", answer: true },
];

const EDGES = [
  "M116,134 C170,134 196,52 250,52",
  "M116,134 L250,134",
  "M116,134 C170,134 196,216 250,216",
  "M368,52 C420,52 400,134 452,134",
  "M368,134 L452,134",
  "M368,216 C420,216 400,134 452,134",
  "M572,134 L600,134",
];

const TOKEN_X = [0, 241, 444, 563]; // offsets from the Planner centre, along the spine (y is constant)
const DEFAULT_CAP = "Hover a node. It is the same pattern behind Rapid-OKR: judgment in the model, determinism in the code.";

const Figure = styled.figure`
  margin: 32px 0 8px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;

  .t {
    font-family: ${(p) => p.theme.mono};
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${(p) => p.theme.stone2};
  }
`;

const Replay = styled.button`
  font-family: ${(p) => p.theme.mono};
  font-size: 12px;
  color: ${(p) => p.theme.pine};
  background: ${(p) => p.theme.paper};
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: ${(p) => p.theme.radius};
  padding: 6px 12px;
  cursor: pointer;
  transition: border-color 0.15s ${(p) => p.theme.ease};

  &:hover {
    border-color: ${(p) => p.theme.pine};
  }
  &:active {
    transform: scale(0.96);
  }
`;

const Wrap = styled.div`
  border: 1px solid ${(p) => p.theme.hair};
  border-radius: 8px;
  background: linear-gradient(0deg, rgba(29, 110, 79, 0.025), transparent);
  padding: 6px;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .edge {
    fill: none;
    stroke: ${(p) => p.theme.pine};
    stroke-width: 1.4;
  }
  .node rect {
    fill: ${(p) => p.theme.card};
    stroke: ${(p) => p.theme.pine};
    stroke-width: 1.4;
  }
  .node.answer rect {
    fill: ${(p) => p.theme.pine};
  }
  .node text {
    font-family: ${(p) => p.theme.mono};
    font-size: 12.5px;
    font-weight: 500;
    fill: ${(p) => p.theme.ink};
  }
  .node.answer text {
    fill: ${(p) => p.theme.paper};
  }
  .node {
    cursor: default;
  }
  .node:hover rect {
    stroke: ${(p) => p.theme.pineDeep};
    stroke-width: 2;
  }
  .token {
    fill: ${(p) => p.theme.pine};
  }
`;

const Cap = styled.figcaption`
  font-family: ${(p) => p.theme.mono};
  font-size: 12px;
  color: ${(p) => p.theme.stone2};
  margin-top: 8px;
  min-height: 34px;
  line-height: 1.5;

  b {
    color: ${(p) => p.theme.ink};
    font-weight: 500;
  }
`;

// Visually hidden but available to assistive tech (component-scoped so it does
// not depend on a global utility class winning the cascade).
const SrList = styled.ul`
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

const SystemGraph = () => {
  const reduce = useReducedMotion();
  const [rk, setRk] = useState(0);
  const [cap, setCap] = useState(DEFAULT_CAP);

  return (
    <>
    <Figure
      role="img"
      aria-label="Agent orchestration: a planner fans out to retriever, code-exec and validator workers, which converge on a synthesiser, then a deterministic answer."
    >
      <Top>
        <span className="t">How a request actually moves</span>
        {!reduce && (
          <Replay type="button" onClick={() => setRk((k) => k + 1)}>
            ▸ Replay
          </Replay>
        )}
      </Top>

      <Wrap>
        <svg viewBox="0 0 680 268" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g key={rk}>
            {EDGES.map((d, i) => (
              <motion.path
                key={`e${i}`}
                className="edge"
                d={d}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.5 + i * 0.12, ease: EASE }}
              />
            ))}
            {NODES.map((n, i) => (
              <motion.g
                key={n.id}
                className={n.answer ? "node answer" : "node"}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.45, delay: i * 0.08, ease: EASE }}
                onMouseEnter={() => setCap(n.role)}
                onMouseLeave={() => setCap(DEFAULT_CAP)}
              >
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="5" />
                <text x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle">
                  {n.label}
                </text>
              </motion.g>
            ))}
            {!reduce && (
              <motion.circle
                key="token"
                className="token"
                cx={68}
                cy={134}
                r={5}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: TOKEN_X, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.4, delay: 1.0, times: [0, 0.4, 0.8, 1], ease: EASE }}
              />
            )}
          </g>
        </svg>
      </Wrap>

      <Cap aria-live="polite">{cap}</Cap>
    </Figure>
      <SrList aria-label="Pipeline stages">
        {NODES.map((n) => (
          <li key={n.id}>{n.role}</li>
        ))}
      </SrList>
    </>
  );
};

export default SystemGraph;
