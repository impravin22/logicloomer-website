import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
/* Base resets */
*,*::before,*::after,h1,h2,h3,h4,h5,h6{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

h1,h2,h3,h4,h5,h6{
    display: inline-block;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
}

body{
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: 'Source Sans Pro',sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Responsive typography */
@media (max-width: 1366px) {
    html {
        font-size: 15px;
    }
}

@media (max-width: 768px) {
    html {
        font-size: 14px;
    }
}

/* Improved touch targets for mobile */
@media (max-width: 768px) {
    button, a {
        min-height: 44px;
        min-width: 44px;
    }
    
    input, select, textarea {
        font-size: 16px; /* Prevents zoom on input focus on iOS */
    }
}

/* Prevent content from being hidden under fixed header/footer */
main {
    width: 100%;
    overflow-x: hidden;
}

/* Utility for screen-reader only content */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
`

export default GlobalStyle;