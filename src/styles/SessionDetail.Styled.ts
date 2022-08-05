import { url } from 'inspector';
import styled from 'styled-components';
import {
  SessionMainInfoBoxProps,
  SessionTransListBoxProps,
  VolumeControlProp,
} from '../interfaces/styles.interface';
import {
  FlexColumnStartCenter,
  FlexColumnStartStart,
  FlexRowSpaceBCenter,
} from './Common.Styled';
import { theme } from './Theme';

export const SessionMainInfoBox = styled.div<SessionMainInfoBoxProps>`
  width: 100%;
  height: 200px;

  background-image: ${({ imageSource }) =>
    imageSource && `url(${imageSource})`};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transition: all 0.3s cubic-bezier(0.42, 0, 0.58, 1);
  transform: scale(1) translate(0, 0);
  -webkit-app-region: no-drag;

  & div {
    width: 100%;
    height: 200px;
    padding: 1.65rem 1rem;
    background-color: rgba(0, 0, 0, 0.68);
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 2px;
    }

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

    .session_date {
      font-weight: bold;
    }
  }

  ${({ isFrameMin, windowWidth }) =>
    isFrameMin &&
    `
    min-width: ${windowWidth < 380 ? '60px' : '100px'};
    min-height: ${windowWidth < 380 ? '60px' : '100px'};  
    max-height: ${windowWidth < 380 ? '60px' : '100px'};  
    padding: 0;
    transform: ${
      windowWidth < 380 ? 'translate(-20%, -10%)' : 'translate(-10%, -10%)'
    };

    & > div {
      height: 100%;
    }

    & > p, h4, span {
      display: none;
    }
  `}
`;

export const SessionTransListBox = styled(
  FlexRowSpaceBCenter
)<SessionTransListBoxProps>`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.TEXT_DESCRIPTION_COLOR}2a;
  cursor: pointer;

  ${({ isMin }) =>
    isMin &&
    `
  border-bottom: none;
  padding: 0.1rem 1rem 0.1rem;
  `}

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
  -webkit-app-region: no-drag;
`;

export const SessionMinDescWrapper = styled(FlexColumnStartStart)`
  min-width: 250px;
  margin: 0;
`;

export const VolumeInfomationArea = styled.div`
  // padding: 1rem 0 0;
  -webkit-app-region: no-drag;
`;

export const VolumeControl = styled.input<VolumeControlProp>`
  -webkit-app-region: no-drag;

  &[type='range'] {
    -webkit-appearance: none;
    -webkit-app-region: no-drag;
    margin-right: 15px;
    // width: 73vw;
    // width: 84%;
    // width: 69vw;
    width: calc(100vw - 100px);
    height: 3px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    background-image: linear-gradient(#f35174, #f67397);
    background-size: ${({ value }) => `${value}% 100%`};
    background-repeat: no-repeat;
    margin: 0.5rem 0;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 12px;
      width: 5px;
      // border-radius: 50%;
      background: #f35174;
      cursor: ew-resize;
      box-shadow: 0 0 2px 0 #555;
      transition: background 0.3s ease-in-out;
    }
  }
`;

export const VolumeSettingBtn = styled.div`
  -webkit-app-region: no-drag;
  -webkit-appearance: none;
  cursor: pointer;
`;
