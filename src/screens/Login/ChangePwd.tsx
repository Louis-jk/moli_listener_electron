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

const ChangePwd = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const { mt_id } = useSelector((state: RootState) => state.login);

  const [currPwd, setCurrPwd] = useState<string>(''); // 현재 비밀번호
  const [newPwd, setNewPwd] = useState<string>(''); // 새 비밀번호
  const [newPwdCheck, setNewPwdCheck] = useState<string>(''); // 새 비밀번호 확인

  const [passwordErr, setPasswordErr] = useState<boolean>(false); // 새 비밀번호 에러
  const [passwordNullErr, setPasswordNullErr] = useState<boolean>(false); // 새 비밀번호 null 에러

  const [passwordReErr, setPasswordReErr] = useState<boolean>(false); // 새 비밀번호 확인 에러
  const [passwordReNullErr, setPasswordReNullErr] = useState<boolean>(false); // 새 비밀번호 확인 null 에러

  const [errorMsg, setErrorMsg] = useState<string>(''); // 서버 response 에러메세지
  const [errorPosition, setErrorPosition] = useState<string>(''); // 서버 response 에러 위치

  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isError, setError] = useState<boolean>(false);

  // 현재 비밀번호 입력
  const currPasswordInsertHandler = (e: HTMLInputElement) => {
    if (e.value && errorPosition === 'mt_pwd') {
      setErrorMsg('');
      setErrorPosition('');
      setPasswordNullErr(false);
    }
    setCurrPwd(e.value);
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

    setNewPwd(e.value);
  };

  // 비밀번호 확인 체킹
  const passwordReInsertHandler = (e: HTMLInputElement) => {
    if (e.value) {
      setPasswordReNullErr(false);
    }

    if (e.value !== newPwd) {
      setPasswordReErr(true);
    } else {
      setPasswordReErr(false);
    }

    setNewPwdCheck(e.value);
  };

  // 비밀번호 변경 전송
  const onSubmit = () => {
    console.log('submit!');

    if (!newPwd || !newPwdCheck || passwordErr || passwordReErr) {
      if (!newPwd) {
        setPasswordNullErr(true);
      }
      if (!newPwdCheck) {
        setPasswordReNullErr(true);
      }
    } else {
      const param = {
        set_lang: locale,
        mt_id,
        mt_pwd: currPwd,
        mt_new_pwd: newPwd,
        mt_new_pwd_re: newPwdCheck,
      };

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/pwd_modify.php`,
        data: QueryString.stringify(param),
      })
        .then((res: AxiosResponse) => {
          console.log('modify res', res);
          if (res.data.result === 'false') {
            setErrorPosition(res.data.data);
            setErrorMsg(res.data.msg);

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
              navigate(-1);
            }, 1000);
          }
        })
        .catch((err: AxiosError) => {
          console.error('res Error', err);
        });
    }
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'password' })} type='general' />
      <Wrapper>
        <Margin type='bottom' size={50} />
        <FlexColumnCenterCenter style={{ width: '100%' }}>
          <InfoTitle>{intl.formatMessage({ id: 'passwordtit' })}</InfoTitle>
          <p>{intl.formatMessage({ id: 'passworddes' })}</p>

          <Margin type='bottom' size={40} />

          <FlexColumnStartStart style={{ width: '100%' }}>
            {/* 현재 비밀번호 */}
            <LoginInputField
              type='password'
              value={currPwd}
              placeholder={intl.formatMessage({ id: 'nowpw' })}
              onChange={(e) => currPasswordInsertHandler(e.target)}
            />
            <Margin type='bottom' size={errorPosition === 'mt_pwd' ? 3 : 7} />
            {errorPosition === 'mt_pwd' && (
              <div>
                <SmallPoint>* {errorMsg}</SmallPoint>
                <Margin type='bottom' size={10} />
              </div>
            )}
            {/* // 현재 비밀번호 */}

            {/* 새 비밀번호 */}
            <LoginInputField
              type='password'
              value={newPwd}
              placeholder={intl.formatMessage({ id: 'newpw' })}
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
                {intl.formatMessage({ id: 'newPasswordRequire' })}
              </SmallPoint>
            )}
            {(passwordErr || passwordNullErr) && (
              <Margin type='bottom' size={10} />
            )}
            {/* // 새 비밀번호 */}

            {/* 새 비밀번호 확인 */}
            <LoginInputField
              type='password'
              value={newPwdCheck}
              placeholder={intl.formatMessage({ id: 'newpwcheck' })}
              onChange={(e) => passwordReInsertHandler(e.target)}
            />
            {(passwordReErr || passwordReNullErr) && (
              <Margin type='bottom' size={7} />
            )}
            {passwordReErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'passwordchecksub' })}
              </SmallPoint>
            )}
            {passwordReNullErr && (
              <SmallPoint>
                {intl.formatMessage({ id: 'newPasswordReRequire' })}
              </SmallPoint>
            )}
            {/* // 새 비밀번호 확인 */}

            <Margin type='bottom' size={50} />
          </FlexColumnStartStart>

          <Button type='full' onClick={onSubmit}>
            {intl.formatMessage({ id: 'password' })}
          </Button>
        </FlexColumnCenterCenter>
      </Wrapper>

      <CustomNotify visible={isNotifyMsgVisible} error={isError}>
        <TextWhite>{notifyMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default ChangePwd;
