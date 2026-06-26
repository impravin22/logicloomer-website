import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html { font-size: 16px; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

  body {
    font-family: ${(props) => props.theme.fontSans};
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    line-height: 1.65;
    font-weight: 400;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background 0.4s ease, color 0.4s ease;
  }

  h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.06; letter-spacing: -0.02em; }

  code, .mono { font-family: ${(props) => props.theme.fontMono}; }

  a { text-decoration: none; color: inherit; transition: color 0.2s ease; }

  ::selection { background: ${(props) => props.theme.gold}; color: ${(props) => props.theme.ink}; }

  ::-webkit-scrollbar { width: 9px; }
  ::-webkit-scrollbar-track { background: ${(props) => props.theme.body}; }
  ::-webkit-scrollbar-thumb { background: ${(props) => props.theme.ink3}; border-radius: 6px; }
  ::-webkit-scrollbar-thumb:hover { background: ${(props) => props.theme.gold}; }

  :focus-visible {
    outline: 2px solid ${(props) => props.theme.gold};
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

  @media (max-width: 768px) { html { font-size: 15px; } }
`;

export default GlobalStyle;
