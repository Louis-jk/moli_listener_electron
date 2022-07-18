import styled from 'styled-components'
import {
  CodeInputProps,
  TermsCheckBoxProps
} from '../interfaces/styles.interface'
import { FlexRowCenterCenter } from './Common.Styled'
import { theme } from './Theme'

export const TermsWrap = styled.div`
  width: 100%;
  padding: 1rem 0;
`

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
`

export const TermsCheckBox = styled.div < TermsCheckBoxProps > `
  display: block;
  width: 40px;
  height: 40px;
  background-image: ${({ checked }) =>
    checked ? "url('images/check_on.png')" : "url('images/check_off.png')"};
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  -webkit-app-region: no-drag;
`

export const CodeInputWrap = styled(FlexRowCenterCenter)`
  margin: 0 auto;
`

export const CodeInput = styled.input < CodeInputProps > `
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
`
