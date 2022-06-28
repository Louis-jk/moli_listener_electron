import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import React, { useState } from 'react';
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
  TextPoint,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import { LoginInputField, NotUserAlert } from '../../styles/Login.Styled';
import { loginUpdate } from '../../store/loginReducer';

export default function EmailLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isErrorMsgVisible, setErrorMsgVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loginHandler = () => {
    const params = {
      set_lang: 'ko',
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
      <Header title='로그인' type='detail' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter>
          <InfoTitle>이메일 로그인</InfoTitle>
          <p>가입하신 정보를 입력해 주세요</p>
          <Margin type='bottom' size={20} />

          <FlexColumnStartStart>
            <LoginInputField
              type='text'
              value={email}
              placeholder='email@naver.com'
              onChange={(e) => emailInsertHandler(e.target)}
            />
            <Margin type='bottom' size={7} />
            <TextPoint>* 이메일 형식에 맞지 않습니다.</TextPoint>
            <Margin type='bottom' size={10} />
            <LoginInputField
              type='password'
              value={password}
              placeholder='비밀번호를 입력해주세요'
              onChange={(e) => setPassword(e.target.value)}
            />
            <Margin type='bottom' size={7} />
            <TextPoint>
              * 비밀번호는 특수문자가 포함 된 8~12자리만 가능합니다.
            </TextPoint>
          </FlexColumnStartStart>

          <Margin type='bottom' size={50} />
          <Button type='full' onClick={loginHandler}>
            로그인
          </Button>
          <Margin type='bottom' size={10} />
          <Button type='line'>비밀번호 찾기</Button>
        </FlexColumnCenterCenter>
      </Wrapper>

      <NotUserAlert visible={isErrorMsgVisible}>
        <TextWhite>{errorMsg}</TextWhite>
      </NotUserAlert>
    </Container>
  );
}
