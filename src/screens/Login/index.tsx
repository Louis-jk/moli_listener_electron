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
import { LoginButtonType, SnsType } from '../../types';

// const REDIRECT_URI01 = 'http://localhost:3000/auth/sns/callback';
const REDIRECT_URI01 = 'https://change-all.com/listen_auth_callback';

const Login = () => {
  const { Kakao, Naver } = window;
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const dispatch = useDispatch();

  const [kakaoCode, setKakaoCode] = useState<string>(''); // 카카오 인증 코드
  const [kakaoProfile, setKakaoProfile] = useState<any>(null); // 카카오 프로필

  const [naverCode, setNaverCode] = useState<string>(''); // 네이버 인증 코드

  const [googleCode, setGoogleCode] = useState<string>(''); // 구글 인증 코드

  const [facebookCode, setFacebookCode] = useState<string>(''); // 페이스북 인증 코드

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

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
          const params = data.data.data;
          params['login_type'] = 'sns';
          params['sns_type'] = 'kakao';
          params['access_token'] = token;

          dispatch(loginUpdate(JSON.stringify(params)));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
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

  // 카카오 로그인 액세스 토큰 가져오기
  const getKakaoToken = () => {
    fetch(`https://kauth.kakao.com/oauth/token`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID_REST}&redirect_url=${REDIRECT_URI01}&code=${kakaoCode}`,
    })
      .then((res: Response) => res.json())
      .then((data) => {
        if (data.access_token) {
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
          const params = data.data.data;
          params['login_type'] = 'sns';
          params['sns_type'] = 'google';
          params['access_token'] = token;

          dispatch(loginUpdate(JSON.stringify(params)));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
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
  const getGoogleToken = () => {
    fetch(`https://accounts.google.com/o/oauth2/token`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `code=${googleCode}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&client_secret=${process.env.REACT_APP_GOOGLE_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI01}&grant_type=authorization_code`,
    })
      .then((res: Response) => res.json())
      .then((data) => {
        if (data.access_token) {
          getGoogleProfile(data.access_token);
        } else {
          return;
        }
      })
      .catch((err) => console.error('google Token error:', err));
  };

  // 페이스북 로그인 API (모리)
  const fbLoginAPIHandler = (payload: any, token: string) => {
    const param = {
      set_lang: locale,
      sns_id: payload.id,
      app_token: token,
      mt_email: payload.email,
      mt_name: payload.name,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/SNS_login_facebook.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => res.data)
      .then((data: any) => {
        if (data.result === 'true') {
          const params = data.data.data;
          params['login_type'] = 'sns';
          params['sns_type'] = 'facebook';
          params['access_token'] = token;

          dispatch(loginUpdate(JSON.stringify(params)));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
      })
      .catch((err: AxiosError) =>
        console.error('google Moli login Error:', err)
      );
  };

  // 페이스북 로그인 프로필 가져오기
  const getFbProfile = async (token: string) => {
    try {
      fetch(
        `https://graph.facebook.com/me?fields=id,name,email,gender,first_name,last_name,picture,short_name&access_token=${token}`,
        {
          method: 'get',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res: Response) => res.json())
        .then((data) => {
          fbLoginAPIHandler(data, token);
        })
        .catch((err) => console.error('google profile error : ', err));
    } catch (err: any) {
      console.error('google get Profile error :', err);
    }
  };

  // 페이스북 로그인 액세스 토큰 가져오기
  const getFacebookToken = (code: string) => {
    fetch(
      `https://graph.facebook.com/v2.11/oauth/access_token?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&client_secret=${process.env.REACT_APP_FACEBOOK_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI01}&code=${code}`,
      {
        method: 'get',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          getFbProfile(data.access_token);
        } else {
          return;
        }
      });
  };

  // 네이버 로그인 API (모리)
  const naverLoginAPIHandler = (payload: any, token: string) => {
    const param = {
      set_lang: locale,
      sns_id: payload.id,
      app_token: token,
      mt_email: payload.email,
      mt_name: payload.name,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/SNS_login_naver.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => res.data)
      .then((data: any) => {
        if (data.result === 'true') {
          const params = data.data.data;
          params['login_type'] = 'sns';
          params['sns_type'] = 'naver';
          params['access_token'] = token;

          dispatch(loginUpdate(JSON.stringify(params)));

          setError(false);
          setNotifyMsg(intl.formatMessage({ id: 'loginSuccess' }));
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 1000);
        }
      })
      .catch((err: AxiosError) =>
        console.error('naver Moli login Error:', err)
      );
  };

  // 네이버 로그인 프로필 API 호출하기
  const getNaverProfile = (token: string) => {
    fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'success') {
          naverLoginAPIHandler(data.response, token);
        }
      })
      .catch((err: any) => console.error('naver get Profile Error', err));
  };

  // 네이버 로그인 액세스 토큰 가져오기
  const getNaverToken = () => {
    fetch(`https://nid.naver.com/oauth2.0/token`, {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&client_secret=${process.env.REACT_APP_NAVER_CLIENT_SECRET}&redirect_url=${REDIRECT_URI01}&code=${naverCode}`,
    })
      .then((res: Response) => res.json())
      .then((data) => {
        if (data.access_token) {
          getNaverProfile(data.access_token);
        } else {
          return;
        }
      });
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
    if (naverCode) {
      getNaverToken();
      return () => getNaverToken();
    }
  }, [naverCode]);

  // 구글 로그인 시도 시 인증코드 받아오면 실행
  useEffect(() => {
    if (googleCode) {
      getGoogleToken();
      return () => getGoogleToken();
    }
  }, [googleCode]);

  // 페이스북 로그인 시도 시 인증코드 받아오면 실행
  useEffect(() => {
    if (facebookCode) {
      getFacebookToken(facebookCode);
      return () => getFacebookToken(facebookCode);
    }
  }, [facebookCode]);

  // web 실행시 주석 필요
  // 카카오 로그인 시도시 인증 코드 main(electron)에서 수신
  appRuntime.on('kakaoLoginCode', (evnet: any, data: string) => {
    setKakaoCode(data);
  });

  // 네이버 로그인 시도시 인증 토큰 main(electron)에서 수신
  appRuntime.on('naverLoginCode', (evnet: any, data: string) => {
    setNaverCode(data);
  });

  // 구글 로그인 시도시 인증 코드 main(electron)에서 수신
  appRuntime.on('googleLoginCode', (evnet: any, data: string) => {
    setGoogleCode(data);
  });

  // 페이스북 로그인 시도시 인증 코드 main(electron)에서 수신
  appRuntime.on('fbLoginCode', (evnet: any, data: string) => {
    setFacebookCode(data);
  });

  const onSNSLogin = (type: SnsType) => {
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
