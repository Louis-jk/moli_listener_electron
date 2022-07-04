import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Divider,
  GoBackBtn,
  HeaderArea,
  SettingBtn,
  WindowControl,
  Wrapper,
} from '../styles/Common.Styled';
import appRuntime from '../appRuntime';
import { toggle } from '../store/frameControlReducer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import QueryString from 'qs';

type HeaderType =
  | 'main'
  | 'detail'
  | 'session'
  | 'session_active'
  | 'not'
  | 'code'
  | 'general';
interface Props {
  type: HeaderType;
  title: string | JSX.Element[] | JSX.Element;
}
const Header: React.FC<Props> = ({ type, title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mt_idx } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.locale);

  const [isFrameMin, setFrameMin] = useState<boolean>(false);
  const [isFrameWide, setFrameWide] = useState<boolean>(true);
  const [isFrameMinClient, setFrameMinClient] = useState<boolean>(false);
  const [isFrameWideClient, setFrameWideClient] = useState<boolean>(true);

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

  // web 실행시 주석 필요
  appRuntime.on('isFrameWide', (event: any, data: boolean) => {
    console.log('GET isFrameWide event ::', event);
    console.log('GET isFrameWide data ::', data);
    setFrameWide(data);
  });

  appRuntime.on('isFrameMin', (event: any, data: boolean) => {
    console.log('GET isFrameMin event ::', event);
    console.log('GET isFrameMin data ::', data);
    setFrameMin(data);
  });

  const winMin = () => {
    console.log('윈도우 최소화');
    appRuntime.send('windowMinimize', null);
  };
  const frameWide = () => {
    console.log('프레임 와이드');
    appRuntime.send('frameWide', null);
    setFrameWideClient(true);
    setFrameMinClient(false);

    dispatch(toggle(false));
  };
  const frameMin = () => {
    console.log('프레임 최소화');
    appRuntime.send('frameMin', null);
    setFrameMinClient(true);
    setFrameWideClient(false);

    dispatch(toggle(true));
  };
  const winClose = () => {
    console.log('윈도우 닫기');
    appRuntime.send('windowClose', null);
  };

  const goSettings = () => {
    navigate('/settings');
  };

  // console.log('====================================');
  // console.log('isFrameMin', isFrameMin);
  // console.log('isFrameWide', isFrameWide);
  // console.log('====================================');

  return (
    <header>
      <WindowControl>
        <div onClick={winMin}>
          <img src='images/win_min.png' alt='최소화' title='최소화' />
        </div>
        {type === 'session_active' && isFrameMin && (
          <div onClick={frameWide}>
            <img src='images/wide.png' alt='풀화면' title='풀화면' />
          </div>
        )}
        {type === 'session_active' && isFrameWide && (
          <div onClick={frameMin}>
            <img src='images/minimize.png' alt='작은화면' title='작은화면' />
          </div>
        )}
        <div onClick={winClose}>
          <img src='images/close.png' alt='창닫기' title='창닫기' />
        </div>
      </WindowControl>

      {type !== 'not' && (
        <HeaderArea isFrameMin={isFrameMinClient}>
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
    </header>
  );
};

export default Header;
