import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";
import { role } from "./_dossier";

// A driveable agent-orchestration sandbox. Pick a request, watch it route
// through the router to a specialist and a tool and back, with a streamed
// trace of the router's decision. Deterministic and scripted, no backend.

const N = {
  request: { x: 16, y: 131, w: 90, h: 38, label: "Request" },
  router: { x: 150, y: 131, w: 84, h: 38, label: "Router" },
  retriever: { x: 290, y: 40, w: 120, h: 38, label: "Retriever" },
  coder: { x: 290, y: 131, w: 120, h: 38, label: "Code-exec" },
  analyst: { x: 290, y: 222, w: 120, h: 38, label: "Analyst" },
  validator: { x: 452, y: 131, w: 110, h: 38, label: "Validator" },
  answer: { x: 592, y: 131, w: 72, h: 38, label: "Answer", answer: true },
};
const NODE_IDS = Object.keys(N);
const cx = (id) => N[id].x + N[id].w / 2;
const cy = (id) => N[id].y + N[id].h / 2;

const EDGES = [
  { id: "req-router", a: "request", b: "router", d: "M106,150 L150,150" },
  { id: "router-retriever", a: "router", b: "retriever", d: "M234,150 C266,150 258,59 290,59" },
  { id: "router-coder", a: "router", b: "coder", d: "M234,150 L290,150" },
  { id: "router-analyst", a: "router", b: "analyst", d: "M234,150 C266,150 258,241 290,241" },
  { id: "retriever-validator", a: "retriever", b: "validator", d: "M410,59 C446,59 430,150 452,150" },
  { id: "coder-validator", a: "coder", b: "validator", d: "M410,150 L452,150" },
  { id: "analyst-validator", a: "analyst", b: "validator", d: "M410,241 C446,241 430,150 452,150" },
  { id: "val-answer", a: "validator", b: "answer", d: "M562,150 L592,150" },
];

const INTENTS = {
  summarise: {
    label: "Summarise a PDF",
    specialist: "retriever",
    trace: ["intent classified: retrieval", "route: retriever, RAG over pgvector", "validator: schema and policy pass", "answer: grounded and cited"],
    keys: ["summar", "pdf", "doc", "read", "explain"],
  },
  debug: {
    label: "Debug a stack trace",
    specialist: "coder",
    trace: ["intent classified: code", "route: code-exec, sandboxed run", "validator: schema and policy pass", "answer: verified output"],
    keys: ["debug", "error", "trace", "stack", "fix", "bug"],
  },
  revenue: {
    label: "What is our Q3 revenue?",
    specialist: "analyst",
    trace: ["intent classified: analytics", "route: analyst, parameterised SQL", "validator: schema and policy pass", "answer: exact figures"],
    keys: ["revenue", "sql", "data", "report", "metric", "how many", "count"],
  },
  book: {
    label: "Book a flight",
    specialist: "coder",
    trace: ["intent classified: action", "route: tool-caller, typed call", "validator: confirm and policy pass", "answer: action receipt"],
    keys: ["book", "flight", "order", "send", "schedule", "action"],
  },
};

const matchIntent = (text) => {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(INTENTS)) {
    if (v.keys.some((kw) => t.includes(kw))) return k;
  }
  return "summarise";
};

const buildRun = (intentKey, failure) => {
  const spec = INTENTS[intentKey].specialist;
  const fallback = spec === "retriever" ? "coder" : "retriever";
  const seq = failure
    ? ["request", "router", spec, "router", fallback, "validator", "answer"]
    : ["request", "router", spec, "validator", "answer"];
  const base = INTENTS[intentKey].trace;
  const trace = failure
    ? [base[0], base[1], `${N[spec].label.toLowerCase()}: timeout injected`, `retry x1, fallback to ${N[fallback].label.toLowerCase()}`, base[2], base[3] + ", flagged degraded"]
    : base;
  const activeEdges = new Set();
  for (let i = 0; i < seq.length - 1; i += 1) {
    const a = seq[i];
    const b = seq[i + 1];
    const e = EDGES.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (e) activeEdges.add(e.id);
  }
  const activeNodes = new Set(seq);
  return { seq, trace, activeEdges, activeNodes };
};

const Fig = styled.figure`
  margin: 0;
`;

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.space.sm};
  margin-bottom: ${(p) => p.theme.space.sm};
  flex-wrap: wrap;

  .t {
    font-size: ${(p) => p.theme.type.small.size};
    line-height: ${(p) => p.theme.type.small.line};
    font-weight: 500;
    color: ${(p) => p.theme.stone};
  }
