import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #6200ee;
    --color-primary-dark: #3700b3;
    --color-secondary: #03dac6;
    --color-secondary-dark: #018786;
    --color-background: #f5f5f5;
    --color-surface: #ffffff;
    --color-error: #b00020;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-text-primary: #212121;
    --color-text-secondary: #757575;
    --color-text-disabled: #9e9e9e;
    --color-text-hint: #9e9e9e;
    --color-text-on-primary: #ffffff;
    --color-text-on-secondary: #000000;
    --color-divider: #e0e0e0;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --border-radius-xl: 24px;
    
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 24px;
    --font-size-xxl: 32px;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    --shadow-md: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    --shadow-lg: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    --shadow-xl: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    --shadow-xxl: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
  }
  
  body {
    font-family: 'Roboto', 'Heebo', sans-serif;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    direction: rtl;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-md);
  }
  
  h1 {
    font-size: var(--font-size-xxl);
  }
  
  h2 {
    font-size: var(--font-size-xl);
  }
  
  h3 {
    font-size: var(--font-size-lg);
  }
  
  p {
    margin-bottom: var(--spacing-md);
    line-height: 1.5;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
`;

export default GlobalStyles;