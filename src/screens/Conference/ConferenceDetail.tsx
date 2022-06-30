import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosResponse } from 'axios';
import QueryString from 'qs';
import Header from '../../components/Header';
import {
  Container,
  FlexColumnCenterCenter,
  FlexColumnStartStart,
  TextWhite,
  Wrapper,
} from '../../styles/Common.Styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ConferenceDetail = () => {
  const params = useParams();
  const { state } = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);

  const [visualType, setVisualType] = useState<string>(''); // 컨퍼런스 내용 타입 POSTER | TEXT
  const [detailDataBackImg, setDetailDataBackImg] = useState<string>('');
  const [detailData, setDetailData] = useState<any[]>([]);

  console.log('Conference state ::', state);

  const getConferenceDetailAPI = (payload: any) => {
    setVisualType(payload.type);

    const param = {
      set_lang: locale,
      code_in: params.id,
      type: payload.type,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_conference_detail.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('cf res :', res);
        if (payload.type === 'POSTER') {
          let newArr: any[] = [];
          res.data.data.list.map((list: any) => {
            let reImg = list.poster_img.replace(
              '../',
              `${process.env.REACT_APP_BACKEND_URL}/`
            );
            newArr.push(reImg);
          });
          console.log('newArr', newArr);
          setDetailData(newArr);
        } else {
          let backImg = res.data.data.back_img.replace(
            '../',
            `${process.env.REACT_APP_BACKEND_URL}/`
          );
          setDetailDataBackImg(backImg);
          setDetailData(res.data.data.list);
        }
      })
      .catch((error) => console.error('cf error: ', error));
  };

  useEffect(() => {
    if (state) {
      getConferenceDetailAPI(state);
    }
  }, [state]);

  console.log('detailDataBackImg', detailDataBackImg);
  console.log('detailData', detailData);

  return (
    <Container>
      <Header
        title={intl.formatMessage({ id: 'conferenceMain' })}
        type='detail'
      />
      <Wrapper>
        {visualType === 'POSTER' && (
          <FlexColumnCenterCenter style={{ height: '100%' }}>
            {detailData &&
              detailData.length > 0 &&
              detailData.map((data: any, _: number) => (
                <img
                  key={`conference-detail-img-${_}`}
                  src={`${data}`}
                  style={{ width: '100%', marginTop: 5, marginBottom: 5 }}
                />
              ))}
          </FlexColumnCenterCenter>
        )}

        {visualType === 'TEXT' && (
          <FlexColumnStartStart>
            {detailDataBackImg !== '' && (
              <div
                style={{
                  position: 'fixed',
                  top: 35,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 'calc(100vh - 30px)',
                  opacity: 0.3,
                  zIndex: -1,
                }}
              >
                <img
                  src={`${detailDataBackImg}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
            {detailData &&
              detailData.length > 0 &&
              detailData.map((data: any, _: number) => (
                <div
                  style={{ textAlign: 'left', marginTop: 10, marginBottom: 15 }}
                >
                  <h3 style={{ marginBottom: 10 }}>
                    <TextWhite>{data.txt_title}</TextWhite>
                  </h3>
                  <TextWhite>{data.txt_content}</TextWhite>
                </div>
              ))}
          </FlexColumnStartStart>
        )}
      </Wrapper>
    </Container>
  );
};

export default ConferenceDetail;
