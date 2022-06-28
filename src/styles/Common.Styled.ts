import styled from 'styled-components';
import { theme } from './Theme';

type MarginType = 'top' | 'right' | 'bottom' | 'left';
interface MarginProps {
  type: MarginType;
  size: number;
}

type ButtonType = 'full' | 'line';
interface ButtonProps {
  type: ButtonType;
}

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
`;

interface WrapperProps {
  isFrameMin?: boolean;
}
export const Wrapper = styled.section<WrapperProps>`
  padding: 5.2rem 1rem 3rem;
  transform: translateY(0);
  transition: all 0.4s ease;

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
  -webkit-app-region: drag;
  cursor: pointer;
  background: #111;
  z-index: 100;

  & > div {
    -webkit-app-region: no-drag;
    display: block;
    width: 20px;
    height: 20px;
    margin-left: 8px;
    cursor: pointer;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

interface WrapperProps {
  isFrameMin?: boolean;
}
export const HeaderArea = styled(FlexRowSpaceBCenter)<WrapperProps>`
  position: fixed;
  top: 1.85rem;
  left: 0;
  right: 0;
  height: 50px;
  background: #222;
  padding: 0.75rem 1rem;
  z-index: 99;
  transform: translateY(0);
  transition: all 0.4s ease;

  ${({ isFrameMin }) =>
    isFrameMin &&
    `
    transform: translateY(-100px);
  `}
`;

export const InfoTitle = styled.h3`
  color: ${theme.colors.TEXT_WHITE_COLOR};
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
`;

export const SettingBtn = styled.div`
  width: 30px;
  height: 30px;
  background-image: url('images/ic_setting_w.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  cursor: pointer;
`;

export const MoreBtn = styled.div`
  font-weight: bold;
  color: ${theme.colors.TEXT_WHITE_COLOR};
  padding: 0.25rem 1.25rem;
  background-color: ${theme.colors.POINT_COLOR};
  border-radius: 12px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.TEXT_DESCRIPTION_COLOR}2a;
`;

interface TabProps {
  active: boolean;
}
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

export const LoadingWrap = styled(FlexColumnCenterCenter)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${theme.colors.BASE_COLOR_DARK};

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
`;

export const Button = styled.div<ButtonProps>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  font-weight: bold;
  text-align: center;
  color: ${({ type }) => (type === 'line' ? theme.colors.POINT_COLOR : '#fff')};
  background: ${({ type }) =>
    type === 'full' ? theme.colors.POINT_COLOR : 'transparent'};
  border: none;
  margin: 0;
  padding: 0.85rem 1.2rem;
  border-radius: 7px;
  cursor: pointer;

  ${({ type }) =>
    type === 'line' &&
    `
    border: 1px solid ${theme.colors.POINT_COLOR};
  `}
`;
