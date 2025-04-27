import styled, { css } from 'styled-components';
  import { theme } from '../../styles/theme';
  
  interface InputProps {
    error?: boolean;
    fullWidth?: boolean;
  }
  
  export const Input = styled.input<InputProps>`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${({ error }) => error ? theme.colors.danger : theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    background-color: ${theme.colors.white};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    ${({ fullWidth }) => fullWidth && css`width: 100%;`};
    
    &:focus {
      outline: none;
      border-color: ${({ error }) => error ? theme.colors.danger : theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ error }) => error 
        ? `${theme.colors.danger}33` 
        : `${theme.colors.primary}33`};
    }
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }
  `;
  
  export const TextArea = styled.textarea<InputProps>`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${({ error }) => error ? theme.colors.danger : theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    background-color: ${theme.colors.white};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    min-height: 100px;
    resize: vertical;
    
    ${({ fullWidth }) => fullWidth && css`width: 100%;`};
    
    &:focus {
      outline: none;
      border-color: ${({ error }) => error ? theme.colors.danger : theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ error }) => error 
        ? `${theme.colors.danger}33` 
        : `${theme.colors.primary}33`};
    }
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:disabled {
      // src/components/common/Input.tsx (continued from previous section)
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.dark};
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.xs};
`;

// Additional Common Components

export const Card = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['3xl']};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.dark};
`;

export const Alert = styled.div<{ type?: 'success' | 'warning' | 'danger' | 'info' }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
  
  ${({ type = 'info' }) => {
    const styles = {
      success: {
        bg: '#d1fae5',
        border: theme.colors.success,
        text: '#065f46',
      },
      warning: {
        bg: '#fef3c7',
        border: theme.colors.warning,
        text: '#92400e',
      },
      danger: {
        bg: '#fee2e2',
        border: theme.colors.danger,
        text: '#b91c1c',
      }, 
      info: {
        bg: '#dbeafe',
        border: theme.colors.info,
        text: '#1e40af',
      }
    };
    
    return `
      background-color: ${styles[type].bg};
      border-left: 4px solid ${styles[type].border};
      color: ${styles[type].text};
    `;
  }}
`;

export const Badge = styled.span<{ type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;
  
  ${({ type = 'primary' }) => {
    const styles = {
      primary: {
        bg: theme.colors.primary,
        text: theme.colors.white,
      },
      secondary: {
        bg: theme.colors.secondary,
        text: theme.colors.white,
      },
      success: {
        bg: theme.colors.success,
        text: theme.colors.white,
      },
      danger: {
        bg: theme.colors.danger,
        text: theme.colors.white,
      },
      warning: {
        bg: theme.colors.warning,
        text: theme.colors.dark,
      },
      info: {
        bg: theme.colors.info,
        text: theme.colors.white,
      }
    };
    
    return `
      background-color: ${styles[type].bg};
      color: ${styles[type].text};
    `;
  }}
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.md};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${theme.spacing.md};
`;

export const Column = styled.div<{ span?: number; sm?: number; md?: number; lg?: number }>`
  grid-column: span ${({ span = 12 }) => span};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-column: span ${({ sm, span = 12 }) => sm || span};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-column: span ${({ md, sm, span = 12 }) => md || sm || span};
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-column: span ${({ lg, md, sm, span = 12 }) => lg || md || sm || span};
  }
`;

export const Flex = styled.div<{ 
  direction?: 'row' | 'column'; 
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch'; 
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
  gap: ${({ gap = theme.spacing.md }) => gap};
  flex-wrap: ${({ wrap = false }) => wrap ? 'wrap' : 'nowrap'};
`;