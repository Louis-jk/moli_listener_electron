import { url } from 'inspector';
import styled from 'styled-components';
import {
  FlexColumnStartCenter,
  FlexColumnStartStart,
  FlexRowSpaceBCenter,
} from './Common.Styled';
import { theme } from './Theme';

interface SessionMainInfoBoxProps {
  imageSource: string;
  isFrameMin: boolean;
}

interface SessionTransListBoxProps {
  active: boolean;
}

export const SessionMainInfoBox = styled.div<SessionMainInfoBoxProps>`
  width: 100%;
  height: 200px;
  overflow-y: auto;
  background-image: ${({ imageSource }) =>
    imageSource && `url(${imageSource})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transition: all 0.3s cubic-bezier(0.42, 0, 0.58, 1);
  transform: scale(1) translate(0, 0);

  & div {
    padding: 1.65rem 1rem;
    background-color: rgba(0, 0, 0, 0.68);

    .session_date {
      font-weight: bold;
    }
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ${({ isFrameMin }) =>
    isFrameMin &&
    `
    min-width: 100px;
    max-height: 100px;
    padding: 0;
    transform: translate(-10%, -10%);

    & > p, h4, span {
      display: none;
    }
  `}

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${theme.colors.BASE_COLOR_DARK};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #333;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.BASE_COLOR_DARK};
  }
`;

export const SessionTransListBox = styled(
  FlexRowSpaceBCenter
)<SessionTransListBoxProps>`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.TEXT_DESCRIPTION_COLOR}2a;
  cursor: pointer;

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

export const SessionMinDescWrapper = styled(FlexColumnStartStart)`
  min-width: 250px;
  margin: 0;
`;
