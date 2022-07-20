import styled from 'styled-components';
import {
  ButtonProps,
  LoadingWrapProp,
  MarginProps,
  TabProps,
  WrapperProps,
  VerticalLineProps,
} from '../interfaces/styles.interface';
import { theme } from './Theme';

export const HeaderContainer = styled.header`
  -webkit-app-region: drag;
`;

export const Width100 = styled.div`
  width: 100%;
`;

export const FlexCenterCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexCenterStart = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const FlexCenterEnd = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const FlexStartCenter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const FlexEndCenter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const FlexStartStart = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FlexSpaceBCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexSpaceECenter = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const FlexSpaceBStart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const FlexRowCenterCenter = styled(FlexCenterCenter)`
  flex-direction: row;
`;

export const FlexRowCenterEnd = styled(FlexCenterEnd)`
  flex-direction: row;
`;

export const FlexRowCenterStart = styled(FlexCenterStart)`
  flex-direction: row;
`;

export const FlexRowStartCenter = styled(FlexStartCenter)`
  flex-direction: row;
`;

export const FlexRowEndCenter = styled(FlexEndCenter)`
  flex-direction: row;
`;

export const FlexRowSpaceBCenter = styled(FlexSpaceBCenter)`
  flex-direction: row;
`;

export const FlexRowSpaceBStart = styled(FlexSpaceBStart)`
  flex-direction: row;
`;

export const FlexColumnCenterCenter = styled(FlexCenterCenter)`
  flex-direction: column;
`;

export const FlexColumnStartCenter = styled(FlexStartCenter)`
  flex-direction: column;
`;

export const FlexColumnStartStart = styled(FlexStartStart)`
  flex-direction: column;
`;

export const FlexColumnSpaceBCenter = styled(FlexSpaceBCenter)`
  flex-direction: column;
`;

export const FlexColumnSpaceECenter = styled(FlexSpaceECenter)`
  flex-direction: column;
`;

export const Container = styled.div`
  height: 100vh;
  background-color: ${theme.colors.BASE_COLOR_DARK};
  -webkit-app-region: drag;
  cursor: grab;
`;

export const Wrapper = styled.section<WrapperProps>`
  display: block;
  padding: 4.9rem 1rem 3rem;
  transform: translateY(0);
  transition: all 0.4s ease;
  background-color: ${theme.colors.BASE_COLOR_DARK};
  cursor: grab;

  ${({ isFrameMin }) =>
    isFrameMin &&
    `
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 3.5rem 1.5rem 0;
  // transform: translateY(-30px);
  width: 100%;
  `}
`;