`;

const Toggle = styled.button`
  font-family: ${(p) => p.theme.mono};
  font-size: ${(p) => p.theme.type.code.size};
  color: ${(p) => (p.$on ? p.theme.paper : p.theme.stone)};
  background: ${(p) => (p.$on ? p.theme.pine : p.theme.paper)};
  border: 1px solid ${(p) => (p.$on ? p.theme.pine : p.theme.hair)};
  border-radius: ${(p) => p.theme.radius};
  position: relative;
  min-height: ${(p) => p.theme.layout.controlPlate};
  padding: 0 ${(p) => p.theme.space.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease}, background-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease},
    border-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};

  /* the hit area runs a little past the control's edge, so a near miss lands */
  &::after {
    content: "";
    position: absolute;
    inset: -${(p) => p.theme.space["2xs"]} 0;
  }
  &:active {
    transform: translateY(1px);
  }

  &:hover {
    border-color: ${(p) => p.theme.pine};
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.space.xs};
  margin-bottom: ${(p) => p.theme.space.sm};
`;

const Chip = styled.button`
  font-family: ${(p) => p.theme.mono};
  font-size: ${(p) => p.theme.type.code.size};
  color: ${(p) => (p.$active ? p.theme.paper : p.theme.ink)};
  background: ${(p) => (p.$active ? p.theme.pine : p.theme.card)};
  border: 1px solid ${(p) => (p.$active ? p.theme.pine : p.theme.hair)};
  border-radius: ${(p) => p.theme.radius};
  position: relative;
  min-height: ${(p) => p.theme.layout.controlPlate};
  padding: 0 ${(p) => p.theme.space.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease}, background-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease},
    border-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};

  &::after {
    content: "";
    position: absolute;
    inset: -${(p) => p.theme.space["2xs"]} 0;
  }
  &:active {
    transform: translateY(1px);
  }

  &:hover {
    border-color: ${(p) => p.theme.pine};
  }
`;

const Form = styled.form`
  display: flex;
  gap: ${(p) => p.theme.space.xs};
  margin-bottom: ${(p) => p.theme.space.md};

  input {
    flex: 1;
    min-width: 0;
    font-family: ${(p) => p.theme.body};
    font-size: 1rem;
    color: ${(p) => p.theme.ink};
    background: ${(p) => p.theme.paper};
    border: 1px solid ${(p) => p.theme.hair};
    border-radius: ${(p) => p.theme.radius};
    min-height: ${(p) => p.theme.layout.controlPlate};
    padding: 0 ${(p) => p.theme.space.sm};
  }
  input::placeholder {
    color: ${(p) => p.theme.stone2};
  }
  button {
    font-family: ${(p) => p.theme.mono};
    font-size: ${(p) => p.theme.type.code.size};
    color: ${(p) => p.theme.paper};
    background: ${(p) => p.theme.pine};
    border: 0;
    border-radius: ${(p) => p.theme.radius};
    min-height: ${(p) => p.theme.layout.controlPlate};
    padding: 0 ${(p) => p.theme.space.md};
    cursor: pointer;
    transition: background-color ${(p) => p.theme.dur.micro} ${(p) => p.theme.ease};
  }
  button:hover {
    background: ${(p) => p.theme.pineDeep};
  }
  button:active {
    transform: translateY(1px);
  }
`;

// The narrowest the graph is drawn on a narrow screen.
const GRAPH_MIN_WIDTH = "560px";

// On a narrow screen the graph keeps a readable size and scrolls sideways
// inside the plate instead of shrinking its labels. From the two-column
// breakpoint up it fits. ScrollHint follows the same breakpoint, so the page
// says the graph scrolls exactly where it does.
const Stage = styled.div`
  overflow-x: auto;

  svg {
    display: block;
    width: 100%;
    min-width: ${GRAPH_MIN_WIDTH};
    height: auto;
  }
  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    svg {
      min-width: 0;
    }
  }
  .edge {
    fill: none;
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
    transition: stroke 0.25s ${(p) => p.theme.ease}, stroke-width 0.25s ${(p) => p.theme.ease};
  }
  .edge.on {
    stroke: ${(p) => p.theme.pine};
    stroke-width: 2;
  }
  .node rect {
    fill: ${(p) => p.theme.card};
    stroke: ${(p) => p.theme.hair};
    stroke-width: 1.4;
    transition: stroke 0.25s ${(p) => p.theme.ease}, stroke-width 0.25s ${(p) => p.theme.ease};
  }
  .node.on rect {
    stroke: ${(p) => p.theme.pine};
    stroke-width: 2;
  }
  .node.answer.on rect {
    fill: ${(p) => p.theme.pine};
  }
  .node text {
    font-family: ${(p) => p.theme.mono};
    font-size: 13.5px;
    font-weight: 500;
    fill: ${(p) => p.theme.ink};
  }
  .node.answer.on text {
    fill: ${(p) => p.theme.paper};
  }
  .packet {
    fill: ${(p) => p.theme.pine};
  }
