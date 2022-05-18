import styled from 'styled-components';
import { theme } from './Theme';

type MarginType = 'top' | 'right' | 'bottom' | 'left';
interface MarginProps {
  type: MarginType;
  size: number;
}

export const Width100 = styled.div`
  width: 100%;
`;

export const FlexCenterCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexStartCenter = styled.div`
  display: flex;
  justify-content: flex-start;
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

export const FlexRowCenterCenter = styled(FlexCenterCenter)`
  flex-direction: row;
`;

export const FlexRowStartCenter = styled(FlexStartCenter)`
  flex-direction: row;
`;

export const FlexRowSpaceBCenter = styled(FlexSpaceBCenter)`
  flex-direction: row;
`;

export const FlexColumnCenterCenter = styled(FlexCenterCenter)`
  flex-direction: column;
`;

export const FlexColumnSpaceBCenter = styled(FlexSpaceBCenter)`
  flex-direction: column;
`;

export const Container = styled.div`
  height: 100vh;
  padding: 0 1rem;
  background-color: ${theme.colors.BASE_COLOR_DARK};
`;

export const Wrapper = styled.section`
  padding: 0 1rem;
`;

export const InfoTitle = styled.h3`
  color: ${theme.colors.TEXT_WHITE_COLOR};
`;

export const InfoDesc = styled.p`
  color: ${theme.colors.TEXT_DESCRIPTION_COLOR};
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

export const PointText = styled.span`
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
  background-image: url('/assets/images/ic_back_w.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  cursor: pointer;
`;

export const SettingBtn = styled.div`
  width: 30px;
  height: 30px;
  background-image: url('/assets/images/ic_setting_w.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  cursor: pointer;
`;