export const WindowControl = styled(FlexRowEndCenter)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0.45rem 0.65rem;
  background: #111;
  z-index: 100;

  & > .control {
    -webkit-app-region: no-drag;
    display: block;
    width: 15px;
    height: 15px;
    margin-left: 8px;
    cursor: pointer;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

export const HeaderArea = styled(FlexRowSpaceBCenter)<WrapperProps>`
  position: fixed;
  top: 1.84rem;
  left: 0;
  right: 0;
  height: 50px;
  background: ${theme.colors.BASE_COLOR_DARK};
  padding: 0.75rem 1rem;
  z-index: 99;
  transform: translateY(0);
  transition: all 0.4s ease;
  border-bottom: 1px solid ${theme.colors.BORDER_COLOR};

  ${({ isFrameMin }) =>
    isFrameMin &&
    `
    transform: translateY(-100px);
  `}
`;

export const InfoTitle = styled.h3`
  color: ${theme.colors.TEXT_WHITE_COLOR};
  margin-bottom: 5px;
`;

export const InfoDesc = styled.p`
  color: ${theme.colors.TEXT_DESCRIPTION_COLOR};
`;

export const TextWhite = styled.p`
  color: ${theme.colors.TEXT_WHITE_COLOR}; ;
`;

export const TextPoint = styled.p`
  color: ${theme.colors.POINT_COLOR}; ;
`;

export const InputWrapper = styled.div`
  width: 80%;
`;

export const InputBox = styled.input`
  outline: none;
  text-align: center;
  color: ${theme.colors.TEXT_WHITE_COLOR};
  border: none;
  background-color: transparent;
  border-bottom: 1px solid ${theme.colors.BORDER_COLOR};
  width: 100%;
  padding: 0.5rem 0;
  -webkit-app-region: no-drag;

  &::placeholder {
    text-align: center;
  }
`;

export const SpanWhite = styled.span`
  color: ${theme.colors.TEXT_WHITE_COLOR};
`;

export const SpanPoint = styled.span`
  color: ${theme.colors.POINT_COLOR};
`;

export const SmallPoint = styled.small`
  color: ${theme.colors.POINT_COLOR};
`;

export const Margin = styled.div<MarginProps>`
  ${({ type, size }) =>
    type &&
    size &&
    `
    margin-${type}: ${size}px;
  `}
`;

export const CircleBtnNext = styled.div`
  position: relative;
  width: 40%;
  cursor: pointer;
  -webkit-app-region: no-drag;

  & > img {
    width: 100%;
    object-fit: contain;
    transition: opacity 0.5s ease;
  }

  & > p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${theme.colors.TEXT_WHITE_COLOR};
    font-weight: bold;
    font-size: 1rem;
  }

  &:hover {
    & > img {
      opacity: 0.65;
    }
  }
`;

export const GoBackBtn = styled.div`
  width: 30px;
  height: 30px;
  background-image: url('images/ic_back_w.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  cursor: pointer;
  -webkit-app-region: no-drag;
`;

export const SettingBtn = styled.div`
  width: 30px;
  height: 30px;
  background-image: url('images/ic_setting_w.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  cursor: pointer;
  -webkit-app-region: no-drag;
`;

export const MoreBtn = styled.div`
  font-weight: bold;
  color: ${theme.colors.TEXT_WHITE_COLOR};
  padding: 0.25rem 1.25rem;
  background-color: ${theme.colors.POINT_COLOR};
  border-radius: 12px;

  & p {
    margin-top: -2px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.BORDER_COLOR};
`;

export const VerticalLine = styled.div<VerticalLineProps>`
  width: 1px;
  height: ${({ height }) => height && `${height}px`};
  background-color: ${theme.colors.BORDER_COLOR};
`;

export const Tab = styled(FlexColumnCenterCenter)<TabProps>`
  flex: 1;
  font-size: 1.05rem;
  cursor: pointer;

  & > p {
    color: ${({ active }) =>
      active ? theme.colors.POINT_COLOR : theme.colors.BORDER_COLOR};
    padding-bottom: 10px;
  }
`;

export const TabActiveBar = styled.div<TabProps>`
  width: 50%;
  height: 2px;
  background-color: ${({ active }) =>
    active ? theme.colors.POINT_COLOR : 'transparent'};
`;

export const LoadingWrap = styled(FlexColumnCenterCenter)<LoadingWrapProp>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ isTransparent }) =>
    isTransparent ? 'transparent' : theme.colors.BASE_COLOR_DARK};

  & > img {
    width: 80px;
    height: 80px;
    object-fit: cover;

    animation-name: loadingAnime;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;

    @keyframes loadingAnime {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-50%);
      }
      100% {
        transform: translateY(0);
      }
    }
  }

  ${({ isTransparent }) =>
    isTransparent
      ? `
      background-color: rgba('0,0,0,0.1');    
    `
      : `
    background-color: ${theme.colors.BASE_COLOR_DARK};
    `}
`;

export const Button = styled.div<ButtonProps>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  font-weight: bold;
  text-align: center;
  line-height: 1rem;
  color: ${({ type }) =>
    type === 'line'
      ? theme.colors.POINT_COLOR
      : type === 'grayLine'
      ? theme.colors.TEXT_DESCRIPTION_COLOR
      : '#fff'};
  background: ${({ type }) =>
    type === 'full'
      ? theme.colors.POINT_COLOR
      : type === 'line' || type === 'grayLine'
      ? 'transparent'
      : theme.colors.TEXT_INPUT_COLOR};
  border: none;
  margin: 0;
  padding: 0.85rem 1.2rem;
  border-radius: 7px;
  cursor: pointer;
  -webkit-app-region: no-drag;

  ${({ type }) =>
    type === 'line' &&
    `
    border: 1px solid ${theme.colors.POINT_COLOR};
  `}

  ${({ type }) =>
    type === 'grayLine' &&
    `
    border: 1px solid ${theme.colors.BORDER_COLOR};
  `}
`;
