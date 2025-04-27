import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing.lg};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.xl};
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes['2xl']};
  cursor: pointer;
  color: ${theme.colors.dark};
  line-height: 1;
  
  &:hover {
    color: ${theme.colors.danger};
  }
`;

export const ModalBody = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;
