import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosResponse } from 'axios';
import {
  CircleBtnNext,
  Container,
  FlexColumnCenterCenter,
  InfoDesc,
  InfoTitle,
  InputBox,
  InputWrapper,
  Margin,
  SpanPoint,
} from '../styles/Common.Styled';
import QueryString from 'qs';
import appRuntime from '../appRuntime';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { codeUpdate } from '../store/codeReducer';
import { GrayLogo } from '../styles/Settings.Styled';

const Code = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const intl = useIntl();
  const [entryCode, setEntryCode] = useState(''); // ex: moli3
  const [isError, setError] = useState(false);
  const [codeResultErrorMsg, setCodeResultErrorMsg] = useState('');

  useEffect(() => {
    setError(false);
  }, []);

  const reSizeBrowser = () => {
    console.log('resize');

    appRuntime.send('re-size', 're-size');
  };

  const nextHandler = () => {
    const params = {
      set_lang: locale,
      code_in: entryCode,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_code_in.php`,
      data: QueryString.stringify(params),
    })
      .then((res: AxiosResponse) => {
        console.log('code :: check res', res);
        if (res.status === 200 && res.data.result === 'true') {
          // navigate('/list', { state: { data: res.data.data } });
          dispatch(codeUpdate(entryCode));
          navigate('/list');
        } else {
          // alert(res.data.msg);
          setError(true);
          setCodeResultErrorMsg(res.data.msg);
        }
      })
      .catch((error) => console.error('error: ', error));
  };

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'conference' })} type='code' />
      <FlexColumnCenterCenter style={{ height: '100%' }}>
        <Margin type='bottom' size={20} />

        <InfoTitle>{intl.formatMessage({ id: 'conferencetit' })}</InfoTitle>
        <Margin type='bottom' size={10} />
        <InfoDesc>{intl.formatMessage({ id: 'conferencesub' })}</InfoDesc>

        <Margin type='bottom' size={50} />

        <InputWrapper>
          <InputBox
            type='text'
            placeholder={intl.formatMessage({
              id: 'conferenceodeceplaceholder',
            })}
            value={entryCode}
            onChange={(e) => setEntryCode(e.target.value)}
          />
        </InputWrapper>

        <Margin type='bottom' size={10} />

        <p>
          {isError ? (
            <SpanPoint>{codeResultErrorMsg}</SpanPoint>
          ) : (
            <SpanPoint>
              {intl.formatMessage({ id: 'conferencealert' })}
            </SpanPoint>
          )}
        </p>

        <Margin type='bottom' size={50} />
        <GrayLogo />
        <Margin type='bottom' size={50} />

        <CircleBtnNext onClick={nextHandler}>
          <img
            src='images/code_btn.png'
            alt={intl.formatMessage({ id: 'next' })}
            title={intl.formatMessage({ id: 'next' })}
          />
          <p>{intl.formatMessage({ id: 'next' })}</p>
        </CircleBtnNext>
      </FlexColumnCenterCenter>
    </Container>
  );
};

export default Code;
