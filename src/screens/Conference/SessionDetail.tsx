import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import { useSelector } from 'react-redux';

// import AgoraRtcEngine from 'agora-electron-sdk';
import AgoraRTC, {
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';

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
} from '../../styles/Common.Styled';
import { ConferenceTitle } from '../../styles/Lists.Styled';
import {
  PlayBtn,
  SessionMainInfoBox,
  SessionMinDescWrapper,
  SessionTransListBox,
} from '../../styles/SessionDetail.Styled';
import { theme } from '../../styles/Theme';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import appRuntime from '../../appRuntime';
import { RootState } from '../../store';

interface ItemProps {
  text: string;
}

const SessionDetail = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const intl = useIntl();

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

  const [isFrameMin, setFrameMin] = useState<boolean>(false);
  const [isFrameWide, setFrameWide] = useState<boolean>(false);
  const [currTrans, setCurrTrans] = useState<number>(-1);

  // 아고라
  const [inCall, setInCall] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>('');
  const [agoraToken, setAgoraToken] = useState<string>('');
  const [agoraUId, setAgoraUId] = useState<any>(null);
  const [isConnect, setConnect] = useState<boolean>(false);
  const [users, setUsers] = useState<any>(null);
  const [active, setActive] = useState(false);
  const [vol, setVol] = useState(0);

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

  const appId = process.env.REACT_APP_AGORA_APP_ID
    ? process.env.REACT_APP_AGORA_APP_ID
    : '';

  // client.on('volume-indicator', (volumes) => {
  //   console.log('volumes ??', volumes);
  //   volumes.forEach((volume, index) => {
  //     //console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
  //     getVolumes = volume;
  //     setVol(volume.level);
  //   });
  // });

  // const client: IAgoraRTCClient = AgoraRTC.createClient({
  //   codec: 'vp8',
  //   mode: 'live',
  // });

  const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

  let localTracks: any = {
    //videoTrack: null,
    audioTrack: null,
  };

  let remoteUsers: any = {};

  let options: any = {
    appid: null,
    channel: null,
    uid: null,
    token: null,
    role: 'audience', //"audience", // host or audience
    audienceLatency: 2,
  };

  const joinChannel = async (
    channel: string,
    agoraToken: string,
    sCode: string
  ) => {
    playSessionHandler(sCode);

    options.appid = appId;
    options.channel = channel;
    options.token = agoraToken;

    const uid = await client.join(
      options.appid,
      options.channel,
      options.token,
      null
    );

    if (options.role === 'audience') {
      client.setClientRole(options.role, { level: options.audienceLatency });
      // add event listener to play remote tracks when remote user publishs.
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
    } else {
      client.setClientRole(options.role);
    }

    //받는쪽 볼륨 체크해서 이퀼라져에 표시
    client.enableAudioVolumeIndicator();
    client.on('volume-indicator', (volumes) => {
      volumes.forEach((volume, index) => {
        console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
        // colorPids(volume.level);
      });
    });

    // join the channel
    options.uid = await client.join(
      appId,
      channel,
      agoraToken || null,
      options.uid || null
    );

    if (options.role === 'host') {
      // create local audio and video tracks
      localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      //localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
      // play local video track
      //localTracks.videoTrack.play("local-player");
      // $("#local-player-name").text(`localTrack(${options.uid})`);
      // publish local tracks to channel
      await client.publish(Object.values(localTracks));
      console.log('publish success');
    }
  };

  console.log('client?', client);
  console.log('localTracks?', localTracks);

  const leaveChannel = async () => {
    stopSessionHandler();
    console.log('Leave ??');
    // console.log('localTracks ??', localTracks);
    // options.channel = '';
    // options.token = '';
    // localTracks = {};
    // localTracks.map((trackName: any) => {
    //   var track = localTracks[trackName];
    //   if (track) {
    //     track.stop();
    //     track.close();
    //     localTracks[trackName] = undefined;
    //   }
    // });

    // Remove remote users and player views.
    // remoteUsers = {};
    //$("#remote-playerlist").html("");

    // leave the channel

    //$("#local-player-name").text("");
    //$("#join").attr("disabled", false);
    //$("#leave").attr("disabled", true);

    try {
      await client.leave();
      console.log('client leaves channel success');
    } catch (err) {
      console.error('leave error', err);
    }
  };

  /*
   * Stop all local and remote tracks then leave the channel.
   */

  /*
   * Add the local use to a remote channel.
   *
   * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
   * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
   */
  async function subscribe(user: any, mediaType: any) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log('subscribe success');
    /*
  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist").append(player);
    user.videoTrack.play(`player-${uid}`);
  }
  */
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  /*
   * Add a user who has subscribed to the live channel to the local interface.
   *
   * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
   * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
   */
  function handleUserPublished(user: any, mediaType: any) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
  }

  /*
   * Remove the user specified from the channel in the local interface.
   *
   * @param  {string} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to remove.
   */
  function handleUserUnpublished(user: any, mediaType: any) {
    if (mediaType === 'video') {
      const id = user.uid;
      delete remoteUsers[id];
      //$(`#player-wrapper-${id}`).remove();
    }
  }

  // web 실행시 주석 필요
  appRuntime.on('isFrameWide', (event: any, data: boolean) => {
    setFrameWide(data);
  });

  appRuntime.on('isFrameMin', (event: any, data: boolean) => {
    setFrameMin(data);
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

  // useEffect(() => {
  //   setInterval(() => {
  //     getRefleshAPI();
  //   }, 5000);
  // });

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

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <Header title={intl.formatMessage({ id: 'session' })} type='session' />
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
            <FlexRowSpaceBCenter>
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
            codeList.map((list: any, index: number) => (
              <SessionTransListBox
                key={`${list.lang_title}_${index}`}
                active={list.status !== 'close'}
              >
                <p>{list.lang_title}</p>
                <FlexRowCenterStart>
                  <PlayBtn
                    onClick={() => {
                      setSessionCode(list.session_code);
                      joinChannel(
                        list.channel_name,
                        list.listen_token,
                        list.session_code
                      );
                      setCurrTrans(index);
                    }}
                  >
                    <img
                      src='images/ic_play.png'
                      style={{ width: 27, height: 27 }}
                      alt='플레이중 스톱 아이콘'
                      title='플레이중 스톱 아이콘'
                    />
                  </PlayBtn>
                  <PlayBtn
                    onClick={() => {
                      leaveChannel();
                    }}
                  >
                    <img
                      src='images/ic_stop.png'
                      style={{ width: 27, height: 27 }}
                      alt='플레이중 스톱 아이콘'
                      title='플레이중 스톱 아이콘'
                    />
                  </PlayBtn>
                </FlexRowCenterStart>
              </SessionTransListBox>
            ))
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
              <SessionTransListBox key={index} active={list.status !== 'close'}>
                <p>{list.file_name}</p>
                <img
                  src='images/ic_download.png'
                  style={{ width: 27, height: 27 }}
                  alt='플레이중 스톱 아이콘'
                  title='플레이중 스톱 아이콘'
                />
              </SessionTransListBox>
            ))
          ) : (
            <FlexCenterCenter style={{ minHeight: '30vh' }}>
              <p>현재 등록된 파일이 없습니다.</p>
            </FlexCenterCenter>
          ))}
        {/* //자료함 탭 선택일 경우  */}

        <Margin type='bottom' size={50} />
      </Wrapper>
      {isMin && codeList?.length > 0 && currTrans !== -1 && (
        <SessionTransListBox active={codeList[currTrans].status !== 'close'}>
          <p>{codeList[currTrans].lang_title}</p>
          <FlexRowCenterStart>
            {codeList[currTrans].status !== 'close' && (
              <img
                src='images/ic_eq.png'
                style={{
                  width: 20,
                  objectFit: 'contain',
                  marginRight: 10,
                }}
                alt='플레이중 아이콘'
                title='플레이중 아이콘'
              />
            )}
            {codeList[currTrans].status === 'open' && !isConnect && (
              <PlayBtn
                onClick={() => {
                  joinChannel(
                    codeList[currTrans].channel_name,
                    codeList[currTrans].listen_token,
                    codeList[currTrans].session_code
                  );
                }}
              >
                <img
                  src='images/ic_play.png'
                  style={{ width: 27, height: 27 }}
                  alt='플레이중 스톱 아이콘'
                  title='플레이중 스톱 아이콘'
                />
              </PlayBtn>
            )}
            {codeList[currTrans].status === 'open' && isConnect && (
              <PlayBtn
                onClick={() => {
                  leaveChannel();
                }}
              >
                <img
                  src='images/ic_stop.png'
                  style={{ width: 27, height: 27 }}
                  alt='플레이중 스톱 아이콘'
                  title='플레이중 스톱 아이콘'
                />
              </PlayBtn>
            )}
            {codeList[currTrans].status === 'close' && (
              <img
                src='images/ic_play.png'
                style={{ width: 27, height: 27, opacity: 0.25 }}
                alt='플레이중 스톱 아이콘'
                title='플레이중 스톱 아이콘'
              />
            )}
            <PlayBtn
              onClick={() => {
                leaveChannel();
              }}
            >
              <img
                src='images/ic_stop.png'
                style={{ width: 27, height: 27 }}
                alt='플레이중 스톱 아이콘'
                title='플레이중 스톱 아이콘'
              />
            </PlayBtn>
          </FlexRowCenterStart>
        </SessionTransListBox>
      )}
      {isMin && codeList?.length === 0 && (
        <FlexCenterCenter style={{ minHeight: '30vh' }}>
          <p>현재 등록된 통역사가 없습니다.</p>
        </FlexCenterCenter>
      )}
    </Container>
  );
};

export default SessionDetail;
