import styled from 'styled-components';
import { FlexCenterCenter, FlexRowCenterCenter } from './Common.Styled';
import { theme } from './Theme';

interface LangWrapProps {
  selected: boolean;
}
export const LangWrap = styled(FlexRowCenterCenter)<LangWrapProps>`
  padding: 0.5rem 0;
  cursor: pointer;

  & p {
    margin-right: 10px;
  }

  & img {
    width: 15px;
    height: 15px;
  }

  ${({ selected }) =>
    selected &&
    `
    & p {
      color: ${theme.colors.POINT_COLOR};
    }
  `}
`;

export const GrayLogo = styled.div`
  display: block;
  width: 90px;
  height: 110px;
  margin: 0 auto;
  // background: #fff;
  background-image: url('images/f_logo.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  opacity: 0.3;
`;

interface ModalButtonProps {
  height: number;
}
export const ModalButton = styled(FlexCenterCenter)<ModalButtonProps>`
  flex: 1;
  height: ${({ height }) => height && `${height}px`};
  cursor: pointer;

  & p {
    font-size: 0.8rem;
    line-height: ${({ height }) => height && `${height}px`};
  }
`;

export const SettingArrowImg = styled.div`
  width: 10px;
  height: 12px;
  background-image: url('images/arrow.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;
