import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary') => {
  const variantMap: Record<string, { bg: string; text: string; hover: string }> = {
    primary: {
      bg: theme.colors.primary,
      text: theme.colors.white,
      hover: '#1d4ed8',
    },
    secondary: {
      bg: theme.colors.secondary,
      text: theme.colors.white,
      hover: '#4338ca',
    },
    success: {
      bg: theme.colors.success,
      text: theme.colors.white,
      hover: '#059669',
    },
    danger: {
      bg: theme.colors.danger,
      text: theme.colors.white,
      hover: '#dc2626',
    },
    warning: {
      bg: theme.colors.warning,
      text: theme.colors.dark,
      hover: '#d97706',
    },
    info: {
      bg: theme.colors.info,
      text: theme.colors.white,
      hover: '#2563eb',
    },
    light: {
      bg: theme.colors.light,
      text: theme.colors.dark,
      hover: '#e5e7eb',
    },
    dark: {
      bg: theme.colors.dark,
      text: theme.colors.white,
      hover: '#111827',
    },
  };

  const styles = variantMap[variant];

  return css`
    background-color: ${styles.bg};
    color: ${styles.text};
    
    &:hover:not(:disabled) {
      background-color: ${styles.hover};
    }
  `;
};

const getSizeStyles = (size: ButtonProps['size'] = 'md') => {
  const sizeMap: Record<string, { padding: string; fontSize: string }> = {
    sm: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.fontSizes.sm,
    },
    md: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.fontSizes.md,
    },
    lg: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      fontSize: theme.fontSizes.lg,
    },
  };

  const styles = sizeMap[size];

  return css`
    padding: ${styles.padding};
    font-size: ${styles.fontSize};
  `;
};

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  ${({ variant }) => getVariantStyles(variant)};
  ${({ size }) => getSizeStyles(size)};
  ${({ fullWidth }) => fullWidth && css`width: 100%;`};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;