`;

const ScrollHint = styled.p`
  ${role("small")}
  margin-top: ${(p) => p.theme.space.xs};
  color: ${(p) => p.theme.stone2};

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    display: none;
  }
`;

const Trace = styled.div`
  margin-top: ${(p) => p.theme.space.sm};
  font-family: ${(p) => p.theme.mono};
  font-size: ${(p) => p.theme.type.code.size};
  line-height: 1.7;
  color: ${(p) => p.theme.stone};
  /* room for six lines, the longest trace, so a degraded run does not shift
     the page (a narrow screen that wraps a line still can) */
  min-height: calc(6 * 1.7em);

  .line b {
    color: ${(p) => p.theme.pine};
    font-weight: 500;
  }
  .caret {
    color: ${(p) => p.theme.stone2};
  }
`;

export const STEP_MS = 620;

const Orchestrator = () => {
  const reduce = useReducedMotion();
  const [intent, setIntent] = useState("summarise");
  const [failure, setFailure] = useState(false);
  const [run, setRun] = useState(() => buildRun("summarise", false));
  const [shown, setShown] = useState(0); // trace lines revealed
  const [pos, setPos] = useState(() => ({ cx: cx("request"), cy: cy("request"), hop: 0 }));
  const [live, setLive] = useState(false);
  const timers = useRef([]);
  const runId = useRef(0);
  const [text, setText] = useState("");

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const send = useCallback(
    (intentKey) => {
      clearTimers();
      const r = buildRun(intentKey, failure);
      const id = runId.current + 1;
      runId.current = id;
      setIntent(intentKey);
      setRun(r);
      setLive(true);

      if (reduce) {
        setShown(r.trace.length);
        setPos({ cx: cx(r.seq[r.seq.length - 1]), cy: cy(r.seq[r.seq.length - 1]), hop: r.seq.length - 1 });
        return;
      }

      setShown(0);
      setPos({ cx: cx(r.seq[0]), cy: cy(r.seq[0]), hop: 0 });
      // advance packet + reveal a trace line at each hop
      for (let i = 1; i < r.seq.length; i += 1) {
        const node = r.seq[i];
        const line = i - 1;
        const t = setTimeout(() => {
          if (runId.current !== id) return;
          setPos({ cx: cx(node), cy: cy(node), hop: i });
          setShown((s) => Math.min(r.trace.length, Math.max(s, line + 1)));
        }, i * STEP_MS);
        timers.current.push(t);
      }
      const done = setTimeout(() => {
        if (runId.current === id) setLive(false);
      }, r.seq.length * STEP_MS + 200);
      timers.current.push(done);
    },
    [failure, reduce]
  );

  useEffect(() => {
    send("summarise");
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    send(matchIntent(text));
  };

  return (
    <Fig role="group" aria-label="Interactive agent orchestrator: pick a request and watch it route through the system.">
      <Bar>
        <span className="t">Drive a request</span>
        <Toggle type="button" $on={failure} aria-pressed={failure} onClick={() => setFailure((f) => !f)}>
          {failure ? "failure: on" : "inject failure"}
        </Toggle>
      </Bar>

      <Chips role="group" aria-label="Example requests">
        {Object.entries(INTENTS).map(([k, v]) => (
          <Chip key={k} type="button" $active={intent === k} aria-pressed={intent === k} onClick={() => send(k)}>
            {v.label}
          </Chip>
        ))}
      </Chips>

      <Form onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="or type a request and route it yourself"
          aria-label="Type a request to route"
        />
        <button type="submit">Route</button>
      </Form>

      <Stage tabIndex={0} role="group" aria-label="Routing graph. On a small screen it scrolls sideways.">
        <svg viewBox="0 0 680 292" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {EDGES.map((e) => (
            <path key={e.id} className={run.activeEdges.has(e.id) ? "edge on" : "edge"} d={e.d} />
          ))}
          {NODE_IDS.map((id) => {
            const n = N[id];
            const on = run.activeNodes.has(id);
            return (
              <g key={id} className={`node${n.answer ? " answer" : ""}${on ? " on" : ""}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="5" />
                <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">
                  {n.label}
                </text>
              </g>
            );
          })}
          {!reduce && live && (
            <motion.circle
              className="packet"
              r={5}
              cx={pos.cx}
              cy={pos.cy}
              animate={{ cx: pos.cx, cy: pos.cy }}
              transition={{ duration: STEP_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </svg>
      </Stage>
      <ScrollHint>Scroll sideways to see the whole graph.</ScrollHint>

      <Trace aria-live="polite">
        {run.trace.slice(0, shown).map((l, i) => (
          <div className="line" key={i}>
            <b>{String(i + 1).padStart(2, "0")}</b> {l}
          </div>
        ))}
        {live && shown < run.trace.length && <span className="caret">routing…</span>}
      </Trace>
    </Fig>
  );
};

export default Orchestrator;
