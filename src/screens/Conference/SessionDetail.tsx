import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import AgoraRTC from 'agora-rtc-sdk';
import { useDispatch, useSelector } from 'react-redux';

import {
  Container,
  Divider,
  Tab,
  FlexRowSpaceBCenter,
  Margin,
  SpanPoint,
  SpanWhite,
  Wrapper,
  TabActiveBar,
  FlexRowCenterStart,
  FlexCenterCenter,
  FlexColumnCenterCenter,
  FlexColumnStartCenter,
  FlexRowStartCenter,
  FlexRowEndCenter,
} from '../../styles/Common.Styled';
import { ConferenceTitle } from '../../styles/Lists.Styled';
import {
  PlayBtn,
  SessionMainInfoBox,
  SessionMinDescWrapper,
  SessionTransListBox,
  VolumeControl,
  VolumeInfomationArea,
  VolumeSettingBtn,
} from '../../styles/SessionDetail.Styled';
import { theme } from '../../styles/Theme';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import appRuntime from '../../appRuntime';
import { RootState } from '../../store';
import { toggle } from '../../store/frameControlReducer';
import AudioBar from '../../components/AudioBar';
import TimeCount from '../../components/TimeCount';
import { joinStateUpdate } from '../../store/joinStateReducer';
import { ItemProps } from '../../interfaces/components.interface';

