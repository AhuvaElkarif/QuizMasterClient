
  import { createGlobalStyle } from 'styled-components';
  import { theme } from './theme';
  
  export const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  
    html, body {
      font-family: ${theme.fonts.body};
      font-size: 16px;
      color: ${theme.colors.text};
      background-color: ${theme.colors.background};
      line-height: 1.5;
      min-height: 100vh;
    }
  
    h1, h2, h3, h4, h5, h6 {
      font-family: ${theme.fonts.heading};
      font-weight: 600;
      margin-bottom: ${theme.spacing.md};
    }
  
    a {
      color: ${theme.colors.primary};
      text-decoration: none;
      transition: color 0.2s ease-in-out;
  
      &:hover {
        color: ${theme.colors.secondary};
      }
    }
  
    button {
      cursor: pointer;
    }
  
    input, textarea, select {
      font-family: ${theme.fonts.body};
    }
  
    ul, ol {
      list-style-position: inside;
    }
  
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${theme.spacing.md};
    }
  `;  