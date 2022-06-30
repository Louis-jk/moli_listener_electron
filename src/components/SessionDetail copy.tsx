import axios from 'axios';
import QueryString from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '../styles/Common.Styled';
import { ConferenceTitle } from '../styles/Lists.Styled';
import {
  PlayBtn,
  SessionMainInfoBox,
  SessionMinDescWrapper,
  SessionTransListBox,
} from '../styles/SessionDetail.Styled';
import { theme } from '../styles/Theme';
import Header from './Header';
import Loading from './Loading';
import appRuntime from '../appRuntime';
import { RootState } from '../store';

interface ItemProps {
  text: string;
}

const TABS = [
  {
    id: 0,
    label: '통역',
  },
  {
    id: 1,
    label: '자료함',
  },
];

const SessionDetail = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();

  const { isMin } = useSelector((state: RootState) => state.frame);
  const { locale } = useSelector((state: RootState) => state.locale);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [codeList, setCodeList] = useState<any[]>([]); // 통역사 리스트
  const [fileList, setFileList] = useState<any[]>([]); // 자료함 리스트
  const [sessionDate, setSessionDate] = useState<string>(''); // 세션 날짜 정보
  const [sessionTitle, setSessionTitle] = useState<string>(''); // 세션 타이틀
  const [sessionContent, setSessionContent] = useState<string>(''); // 세션 컨텐츠(내용)
  const [sessionImg, setSessionImg] = useState<string>(''); // 세션 이미지
  const [selectTabNum, setSelectTabNum] = useState<number>(0); // 선택 탭 번호

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
  const [localTracks, setLocalTracks] = useState<any>(null);

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

  // let localTracks: any;
  let localAudioTrack;
  let remoteUsers: any[] = [];
  let getVolumes = {};

  const client: IAgoraRTCClient = AgoraRTC.createClient({
    codec: 'vp8',
    mode: 'live',
  });

  client.setClientRole('audience');

  const joinChannel = async (channel: string, agoraToken: string) => {
    await client.setClientRole('audience');

    // client.on('user-published', handleUserPublished);
    // client.on('user-unpublished', handleUserUnpublished);

    const uid = await client.join(appId, channel, agoraToken, null);
    const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalTracks(localTrack);

    console.log('join localTrack?', localTrack);
    // await client.publish([localTrack]);
    // await client.unpublish();
    setConnect(true);

    console.log('publish success!');
  };

  const leaveChannel = async () => {
    console.log('leave localTracks?', localTracks);

    localTracks.stop();
    localTracks.close();

    remoteUsers = [];

    await client.leave();
    // client.removeAllListeners();
    setConnect(false);
  };

  // client.on('user-joined', (state) => {
  //   console.log('user-joined ::::::::::::::', state);
  // });

  client.on('user-published', async (user: any, mediaType: any) => {
    await client.subscribe(user, mediaType);

    console.log('mediaType ??', mediaType);

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  });

  client.on('user-unpublished', async (user: any) => {
    console.log('unpublished success', user);
  });

  client.on('user-left', (user: IAgoraRTCRemoteUser, reason: string) => {
    console.log('user Left success', user);
    console.log('user Left reason ?????', reason);

    client.unsubscribe(user);
  });

  appRuntime.on('isFrameWide', (event: any, data: boolean) => {
    setFrameWide(data);
  });

  appRuntime.on('isFrameMin', (event: any, data: boolean) => {
    setFrameMin(data);
  });

  const getSessinInfoAPI = () => {
    const params = {
      set_lang: locale,
      code_in: state.code,
      mt_idx: 20,
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
    if (state && state.code && typeof state.code === 'string') {
      getSessinInfoAPI();

      requestAPI();
      // return requestAPI();
    }
  }, [state]);

  useEffect(() => {
    setInterval(() => {
      getRefleshAPI();
    }, 5000);
  });

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

  function handleUserPublished(user: any, mediaType: any) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
  }

  function handleUserUnpublished(user: any, mediaType: any) {
    if (mediaType === 'video') {
      const id = user.uid;
      delete remoteUsers[id];
      //$(`#player-wrapper-${id}`).remove();
    }
  }

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

  console.log('codeList ??', codeList);

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <Header title='세션' type='session' />
      <Wrapper isFrameMin={isMin}>
        <Margin type='bottom' size={20} />

        {/* 세션 메인 안내 블럭 */}
        <SessionMainInfoBox imageSource={sessionImg} isFrameMin={isMin}>
          <p className='session_date'>
            <SpanPoint>{sessionDate}</SpanPoint>
          </p>
          <ConferenceTitle>{sessionTitle}</ConferenceTitle>

          <Item text={sessionContent} />
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
                  {list.status !== 'close' && (
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
                  {list.status === 'open' && !isConnect && (
                    <PlayBtn
                      onClick={() => {
                        joinChannel(list.channel_name, list.listen_token);
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
                  )}
                  {list.status === 'open' && isConnect && (
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
                  {list.status === 'close' && (
                    <img
                      src='images/ic_play.png'
                      style={{ width: 27, height: 27, opacity: 0.25 }}
                      alt='플레이중 스톱 아이콘'
                      title='플레이중 스톱 아이콘'
                    />
                  )}
                  {/* <PlayBtn
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
                  </PlayBtn> */}
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
                    codeList[currTrans].listen_token
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
