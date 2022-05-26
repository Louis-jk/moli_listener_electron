import { url } from 'inspector';
import styled from 'styled-components';
import { FlexRowSpaceBCenter } from './Common.Styled';
import { theme } from './Theme';

interface SessionMainInfoBoxProps {
  imageSource: string;
}

interface SessionTransListBoxProps {
  active: boolean;
}

export const SessionMainInfoBox = styled.div<SessionMainInfoBoxProps>`
  width: 100%;
  height: 200px;
  overflow-y: auto;
  padding: 1.65rem 1rem;
  background-image: ${({ imageSource }) =>
    imageSource && `url(${imageSource})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  .session_date {
    font-weight: bold;
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #333;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #000;
  }
`;

export const SessionTransListBox = styled(
  FlexRowSpaceBCenter
)<SessionTransListBoxProps>`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.TEXT_DESCRIPTION_COLOR}2a;

  & > p {
    color: ${({ active }) =>
      active
        ? theme.colors.TEXT_WHITE_COLOR
        : theme.colors.TEXT_DESCRIPTION_COLOR};
  }

  ${({ active }) =>
    active &&
    `
      font-weight: bold;
    `}
`;

export const PlayBtn = styled.div`
  cursor: pointer;
`;
