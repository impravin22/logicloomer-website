// The work on the page: seventeen field notes and four open-source builds.
// Each entry names its architecture plate with `sketch` (see plates/specs.js);
// an entry with no plate is set in type across the row.
import React from "react";

export const PROJECTS = [
  {
    id: "auto-fix",
    title: "Auto Issue Solver",
    what: "Production errors turn into tested fixes on dev, with no one writing the code.",
    role: "Lead architect",
    year: "2026",
    stack: ["Claude Code", "GitHub Actions", "AWS"],
    brief: "Keep a live internal pricing tool healthy without a developer chasing every traceback by hand.",
    decision: (
      <>
        The agent faces every gate a developer does: it has to{" "}
        <b>reproduce the error with a failing test first</b>, clear lint, format, type and test
        checks, and answer the code review, all inside a sandbox. It can release to dev on its own;{" "}
        <b>production still needs a human approval</b> and a release tag.
      </>
    ),
    sketch: "autofix",
    outcome: "Every six hours it reads the dev and prod logs, files each new error once and works the queue. A person only steps in to approve the release to production.",
    defaultOpen: true,
  },
  {
    id: "marketing-operations",
    title: "Marketing Operations",
    what: "One platform where an in-house marketing agency costs briefs, translates copy, signs off assets and checks drafts.",
    role: "Lead architect",
    year: "2026",
    stack: ["FastAPI", "Next.js", "pgvector", "DSPy", "MCP"],
    brief: "Give an in-house marketing agency one place to turn a brief into a costed project, translate site copy, sign off finished assets and check a draft before it ships.",
    decision: (
      <>
        The model never produces a price. It reads the brief; <b>the server derives every number</b>.
        And there is <b>one code path for every change</b>, whether it comes from the screen, the
        API or an AI assistant over MCP.
      </>
    ),
    sketch: "gma",
    outcome: "In production on AWS: six tools on one backend, and the same rules whether a person or an AI assistant makes the change.",
  },
  {
    id: "transformation-manager",
    title: "Transformation Manager",
    what: "Where a transformation office runs its workstreams: who drives, what is due, what leadership reads.",
    role: "Lead developer",
    year: "2026",
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Bedrock", "Teams"],
    brief: "Give a transformation office one place to run its workstreams: who drives and who approves, what each milestone owes this month, and what leadership reads at the end of it.",
    decision: (
      <>
        The server holds every rule; the screen only mirrors it. And the AI works as a contributor:{" "}
        <b>it drafts, it never approves and never makes a business decision</b>. If the model fails
        on report day, <b>nothing is sent</b> until it is fixed.
      </>
    ),
    sketch: "tmgr",
    outcome: "In production on AWS: a web app, a Teams bot, and a monthly leadership report that the system drafts and sends.",
  },
  {
    id: "mcp-gateway",
    title: "One-Login MCP Gateway",
    what: "Company apps inside Claude, behind a single company login.",
    role: "Lead architect",
    year: "2026",
    stack: ["MCP", "OAuth 2.1", "TypeScript"],
    brief: "Let people ask Claude about their own goals, reviews and AI progress in plain language, without a new server and a new login for every product.",
    decision: (
      <>
        One server, one login, many products. OAuth 2.1 brokered to Azure AD, and{" "}
        <b>each product plugs in its own credential</b>, so the core never learns how a backend
        token is made. Read-only by design: <b>whatever you can see in the app is exactly what
        Claude sees</b>.
      </>
    ),
    sketch: "mcp",
    outcome: "Staff query their own platform data straight from Claude, and the next product plugs in without a new deployment.",
  },
  {
    id: "workflow-intel",
    title: "Workflow Intelligence",
    what: "Where a company's working time actually goes, answered without a survey.",
    role: "Lead architect",
    year: "2026",
    stack: ["Python", "PostgreSQL", "Playwright"],
    brief: "Find the workflows worth automating first, from data the company already owns, so the pod works on the right problem.",
    decision: (
      <>
        Strip identity at extraction, not at the report, so <b>no name ever reaches the analysis</b>.
        Every figure recomputes deterministically from the corpus and a committed grouping file,
        and <b>every finding cites its evidence</b>.
      </>
    ),
    sketch: "workflow",
    outcome: "Read 1,000+ work profiles into 34 workflow families and ranked 14 findings to act on or validate first.",
  },
  {
    id: "work-intel-capstone",
    title: "Work Intelligence Capstone",
    what: "With a Northwestern University capstone team: where a department's work gets stuck, read from its own words.",
    role: "Technical coach",
    year: "2026",
    stack: ["Claude on Bedrock", "Gemini", "FastAPI", "Next.js", "Terraform"],
    brief: "Rebuild a department's workflows from what its people wrote about their own work, find where the work gets stuck, and rank those blockers.",
    decision: (
      <>
        The method is the team's. I coach them and run the platform it ships on, and hold two
        rules: <b>anything the model inferred must look different from what a person actually
        said</b>, and quotes and names never leave the server.
      </>
    ),
    sketch: "capstone",
    outcome: "A testing version runs on AWS: each run is queued, and the web app receives a redacted bundle. One value stream has been run end to end so far.",
  },
  {
    id: "vlm",
    title: "VLM Document Pipeline",
    what: "Six layers of vision-language with an AI-auditor loop.",
    year: "2026",
    stack: ["Gemini Vision", "Pydantic"],
    decision: "An auditor model checks every extraction against the schema before it ships, so the output stays brand-compliant without a human in the loop.",
    sketch: "vlm",
    outcome: "Manual brand review dropped from every document to the exceptions only.",
  },
  {
    id: "rapid-okr",
    title: "Rapid-OKR",
    what: "An enterprise AI platform 1,300 people rely on.",
    role: "Lead architect",
    year: "2025",
    stack: ["FastAPI", "Next.js", "pgvector", "DSPy"],
    brief: "Turn company strategy into how 1,300 people actually set goals and get evaluated, without a wall of forms.",
    decision: (
      <>
        I split the system on one rule: <b>prompts for judgement, code for determinism</b>. The LLM
        elicits and scores; a deterministic core aggregates and gates. That is why the output never
        flickers run to run.
      </>
    ),
    sketch: "rapidokr",
    outcome: "Goal-setting went from weeks of spreadsheets to one guided session, shipped to 1,300+ on AWS ECS.",
  },
  {
    id: "ai-sales",
    title: "AI Sales Assistant",
    what: "A multi-agent system that gives a sales floor real answers, fast.",
    role: "Lead developer",
    year: "2025",
    stack: ["Multi-agent", "Qdrant", "FastAPI"],
    decision: "A router that picks the right specialist agent per query beat one do-everything prompt. Accuracy went up, latency came down.",
    sketch: "sales",
    outcome: "Reps stopped pinging product teams for answers the system now gives in seconds.",
  },
  {
    id: "object-detection",
    title: "Large-Scale Object Detection",
    what: "Half a million images, organised and trained to mAP 0.82.",
    role: "Lead developer",
    year: "2024",
    stack: ["PyTorch", "8-GPU K8s", "Hadoop"],
    sketch: "detection",
    decision: "Half a million images will not train on one box. I stood up an 8-GPU Kubernetes cluster with Hadoop pipelines feeding SSD-backed nodes, and ran distributed PyTorch across the lot.",
    outcome: "Built the whole loop from raw data to a deployed detector at mAP 0.82 over 500K images.",
  },
  {
    id: "distillation",
    title: "Model Distillation",
    what: "A 600M-parameter teacher squeezed into a faster student.",
    year: "2024",
    stack: ["Optimisation", "NLP"],
    sketch: "distillation",
    outcome: (
      <>
        Same quality at <b>2× the speed</b>. The model that was too slow for production became the
        one in production.
      </>
    ),
  },
  {
    id: "sensai",
    title: "SensAI Sketch Recognition",
    what: "Real-time stroke recognition that turns a whiteboard scrawl into a clean shape.",
    role: "Lead architect",
    year: "2022",
    stack: ["LSTM/GNN", "PyTorch", "Edge"],
    brief: "Give an interactive whiteboard the sense to read a rough hand-drawn box or arrow and snap it to the shape the person meant, without a round trip to a server.",
    decision: "I modelled a sketch as the sequence of strokes you draw, not a flat bitmap, so an LSTM/GNN reads it the way a person makes it. Then I compressed the model hard enough to run inference on the panel itself.",
    sketch: "sensai",
    outcome: "Shipped on ViewSonic interactive whiteboards: draw a rough box, get a crisp shape, all on-device.",
  },
  {
    id: "human-vision",
    title: "Human-Centric Vision",
    what: "Pose, gaze and expression read live on low-power edge hardware.",
    role: "Lead architect",
    year: "2022",
    stack: ["ONNX Runtime", "OpenVINO", "DinoV2"],
    decision: "Constrained edge hardware left no room for a heavy backbone, so I used Lie-algebraic keypoint transforms for pose and distilled DinoV2 down into a RegNet-800 for expression. All three signals run in real time without a GPU.",
    sketch: "humanvision",
    outcome: "Pose at 80% and eye-status at 85% real-time accuracy, on device, in C++.",
  },
  {
    id: "lpr",
    title: "Licence-Plate Recognition",
    what: "A plate reader quick enough to keep up with a production line.",
    role: "AI developer",
    year: "2021",
    stack: ["TensorRT", "CUDA", "OpenCV"],
    sketch: "lpr",
    decision: "TensorRT and CUDA did the heavy lifting so the pipeline stayed in step with the line, no rack of GPUs behind it.",
    outcome: "Shipped into industrial production, reading plates on the edge in real time.",
  },
  {
    id: "defect",
    title: "LCD Defect Detection",
    what: "A model that learned what a good panel looks like, then flagged the ones that were not.",
    role: "AI developer",
    year: "2021",
    stack: ["VAE", "PyTorch", "Docker"],
    sketch: "defect",
    decision: "Defects were rare and never looked the same twice, so labelling them was a losing game. A variational autoencoder trained only on good panels caught the bad ones by how poorly they reconstructed.",
    outcome: "85% production accuracy, owned end to end from data curation to a containerised deploy.",
  },
  {
    id: "smart-manufacturing",
    title: "Smart Manufacturing Analytics",
    what: "Models that help large manufacturers hold tighter tolerances on the parts they make.",
    role: "AI developer",
    year: "2020",
    stack: ["Feature engineering", "Boosted trees", "Kubeflow"],
    sketch: "manufacturing",
    decision: "Precision problems live in the process data, so the work started there, not with a bigger model. Feature engineering and statistics first, until the dataset could be trusted; then boosted trees, built from scratch.",
    outcome: "Trained on a Docker, Kubernetes and Kubeflow cluster and deployed on the client's own site: the first of three production systems at Neurelli.",
  },
  {
    id: "blend",
    title: "Blend n Bubbles",
    what: "A bubble-tea brand I founded and built, because not everything is a model.",
    role: "Founder",
    year: "2025",
    stack: ["React"],
    outcome: "Took it from an idea to a real storefront and brand.",
    href: "https://github.com/impravin22/blendnbubbles",
  },
];

