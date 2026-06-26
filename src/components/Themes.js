// Design tokens — "Systems Dossier" identity (navy + gold, derived from the CV).
// One neutral grotesk (General Sans) + a technical mono (JetBrains Mono).

const fonts = {
  fontSans: "'General Sans', system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
  // Back-compat aliases (older components referenced these names).
  fontDisplay: "'General Sans', system-ui, sans-serif",
  fontBody: "'General Sans', system-ui, sans-serif",
};

// Dark — primary identity.
export const darkTheme = {
  ...fonts,
  ink: "#0B1A2C",
  ink2: "#102439",
  ink3: "#16304A",
  body: "#0B1A2C",
  surface: "#102439",
  surfaceHover: "#16304A",

  gold: "#C2A45A",
  goldSoft: "#D8BE7E",
  steel: "#4E7CA8",

  text: "#F0F3F7",
  text2: "#A7B6C6",
  text3: "#8A9BAD",

  rule: "rgba(255, 255, 255, 0.10)",
  rule2: "rgba(194, 164, 90, 0.34)",

  navbar: "rgba(11, 26, 44, 0.82)",
  isDark: true,
};

// Light — cream/navy, mirrors the CV paper.
export const lightTheme = {
  ...fonts,
  ink: "#F3EFE6",
  ink2: "#ECE6D8",
  ink3: "#E3DBC9",
  body: "#F3EFE6",
  surface: "#ECE6D8",
  surfaceHover: "#E3DBC9",

  gold: "#6F5612",
  goldSoft: "#7E641F",
  steel: "#3F6488",

  text: "#13243A",
  text2: "#42566C",
  text3: "#51616F",

  rule: "rgba(11, 26, 44, 0.10)",
  rule2: "rgba(154, 123, 46, 0.34)",

  navbar: "rgba(243, 239, 230, 0.85)",
  isDark: false,
};
