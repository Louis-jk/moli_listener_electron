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
import { SnsLoginButton } from '../../styles/Login.Styled';
import { useEffect } from 'react';
import appRuntime from '../../appRuntime';
import axios, { AxiosError, AxiosResponse } from 'axios';

type LoginButtonType = 'login' | 'register';
type SNSLoginType = 'kakao' | 'naver' | 'google' | 'facebook';

const REDIRECT_URI = 'http://localhost:3000/auth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID_REST}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const Login = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { Kakao } = window;

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

  console.log('====================================');
  console.log(
    'process.env.REACT_APP_KAKAO_CLIENT_ID_JS ',
    process.env.REACT_APP_KAKAO_CLIENT_ID_JS
  );
  console.log(
    'process.env.REACT_APP_KAKAO_CLIENT_ID_REST ',
    process.env.REACT_APP_KAKAO_CLIENT_ID_REST
  );
  console.log('====================================');

  useEffect(() => {
    kakaoInit();

    return () => kakaoInit();
  }, []);

  const onPressHandler = (type: LoginButtonType) => {
    if (type === 'login') {
      navigate('/emailLogin');
    } else {
      navigate('/terms');
    }
  };

  function loginFormWithKakao() {
    // window.open(`${KAKAO_AUTH_URL}`, '_blank');
    // console.log('KAKAO_AUTH_URL ??', KAKAO_AUTH_URL);
    window.Kakao.Auth.authorize({
      redirectUri: `${REDIRECT_URI}`,
    });

    // window.Kakao.Auth.login({
    //   success(authObj: any) {
    //     console.log('authObj', authObj);
    //     console.log('authObj.access_token', authObj.access_token);
    //     // getKakao(authObj.access_token);
    //   },
    //   fail(err: any) {
    //     console.log('kakao error', err);
    //   },
    // });
  }

  const onSNSLogin = (type: SNSLoginType) => {
    console.log('SNS type ?', type);
    switch (type) {
      case 'kakao':
        appRuntime.send('kakao_login', null);
        // loginFormWithKakao();
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

            <SnsLoginButton>
              <img
                src='images/btn_naver.png'
                alt='Naver login'
                title='Naver login'
              />
            </SnsLoginButton>
            <SnsLoginButton>
              <img
                src='images/btn_google.png'
                alt='Google login'
                title='Google login'
              />
            </SnsLoginButton>
            <SnsLoginButton>
              <img
                src='images/btn_facebook.png'
                alt='Facebook login'
                title='Facebook login'
              />
            </SnsLoginButton>
          </FlexRowSpaceBCenter>
        </FlexColumnCenterCenter>
      </FlexColumnSpaceECenter>
    </Container>
  );
};

export default Login;
