import React from 'react';
import { LoadingWrap } from '../styles/Common.Styled';

const Loading = () => {
  return (
    <LoadingWrap>
      <img src='/assets/images/login_img.png' />
      <p>로딩중...</p>
    </LoadingWrap>
  );
};

export default Loading;
