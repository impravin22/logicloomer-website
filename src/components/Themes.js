/* Hallmark · theme: custom · idea: "Logic loomer: threads of light run across a black page, and the work hangs on them." · vibe: "black room, white type, one thread of acid light" · redesign: full
 * paper: #09090B · accent: #C6F53D · display: Clash Grotesk · body: Satoshi · labels: Geist Mono · hero: the page's one sentence over a field of moving threads, with the newest systems and the chart of the one in hand on a glass panel · nav: edge-aligned, the distance travelled under it · footer: one short block · signature: the threads, and each chart's deciding node in the accent
 * axes: dark/grotesk-sans/chromatic-lime · posture: one accent · job: hire · v2.0.0 */
/* Hallmark · look from the owner's instructions of 23 November 2026: change the whole design system; take the best real portfolios, a named reference hero and a gallery of templates as references without copying them; use the best open-source work. A black ground with one bright accent, labels in capitals and a mono face are the owner's look, taken from those references, so the gates against them are waived on the owner's word. */
/* Hallmark · open-source: the hero's threads are the Threads component from React Bits, used as published under its MIT + Commons Clause licence (components/vendor/react-bits). */
/* Hallmark · waive 29 · the soft halo behind the threads is the light they carry, from the references the owner chose · without it the threads sit on flat black */
/* Hallmark · waive 44c · the sentence runs the full width, so the systems panel sits under its right half, level with the action · centring it on the text would cut the sentence to half the screen */
/* Hallmark · open: FAIL 58 · "Where I've been" holds more than two hundred words on one screen · the words are the owner's, so cutting them is the owner's call */

// Design tokens: the "Onyx" system. A black room, white type, and one acid
// accent that marks the thing to act on and the thing that decided a design.
// Three faces, each with one job: Clash Grotesk for headings, Satoshi for
// reading, Geist Mono for small labels.

// Every colour is named once here. Every surface below is composed from these.
const COLOUR = {
  black: "#09090B", // the ground
  coal: "#121215", // one step up: a card, a chart's ground
  coal2: "#1B1B20", // two steps up: a node on a chart, a control at rest
  line: "#2A2A31", // a hairline on the ground
  rim: "#72727C", // the edge of a control (3.9:1 on coal)
  steel: "#8E8E97", // labels, captions and chart line work (6.1:1 on black, 5.8:1 on coal)
  mist: "#BBBBC2", // secondary text (10.4:1 on black)
  white: "#F5F5F2", // the type (18.2:1 on black)
  volt: "#C6F53D", // the accent (15.7:1 on black; black on it the same)
  voltSoft: "#DDFB86", // the accent under a pointer
};

// A surface re-maps the same keys, so a component drawn on it re-themes
// without knowing where it sits.
//   well   a chart's ground: a raised card, pale line work, the accent node
//   field  the sandbox: the same card, with edges strong enough for controls
const surfaces = {
  well: {
    paper: COLOUR.coal,
    ink: COLOUR.white,
    stone: COLOUR.mist,
    stone2: COLOUR.steel,
    pine: COLOUR.volt,
    pineDeep: COLOUR.white,
    onPine: COLOUR.black,
    hair: COLOUR.steel,
    card: COLOUR.coal2,
    focus: COLOUR.volt,
  },
  field: {
    paper: COLOUR.coal,
    ink: COLOUR.white,
    stone: COLOUR.mist,
    stone2: COLOUR.mist,
    pine: COLOUR.volt,
    pineDeep: COLOUR.voltSoft,
    onPine: COLOUR.black,
    hair: COLOUR.rim,
    card: COLOUR.coal2,
    focus: COLOUR.volt,
  },
};

// Spacing steps. Nothing on the page uses a length outside this scale, the
// layout values and the section gaps below.
const space = {
  "3xs": "2px",
  "2xs": "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "40px",
  "2xl": "64px",
  "3xl": "96px",
  "4xl": "144px",
};

// One container, capped and centred: at 1920 the gutters grow, the grid does not.
const layout = {
  container: "1440px",
  gutter: "clamp(16px, 4.5vw, 64px)",
  gap: "clamp(16px, 2.2vw, 32px)",
  nav: "64px",
  control: "44px",
  controlPlate: "44px",
  primary: "52px",
};

const displayFace = "'Clash Grotesk', ui-sans-serif, system-ui, sans-serif";
const textFace = "'Satoshi', ui-sans-serif, system-ui, sans-serif";
const monoFace = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const NORMAL = "100%";

// Type roles: size, leading, tracking, weight and width travel together, and
// a role may name its face. A component picks a role (see `role` in
// _dossier.js) and never sets tracking by hand.
const type = {
  display: { size: "clamp(3.25rem, 7.6vw, 7.75rem)", line: "0.92", track: "-0.04em", weight: 500, width: NORMAL, face: displayFace },
  displayS: { size: "clamp(2.5rem, 5vw, 5rem)", line: "0.96", track: "-0.035em", weight: 500, width: NORMAL, face: displayFace },
  section: { size: "clamp(2rem, 3vw + 0.75rem, 3.5rem)", line: "1", track: "-0.03em", weight: 500, width: NORMAL, face: displayFace },
  statement: { size: "clamp(1.75rem, 2.4vw + 1rem, 3.25rem)", line: "1.14", track: "-0.015em", weight: 400, width: NORMAL, face: displayFace },
  title: { size: "clamp(1.25rem, 0.7vw + 0.9rem, 1.5rem)", line: "1.15", track: "-0.012em", weight: 500, width: NORMAL },
  lead: { size: "clamp(1.125rem, 0.35vw + 1rem, 1.3125rem)", line: "1.45", track: "0", weight: 400, width: NORMAL },
  body: { size: "1.0625rem", line: "1.5", track: "0", weight: 400, width: NORMAL },
  small: { size: "0.875rem", line: "1.45", track: "0", weight: 500, width: NORMAL },
  // a small label in capitals: the one role that is tracked out
  label: { size: "0.75rem", line: "1.3", track: "0.09em", weight: 500, width: NORMAL, face: monoFace },
  code: { size: "0.8125rem", line: "1.6", track: "0", weight: 400, width: NORMAL },
};

export const theme = {
  // On the ground: white is the type, the links and the outlined controls;
  // the accent is a hover, the focus ring and the one filled button.
  paper: COLOUR.black,
  ink: COLOUR.white,
  stone: COLOUR.mist,
  stone2: COLOUR.steel,
  pine: COLOUR.white,
  pineDeep: COLOUR.volt,
  onPine: COLOUR.black,
  hair: COLOUR.line,
  card: COLOUR.coal,
  focus: COLOUR.volt,
  mark: COLOUR.volt,
  accent: COLOUR.volt,
  accentSoft: COLOUR.voltSoft,
  rim: COLOUR.rim,

  surfaces,

  grot: displayFace,
  body: textFace,
  mono: monoFace,

  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  radius: "10px",
  radiusPlate: "20px",
  pill: "999px",

  space,
  type,
  layout,

  // Space between sections, mixed across the page.
  gap: {
    s: "clamp(56px, 8.4vw, 120px)",
    m: "clamp(72px, 10vw, 144px)",
    l: "clamp(96px, 12.2vw, 176px)",
  },
  // stage: where the hero goes from one column to two.
  // chart: where a two-across card is wide enough for a chart at full density.
  bp: {
    grid2: "40rem",
    stage: "60rem",
    hero: "76rem",
    chart: "80rem",
  },
  dur: {
    micro: "120ms",
    short: "220ms",
    long: "420ms",
  },
};

export default theme;
