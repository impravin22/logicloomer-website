import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html { font-size: 17px; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

  body {
    font-family: ${(p) => p.theme.body};
    background: ${(p) => p.theme.paper};
    color: ${(p) => p.theme.ink};
    line-height: 1.6;
    font-weight: 400;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* one grain texture — a quiet fingerprint, reused everywhere */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  h1, h2, h3, h4, h5, h6 { font-family: ${(p) => p.theme.grot}; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }

  a { text-decoration: none; color: inherit; }

  ::selection { background: ${(p) => p.theme.pine}; color: ${(p) => p.theme.paper}; }

  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: ${(p) => p.theme.paper}; }
  ::-webkit-scrollbar-thumb { background: ${(p) => p.theme.hair}; border-radius: 0; }
  ::-webkit-scrollbar-thumb:hover { background: ${(p) => p.theme.pine}; }

  :focus-visible {
    outline: 2px solid ${(p) => p.theme.pine};
    outline-offset: 3px;
    border-radius: 2px;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }

  @media (max-width: 768px) { html { font-size: 16px; } }
`;

export default GlobalStyle;
