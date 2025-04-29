import styled from 'styled-components';

// Layout components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -var(--spacing-md);
`;

export const Column = styled.div<{ size?: number }>`
  flex: ${props => props.size || 1};
  padding: 0 var(--spacing-md);
`;

export const Card = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

export const Section = styled.section`
  margin: var(--spacing-xl) 0;
`;

// Form components
export const Form = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

export const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
`;

export const Input = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-divider);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-divider);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: var(--border-color: var(--color-primary);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-divider);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

export const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
`;

// Button components
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' | 'text' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: var(--color-secondary);
          color: var(--color-text-on-secondary);
          border: none;
          
          &:hover {
            background-color: var(--color-secondary-dark);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
          
          &:hover {
            background-color: rgba(98, 0, 238, 0.05);
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: var(--color-primary);
          border: none;
          padding: var(--spacing-xs) var(--spacing-sm);
          
          &:hover {
            background-color: rgba(98, 0, 238, 0.05);
          }
        `;
      default:
        return `
          background-color: var(--color-primary);
          color: var(--color-text-on-primary);
          border: none;
          
          &:hover {
            background-color: var(--color-primary-dark);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
`;

// Navigation components
export const NavBar = styled.nav`
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

export const NavBrand = styled.div`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
`;

export const NavItems = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  margin-right: var(--spacing-md);
  
  &:last-child {
    margin-right: 0;
  }
`;

export const NavLink = styled.a`
  color: var(--color-text-on-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Badge components
export const Badge = styled.span<{ variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' }>`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: var(--color-secondary);
          color: var(--color-text-on-secondary);
        `;
      case 'success':
        return `
          background-color: var(--color-success);
          color: white;
        `;
      case 'error':
        return `
          background-color: var(--color-error);
          color: white;
        `;
      case 'warning':
        return `
          background-color: var(--color-warning);
          color: var(--color-text-primary);
        `;
      default:
        return `
          background-color: var(--color-primary);
          color: var(--color-text-on-primary);
        `;
    }
  }}
`;

// Specialized components for QuizMaster
export const QuizCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto var(--spacing-lg);
`;

export const QuestionText = styled.h3`
  margin-bottom: var(--spacing-lg);
`;

export const AnswerOption = styled.div<{ selected?: boolean; correct?: boolean; incorrect?: boolean }>`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--color-divider);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${props => {
    if (props.correct) {
      return `
        background-color: rgba(76, 175, 80, 0.1);
        border-color: var(--color-success);
      `;
    }
    if (props.incorrect) {
      return `
        background-color: rgba(176, 0, 32, 0.1);
        border-color: var(--color-error);
      `;
    }
    if (props.selected) {
      return `
        background-color: rgba(98, 0, 238, 0.1);
        border-color: var(--color-primary);
      `;
    }
    return `
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    `;
  }}
`;

export const QuizNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xl);
`;

export const ResultSummary = styled.div`
  text-align: center;
  margin: var(--spacing-xl) 0;
`;

export const Score = styled.div<{ score: number }>`
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin: var(--spacing-lg) 0;
  color: ${props => {
    if (props.score < 50) return 'var(--color-error)';
    if (props.score < 80) return 'var(--color-warning)';
    return 'var(--color-success)';
  }};
`;

export const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  
  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid var(--color-divider);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: right;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 2px solid var(--color-divider);
`;

export const Td = styled.td`
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-divider);
`;

export const Tr = styled.tr`
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;