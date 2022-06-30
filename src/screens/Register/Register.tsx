import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexColumnCenterCenter,
  FlexColumnStartStart,
  FlexRowSpaceBCenter,
  InfoTitle,
  Margin,
  SmallPoint,
  TextPoint,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import {
  TermsCheckBox,
  TermsInnerWrap,
  TermsWrap,
} from '../../styles/Register.Styled';
import { CustomNotify, LoginInputField } from '../../styles/Login.Styled';
import { useDispatch } from 'react-redux';
import { registerUpdate } from '../../store/registerReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const { locale } = useSelector((state: RootState) => state.locale);

  const [email, setEmail] = useState<string>(''); // 이메일
  const [emailErr, setEmailErr] = useState<boolean>(false); // 이메일 유효성 검사 에러
  const [emailNullErr, setEmailNullErr] = useState<boolean>(false); // 이메일 null 에러

  const [name, setName] = useState<string>(''); // 이름
  const [nameErr, setNameErr] = useState<boolean>(false); // 이름 에러
  const [nameNullErr, setNameNullErr] = useState<boolean>(false); // 이름 null 에러

  const [password, setPassword] = useState<string>(''); // 비밀번호
  const [passwordErr, setPasswordErr] = useState<boolean>(false); // 비밀번호 에러
  const [passwordNullErr, setPasswordNullErr] = useState<boolean>(false); // 비밀번호 null 에러

  const [passwordRe, setPasswordRe] = useState<string>(''); // 비밀번호 확인
  const [passwordReErr, setPasswordReErr] = useState<boolean>(false); // 비밀번호 확인 에러
  const [passwordReNullErr, setPasswordReNullErr] = useState<boolean>(false); // 비밀번호 확인 null 에러

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

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

    setEmail(e.value);
  };

  // 이름 체킹
  const nameInsertHandler = (e: HTMLInputElement) => {
    const regx = new RegExp(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);

    if (e.value) {
      setNameNullErr(false);
    }

    if (regx.test(e.value)) {
      setNameErr(false);
    } else {
      setNameErr(true);
    }

    setName(e.value);
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

  // 비밀번호 확인 체킹
  const passwordReInsertHandler = (e: HTMLInputElement) => {
    if (e.value) {
      setPasswordReNullErr(false);
    }

    if (e.value !== password) {
      setPasswordReErr(true);
    } else {
      setPasswordReErr(false);
    }

    setPasswordRe(e.value);
  };

  // 일반회원가입 가능 체크
  const checkRegisterAPI = () => {
    const param = {
      set_lang: locale,
      mt_id: email,
      mt_name: name,
      mt_pwd: password,
      mt_pwd_re: passwordRe,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/member_join_check.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('check res', res);
        if (res.data.result === 'true') {
          const updateData = JSON.stringify(param);
          dispatch(registerUpdate(updateData));
          navigate('/registerCode');
          console.log('success');
        } else {
          setError(true);
          setNotifyMsg(res.data.msg);
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
          }, 2000);
        }
      })
      .catch((err: AxiosError) => {
        console.error('res Error', err);
      });
  };

  // 회원가입 확인(전송)
  const signInHandler = () => {
    if (
      !email ||
      emailErr ||
      !name ||
      nameErr ||
      !password ||
      passwordErr ||
      !passwordRe ||
      passwordReErr
    ) {
      if (!email) {
        setEmailNullErr(true);
        setEmailErr(false);
      }

      if (!name) {
        setNameNullErr(true);
        setNameErr(false);
      }

      if (!password) {
        setPasswordNullErr(true);
        setPasswordErr(false);
      }

      if (!passwordRe) {
        setPasswordReNullErr(true);
        setPasswordReErr(false);
      }
    } else {
      if (password !== passwordRe) {
        setPasswordReErr(true);
      } else {
        console.log('user email', email);
        console.log('user name', name);
        console.log('user pwd', password);
        checkRegisterAPI();
      }
    }
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'signup' })} type='general' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter>
          <InfoTitle>{intl.formatMessage({ id: 'signuptit' })}</InfoTitle>
          <p>{intl.formatMessage({ id: 'signupsub' })}</p>
          <Margin type='bottom' size={20} />
          <FlexColumnStartStart style={{ width: '100%' }}>
            {/* 이메일 입력 */}
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
            {/* // 이메일 입력 */}

            {/* 이름 입력 */}
            <LoginInputField
              type='text'
              value={name}
              placeholder={intl.formatMessage({ id: 'nameplaceholder' })}
              onChange={(e) => nameInsertHandler(e.target)}
            />
            <Margin type='bottom' size={7} />
            {nameErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'nameValidate' })}
              </SmallPoint>
            )}
            {nameNullErr && (
              <SmallPoint>{intl.formatMessage({ id: 'namesub' })}</SmallPoint>
            )}
            <Margin type='bottom' size={10} />
            {/* // 이름 입력 */}

            {/* 비밀번호 입력 */}
            <LoginInputField
              type='password'
              value={password}
              placeholder={intl.formatMessage({ id: 'passwordplaceholder' })}
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
            <Margin type='bottom' size={10} />
            {/* // 비밀번호 입력 */}

            {/* 비밀번호 확인 */}
            <LoginInputField
              type='password'
              value={passwordRe}
              placeholder={intl.formatMessage({
                id: 'passwordcheckplaceholder',
              })}
              onChange={(e) => passwordReInsertHandler(e.target)}
            />
            <Margin type='bottom' size={7} />
            {passwordReErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'passwordchecksub' })}
              </SmallPoint>
            )}
            {passwordReNullErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'passwordReRequire' })}
              </SmallPoint>
            )}
            <Margin type='bottom' size={10} />
            {/* // 비밀번호 확인 */}
          </FlexColumnStartStart>
        </FlexColumnCenterCenter>
        <Margin type='top' size={50} />
        <Button type='full' onClick={signInHandler}>
          {intl.formatMessage({ id: 'signup' })}
        </Button>
      </Wrapper>

      <CustomNotify visible={isNotifyMsgVisible} error={isError}>
        <TextWhite>{notifyMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default Register;
