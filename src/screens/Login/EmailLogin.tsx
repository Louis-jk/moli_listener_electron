import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexColumnCenterCenter,
  FlexColumnSpaceECenter,
  FlexColumnStartCenter,
  FlexColumnStartStart,
  InfoTitle,
  Margin,
  SmallPoint,
  TextPoint,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import { LoginInputField, CustomNotify } from '../../styles/Login.Styled';
import { loginUpdate } from '../../store/loginReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function EmailLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);

  const [email, setEmail] = useState<string>('');
  const [emailErr, setEmailErr] = useState<boolean>(false); // 이메일 유효성 검사 에러
  const [emailNullErr, setEmailNullErr] = useState<boolean>(false); // 이메일 null 에러
  const [password, setPassword] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<boolean>(false); // 비밀번호 에러
  const [passwordNullErr, setPasswordNullErr] = useState<boolean>(false); // 비밀번호 null 에러
  const [isErrorMsgVisible, setErrorMsgVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loginHandler = () => {
    if (!email || !password || emailErr || passwordErr) {
      if (!email) {
        setEmailNullErr(true);
        setEmailErr(false);
      }

      if (!password) {
        setPasswordNullErr(true);
        setPasswordErr(false);
      }
    } else {
      const params = {
        set_lang: locale,
        mt_id: email,
        mt_pwd: password,
        app_token: 1,
      };

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/member_login.php`,
        data: QueryString.stringify(params),
      })
        .then((res: AxiosResponse) => {
          console.log('login res', res);
          if (res.data.result === 'false') {
            setErrorMsg(res.data.msg);
            setErrorMsgVisible(true);

            setTimeout(() => {
              setErrorMsgVisible(false);
            }, 2000);
          } else {
            const params = JSON.stringify(res.data.data.data);
            dispatch(loginUpdate(params));
            setErrorMsg(res.data.msg);
            setErrorMsgVisible(true);

            setTimeout(() => {
              setErrorMsgVisible(false);
              navigate('/code');
            }, 1500);
          }
        })
        .catch((err: AxiosError) => {
          console.error('res Error', err);
        });
    }
  };

  // 이메일 체킹
  const emailInsertHandler = (e: HTMLInputElement) => {
    const regx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    if (e.value) {
      setEmailNullErr(false);
    }

    if (regx.test(e.value)) {
      setEmailErr(false);
    } else {
      setEmailErr(true);
    }

    setErrorMsgVisible(false);
    setEmail(e.value);
  };

  // 비밀번호 체킹
  const passwordInsertHandler = (e: HTMLInputElement) => {
    const regx = new RegExp(
      /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/
    );

    if (e.value) {
      setPasswordNullErr(false);
    }

    if (regx.test(e.value)) {
      setPasswordErr(false);
    } else {
      setPasswordErr(true);
    }

    setPassword(e.value);
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'login' })} type='session' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter>
          <InfoTitle>{intl.formatMessage({ id: 'logintit' })}</InfoTitle>
          <p>{intl.formatMessage({ id: 'loginsub' })}</p>
          <Margin type='bottom' size={20} />

          <FlexColumnStartStart style={{ width: '100%' }}>
            <LoginInputField
              type='text'
              value={email}
              placeholder='email@naver.com'
              onChange={(e) => emailInsertHandler(e.target)}
            />
            <Margin type='bottom' size={7} />
            {emailErr && (
              <SmallPoint>{intl.formatMessage({ id: 'emailsub' })}</SmallPoint>
            )}
            {emailNullErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'emailRequire' })}
              </SmallPoint>
            )}
            <Margin type='bottom' size={10} />
            <LoginInputField
              type='password'
              value={password}
              placeholder={intl.formatMessage({ id: 'loginpwplaceholder' })}
              onChange={(e) => passwordInsertHandler(e.target)}
            />
            <Margin type='bottom' size={7} />
            {passwordErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'passwordsub' })}
              </SmallPoint>
            )}
            {passwordNullErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'passwordRequire' })}
              </SmallPoint>
            )}
          </FlexColumnStartStart>

          <Margin type='bottom' size={50} />
          <Button type='full' onClick={loginHandler}>
            {intl.formatMessage({ id: 'login' })}
          </Button>
          <Margin type='bottom' size={10} />
          <Button type='line'>{intl.formatMessage({ id: 'findpw' })}</Button>
        </FlexColumnCenterCenter>
      </Wrapper>

      <CustomNotify visible={isErrorMsgVisible} error={isErrorMsgVisible}>
        <TextWhite>{errorMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
}
