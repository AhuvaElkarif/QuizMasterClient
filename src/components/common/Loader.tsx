import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Loader = styled.div<LoaderProps>`
  display: inline-block;
  width: ${({ size = 'md' }) => 
    size === 'sm' ? '1rem' : 
    size === 'md' ? '2rem' : 
    '3rem'};
  height: ${({ size = 'md' }) => 
    size === 'sm' ? '1rem' : 
    size === 'md' ? '2rem' : 
    '3rem'};
  border: ${({ size = 'md' }) => 
    size === 'sm' ? '2px' : 
    size === 'md' ? '3px' : 
    '4px'} solid rgba(0, 0, 0, 0.1);
  border-left-color: ${({ color = theme.colors.primary }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;