import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Container,
  FlexRowSpaceBCenter,
  FlexRowSpaceBStart,
  FlexRowStartCenter,
  InfoTitle,
  Margin,
  MoreBtn,
  SpanPoint,
  Wrapper,
} from '../../styles/Common.Styled';
import {
  ConferenceDesc,
  ConferenceInfoWrap,
  ConferenceMainWrap,
  ConferenceSessionImg,
  ConferenceSessionImgWrap,
  ConferenceTitle,
} from '../../styles/Lists.Styled';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import axios, { AxiosResponse } from 'axios';
import QueryString from 'qs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const List = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const { code } = useSelector((state: RootState) => state.code);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [conImageUrl, setConImageUrl] = useState('');
  const [data, setData] = useState<any>({});

  console.log('prop data', state);

  const getAPI = () => {
    const params = {
      set_lang: locale,
      code_in: code,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_conference_info.php`,
      data: QueryString.stringify(params),
    })
      .then((res: AxiosResponse) => {
        console.log('code :: conference_info res', res);
        if (res.status === 200 && res.data.result === 'true') {
          const chgImgUrl = res.data.data.con_img.replace('../', '');
          setConImageUrl(chgImgUrl);
          setData(res.data.data);
        } else {
          // alert(res.data.msg);
          // setError(true);
          // setCodeResultErrorMsg(res.data.msg);
        }
      })
      .catch((error) => console.error('error: ', error));
  };

  useEffect(() => {
    // console.log('typeof data', typeof state);
    // if (state && typeof state === 'object') {
    //   const chgImgUrl = state.con_img.replace('../', '');
    //   setConImageUrl(chgImgUrl);
    // }

    getAPI();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => getAPI();
  }, [state]);

  const urlChange = (path: string) => {
    const chgImgUrl = path.replace('../', '');
    return chgImgUrl;
  };

  const entrySessionHandler = (code: string) => {
    console.log('code?', code);
    navigate('/sessionDetail', { state: { code } });
  };

  const goConferenceDetail = () => {
    navigate(`/conferenceDetail/${code}`, {
      state: { type: data.con_detail_type },
    });
  };

  return isLoading ? (
    <Loading isTransparent={false} />
  ) : (
    <Container>
      <Header
        title={intl.formatMessage({ id: 'conferenceMain' })}
        type='main'
      />
      {/* className='no_drag' */}
      <Wrapper> 
        <ConferenceMainWrap>
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${conImageUrl}`}
            alt={`${data.title}`}
            title={`${data.title}`}
          />

          <ConferenceInfoWrap type='conference' onClick={goConferenceDetail}>
            <FlexRowSpaceBStart>
              <div>
                <small>{data.date}</small>
                <ConferenceTitle>{data.title}</ConferenceTitle>
                <ConferenceDesc type='conference'>{data.sub}</ConferenceDesc>
              </div>
              <MoreBtn>
                <p>MORE</p>
              </MoreBtn>
            </FlexRowSpaceBStart>
          </ConferenceInfoWrap>
        </ConferenceMainWrap>

        <Margin type='bottom' size={45} />

        {/* 세션 목록 */}

        {data && data.session_list && (
          <FlexRowStartCenter style={{ width: '100%' }}>
            <InfoTitle style={{ marginRight: 10, marginBottom: 0 }}>
              {intl.formatMessage({ id: 'session' })}
            </InfoTitle>

            <p style={{ fontSize: '1.25rem' }}>
              <SpanPoint>{data.session_list.length}</SpanPoint>
            </p>
          </FlexRowStartCenter>
        )}

        <Margin type='bottom' size={20} />

        {data &&
          data.session_list &&
          data.session_list.length > 0 &&
          data.session_list.map((session: any, index: number) => (
            <ConferenceInfoWrap
              key={`session-${index}`}
              type='session'
              onClick={() => entrySessionHandler(session.ses_code)}
            >
              <FlexRowSpaceBCenter>
                <div>
                  <small>{session.ses_date}</small>
                  <ConferenceTitle>{session.ses_title}</ConferenceTitle>
                  <ConferenceDesc type='session'>
                    {session.ses_content}
                  </ConferenceDesc>
                </div>
                {session.ses_img && (
                  <ConferenceSessionImgWrap>
                    <ConferenceSessionImg
                      src={`${process.env.REACT_APP_BACKEND_URL}/${urlChange(
                        session.ses_img
                      )}`}
                      alt={`${session.ses_title}`}
                      title={`${session.ses_title}`}
                    />
                  </ConferenceSessionImgWrap>
                )}
              </FlexRowSpaceBCenter>
            </ConferenceInfoWrap>
          ))}

        {/* // 세션 목록 */}

        <div />
      </Wrapper>
    </Container>
  );
};

export default List;
