// Content for the map page: the start, eight checkpoints, ocean labels and the
// contact card. Plain data only; journey-core.js renders it as text, never HTML.
(function (root, factory) {
  "use strict";
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.JourneyData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const start = {
    id: "taipei",
    name: "Taipei",
    year: "2018",
    lat: 25.04,
    lng: 121.56,
    z: 1.7,
    title: "Taipei, 2018",
    where: "Home. A master's student and a slow flood model.",
  };

  const stops = [
    {
      id: "amsterdam", name: "Amsterdam", year: "2019", lat: 52.31, lng: 4.94, z: 2.5, ep: "01", title: "Origin",
      when: "2018 to 2020 · Taipei",
      venue: "Johan Cruyff Arena · 8 May 2019 · Champions League semi-final, 2nd leg",
      s1: "Ajax 2", s2: "Spurs 3", res: "Full time · 3–3 on aggregate, through on away goals", mood: "joy",
      story: "Lucas Moura hat-trick, the third in the 96th minute, from 2–0 down on the night and 3–0 down on aggregate. Spurs' first Champions League final, in Madrid three weeks later.",
      more: [
        { label: "Jul 2018:", text: "Mbappé, 19, scores in a World Cup final. France 4–2 Croatia." },
        { label: "Dec 2019:", text: "Messi's sixth Ballon d'Or. Son's solo goal against Burnley the same month wins him the FIFA Puskás Award a year later." },
        { label: "2020:", text: "Liverpool end a 30-year wait for the league. Bayern beat PSG in an empty Lisbon." },
      ],
      projects: [
        { k: "2018 · M.Sc.", h: "Real-time object detection", what: "Conference paper on deep-learning detection that runs in real time, written in the first year of the master's.", res: "The groundwork for every vision system that followed.", chips: ["Deep learning", "Vision"] },
        { k: "2018 to 2020 · thesis", h: "A flood model that ran 15 times faster", what: "M.Sc. thesis at National Taipei University of Technology: a CPU-bound flood simulation rebuilt on a GPU with CUDA.", res: "15× speedup, published at IEEE.", chips: ["CUDA", "HPC", "IEEE paper"] },
      ],
      par: { big: "Early proof beats early promise.", p: "Mbappé scored in a World Cup final at 19. The thesis put a 15× result on the table before the first job. Nobody has to take a prodigy's word for it when the number is already in." },
    },
    {
      id: "rio", name: "Rio de Janeiro", year: "2021", lat: -22.91, lng: -43.23, z: 1.6, ep: "02", title: "First ship",
      when: "Aug 2020 to Mar 2022 · Neurelli, New Taipei",
      venue: "Maracanã · 10 Jul 2021 · Copa América final",
      s1: "Argentina 1", s2: "Brazil 0", res: "Full time · Trophy", mood: "joy",
      story: "Di María, 22nd minute, in Brazil's own stadium. Messi's first senior trophy with Argentina at 34, after four lost finals. A month later he leaves Barcelona in tears for PSG.",
      more: [
        { label: "May 2021:", text: "Kane 23 goals and 14 assists, Golden Boot and Playmaker in the same season, a Premier League first. Chelsea 1–0 City in Porto." },
        { label: "Dec 2020:", text: "Son collects the FIFA Puskás Award, a Spurs player with the best goal in the world." },
        { label: "Nov 2021:", text: "Conte arrives at Spurs. Messi's seventh Ballon d'Or." },
      ],
      projects: [
        { k: "2020 to 2021", h: "Smart manufacturing: tighter tolerances from the factory's own data", what: "Large manufacturers needed more precise parts. Feature engineering and statistics turned raw process data into a dataset a model could trust; boosted trees, built from scratch, did the predicting.", res: "Trained on a Docker, Kubernetes and Kubeflow cluster, then deployed on the client's own site. The first models I put in a factory rather than a notebook.", chips: ["Feature engineering", "Boosted trees", "Kubeflow"] },
        { k: "May to Jul 2021", h: "LCD defect detection that only learned \"good\"", what: "A variational autoencoder trained on good panels only; defects show up as poor reconstructions, so nobody has to label the rare ones.", res: "85% production accuracy, owned from data curation to containerised deploy.", chips: ["VAE", "PyTorch", "Docker"] },
        { k: "Aug 2021 to Feb 2022", h: "Licence-plate recognition at line speed", what: "A plate reader for an industrial production line, accelerated with TensorRT and CUDA.", res: "Shipped to production, reading plates on the edge in real time, no GPU rack behind it.", chips: ["TensorRT", "CUDA", "OpenCV"] },
      ],
      par: { big: "The first one takes the longest.", p: "Messi needed sixteen years and four lost finals before the Maracanã. Smart manufacturing was my apprenticeship: learn the factory before the model, get the data right, then ship where the parts are made. Three production systems in under two years, none of them a demo." },
    },
    {
      id: "lusail", name: "Lusail", year: "2022", lat: 25.42, lng: 51.49, z: 1.9, ep: "03", title: "On the edge",
      when: "Mar 2022 to 2023 · ViewSonic CEO Office",
      venue: "Lusail Stadium · 18 Dec 2022 · World Cup final",
      s1: "Argentina 3", s2: "France 3", res: "3–3 after extra time · Argentina win 4–2 on penalties", mood: "joy",
      story: "Messi twice, Mbappé a hat-trick in a World Cup final, Martínez's save in the 123rd minute. Messi, 35, finally has the one he was missing. Scaloni's structure did the repeatable work so one man only had to do judgement.",
      more: [
        { label: "22 May 2022:", text: "Norwich 0–5 Spurs. Son shares the Golden Boot with Salah on 23, the first Asian player to win it, ten days after the 3–0 north London derby win. Spurs back in the Champions League." },
        { label: "28 May 2022:", text: "Real Madrid 1–0 Liverpool in Paris, a 14th European Cup. Benzema's Ballon d'Or." },
        { label: "Mar 2022:", text: "I join the ViewSonic CEO Office, starting from an empty folder." },
      ],
      projects: [
        { k: "Mar 2022 onward", h: "Human-centric vision", what: "Pose, gaze and expression read live on low-power edge hardware. Lie-algebraic keypoint transforms for pose; DinoV2 distilled into a RegNet-800 for expression.", res: "Pose at 80%, eye-status at 85%, real time in C++ without a GPU.", chips: ["ONNX Runtime", "OpenVINO", "DinoV2"] },
        { k: "Late 2022 to 2023", h: "SensAI sketch recognition", what: "A sketch modelled as the strokes you draw, read by an LSTM/GNN, then compressed hard enough to run on the whiteboard itself.", res: "Shipped on ViewSonic whiteboards: rough box in, crisp shape out, no server round trip.", chips: ["LSTM/GNN", "PyTorch", "Edge"] },
      ],
      par: { big: "Decide at the edge.", p: "Martínez's save in the 123rd minute left no time for a second opinion. SensAI makes its call on the whiteboard itself and the vision models read pose and gaze on low-power hardware, no server round trip. When the moment is live, the decision has to be local." },
    },
    {
      id: "istanbul", name: "Istanbul", year: "2023", lat: 41.07, lng: 28.77, z: 2.1, ep: "04", title: "Scale",
      when: "2023 to Jul 2024 · ViewSonic CEO Office",
      venue: "Atatürk Olympic Stadium · 10 Jun 2023 · Champions League final",
      s1: "Man City 1", s2: "Inter 0", res: "Full time · The treble", mood: "joy",
      story: "Rodri, 68th minute. City complete the treble. Haaland's 36 league goals set a Premier League record, 52 in all competitions, every one from a system built to feed one specialist.",
      more: [
        { label: "5 Feb 2023:", text: "Kane's 267th Spurs goal passes Jimmy Greaves, the club's all-time record. 23 March: his 54th for England passes Rooney. August: Kane to Bayern as their record signing." },
        { label: "Jul to Oct 2023:", text: "Messi to Inter Miami, Leagues Cup in his first month, an eighth Ballon d'Or in October." },
        { label: "Autumn 2023:", text: "Postecoglou's Spurs go ten games unbeaten and top the league through October; he takes Manager of the Month three times in a row, a first for a new manager." },
      ],
      projects: [
        { k: "Mar to Jul 2024", h: "Half a million images, trained to mAP 0.82", what: "Half a million images will not train on one box. An 8-GPU Kubernetes cluster with Hadoop pipelines feeding SSD-backed nodes, distributed PyTorch across the lot.", res: "The whole loop from raw data to a deployed detector at mAP 0.82 over 500K images.", chips: ["PyTorch", "8-GPU K8s", "Hadoop"] },
        { k: "2024", h: "Model distillation", what: "A 600M-parameter teacher distilled into a production student.", res: "2× faster at the same quality; the model that was too slow became the one in production.", chips: ["Distillation", "PyTorch"] },
      ],
      par: { big: "Build the machine that feeds the striker.", p: "Haaland's 52 goals came from a system built to deliver him the ball. Half a million images only train if the pipeline feeds eight GPUs without stalling. Then distil the result so production can keep up with it." },
    },
    {
      id: "bilbao", name: "Bilbao", year: "2025", lat: 43.26, lng: -2.95, z: 2.4, ep: "05", title: "Specialists",
      when: "Mar to Nov 2025 · ViewSonic CEO Office",
      venue: "San Mamés · 21 May 2025 · Europa League final",
      s1: "Spurs 1", s2: "Man Utd 0", res: "Full time · Trophy", mood: "joy",
      story: "Brennan Johnson, 42nd minute. First trophy in 17 years, first European trophy in 41, and a Champions League place with it. Seventeen days earlier Harry Kane, 31, had won his first major trophy with Bayern after fourteen seasons as a professional.",
      more: [
        { label: "Route to Bilbao:", text: "AZ, Eintracht Frankfurt, then Bodø/Glimt 5–1 on aggregate in the semi-final, then United." },
        { label: "2024:", text: "Kane scores 36 in his first Bundesliga season, a record for a debutant. Real Madrid's 15th at Wembley; Mbappé joins them. Spain 2–1 England in Berlin, Yamal 17; Messi's second Copa the same night. Rodri's Ballon d'Or in October." },
        { label: "Apr to May 2025:", text: "Liverpool's 20th title; Salah 29 goals and 18 assists. PSG 5–0 Inter in Munich, ten days after Bilbao." },
      ],
      projects: [
        { k: "Mar to Nov 2025", h: "AI sales assistant", what: "A multi-agent system for a sales floor: a router picks the right specialist agent per question instead of one do-everything prompt, over Qdrant retrieval and live search.", res: "Accuracy up, latency down; reps get in seconds what they used to ask product teams for.", chips: ["Multi-agent", "Qdrant", "FastAPI"] },
        { k: "2025 · still running", h: "Blend n Bubbles", what: "A bubble-tea brand founded on the side, because not everything is a model.", res: "Idea to a real storefront and brand, still trading.", chips: ["Founder", "Brand"], links: [{ label: "blendnbubbles.com", href: "https://blendnbubbles.com" }] },
      ],
      par: { big: "The right specialist for the night.", p: "Spurs won in Bilbao with a plan built for one opponent, not a star carrying the team. The sales assistant works the same way: a router picks a specialist agent per question instead of one prompt doing everything." },
    },
    {
      id: "munich", name: "Munich", year: "2026", lat: 48.22, lng: 11.62, z: 2.5, ep: "06", title: "Blank repo to 1,300",
      when: "Dec 2025 to Jun 2026 · ViewSonic CEO Office",
      venue: "Allianz Arena · 2025-26 season · Bundesliga retained, a first DFB-Pokal",
      s1: "Kane 36", s2: "league goals", res: "Third straight top scorer · 61 for Bayern · 73 with England", mood: "joy",
      story: "Kane retains the Bundesliga, wins his first domestic cup and a second European Golden Shoe. 36 league goals for a third straight Torjägerkanone, 61 in all competitions for Bayern, 73 with England: the second-highest scoring season by anyone since 2000, behind only Messi's 82 in 2011-12.",
      more: [
        { label: "Spurs in Europe:", text: "a first UEFA Super Cup final, in Udine, 2–0 up against the European champions before penalties. Then top four of the Champions League league phase, straight into the last 16, and a 3–2 home win over Atlético in the second leg." },
        { label: "22 Sep 2025:", text: "Dembélé's Ballon d'Or, Yamal second and Kopa winner again." },
        { label: "6 Dec 2025:", text: "Messi's MLS Cup, Inter Miami 3–1 Vancouver; Busquets and Alba retire as champions." },
        { label: "30 May 2026:", text: "PSG retain the European Cup in Budapest, on penalties." },
      ],
      projects: [
        { k: "Dec 2025 to May 2026", h: "Rapid-OKR (VISTA): an enterprise AI platform, empty repo to 1,300 people", what: "Sole architect. Turns company strategy into how people set goals and get evaluated: LangGraph workflows, DSPy signatures with behavioural anchors, pgvector retrieval, Text-to-SQL, SSE streaming into a Next.js UI, on AWS ECS. Treated as an external product from day one: full OWASP LLM Top 10, per-user answer redaction at inference, AST checks on generated SQL, a versioned ethics gate.", res: "1,300+ people on the platform in six months; goal-setting from weeks of spreadsheets to one guided session, updates 9× faster.", chips: ["FastAPI", "Next.js", "pgvector", "DSPy", "LangGraph", "AWS ECS"] },
        { k: "Feb 2026", h: "An AI-maturity assistant that rates every employee L1 to L5", what: "Co-developed the AI-fluency framework, encoded Doerr-style OKR criteria into LLM-validated rubrics, built the org-wide adoption dashboards.", res: "Delivery judged on measured quality, not on features shipped.", chips: ["LLM-as-judge", "Rubrics", "Dashboards"] },
        { k: "Apr 2026 · open source", h: "MedBuddy, Pravy's Market Bot, Outfit Recommender", what: "A voice-first medication assistant in Mandarin on LINE; a CAN SLIM screen over the NSE posted to Telegram; a LangGraph multi-agent stylist that reads an outfit photo.", res: "Three working agents, all public.", chips: ["DSPy", "Gemini", "LangGraph"], links: [
          { label: "MedBuddy", href: "https://github.com/impravin22/medbuddy" },
          { label: "Market Bot", href: "https://github.com/impravin22/pravys-market-bot" },
          { label: "Outfit Recommender", href: "https://github.com/impravin22/outfit-recommender" },
        ] },
        { k: "May to Jun 2026", h: "One-login MCP gateway", what: "Company apps inside Claude behind a single company login. OAuth 2.1 brokered to Azure AD, each product plugging in its own credential, so the core never learns how a backend token is made.", res: "Read-only by design; staff query their own goals, reviews and AI progress from Claude, and the next product plugs in without a new deployment.", chips: ["MCP", "OAuth 2.1", "TypeScript"] },
        { k: "Jun 2026", h: "VLM document pipeline with an auditor loop", what: "Six layers of vision-language turn PPTX, DOCX, PDF and images into brand-compliant decks; an auditor model scores six dimensions and triggers remakes, up to three times.", res: "Manual brand review dropped from every document to the exceptions only.", chips: ["Gemini Vision", "Pydantic v2", "Celery"] },
      ],
      par: { big: "Repeat the pattern, run up the score.", p: "Kane's 73 came from the same movements every week. The platform went from an empty repo to 1,300 people in six months by reusing one pattern in every module: elicitation, structured scoring, deterministic aggregation, narrative. Prompts for judgement, code for determinism." },
    },
    {
      id: "newjersey", name: "New Jersey", year: "2026", lat: 40.81, lng: -74.07, z: 1.8, ep: "07", title: "Forward deployed",
      when: "Jul to Sep 2026 · Pod lead, ViewSonic CEO Office",
      venue: "MetLife Stadium · 19 Jul 2026 · World Cup final",
      s1: "Spain 1", s2: "Argentina 0", res: "After extra time", mood: "pain",
      story: "Ferran Torres, 106th minute, off the bench. Messi, 39, loses a World Cup final with eight tournament goals behind him. Rodri takes the Golden Ball, Unai Simón the Golden Glove with one goal conceded in eight games, Cubarsí, 19, best young player.",
      more: [
        { label: "Golden Boot:", text: "Mbappé, 10 goals and 4 assists. Messi 8, Bellingham and Haaland 7." },
        { label: "England third,", text: "their best finish since 1966. Kane 6 goals, 73 for club and country in one season." },
        { label: "Ronaldo, 41:", text: "a first World Cup knockout goal, career goal 976. By September, 979 and chasing 1,000." },
      ],
      projects: [
        { k: "Jul 2026 onward", h: "Sit with the team, find where work stalls, ship the fix", what: "A repeatable intake: find bottlenecks in org-wide workflow data, validate with the affected team, get a go or no-go, then build. Marketing, supply chain, legal and the EDU business unit.", res: "Several workstreams in parallel, with US and UK counterparts.", chips: ["Discovery", "Claude", "Gemini", "MCP"] },
        { k: "Aug to Sep 2026", h: "Workflow intelligence", what: "Where a company's working time actually goes, from data it already owns, without a survey. Identity stripped at extraction, not at the report, so no name ever reaches the analysis.", res: "1,000+ work profiles into 34 workflow families and 14 ranked findings, each citing its evidence.", chips: ["Python", "PostgreSQL", "Playwright"] },
        { k: "2026", h: "Auto issue solver", what: "Every six hours an agent reads the prod and dev logs of a live pricing tool, files each new error once, reproduces it with a failing test, then clears lint, types, tests and code review inside a sandbox.", res: "Releases to dev on its own; production still needs a human approval and a release tag.", chips: ["Claude Code", "GitHub Actions", "AWS"] },
      ],
      par: { big: "A tournament, not a league.", p: "Spain won it with a midfielder who rarely needed the ball to run the game and a keeper who conceded once in eight. Forward deployment plays the same way: short windows, several fronts, a result each time, and the boring parts made bulletproof." },
    },
    {
      id: "london", name: "London", year: "Now", lat: 51.6, lng: -0.07, z: 2.5, ep: "08", title: "To be continued", final: true,
      when: "Sep 2026 to now · London and Taipei",
      venue: "Tottenham Hotspur Stadium · October 2026 · where the next arc starts",
      s1: "Spurs", s2: "COYS", res: "The honours board since Episode 01", mood: "joy",
      story: "Champions League finalists 2019. Puskás Award 2020. Golden Boot and Playmaker 2021. Golden Boot 2022. All-time club record scorer 2023. Europa League winners 2025. UEFA Super Cup finalists 2025. Champions League league phase, top four, 2026.",
      more: [
        { label: "26 Oct 2026:", text: "Ballon d'Or night, still to come." },
        { label: "This month:", text: "PSG defend the European Cup, Messi is back at Inter Miami, Ronaldo is 21 goals from 1,000, and I'm in London running a 25-session leadership offsite over MCP." },
      ],
      projects: [
        { k: "Sep 2026 to now", h: "A cost calculator where the model never sets a price", what: "For the Global Marketing Agency. Any brief in, DSPy extraction to priced lines against a Finance-governed rate card. Brief text is untrusted: a canary in every system prompt, every claim re-resolved against the catalogue, so an injected id becomes an unmapped line, never an action.", res: "Approval freezes prices; account managers verify each line and their corrections teach a mapping memory. CI to AWS ECS with migration and smoke-test gates.", chips: ["FastAPI", "Next.js 16", "Postgres / pgvector", "AWS ECS"] },
        { k: "Sep 2026 to now", h: "Translation engine: durable jobs, a model gateway, a second model as judge", what: "Jobs on a Postgres queue: leased, renewed, three attempts with backoff, crash recovery that redrafts only in-flight batches. The gateway retries, falls back to a backup model, halves a batch at the output ceiling, holds per-job token budgets.", res: "A second model scores every draft with MQM, never the one that wrote it. Thirty brief-shielded FastMCP tools on one service layer.", chips: ["Postgres queue", "FastMCP", "MQM evals", "WebSocket"] },
        { k: "Oct 2026 · in flight", h: "Asset Management Tool for GMA", what: "Batch-renames creative assets for Bynder. PRD, a living decision register and a UX prototype on the ViewSonic design system; a pure rules engine with position-aware parsing and tests derived from the naming convention.", res: "Pluggable source and destination adapters, so the next system plugs in without a rewrite.", chips: ["Rules engine", "PRD", "Design system"] },
        { k: "Oct to Dec 2026", h: "London offsite over MCP, Northwestern capstone, AI code review", what: "A meeting framework turned into an MCP workflow that runs a 25-session leadership offsite in London. Client lead and technical coach for a five-student Northwestern University graduate capstone. AI-assisted code review across three engineering pods.", res: "25 sessions, five students, three pods. Expected through December.", chips: ["MCP", "Mentoring", "Claude Code"] },
      ],
      par: { big: "The next episode needs a co-writer.", p: "Hire me for a build, bring a problem worth talking through, or argue about Kane, Messi and Spurs." },
    },
  ];

  // [label, lat, lng] for the hand-lettered sea names.
  const oceans = [
    ["Oceanus Atlanticus", 12, -36],
    ["Oceanus Pacificus", -8, -132],
    ["Oceanus Pacificus", 4, 172],
    ["Oceanus Indicus", -22, 82],
    ["Oceanus Arcticus", 79, 70],
    ["Mare Australe", -50, 20],
    ["Hic sunt dracones", -46, 140],
  ];

  const contact = {
    email: "impravin22@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/impravin22" },
      { label: "GitLab", href: "https://gitlab.com/impravin22" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/praveen-chittem-b78b4a160" },
      { label: "CV (PDF)", href: "./Praveen_Chittem_CV_2026.pdf" },
      { label: "The same work, in short", href: "./in-short/" },
    ],
    factCheck: "2026 football facts checked on 18 Oct 2026 against",
    credits: "Earlier seasons from the record books. Country outlines: jsvectormap world data (MIT).",
  };

  const sources = [
    { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final" },
    { label: "bundesliga.com", href: "https://www.bundesliga.com/en/bundesliga/news/harry-kane-2025-26-numbers-england-bauern-munich-goals-records-messi-38301" },
    { label: "Football360", href: "https://football360.com.au/2026-fifa-world-cup-awards-winners/" },
    { label: "beIN Sports", href: "https://www.beinsports.com/en-us/soccer/articles/cristiano-ronaldo-is-21-goals-away-from-1-000-can-he-reach-the-historic-milestone-in-2026-2026-09-09" },
  ];

  return Object.freeze({ start, stops, oceans, contact, sources });
});
