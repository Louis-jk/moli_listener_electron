import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  FlexRowCenterCenter,
  FlexRowSpaceBCenter,
  InfoTitle,
  Margin,
  SmallPoint,
  TextPoint,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import {
  CodeInput,
  CodeInputWrap,
  TermsCheckBox,
  TermsInnerWrap,
  TermsWrap,
} from '../../styles/Register.Styled';
import { LoginInputField, CustomNotify } from '../../styles/Login.Styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { loginUpdate } from '../../store/loginReducer';

const RegisterCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const { set_lang, mt_id, mt_name, mt_pwd } = useSelector(
    (state: RootState) => state.register
  );

  // console.log('regi mt_id', mt_id);

  const [code01, setCode01] = useState<string>('');
  const [code02, setCode02] = useState<string>('');
  const [code03, setCode03] = useState<string>('');
  const [code04, setCode04] = useState<string>('');

  const code01Ref = useRef(null);
  const code02Ref = useRef(null);
  const code03Ref = useRef(null);
  const code04Ref = useRef(null);

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

  const sendEmailCertifyAPI = () => {
    const param = {
      set_lang,
      mt_id,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/email_certi_send.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('email certi res ::', res);
        if (res.data.data === 'success') {
          setError(false);
          // setNotifyMsg(res.data.msg);
          setNotifyMsg(res.data.msg);
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
          }, 2000);
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

  useEffect(() => {
    if (set_lang && mt_id) {
      sendEmailCertifyAPI();
    }
  }, []);

  // 첫번째 코드 핸들러
  const code01InsertHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const onlyNumber = value.replace(/[^0-9]{1}$/g, '');
    const toStr = onlyNumber.toString();
    console.log('toStr', toStr);
    setCode01(toStr);
  };

  // 두번째 코드 핸들러
  const code02InsertHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const onlyNumber = value.replace(/[^0-9]{1}$/g, '');
    const toStr = onlyNumber.toString();
    console.log('toStr', toStr);
    setCode02(toStr);
  };

  // 세번째 코드 핸들러
  const code03InsertHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const onlyNumber = value.replace(/[^0-9]{1}$/g, '');
    const toStr = onlyNumber.toString();
    console.log('toStr', toStr);
    setCode03(toStr);
  };

  // 네번째 코드 핸들러
  const code04InsertHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const onlyNumber = value.replace(/[^0-9]{1}$/g, '');
    const toStr = onlyNumber.toString();
    console.log('toStr', toStr);
    setCode04(toStr);
  };

  // 로그인 처리
  const loginHandler = () => {
    const params = {
      set_lang,
      mt_id,
      mt_pwd,
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
          setError(true);
          setNotifyMsg(res.data.msg);
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
          }, 2000);
        } else {
          const params = JSON.stringify(res.data.data.data);
          dispatch(loginUpdate(params));

          setError(false);
          setNotifyMsg(res.data.msg);
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            navigate('/code');
          }, 2000);
        }
      })
      .catch((err: AxiosError) => {
        console.error('res Error', err);
      });
  };

  // 일반 회원가입
  const memberJoinAPI = () => {
    const param = {
      set_lang,
      mt_id,
      mt_name,
      mt_pwd,
      email_certi: 'Y',
      app_token: 1,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/member_join.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('email certi res ::', res);
        if (res.data.result === 'true') {
          setError(false);
          setNotifyMsg(res.data.msg);
          setNotifyMsgVisible(true);

          setTimeout(() => {
            setNotifyMsgVisible(false);
            loginHandler();
          }, 2000);
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

  // 이메일 인증 확인
  const emailCertiCheckAPI = (passcode: number) => {
    const param = {
      set_lang,
      mt_id,
      passcode,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/email_certi_check.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('email certi res ::', res);
        if (res.data.result === 'true') {
          console.log('suceess!');
          memberJoinAPI();
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

  const onSubmit = () => {
    console.log('code01', code01);
    console.log('code01', typeof code01);
    console.log('code02', code02);
    console.log('code03', code03);
    console.log('code04', code04);
    let mergeCode = code01 + code02 + code03 + code04;
    let certiCode = Number(mergeCode);
    emailCertiCheckAPI(certiCode);
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'emailcode' })} type='general' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter>
          <InfoTitle>{intl.formatMessage({ id: 'emailcodetit' })}</InfoTitle>
          <p>{intl.formatMessage({ id: 'emailcodesub' })}</p>
          <Margin type='bottom' size={20} />
          <FlexColumnStartStart style={{ width: '100%' }}>
            <CodeInputWrap>
              <CodeInput
                ref={code01Ref}
                type='text'
                value={code01}
                visible={!!code01}
                maxLength={1}
                onChange={code01InsertHandler}
              />
              <CodeInput
                ref={code02Ref}
                type='text'
                value={code02}
                visible={!!code02}
                maxLength={1}
                onChange={code02InsertHandler}
              />
              <CodeInput
                ref={code03Ref}
                type='text'
                value={code03}
                visible={!!code03}
                maxLength={1}
                onChange={code03InsertHandler}
              />
              <CodeInput
                ref={code04Ref}
                type='text'
                value={code04}
                visible={!!code04}
                maxLength={1}
                onChange={code04InsertHandler}
              />
            </CodeInputWrap>
          </FlexColumnStartStart>
        </FlexColumnCenterCenter>
        <Margin type='top' size={50} />
        {code01 && code02 && code03 && code04 ? (
          <Button type='full' onClick={onSubmit}>
            {intl.formatMessage({ id: 'codesuccess' })}
          </Button>
        ) : (
          <Button type='disable'>
            {intl.formatMessage({ id: 'codesuccess' })}
          </Button>
        )}
        <Margin type='bottom' size={10} />
        <Button type='line'>{intl.formatMessage({ id: 'coderesend' })}</Button>
      </Wrapper>

      <CustomNotify visible={isNotifyMsgVisible} error={isError}>
        <TextWhite>{notifyMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default RegisterCode;
