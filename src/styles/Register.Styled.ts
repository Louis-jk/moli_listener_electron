import styled from 'styled-components';
import { FlexRowCenterCenter } from './Common.Styled';
import { theme } from './Theme';

export const TermsWrap = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

export const TermsInnerWrap = styled.div`
  width: 100%;
  height: 150px;
  padding: 1rem 1.25rem;
  background-color: ${theme.colors.TERMS_WRAP_COLOR};
  border-radius: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  scrollbar-color: #000;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-moz-scrollbar {
    display: none;
  }

  & p {
    font-size: 0.85rem;
  }
`;

export const TermsCheckBox = styled.div`
label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  input[type='checkbox'] {
    display: none;
  }

  input[type='checkbox'] {
    display: block;
    width: 19px;
    height: 19px;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    background-color: #fff;
    border-radius: 19px;
    position: relative;
    cursor: pointer;
  }

  input[type='checkbox']:checked::after {
    content: '';
    display: block;
    color: ${theme.colors.POINT_COLOR};
    width: 10px;
    height: 10px;
    position: absolute;    
    top: 50%;
    left: 50%;
    transform: translate(-55%, -45%);
    border-radius: 10px;
    background-color: ${theme.colors.POINT_COLOR};
  }

  span {
    color: ${theme.colors.BORDER_COLOR};
    margin-left: 10px;
  }

  div {
    label {
      &::before {
        background: #222;
      }
    }
  }
`;

export const CodeInputWrap = styled(FlexRowCenterCenter)`
  margin: 0 auto;
`;

interface CodeInputProps {
  visible: boolean;
}
export const CodeInput = styled.input<CodeInputProps>`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  color: ${theme.colors.POINT_COLOR};
  border: none;
  border-bottom: 0.1rem solid ${theme.colors.TEXT_DESCRIPTION_COLOR};
  background: transparent;
  width: 45px;
  margin: 0 5px;
  padding: 0.25rem;

  &:focus,
  :visited {
    border-bottom: 0.2rem solid ${theme.colors.POINT_COLOR};
  }

  ${({ visible }) =>
    visible &&
    `
  border-bottom: 0.2rem solid ${theme.colors.POINT_COLOR};
  `}
`;
