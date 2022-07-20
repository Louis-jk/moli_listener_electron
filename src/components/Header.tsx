import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import QueryString from 'qs';
import {
  Divider,
  GoBackBtn,
  HeaderArea,
  SettingBtn,
  WindowControl,
  Wrapper,
  HeaderContainer,
} from '../styles/Common.Styled';
import appRuntime from '../appRuntime';
import { toggle } from '../store/frameControlReducer';
import { RootState } from '../store';
import { HeaderProps } from '../interfaces/components.interface';

const Header: React.FC<HeaderProps> = ({ type, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mt_idx } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.locale);
  const { isMin } = useSelector((state: RootState) => state.frame);

  const goBackHandler = () => {
    navigate(-1);

    if (type === 'session') {
      const params = {
        set_lang: locale,
        mt_idx,
      };

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_page_out.php`,
        data: QueryString.stringify(params),
      })
        .then((res: any) => console.log('session page out Res', res))
        .catch((err: any) => console.error('session page out error ::', err));
    }
  };

  const winMin = () => {
    // console.log('윈도우 최소화');
    appRuntime.send('windowMinimize', null);
  };
  const frameWide = () => {
    // console.log('프레임 와이드');
    appRuntime.send('frameWide', null);

    dispatch(toggle(false));
  };
  const frameMin = () => {
    // console.log('프레임 최소화');
    appRuntime.send('frameMin', null);

    dispatch(toggle(true));
  };

  const winClose = () => {
    console.log('윈도우 닫기');
    appRuntime.send('windowClose', null);
  };

  const goSettings = () => {
    navigate('/settings');
  };

  // web 실행시 주석 필요
  // appRuntime.on('isFrameWide', (event: any, data: boolean) => {
  //   if (isMin) {
  //     dispatch(toggle(false));
  //   } else {
  //     return false;
  //   }
  // });

  // appRuntime.on('isFrameMin', (event: any, data: boolean) => {
  //   if (!isMin) {
  //     dispatch(toggle(true));
  //   } else {
  //     return false;
  //   }
  // });

  // console.log('====================================');
  // console.log('isFrameMin', isFrameMin);
  // console.log('isFrameWide', isFrameWide);
  console.log('====================================');
  console.log('HEADE isMin', isMin);

  return (
    <HeaderContainer>
      <WindowControl>
        <div onClick={winMin} className='control'>
          <img src='images/win_min.png' alt='최소화' title='최소화' />
        </div>
        {type === 'session_active' && isMin && (
          <div onClick={frameWide} className='control'>
            <img src='images/wide.png' alt='풀화면' title='풀화면' />
          </div>
        )}
        {type === 'session_active' && !isMin && (
          <div onClick={frameMin} className='control'>
            <img src='images/minimize.png' alt='작은화면' title='작은화면' />
          </div>
        )}
        <div onClick={winClose} className='control'>
          <img src='images/close.png' alt='창닫기' title='창닫기' />
        </div>
      </WindowControl>

      {type !== 'not' && (
        <HeaderArea isFrameMin={isMin}>
          {type !== 'code' ? (
            <GoBackBtn onClick={goBackHandler} />
          ) : (
            <div style={{ width: 30 }} />
          )}
          <h3>{title}</h3>
          {type !== 'session' &&
          type !== 'session_active' &&
          type !== 'general' ? (
            <SettingBtn onClick={goSettings} />
          ) : (
            <div style={{ width: 30 }} />
          )}
        </HeaderArea>
      )}

      <Divider />
    </HeaderContainer>
  );
};

export default Header;
