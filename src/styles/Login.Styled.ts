import styled from 'styled-components';
import { theme } from './Theme';

interface CustomNotifyProps {
  visible: boolean;
  error: boolean;
}

export const LoginButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 80%;
  background: ${theme.colors.POINT_COLOR};
  border: none;
  margin: 0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

export const SnsLoginButton = styled.div`
  width: 55px;
  height: 55px;
  cursor: pointer;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LoginInputField = styled.input`
  background: transparent;
  width: 100%;
  color: ${theme.colors.TEXT_WHITE_COLOR};
  padding: 0.85rem 1rem;
  border: 1px solid ${theme.colors.BORDER_COLOR};
  border-radius: 7px;
`;

export const CustomNotify = styled.div<CustomNotifyProps>`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.65rem 1rem;
  text-align: center;
  width: 92%;
  margin: 0 auto;
  transition: all 0.4s ease;

  ${({ visible, error }) =>
    visible
      ? `  
    opacity: 1;  
    background: ${error ? '#131313' : theme.colors.POINT_COLOR};

    & p {
      visibility: visible;
    }
  `
      : `  
    opacity: 0;
    
    & p {
      visibility: hidden;
    }
  `}
`;
