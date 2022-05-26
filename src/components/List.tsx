import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  FlexRowSpaceBCenter,
  FlexRowSpaceBStart,
  FlexRowStartCenter,
  InfoTitle,
  Margin,
  MoreBtn,
  PointText,
  Wrapper,
} from '../styles/Common.Styled';
import {
  ConferenceDesc,
  ConferenceInfoWrap,
  ConferenceMainWrap,
  ConferenceSessionImg,
  ConferenceSessionImgWrap,
  ConferenceTitle,
} from '../styles/Lists.Styled';
import Header from './Header';
import Loading from './Loading';

const List = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [conImageUrl, setConImageUrl] = useState('');

  console.log('prop data', state);

  useEffect(() => {
    console.log('typeof data', typeof state);
    if (state && typeof state === 'object') {
      const chgImgUrl = state.con_img.replace('../', '');
      setConImageUrl(chgImgUrl);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [state]);

  const urlChange = (path: string) => {
    const chgImgUrl = path.replace('../', '');
    return chgImgUrl;
  };

  const entrySessionHandler = (code: string) => {
    console.log('code?', code);
    navigate('/sessionDetail', { state: { code } });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <Header title='행사' type='main' />
      <Wrapper>
        <ConferenceMainWrap>
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${conImageUrl}`}
            alt={`${state.title} 이미지`}
            title={`${state.title} 이미지`}
          />

          <ConferenceInfoWrap type='conference'>
            <FlexRowSpaceBStart>
              <div>
                <small>{state.date}</small>
                <ConferenceTitle>{state.title}</ConferenceTitle>
                <ConferenceDesc type='conference'>{state.sub}</ConferenceDesc>
              </div>
              <MoreBtn>
                <p>MORE</p>
              </MoreBtn>
            </FlexRowSpaceBStart>
          </ConferenceInfoWrap>
        </ConferenceMainWrap>

        <Margin type='bottom' size={45} />

        {/* 세션 목록 */}

        <FlexRowStartCenter style={{ width: '100%' }}>
          <InfoTitle style={{ marginRight: 10 }}>세션목록</InfoTitle>
          <p>
            <PointText>4</PointText>
          </p>
        </FlexRowStartCenter>

        <Margin type='bottom' size={20} />

        {state &&
          state.session_list &&
          state.session_list.length > 0 &&
          state.session_list.map((session: any, index: number) => (
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
                      alt={`${session.ses_title} 이미지`}
                      title={`${session.ses_title} 이미지`}
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
