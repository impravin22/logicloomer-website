import { createGlobalStyle } from "styled-components";

// Dark Professional Theme
export const darkTheme = {
  body: "#0D1117", // GitHub dark background
  text: "#F0F6FC", // Light text
  textSecondary: "#8B949E", // Secondary text
  accent: "#58A6FF", // GitHub blue
  accentHover: "#79C0FF",
  background: "#161B22", // Card background
  border: "#30363D", // Borders
  shadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  success: "#3FB950",
  warning: "#D29922",
  error: "#F85149",
  code: "#F0F6FC",
  codeBackground: "#21262D",
  link: "#58A6FF",
  linkHover: "#79C0FF",
  cardBackground: "#161B22",
  cardBorder: "#30363D",
  navbarBackground: "rgba(13, 17, 23, 0.8)",
  backdrop: "rgba(0, 0, 0, 0.4)",
};

// Light Professional Theme
export const lightTheme = {
  body: "#FFFFFF",
  text: "#24292F",
  textSecondary: "#656D76",
  accent: "#0969DA",
  accentHover: "#0860CA",
  background: "#F6F8FA",
  border: "#D0D7DE",
  shadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  success: "#1A7F37",
  warning: "#9A6700",
  error: "#CF222E",
  code: "#24292F",
  codeBackground: "#F6F8FA",
  link: "#0969DA",
  linkHover: "#0860CA",
  cardBackground: "#FFFFFF",
  cardBorder: "#D0D7DE",
  navbarBackground: "rgba(255, 255, 255, 0.8)",
  backdrop: "rgba(0, 0, 0, 0.1)",
};

// Global Styles
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: ${props => props.theme.body};
    color: ${props => props.theme.text};
    line-height: 1.6;
    overflow-x: hidden;
    transition: all 0.3s ease;
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.accent};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.accentHover};
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.link};
    transition: color 0.3s ease;
  }

  a:hover {
    color: ${props => props.theme.linkHover};
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section {
    padding: 80px 0;
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    background: ${props => props.theme.accent};
    color: white;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    text-decoration: none;
  }

  .btn:hover {
    background: ${props => props.theme.accentHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }

  .btn-outline {
    background: transparent;
    border: 2px solid ${props => props.theme.accent};
    color: ${props => props.theme.accent};
  }

  .btn-outline:hover {
    background: ${props => props.theme.accent};
    color: white;
  }

  .card {
    background: ${props => props.theme.cardBackground};
    border: 1px solid ${props => props.theme.cardBorder};
    border-radius: 12px;
    padding: 24px;
    box-shadow: ${props => props.theme.shadow};
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  .text-gradient {
    background: ${props => props.theme.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 16px;
    }
    
    .section {
      padding: 60px 0;
    }
  }
`;