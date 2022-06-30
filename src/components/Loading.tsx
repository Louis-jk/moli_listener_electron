import React from 'react';
import { LoadingWrap } from '../styles/Common.Styled';

interface LoadingWrapProp {
  isTransparent: boolean;
}

const Loading: React.FC<LoadingWrapProp> = ({ isTransparent }) => {
  return (
    <LoadingWrap isTransparent={isTransparent}>
      <img src='images/login_img.png' />
      {/* <p>로딩중...</p> */}
    </LoadingWrap>
  );
};

export default Loading;