const SessionDetail = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const intl = useIntl();
  const { isJoin } = useSelector((state: RootState) => state.joinState);

  // 아고라
  // const [joined, setJoined] = useState<boolean>(false);
  const [currStream, setCurrStream] = useState<any>();
  const [currStreamId, setCurrStreamId] = useState<string>('');
  const [currTrans, setCurrTrans] = useState<number>(-1);
  const [remoteVol, setRemoteVol] = useState<number>(0);

  const { isMin } = useSelector((state: RootState) => state.frame);
  const { mt_idx } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.locale);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [codeList, setCodeList] = useState<any[]>([]); // 통역사 리스트
  const [fileList, setFileList] = useState<any[]>([]); // 자료함 리스트
  const [sessionDate, setSessionDate] = useState<string>(''); // 세션 날짜 정보
  const [sessionTitle, setSessionTitle] = useState<string>(''); // 세션 타이틀
  const [sessionContent, setSessionContent] = useState<string>(''); // 세션 컨텐츠(내용)
  const [sessionImg, setSessionImg] = useState<string>(''); // 세션 이미지
  const [selectTabNum, setSelectTabNum] = useState<number>(0); // 선택 탭 번호
  const [sessionCode, setSessionCode] = useState<string>(''); // 현재 세션 코드
  const [isVolSetArea, setVolSetArea] = useState<boolean>(false);

  const [vol, setVol] = useState<number>(100);

  const TABS = [
    {
      id: 0,
      label: `${intl.formatMessage({ id: 'translate' })}`,
    },
    {
      id: 1,
      label: `${intl.formatMessage({ id: 'databox' })}`,
    },
  ];

  // 볼륨 설정 or 볼륨 출력 설정
  const volumeSettingHandler = () => {
    setVolSetArea((prev) => !prev);
  };

  // 볼륨 설정
  const volumeSetting = (val: any) => {
    console.log('volumeSetting val :: ', val);
    let changeVal = Number(val);
    setVol(changeVal);
  };

  const APPID = process.env.REACT_APP_AGORA_APP_ID
    ? process.env.REACT_APP_AGORA_APP_ID
    : '';

  const client = AgoraRTC.createClient({
    mode: 'live',
    codec: 'vp8',
  });

  let localStream = AgoraRTC.createStream({
    audio: true,
    video: false,
  });

  client.init(APPID);

  client.setClientRole('audience', (error: any) => {
    console.log('clientRole Error ::', error);
  });

  console.log('currStream ??', currStream);

  useEffect(() => {
    if (currStream && vol) {
      // currStream.adjustAudioMixingVolume(vol)
      currStream.setAudioVolume(vol);
    }
  }, [vol]);

  // 채널 나가기
  const leaveChannel = () => {
    client.leave(() => {
      // console.log('client leaves channel success!');
      currStream.close();
      removeVideoStream(currStreamId);
      // setJoined(false);
      dispatch(joinStateUpdate(false));
      setRemoteVol(0);

      if (isMin) {
        frameWide();
      }
    }, handleError);
  };

  const joinChannel = (channel: string, token: string) => {
    try {
      // const uid = await client.join(APPID, channel, token, null);
      let uId: string | null = '';
      client.join(
        token,
        channel,
        null,
        'audience',
        () => {
          localStream.init(() => {
            localStream.play('me');
            client.publish(localStream, handleError);
          }, handleError);

          // setJoined(true);
          dispatch(joinStateUpdate(true));

          client.on('stream-added', (evt: any) => {
            // add
            let stream = evt.stream;
            console.log('new stream added ', stream.getId());
            // add
            client.subscribe(
              evt.stream,
              { video: false, audio: true },
              handleError
            );

            client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
            client.on('volume-indicator', (evt: any) => {
              evt.attr.forEach((volume: any, index: number) => {
                // console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
                setRemoteVol(volume.level);
              });
            });
          });
        },
        handleError
      );

      console.log('joined');
    } catch (e) {
      console.log('join failed', e);
    }
  };

  client.on('stream-subscribed', (evt: any) => {
    // console.log('stream-subscribed evt :::::', evt);
    // console.log('stream-subscribed evt stream :::::', evt.stream);

    let stream = evt.stream;
    let streamId = String(stream.getId());
    setCurrStream(stream);
    setCurrStreamId(streamId);

    // stream.setAudioVolume(vol);

    console.log(
      'stream-subscribed evt stream getID :::::',
      String(stream.getId())
    );
    addVideoStream(streamId);
    stream.play(streamId);
    // setJoined(true);
    dispatch(joinStateUpdate(true));
  });

  client.on('stream-removed', (evt: any) => {
    // console.log('stream-removed evt :::::', evt);

    setCurrTrans(-1);

    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);

    getRefleshAPI();
    // setJoined(false);
    dispatch(joinStateUpdate(false));

    if (isMin) {
      frameWide();
    }
  });

  client.on('peer-leave', (evt: any) => {
    console.log('peer-leave evt :::::', evt);

    let uid = evt.uid;
    let reason = evt.reason;
    // let stream = evt.stream;
    // let streamId = String(stream.getId());
    // stream.close();
    requestAPI();
    removeVideoStream(uid);
    setCurrTrans(-1);
    // setJoined(false);
    dispatch(joinStateUpdate(false));

    frameWide();
  });

  const handleError = (err: any) => {
    console.log('Error: ', err);
  };

  const addVideoStream = (elementId: any) => {
    let streamDiv = document.createElement('div');
    streamDiv.id = elementId;
    // streamDiv.style.transform = 'rotateY(180deg)';
    streamDiv.style.width = '400px';
    streamDiv.style.height = '400px';
    streamDiv.style.display = 'none';

    document.getElementById('container')?.appendChild(streamDiv);
  };

  const removeVideoStream = (elementId: any) => {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) {
      remoteDiv.parentNode?.removeChild(remoteDiv);
    }
  };

  // web 실행시 주석 필요
  appRuntime.on('isFrameWide', (event: any, data: boolean) => {
    if (isMin) {
      dispatch(toggle(false));
    } else {
      return false;
    }
  });

  appRuntime.on('isFrameMin', (event: any, data: boolean) => {
    if (!isMin) {
      dispatch(toggle(true));
    } else {
      return false;
    }
  });

  // 세션 페이지 들어왔을 때
  const getSessinInfoAPI = () => {
    console.log('state.code ??', state.code);

    const params = {
      set_lang: locale,
      code_in: state.code,
      mt_idx,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_page_in.php`,
      data: QueryString.stringify(params),
    })
      .then((res: any) => console.log('get Res', res))
      .catch((err: any) => console.error('res error ::', err));
  };

  // 세션 코드 새로고침(언어 활성화체크)
  const getRefleshAPI = () => {
    const params = {
      set_lang: locale,
      code_in: state.code,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_refresh.php`,
      data: QueryString.stringify(params),
    })
      .then((res: any) => {
        if (res.status === 200 && res.data && res.data.result === 'true') {
          const result = res.data.data;
          setCodeList(result.codelist);
          console.log('result.codelist ?', result.codelist);
        }
      })
      .catch((err: any) => console.error('res Reflesh error ::', err));
  };

  const requestAPI = () => {
    const params = {
      set_lang: locale,
      code_in: state.code,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_info.php`,
      data: QueryString.stringify(params),
    })
      .then((res) => {
        console.log('detail ', res);
        if (res.status === 200 && res.data && res.data.result === 'true') {
          const result = res.data.data;
          setCodeList(result.codelist);
          setFileList(result.filelist);

          let newFile: any[] = [];
          result.filelist.map((file: any) => {
            let filter = {
              file_link: file.file_link.replace(
                '../',
                `${process.env.REACT_APP_BACKEND_URL}/`
              ),
              file_name: file.file_name,
            };
            newFile.push(filter);
          });

          console.log('newFile', newFile);
          setFileList(newFile);

          setSessionDate(result.date);
          setSessionTitle(result.title);
          setSessionContent(result.content);

          let chgImgUrl = result.img.replace(
            '../',
            `${process.env.REACT_APP_BACKEND_URL}/`
          );
          setSessionImg(chgImgUrl);

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  useEffect(() => {
    getSessinInfoAPI();
  }, []);

  useEffect(() => {
    if (state && state.code && typeof state.code === 'string') {
      requestAPI();
      // return requestAPI();
    }
  }, [state]);

  useEffect(() => {
    const getReflesh = setInterval(() => {
      getRefleshAPI();
    }, 5000);

    return () => clearInterval(getReflesh);
  });

  // 세션 언어 플레이
  const playSessionHandler = (payload: string) => {
    console.log('play sessionCode ?', sessionCode);

    const params = {
      set_lang: locale,
      code_in: payload,
      mt_idx,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_play.php`,
      data: QueryString.stringify(params),
    })
      .then((res: AxiosResponse) => console.log('play res::', res))
      .catch((err: AxiosError) => {
        console.error('play res Error', err);
      });
  };

  // 세션 언어 중지(청취자가 통역듣는 세션 중지했을때)
  const stopSessionHandler = () => {
    console.log('stop sessionCode ?', sessionCode);

    const params = {
      set_lang: locale,
      code_in: sessionCode,
      mt_idx,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/listen_session_end.php`,
      data: QueryString.stringify(params),
    })
      .then((res: AxiosResponse) => console.log('stop res::', res))
      .catch((err: AxiosError) => {
        console.error('stop res Error', err);
      });
  };

  const Item: React.FC<ItemProps> = ({ text }) => {
    return (
      <SpanWhite>
        {text.split('\n').map((txt: string, index: number) => (
          <p key={`session_content_${index}`}>
            {txt}
            <br />
          </p>
        ))}
      </SpanWhite>
    );
  };

  // 세션 탭(통역, 자료함) 선택 핸들러
  const selectTabHandler = (id: number) => {
    setSelectTabNum(id);
  };

  console.log('codeList ??', codeList);
  console.log('fileList ??', fileList);

  const dispatch = useDispatch();

  const frameWide = () => {
    console.log('프레임 와이드');
    appRuntime.send('frameWide', null);

    dispatch(toggle(false));
  };

  return isLoading ? (
    <Loading isTransparent={false} />
  ) : (
    <Container id='container'>
      <Header
        title={intl.formatMessage({ id: 'session' })}
        type={isJoin ? 'session_active' : 'session'}
      />
      <Wrapper isFrameMin={isMin}>
        <Margin type='bottom' size={20} />

        {/* 세션 메인 안내 블럭 */}
        <SessionMainInfoBox imageSource={sessionImg} isFrameMin={isMin}>
          <div>
            <p className='session_date'>
              <SpanPoint>{sessionDate}</SpanPoint>
            </p>
            <ConferenceTitle>{sessionTitle}</ConferenceTitle>
            <Item text={sessionContent} />
          </div>
        </SessionMainInfoBox>
        {/* // 세션 메인 안내 블럭 */}

        {isMin && (
          <SessionMinDescWrapper>
            <p className='session_date' style={{ marginBottom: 5 }}>
              <SpanPoint>{sessionDate}</SpanPoint>
            </p>
            <h4 style={{ fontSize: 16 }}>{sessionTitle}</h4>
          </SessionMinDescWrapper>
        )}

        <Margin type='bottom' size={35} />

        {/* 탭 */}
        {!isMin && (
          <>
            <FlexRowSpaceBCenter style={{ width: '100%' }}>
              {TABS.map((tab: any, index: number) => (
                <Tab
                  key={`session_tab_${tab.id}_idx${index}`}
                  active={selectTabNum === tab.id}
                  onClick={() => selectTabHandler(tab.id)}
                >
                  <p>{tab.label}</p>
                  <TabActiveBar active={selectTabNum === tab.id} />
                </Tab>
              ))}
            </FlexRowSpaceBCenter>
            <Divider />
          </>
        )}
        {/* // 탭 */}

        {/* 통역 탭 선택일 경우  */}
        {!isMin &&
          selectTabNum === 0 &&
          (codeList?.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: 420,
                height: '100%',
              }}
            >
              {/* 펼친화면 세션 선택 통역 Area */}
              <div style={{ width: '100%' }}>
                {codeList.map((list: any, index: number) => (
                  <SessionTransListBox
                    style={{ width: '100%' }}
                    key={`${list.lang_title}_${index}`}
                    active={list.status !== 'close'}
                    isMin={false}
                  >
                    <p>{list.lang_title}</p>
                    <FlexRowCenterStart>
                      {isJoin && currTrans === index && (
                        <img
                          src='images/ic_eq.png'
                          style={{
                            width: 22,
                            height: 22,
                            marginRight: 10,
                          }}
                          alt='플레이중 스톱 아이콘'
                          title='플레이중 스톱 아이콘'
                        />
                      )}
                      <PlayBtn
                        onClick={() => {
                          if (!isJoin) {
                            setSessionCode(list.session_code);
                            joinChannel(list.channel_name, list.listen_token);
                            // list.session_code
                            playSessionHandler(list.session_code);
                            setCurrTrans(index);
                          } else {
                            leaveChannel();
                            stopSessionHandler();
                          }
                        }}
                      >
                        <img
                          src={
                            isJoin && currTrans === index
                              ? 'images/ic_stop.png'
                              : 'images/ic_play.png'
                          }
                          style={{
                            width: 27,
                            height: 27,
                            opacity: list.status === 'open' ? 1 : 0.3,
                          }}
                          alt='플레이중 스톱 아이콘'
                          title='플레이중 스톱 아이콘'
                        />
                      </PlayBtn>
                    </FlexRowCenterStart>
                  </SessionTransListBox>
                ))}
              </div>
              {/* // 펼친화면 세션 선택 통역 Area */}

              {/* 펼친화면 재생 시간 및 사운드 바 */}
              <VolumeInfomationArea>
                <FlexRowEndCenter>
                  <TimeCount start={isJoin} />
                </FlexRowEndCenter>
                <FlexRowSpaceBCenter>
                  <VolumeSettingBtn onClick={volumeSettingHandler}>
                    <img
                      src={
                        isVolSetArea
                          ? 'images/ic_vol_s.png'
                          : 'images/ic_vol_w.png'
                      }
                      style={{
                        width: 25,
                        height: 27,
                        objectFit: 'contain',
                        marginRight: 5,
                      }}
                      alt='플레이중 스톱 아이콘'
                      title='플레이중 스톱 아이콘'
                    />
                  </VolumeSettingBtn>
                  {isVolSetArea ? (
                    <FlexRowStartCenter>
                      <VolumeControl
                        type='range'
                        value={vol}
                        min={0}
                        max={100}
                        onChange={(e) => volumeSetting(e.target.value)}
                      />
                      <p
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          marginLeft: 15,
                          textAlign: 'right',
                          width: 25,
                        }}
                      >
                        {vol}
                      </p>
                    </FlexRowStartCenter>
                  ) : (
                    <AudioBar vol={isJoin ? remoteVol * 10 : 0} />
                  )}
                </FlexRowSpaceBCenter>
              </VolumeInfomationArea>
              {/* // 펼친화면 재생 시간 및 사운드 바 */}
            </div>
          ) : (
            <FlexCenterCenter style={{ minHeight: '30vh' }}>
              <p>현재 등록된 통역사가 없습니다.</p>
            </FlexCenterCenter>
          ))}
        {/* // 통역 탭 선택일 경우  */}

        {/* 자료함 탭 선택일 경우  */}
        {!isMin &&
          selectTabNum === 1 &&
          (fileList?.length > 0 ? (
            fileList.map((list: any, index: number) => (
              <SessionTransListBox
                key={index}
                active={list.status !== 'close'}
                isMin={false}
                style={{ width: '100%' }}
                onClick={() =>
                  appRuntime.send('download', { url: list.file_link })
                }
              >
                <p>{list.file_name}</p>
                <div style={{ width: 27, height: 27 }}>
                  <img
                    src='images/ic_download.png'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    alt='다운로드'
                    title='다운로드'
                  />
                </div>
              </SessionTransListBox>
            ))
          ) : (
            <FlexCenterCenter style={{ minHeight: '30vh' }}>
              <p>현재 등록된 파일이 없습니다.</p>
            </FlexCenterCenter>
          ))}
        {/* //자료함 탭 선택일 경우  */}

        {/* 볼륨 조절 바 */}
        {/* {!isMin && selectTabNum === 0 && (
          <FlexRowStartCenter>
            <VolumeControl
              type='range'
              value={vol}
              min={0}
              max={100}
              onChange={(e) => volumeSetting(e.target.value)}
            />
            <p style={{ marginLeft: 15 }}>{vol}</p>
          </FlexRowStartCenter>
        )} */}
        {/* // 볼륨 조절 바 */}
      </Wrapper>

      {isMin && codeList?.length > 0 && currTrans !== -1 && (
        <FlexColumnStartCenter>
          {/* 접은화면 세션 선택 통역 Area */}
          <SessionTransListBox
            active={codeList[currTrans].status !== 'close'}
            isMin={true}
            style={{ width: '100%' }}
          >
            <p>{codeList[currTrans].lang_title}</p>
            <FlexRowCenterStart>
              {codeList[currTrans].status === 'open' && (
                <>
                  <img
                    src='images/ic_eq.png'
                    style={{
                      width: 22,
                      height: 22,
                      marginRight: 10,
                    }}
                    alt='플레이중 스톱 아이콘'
                    title='플레이중 스톱 아이콘'
                  />

                  <PlayBtn
                    onClick={() => {
                      if (!isJoin) {
                        setSessionCode(codeList[currTrans].session_code);
                        joinChannel(
                          codeList[currTrans].channel_name,
                          codeList[currTrans].listen_token
                        );
                        // list.session_code
                        playSessionHandler(codeList[currTrans].session_code);
                      } else {
                        leaveChannel();
                        stopSessionHandler();
                      }
                    }}
                  >
                    <img
                      src={isJoin ? 'images/ic_stop.png' : 'images/ic_play.png'}
                      style={{ width: 27, height: 27 }}
                      alt='플레이중 스톱 아이콘'
                      title='플레이중 스톱 아이콘'
                    />
                  </PlayBtn>
                </>
              )}
            </FlexRowCenterStart>
          </SessionTransListBox>
          {/* // 접은화면 세션 선택 통역 Area */}

          {/* 접은화면 재생 시간 및 사운드 바 */}
          <VolumeInfomationArea>
            <FlexRowEndCenter>
              <TimeCount start={isJoin} />
            </FlexRowEndCenter>
            <FlexRowSpaceBCenter>
              <VolumeSettingBtn onClick={volumeSettingHandler}>
                <img
                  src={
                    isVolSetArea ? 'images/ic_vol_s.png' : 'images/ic_vol_w.png'
                  }
                  style={{
                    width: 25,
                    height: 27,
                    objectFit: 'contain',
                    marginRight: 5,
                  }}
                  alt='플레이중 스톱 아이콘'
                  title='플레이중 스톱 아이콘'
                />
              </VolumeSettingBtn>
              {isVolSetArea ? (
                <FlexRowStartCenter>
                  <VolumeControl
                    type='range'
                    value={vol}
                    min={0}
                    max={100}
                    onChange={(e) => volumeSetting(e.target.value)}
                  />
                  <p
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      marginLeft: 15,
                      textAlign: 'right',
                      width: 25,
                    }}
                  >
                    {vol}
                  </p>
                </FlexRowStartCenter>
              ) : (
                <AudioBar vol={isJoin ? remoteVol * 10 : 0} />
              )}
            </FlexRowSpaceBCenter>
          </VolumeInfomationArea>
          {/* // 접은화면 재생 시간 및 사운드 바 */}
        </FlexColumnStartCenter>
      )}
    </Container>
  );
};

export default SessionDetail;
