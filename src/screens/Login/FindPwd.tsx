import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexColumnCenterCenter,
  FlexColumnStartStart,
  InfoTitle,
  Margin,
  SmallPoint,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import { CustomNotify, LoginInputField } from '../../styles/Login.Styled';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';

const FindPwd = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const { mt_id } = useSelector((state: RootState) => state.login);

  const [email, setEmail] = useState<string>('');
  const [emailErr, setEmailErr] = useState<boolean>(false); // 이메일 유효성 검사 에러
  const [emailNullErr, setEmailNullErr] = useState<boolean>(false); // 이메일 null 에러

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);
  const [isErrorMsgVisible, setErrorMsgVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

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

  // 전송
  const onSubmit = () => {
    if (!email || emailErr) {
      if (!email) {
        setEmailNullErr(true);
      }
    } else {
      const param = {
        set_lang: locale,
        mt_id: email,
      };

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/password_find.php`,
        data: QueryString.stringify(param),
      })
        .then((res: AxiosResponse) => {
          console.log('find pwd res', res);
          if (res.data.result === 'false') {
            setError(true);
            setNotifyMsg(res.data.msg);
            setNotifyMsgVisible(true);

            setTimeout(() => {
              setNotifyMsgVisible(false);
            }, 2000);
          } else {
            setError(false);
            setNotifyMsg(res.data.msg);
            setNotifyMsgVisible(true);

            setTimeout(() => {
              setNotifyMsgVisible(false);
              navigate('/login');
            }, 1500);
          }
        })
        .catch((err: AxiosError) => {
          console.error('res Error', err);
        });
    }
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'findpw' })} type='general' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter style={{ width: '100%' }}>
          <InfoTitle>{intl.formatMessage({ id: 'findpwtit' })}</InfoTitle>
          <p>{intl.formatMessage({ id: 'findpwsub' })}</p>

          <Margin type='bottom' size={40} />

          <FlexColumnStartStart style={{ width: '100%' }}>
            {/* 이메일 */}
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
            {/* // 이메일 */}

            <Margin type='bottom' size={20} />
          </FlexColumnStartStart>

          <Button type='full' onClick={onSubmit}>
            {intl.formatMessage({ id: 'findpwbtn' })}
          </Button>
        </FlexColumnCenterCenter>
      </Wrapper>

      <CustomNotify visible={isNotifyMsgVisible} error={isError}>
        <TextWhite>{notifyMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default FindPwd;
