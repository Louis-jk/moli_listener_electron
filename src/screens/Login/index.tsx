import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexColumnCenterCenter,
  FlexColumnSpaceBCenter,
  FlexColumnSpaceECenter,
  FlexRowCenterCenter,
  FlexRowSpaceBCenter,
  Margin,
  TextWhite,
} from '../../styles/Common.Styled';
import { CustomNotify, SnsLoginButton } from '../../styles/Login.Styled';
import { useEffect } from 'react';
import appRuntime from '../../appRuntime';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import QueryString from 'qs';
import { useDispatch } from 'react-redux';
import { loginUpdate } from '../../store/loginReducer';

type LoginButtonType = 'login' | 'register';
type SNSLoginType = 'kakao' | 'naver' | 'google' | 'facebook';

const REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';
const REDIRECT_URI02 = 'http://localhost:3000/auth/sns/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID_REST}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const Login = () => {
  const { Kakao, Naver } = window;
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const dispatch = useDispatch();

  const [kakaoCode, setKakaoCode] = useState<string>(''); // 카카오 인증 코드
  const [kakaoProfile, setKakaoProfile] = useState<any>(null); // 카카오 프로필

  const [naverToken, setNaverToken] = useState<string>(''); // 네이버 인증 토큰

  const [googleCode, setGoogleCode] = useState<string>(''); // 구글 인증 코드

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

  const kakaoInit = () => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    document.head.appendChild(kakaoScript);

    // Kakao sdk 스크립트 완료시
    kakaoScript.onload = () => {
      window.Kakao.init(process.env.REACT_APP_KAKAO_CLIENT_ID_JS);
      // console.log('kakao init', window.Kakao.isInitialized());
    };
  };

  const naverInit = () => {
    const naverScript = document.createElement('script');
    naverScript.src =
      'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
    document.head.appendChild(naverScript);

    const naverScript02 = document.createElement('script');
    naverScript02.src =
      'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
    document.head.appendChild(naverScript02);
  };

  useEffect(() => {
    kakaoInit();
    naverInit();

    return () => {
      kakaoInit();
      naverInit();
    };
  }, []);

  const onPressHandler = (type: LoginButtonType) => {
    if (type === 'login') {
      navigate('/emailLogin');
    } else {
      navigate('/terms');
    }
  };

  // 카카오 로그인 API (모리)
  const kakaoLoginAPIHandler = (payload: any, token: string) => {
    const param = {
      set_lang: locale,
      sns_id: payload.id,
      app_token: token,
      mt_email: payload.kakao_account.email,
      mt_name: payload.kakao_account.profile.nickname,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/SNS_login_kakao.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => res.data)
      .then((data: any) => {
        if (data.result === 'true') {
          const params = JSON.stringify(data.data.data);
          dispatch(loginUpdate(params));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
        console.log('kakao moli login data ::', data);
      })
      .catch((err: AxiosError) =>
        console.error('kakao Moli login Error:', err)
      );
  };

  // 카카오 로그인 프로필 가져오기
  const getKakaoProfile = async (kakaoToken: string) => {
    try {
      fetch(`https://kapi.kakao.com/v2/user/me`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${kakaoToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
        .then((res: Response) => res.json())
        .then((data) => kakaoLoginAPIHandler(data, kakaoToken))
        .catch((err) => console.error('kakao profile error : ', err));
    } catch (err: any) {
      console.error('kakao get Profile error :', err);
    }
  };

  // console.log('kakaoProfile ?', kakaoProfile);

  // 카카오 로그인 액세스 토큰 가져오기
  const getKakaoToken = () => {
    fetch(`https://kauth.kakao.com/oauth/token`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID_REST}&redirect_url=${REDIRECT_URI}&code=${kakaoCode}`,
    })
      .then((res: Response) => res.json())
      .then((data) => {
        if (data.access_token) {
          console.log('kakao accessToken ::', data.access_token);
          getKakaoProfile(data.access_token);
        } else {
          return;
        }
      });
  };

  // 구글 로그인 API (모리)
  const googleLoginAPIHandler = (payload: any, token: string) => {
    const param = {
      set_lang: locale,
      sns_id: payload.id,
      app_token: token,
      mt_email: payload.email,
      mt_name: payload.name,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/SNS_login_google.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => res.data)
      .then((data: any) => {
        if (data.result === 'true') {
          const params = JSON.stringify(data.data.data);
          dispatch(loginUpdate(params));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
        console.log('google moli login data ::', data);
      })
      .catch((err: AxiosError) =>
        console.error('google Moli login Error:', err)
      );
  };

  // 구글 로그인 프로필 가져오기
  const getGoogleProfile = async (token: string) => {
    try {
      fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res: Response) => res.json())
        .then((data) => googleLoginAPIHandler(data, token))
        .catch((err) => console.error('google profile error : ', err));
    } catch (err: any) {
      console.error('google get Profile error :', err);
    }
  };

  // 구글 로그인 액세스 토큰 가져오기
  const getGoogleToken = (code: string) => {
    fetch(`https://accounts.google.com/o/oauth2/token`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `code=${code}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&client_secret=${process.env.REACT_APP_GOOGLE_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI02}&grant_type=authorization_code`,
    })
      .then((res: Response) => res.json())
      .then((data) => {
        console.log('google get token api res :: ', data);
        if (data.access_token) {
          console.log('google accessToken ::', data.access_token);
          getGoogleProfile(data.access_token);
        } else {
          return;
        }
      });
  };

  // 네이버 로그인 프로필 API 호출하기
  const getNaverProfile = (token: string) => {
    console.log('Naver Get Profile before Current Token ::', token);

    fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => res.json())
      .then((data) => console.log('naver profile data ::', data))
      .catch((err: any) => console.error('naver get Profile Error', err));
  };

  // 카카오 로그인 시도 시 인증코드 받아오면 실행
  useEffect(() => {
    if (kakaoCode) {
      getKakaoToken();
      return () => getKakaoToken();
    }
  }, [kakaoCode]);

  // 네이버 로그인 시도 시 토큰 받아오면 실행
  useEffect(() => {
    if (naverToken) {
      getNaverProfile(naverToken);
      return () => getNaverProfile(naverToken);
    }
  }, [naverToken]);

  // 구글 로그인 시도 시 인증코드 받아오면 실행
  useEffect(() => {
    if (googleCode) {
      getGoogleToken(googleCode);
      return () => getGoogleToken(googleCode);
    }
  }, [googleCode]);

  // web 실행시 주석 필요
  // 카카오 로그인 시도시 인증 코드 main(electron)에서 수신
  appRuntime.on('kakaoLoginCode', (evnet: any, data: string) => {
    // console.log('kakaoLoginCode data get ::', data);
    setKakaoCode(data);
  });

  // 네이버 로그인 시도시 인증 토큰 main(electron)에서 수신
  appRuntime.on('naverLoginToken', (evnet: any, data: string) => {
    // console.log('kakaoLoginCode data get ::', data);
    setNaverToken(data);
  });

  // 구글 로그인 시도시 인증 코드 main(electron)에서 수신
  appRuntime.on('googleLoginCode', (evnet: any, data: string) => {
    // console.log('googleLoginCode data get ::', data);
    setGoogleCode(data);
  });

  // console.log('Login Index kakaoCode', kakaoCode);
  // console.log('Login Index naverToken :: ', naverToken);
  console.log('Login Index googleCode :: ', googleCode);

  const onSNSLogin = (type: SNSLoginType) => {
    console.log('SNS type ?', type);
    switch (type) {
      case 'kakao':
        appRuntime.send('kakaoLogin', null);
        break;
      case 'naver':
        appRuntime.send('naverLogin', null);
        break;
      case 'google':
        appRuntime.send('googleLogin', null);
        break;
      case 'facebook':
        appRuntime.send('fbLogin', null);
        break;
      default:
        return;
    }
  };

  return (
    <Container>
      <Header title='' type='not' />
      <FlexColumnSpaceECenter style={{ height: '100%' }}>
        <FlexColumnCenterCenter style={{ width: '90%' }}>
          <img
            src='images/login_img.png'
            alt='MOLI 로고'
            title='MOLI 로고'
            style={{ width: '13vh' }}
          />
          <Margin type='bottom' size={80} />

          <Button type='full' onClick={() => onPressHandler('login')}>
            {intl.formatMessage({ id: 'emailLogin' })}
          </Button>
          <Margin type='bottom' size={10} />
          <Button type='line' onClick={() => onPressHandler('register')}>
            {intl.formatMessage({ id: 'emailSign' })}
          </Button>
        </FlexColumnCenterCenter>

        <FlexColumnCenterCenter style={{ width: '100%' }}>
          <TextWhite style={{ marginBottom: 5 }}>
            <strong>{intl.formatMessage({ id: 'snsLogintxt' })}</strong>
          </TextWhite>
          <p>{intl.formatMessage({ id: 'snsLoginDes' })}</p>
          <Margin type='bottom' size={30} />
          <FlexRowSpaceBCenter style={{ width: '70%' }}>
            <SnsLoginButton onClick={() => onSNSLogin('kakao')}>
              <img
                src='images/btn_kakao.png'
                alt='Kakao Login'
                title='Kakao Login'
              />
            </SnsLoginButton>

            <SnsLoginButton onClick={() => onSNSLogin('naver')}>
              <img
                src='images/btn_naver.png'
                alt='Naver login'
                title='Naver login'
              />
            </SnsLoginButton>
            <SnsLoginButton onClick={() => onSNSLogin('google')}>
              <img
                src='images/btn_google.png'
                alt='Google login'
                title='Google login'
              />
            </SnsLoginButton>
            <SnsLoginButton onClick={() => onSNSLogin('facebook')}>
              <img
                src='images/btn_facebook.png'
                alt='Facebook login'
                title='Facebook login'
              />
            </SnsLoginButton>
          </FlexRowSpaceBCenter>
        </FlexColumnCenterCenter>
      </FlexColumnSpaceECenter>

      <CustomNotify visible={isNotifyMsgVisible} error={isError}>
        <TextWhite>{notifyMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default Login;
