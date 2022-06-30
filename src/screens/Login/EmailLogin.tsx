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
  const [password, setPassword] = useState<string>('');
  const [isErrorMsgVisible, setErrorMsgVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loginHandler = () => {
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
        } else {
          const params = JSON.stringify(res.data.data.data);
          dispatch(loginUpdate(params));
          navigate('/code');
          setErrorMsgVisible(false);
        }
      })
      .catch((err: AxiosError) => {
        console.error('res Error', err);
      });
  };

  const emailInsertHandler = (e: HTMLInputElement) => {
    setErrorMsgVisible(false);
    setEmail(e.value);
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
            <SmallPoint>{intl.formatMessage({ id: 'emailsub' })}</SmallPoint>
            <Margin type='bottom' size={10} />
            <LoginInputField
              type='password'
              value={password}
              placeholder={intl.formatMessage({ id: 'loginpwplaceholder' })}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Margin type='bottom' size={7} />
            <SmallPoint>{intl.formatMessage({ id: 'passwordsub' })}</SmallPoint>
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
