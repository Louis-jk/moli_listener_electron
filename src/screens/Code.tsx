import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Code = () => {
  const navigate = useNavigate();
  const [entryCode, setEntryCode] = useState('ksce');
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
      set_lang: 'ko',
      code_in: entryCode,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_conference_info.php`,
      data: QueryString.stringify(params),
    })
      .then((res: AxiosResponse) => {
        console.log('res', res);
        if (res.status === 200 && res.data.result === 'true') {
          // navigate('/list', { state: { data: res.data.data } });
          navigate('/list', { state: res.data.data });
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
      <Header title='' type='not' />
      <FlexColumnCenterCenter style={{ height: '100%' }}>
        <InfoTitle>코드입력</InfoTitle>
        <Margin type='bottom' size={10} />
        <InfoDesc>코드를 입력해주세요</InfoDesc>

        <Margin type='bottom' size={50} />

        <InputWrapper>
          <InputBox
            type='text'
            placeholder='HO-DDD-45465'
            value={entryCode}
            onChange={(e) => setEntryCode(e.target.value)}
          />
        </InputWrapper>

        <Margin type='bottom' size={10} />

        <p>
          {isError ? (
            <SpanPoint>{codeResultErrorMsg}</SpanPoint>
          ) : (
            <SpanPoint>코드입력 후 아래 버튼을 눌러주세요</SpanPoint>
          )}
        </p>

        <Margin type='bottom' size={100} />

        <CircleBtnNext onClick={nextHandler}>
          <img src='images/code_btn.png' alt='다음 버튼' title='다음 버튼' />
          <p>다음</p>
        </CircleBtnNext>
      </FlexColumnCenterCenter>
    </Container>
  );
};

export default Code;
