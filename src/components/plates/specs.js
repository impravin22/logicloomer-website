// The system design charts: one small grid spec per system.
//
// Each chart draws only what its project's own text states. The first eight
// carry the nodes, edges and labels of the sketches they replace; the other
// twelve are drawn from the sentence, README or architecture document named
// beside them. `tech`, edge labels and lanes add only facts from the same
// source. One node per chart is lit: the one the note's "decision that
// mattered" turns on.
//
// kind: a box is a service (the default), a drum a store, a bevelled box a
// model or agent, a pill a person, a dashed box a system outside this one.
// A label breaks with "\n" where a narrow cell needs two lines.

const node = (id, label, col, row, extra) => ({ id, label, col, row, ...extra });
const edge = (from, to, extra) => ({ from, to, ...extra });

export const PLATES = {
  autofix: {
    id: "autofix",
    label: "Auto-fix loop: logs become a gated fix on dev, and a human approves production",
    cols: 4,
    rows: 2,
    nodes: [
      node("logs", "Logs", 0, 0, { kind: "store", tech: "every 6 h" }),
      node("issue", "Issue", 1, 0, { tech: "filed once" }),
      node("agent", "Agent", 2, 0, { kind: "model", tech: "Claude Code" }),
      node("gates", "Gates", 3, 0, { tech: "lint, test" }),
      node("dev", "Dev", 3, 1, { tech: "on its own" }),
      node("human", "Human", 2, 1, { kind: "person", tech: "approves", accent: true }),
      node("prod", "Prod", 1, 1, { tech: "tagged" }),
    ],
    edges: [
      edge("logs", "issue"),
      edge("issue", "agent"),
      edge("agent", "gates"),
      edge("gates", "agent", { arc: true }),
      edge("gates", "dev"),
      edge("dev", "human"),
      edge("human", "prod"),
    ],
  },
  mcp: {
    id: "mcp",
    label: "One login in front of many product backends",
    cols: 4,
    rows: 3,
    lanes: [
      { title: "Client", from: 0, to: 0 },
      { title: "Gateway", from: 1, to: 2 },
      { title: "Products", from: 3, to: 3 },
    ],
    nodes: [
      node("claude", "Claude", 0, 1, { kind: "model" }),
      node("sso", "SSO", 1, 1, { tech: "Azure AD", accent: true }),
      node("core", "MCP\ncore", 2, 1, { tech: "TypeScript" }),
      node("okr", "Rapid-\nOKR", 3, 0),
      node("skills", "Skill\nportal", 3, 1),
      node("next", "+ next", 3, 2, { kind: "external" }),
    ],
    edges: [
      edge("claude", "sso", { label: "OAuth" }),
      edge("sso", "core"),
      edge("core", "okr"),
      edge("core", "skills"),
      edge("core", "next"),
    ],
  },
  workflow: {
    id: "workflow",
    label: "Identity stripped at extraction, then grouped, scored and reported",
    cols: 3,
    rows: 2,
    nodes: [
      node("records", "Records", 0, 0, { kind: "store", tech: "1,000+ profiles" }),
      node("strip", "Strip ID", 1, 0, { tech: "at extraction", accent: true }),
      node("families", "Families", 2, 0, { tech: "34 of them" }),
      node("score", "Score", 2, 1),
      node("report", "Report", 1, 1, { tech: "14 findings" }),
    ],
    edges: [
      edge("records", "strip"),
      edge("strip", "families"),
      edge("families", "score"),
      edge("score", "report"),
    ],
  },
  vlm: {
    id: "vlm",
    label: "Vision-language pipeline with auditor loop",
    cols: 3,
    rows: 2,
    nodes: [
      node("image", "Image", 0, 0),
      node("vlm", "VLM ×6", 1, 0, { kind: "model", tech: "Gemini Vision" }),
      node("schema", "Schema", 2, 0, { tech: "Pydantic" }),
      node("auditor", "Auditor", 1, 1, { kind: "model", tech: "checks each one", accent: true }),
    ],
    edges: [
      edge("image", "vlm"),
      edge("vlm", "schema"),
      edge("schema", "auditor"),
      edge("auditor", "vlm"),
    ],
  },
  rapidokr: {
    id: "rapidokr",
    label: "Rapid-OKR data flow",
    cols: 3,
    rows: 3,
    lanes: [
      { title: "Web", from: 0, to: 0 },
      { title: "Services", from: 1, to: 1 },
      { title: "Data", from: 2, to: 2 },
    ],
    nodes: [
      node("next", "Next.js", 0, 1),
      node("api", "FastAPI,\nDDD", 1, 0, { accent: true }),
      node("dagster", "Dagster", 1, 2),
      node("pgvector", "pgvector", 2, 1, { kind: "store" }),
    ],
    edges: [
      edge("next", "api"),
      edge("next", "dagster"),
      edge("api", "pgvector"),
      edge("dagster", "pgvector"),
    ],
  },
  sales: {
    id: "sales",
    label: "Multi-agent fan-out",
    cols: 3,
    rows: 3,
    nodes: [
      node("router", "Router", 0, 1, { tech: "picks one", accent: true }),
      node("product", "Product", 2, 0, { kind: "model" }),
      node("competitor", "Competitor", 2, 1, { kind: "model" }),
      node("general", "General", 2, 2, { kind: "model" }),
    ],
    edges: [edge("router", "product"), edge("router", "competitor"), edge("router", "general")],
  },
  sensai: {
    id: "sensai",
    label: "On-device sketch recognition pipeline",
    cols: 3,
    rows: 2,
    nodes: [
      node("strokes", "Strokes", 0, 0),
      node("model", "LSTM/GNN", 1, 0, { kind: "model", tech: "PyTorch" }),
      node("compress", "Compress", 2, 0, { tech: "to the panel", accent: true }),
      node("shape", "Shape", 2, 1),
    ],
    edges: [edge("strokes", "model"), edge("model", "compress"), edge("compress", "shape")],
  },
  humanvision: {
    id: "humanvision",
    label: "One frame read for pose, gaze and expression",
    cols: 3,
    rows: 3,
    nodes: [
      node("frame", "Frame", 0, 1),
      node("keypoints", "Keypoints", 1, 1, { tech: "Lie-algebraic", accent: true }),
      node("pose", "Pose", 2, 0),
      node("gaze", "Gaze", 2, 1),
      node("expression", "Expression", 2, 2, { kind: "model", tech: "RegNet-800" }),
    ],
    edges: [
      edge("frame", "keypoints"),
      edge("keypoints", "pose"),
      edge("keypoints", "gaze"),
      edge("keypoints", "expression"),
    ],
  },

  // gma-backend ARCHITECTURE.md: "the model never produces a price"; "one code
  // path for every mutation, one authority for every number"
  gma: {
    id: "gma",
    label: "The web app and AI assistants over MCP reach one backend; it alone derives every number, and calls Gemini, Postgres and the agency's work systems",
    cols: 3,
    rows: 3,
    lanes: [
      { title: "Clients", from: 0, to: 0 },
      { title: "Platform", from: 1, to: 1 },
      { title: "Models, data, systems", from: 2, to: 2 },
    ],
    nodes: [
      node("web", "Web app", 0, 0, { tech: "Next.js" }),
      node("assistant", "Assistant", 0, 2, { kind: "external", tech: "any MCP client" }),
      node("backend", "Backend", 1, 1, { tech: "FastAPI", accent: true }),
      node("gemini", "Gemini", 2, 0, { kind: "model" }),
      node("postgres", "Postgres", 2, 1, { kind: "store", tech: "pgvector" }),
      node("systems", "Work\nsystems", 2, 2, { kind: "external" }),
    ],
    edges: [
      edge("web", "backend", { label: "REST" }),
      edge("assistant", "backend", { label: "MCP" }),
      edge("backend", "gemini"),
      edge("backend", "postgres"),
      edge("backend", "systems"),
    ],
  },
  // t-mgr-backend: the API, the Teams bot and the scheduler run from one image
  // and share one database; "Server-authoritative governance"
  tmgr: {
    id: "tmgr",
    label: "A web app, a Teams bot and a scheduler share one Postgres; the API holds the rules, and Claude on Bedrock only drafts",
    cols: 3,
    rows: 3,
    nodes: [
      node("web", "Web app", 0, 0, { tech: "Next.js" }),
      node("api", "API", 1, 0, { tech: "FastAPI", accent: true }),
      node("claude", "Claude", 2, 0, { kind: "model", tech: "Bedrock" }),
      node("bot", "Teams\nbot", 0, 1, { tech: "Adaptive Cards" }),
      node("postgres", "Postgres", 1, 1, { kind: "store", tech: "RDS" }),
      node("scheduler", "Scheduler", 1, 2, { tech: "cron jobs" }),
      node("report", "Report", 2, 2, { tech: "by email" }),
    ],
    edges: [
      edge("web", "api"),
      edge("api", "claude", { label: "drafts" }),
      edge("api", "postgres"),
      edge("bot", "postgres"),
      edge("scheduler", "postgres"),
      edge("scheduler", "report", { label: "monthly" }),
    ],
  },
  // work-intelligence-capstone READMEs: the pipeline, the run API that drops
  // quotes and person keys, the web app
  capstone: {
    id: "capstone",
    label: "A pipeline reads a department's own words with Claude and Gemini; a run API strips quotes and names before the web app sees a result",
    cols: 3,
    rows: 3,
    nodes: [
      node("models", "Claude,\nGemini", 1, 0, { kind: "model" }),
      node("dataset", "Dataset", 0, 1, { kind: "store", tech: "own words" }),
      node("pipeline", "Pipeline", 1, 1, { tech: "Python" }),
      node("api", "Run API", 2, 1, { tech: "FastAPI", accent: true }),
      node("web", "Web app", 2, 2, { tech: "Next.js" }),
    ],
    edges: [
      edge("dataset", "pipeline"),
      edge("pipeline", "models"),
      edge("pipeline", "api"),
      edge("api", "web", { label: "redacted" }),
    ],
  },

  // "an 8-GPU Kubernetes cluster with Hadoop pipelines feeding SSD-backed nodes"
  detection: {
    id: "detection",
    label: "Hadoop pipelines feed SSD-backed nodes, and an 8-GPU Kubernetes cluster trains the detector",
    cols: 3,
    rows: 2,
    nodes: [
      node("images", "Images", 0, 0, { kind: "store", tech: "500K" }),
      node("hadoop", "Hadoop", 1, 0, { tech: "pipelines" }),
      node("ssd", "SSD nodes", 2, 0),
      node("cluster", "8-GPU K8s", 2, 1, { tech: "PyTorch", accent: true }),
      node("detector", "Detector", 1, 1, { kind: "model", tech: "mAP 0.82" }),
    ],
    edges: [
      edge("images", "hadoop"),
      edge("hadoop", "ssd"),
      edge("ssd", "cluster"),
      edge("cluster", "detector"),
    ],
  },
  // "A 600M-parameter teacher squeezed into a faster student."
  distillation: {
    id: "distillation",
    label: "A 600M-parameter teacher distilled into a faster student, the one now in production",
    cols: 3,
    rows: 2,
    nodes: [
      node("teacher", "Teacher", 0, 0, { kind: "model", tech: "600M" }),
      node("distil", "Distil", 1, 0),
      node("student", "Student", 2, 0, { kind: "model", tech: "2× the speed", accent: true }),
      node("production", "Production", 2, 1),
    ],
    edges: [edge("teacher", "distil"), edge("distil", "student"), edge("student", "production")],
  },
  // "TensorRT and CUDA did the heavy lifting"
  lpr: {
    id: "lpr",
    label: "Each frame read on the edge by TensorRT on CUDA, in step with the line",
    cols: 3,
    rows: 1,
    nodes: [
      node("frame", "Frame", 0, 0),
      node("engine", "TensorRT", 1, 0, { kind: "model", tech: "on CUDA", accent: true }),
      node("plate", "Plate", 2, 0, { tech: "in real time" }),
    ],
    edges: [edge("frame", "engine"), edge("engine", "plate")],
  },
  // "A variational autoencoder trained only on good panels caught the bad ones
  // by how poorly they reconstructed."
  defect: {
    id: "defect",
    label: "A VAE trained only on good panels rebuilds each panel and flags the ones it reconstructs poorly",
    cols: 3,
    rows: 3,
    nodes: [
      node("panel", "Panel", 0, 0),
      node("vae", "VAE", 1, 0, { kind: "model", tech: "PyTorch" }),
      node("rebuild", "Rebuild", 2, 0),
      node("good", "Good\npanels", 1, 1, { kind: "store", tech: "training set" }),
      node("error", "Error", 2, 1, { accent: true }),
      node("flag", "Flag", 2, 2),
    ],
    edges: [
      edge("panel", "vae"),
      edge("vae", "rebuild"),
      edge("good", "vae"),
      edge("rebuild", "error"),
      edge("error", "flag"),
    ],
  },
  // "Feature engineering and statistics first ... then boosted trees"; "Trained
  // on a Docker, Kubernetes and Kubeflow cluster and deployed on the client's own site"
  manufacturing: {
    id: "manufacturing",
    label: "Process data becomes features, then boosted trees, trained on Kubeflow and deployed on the client's site",
    cols: 3,
    rows: 3,
    nodes: [
      node("kubeflow", "Kubeflow", 2, 0, { tech: "training" }),
      node("data", "Process\ndata", 0, 1, { kind: "store" }),
      node("features", "Features", 1, 1, { tech: "statistics", accent: true }),
      node("trees", "Boosted\ntrees", 2, 1, { kind: "model" }),
      node("site", "Client\nsite", 2, 2, { kind: "external" }),
    ],
    edges: [
      edge("data", "features"),
      edge("features", "trees"),
      edge("kubeflow", "trees"),
      edge("trees", "site"),
    ],
  },

  // impravin22/medbuddy README, "Architecture"
  medbuddy: {
    id: "medbuddy",
    label: "A LINE message reaches a FastAPI webhook; a LangGraph graph calls speech-to-text, DSPy with Gemini, RxNorm and text-to-speech",
    cols: 3,
    rows: 3,
    nodes: [
      node("line", "LINE", 0, 0, { kind: "external" }),
      node("webhook", "Webhook", 1, 0, { tech: "FastAPI" }),
      node("stt", "STT", 0, 1, { kind: "model", tech: "Gemini" }),
      node("graph", "LangGraph", 1, 1, { tech: "6 nodes", accent: true }),
      node("dspy", "DSPy", 2, 1, { kind: "model", tech: "Gemini" }),
      node("rxnorm", "RxNorm", 0, 2, { kind: "external", tech: "interactions" }),
      node("tts", "TTS", 2, 2, { tech: "edge-tts" }),
    ],
    edges: [
      edge("line", "webhook"),
      edge("webhook", "graph"),
      edge("graph", "stt"),
      edge("graph", "dspy"),
      edge("graph", "rxnorm"),
      edge("graph", "tts"),
    ],
  },
  // impravin22/pravys-market-bot README, schedule and CAN SLIM thresholds
  marketbot: {
    id: "marketbot",
    label: "A GitHub Actions cron pulls yfinance data, runs the CAN SLIM screen, has Gemini write the digest and posts it to Telegram",
    cols: 3,
    rows: 2,
    nodes: [
      node("cron", "Actions\ncron", 0, 0),
      node("data", "yfinance", 1, 0, { kind: "external", tech: "NSE data" }),
      node("screen", "CAN SLIM", 2, 0, { tech: "7 letters", accent: true }),
      node("gemini", "Gemini", 2, 1, { kind: "model", tech: "narrative" }),
      node("telegram", "Telegram", 1, 1, { kind: "external", tech: "3 digests" }),
    ],
    edges: [
      edge("cron", "data"),
      edge("data", "screen"),
      edge("screen", "gemini"),
      edge("gemini", "telegram"),
    ],
  },
  // impravin22/outfit-recommender README, "Multi-Agent Workflow"
  outfit: {
    id: "outfit",
    label: "A photo passes through four LangGraph agents: vision, trends, advisor and image",
    cols: 3,
    rows: 2,
    nodes: [
      node("photo", "Photo", 0, 0),
      node("vision", "Vision", 1, 0, { kind: "model", tech: "Gemini 2.5", accent: true }),
      node("trends", "Trends", 2, 0, { kind: "model", tech: "DSPy" }),
      node("advisor", "Advisor", 2, 1, { kind: "model", tech: "DSPy" }),
      node("image", "Image", 1, 1, { kind: "model", tech: "Gemini 2.5" }),
    ],
    edges: [
      edge("photo", "vision"),
      edge("vision", "trends"),
      edge("trends", "advisor"),
      edge("advisor", "image"),
    ],
  },
  // impravin22/Medical-info-extractor README, "Technical Architecture"
  medextract: {
    id: "medextract",
    label: "pdfplumber reads the PDF, an LLM extracts the history, a Pydantic schema holds its shape and a DOCX summary comes out",
    cols: 3,
    rows: 2,
    nodes: [
      node("pdf", "PDF", 0, 0),
      node("reader", "pdfplumber", 1, 0),
      node("llm", "LLM", 2, 0, { kind: "model", tech: "Hermes-4" }),
      node("schema", "Pydantic", 2, 1, { tech: "schema", accent: true }),
      node("docx", "DOCX", 1, 1, { tech: "and Markdown" }),
    ],
    edges: [
      edge("pdf", "reader"),
      edge("reader", "llm"),
      edge("llm", "schema"),
      edge("schema", "docx"),
    ],
  },
};

export default PLATES;
