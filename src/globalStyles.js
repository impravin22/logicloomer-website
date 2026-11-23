import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-size: 100%;
    scroll-behavior: smooth;
    /* anchors land clear of the sticky nav */
    scroll-padding-top: ${(p) => p.theme.space["3xl"]};
    scrollbar-color: ${(p) => p.theme.stone2} ${(p) => p.theme.paper};
    -webkit-text-size-adjust: 100%;
  }

  /* clip, not hidden: hidden would break the sticky nav */
  html, body { overflow-x: clip; }

  body {
    font-family: ${(p) => p.theme.body};
    font-size: ${(p) => p.theme.type.body.size};
    background: ${(p) => p.theme.paper};
    color: ${(p) => p.theme.ink};
    line-height: ${(p) => p.theme.type.body.line};
    font-weight: 400;
    caret-color: ${(p) => p.theme.focus};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${(p) => p.theme.grot};
    font-synthesis: none;
    overflow-wrap: break-word;
    min-width: 0;
    text-wrap: balance;
  }

  p { text-wrap: pretty; }

  a { text-decoration: none; color: inherit; }

  button, input { font: inherit; }

  svg { display: block; }

  [hidden] { display: none !important; }

  ::selection { background: ${(p) => p.theme.focus}; color: ${(p) => p.theme.paper}; }

  /* Instant, never animated. Each surface sets its own ring colour. */
  :focus-visible {
    outline: 2px solid ${(p) => p.theme.focus};
    outline-offset: 3px;
    border-radius: 2px;
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;

export default GlobalStyle;
