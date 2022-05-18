import styled from 'styled-components';
import { FlexCenterCenter } from './Common.Styled';
import { theme } from './Theme';

export const SplashContainer = styled(FlexCenterCenter)`
  height: 100vh;
  background-color: ${theme.colors.BASE_COLOR_DARK};

  & > img {
    width: 30%;
    height: auto;
    object-fit: contain;
  }
`;