// Open-source builds anyone can read, distinct from the NDA work above.
export const OPEN = [
  {
    id: "medbuddy",
    title: "MedBuddy",
    line: "A voice-first medication assistant for elderly patients in Taiwan. Ask about a drug in Mandarin on LINE, get a plain-language answer back, spoken and written.",
    stack: ["DSPy", "Gemini", "LINE"],
    sketch: "medbuddy",
    href: "https://github.com/impravin22/medbuddy",
  },
  {
    id: "market-bot",
    title: "Pravy's Market Bot",
    line: "A live agent that runs a CAN SLIM screen over the NSE and posts a morning, evening and weekly digest to Telegram. It schedules itself and skips the holidays.",
    stack: ["Python", "yfinance", "Telegram"],
    sketch: "marketbot",
    href: "https://github.com/impravin22/pravys-market-bot",
  },
  {
    id: "outfit",
    title: "Outfit Recommender",
    line: "A multi-agent system that reads an outfit photo and gives styling feedback, orchestrated with LangGraph.",
    stack: ["LangGraph", "Gemini", "Python"],
    sketch: "outfit",
    href: "https://github.com/impravin22/outfit-recommender",
  },
  {
    id: "medextract",
    title: "Medical Summary Builder",
    line: "Pulls a structured medical history out of long disability-case PDFs into a clean document. Judgement in the model, shape held by a Pydantic schema.",
    stack: ["LLM", "Pydantic", "PDF"],
    sketch: "medextract",
    href: "https://github.com/impravin22/Medical-info-extractor",
  },
];
