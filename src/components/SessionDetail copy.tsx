import axios from 'axios';
import QueryString from 'qs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AgoraRTC from 'agora-rtc-sdk-ng';
// import AgoraRTC from 'agora-rtc-sdk';

import {
  Container,
  Divider,
  Tab,
  FlexRowSpaceBCenter,
  Margin,
  PointText,
  WhiteText,
  Wrapper,
  TabActiveBar,
  FlexRowCenterCenter,
  FlexRowCenterEnd,
  FlexRowCenterStart,
  FlexCenterCenter,
} from '../styles/Common.Styled';
import { ConferenceTitle } from '../styles/Lists.Styled';
import {
  PlayBtn,
  SessionMainInfoBox,
  SessionTransListBox,
} from '../styles/SessionDetail.Styled';
import { theme } from '../styles/Theme';
import Header from './Header';
import Loading from './Loading';

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

  const [isLoading, setLoading] = useState<boolean>(true);
  const [codeList, setCodeList] = useState<any[]>([]); // 통역사 리스트
  const [fileList, setFileList] = useState<any[]>([]); // 자료함 리스트
  const [sessionDate, setSessionDate] = useState<string>(''); // 세션 날짜 정보
  const [sessionTitle, setSessionTitle] = useState<string>(''); // 세션 타이틀
  const [sessionContent, setSessionContent] = useState<string>(''); // 세션 컨텐츠(내용)
  const [sessionImg, setSessionImg] = useState<string>(''); // 세션 이미지
  const [selectTabNum, setSelectTabNum] = useState<number>(0); // 선택 탭 번호

  // 아고라
  const [inCall, setInCall] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>('');
  const [agoraToken, setAgoraToken] = useState<string>('');
  const [agoraUId, setAgoraUId] = useState<any>(null);
  const [isConnect, setConnect] = useState<boolean>(false);
  const [users, setUsers] = useState<any>(null);

  const appId = process.env.REACT_APP_AGORA_APP_ID
    ? process.env.REACT_APP_AGORA_APP_ID
    : '';

  let rtc: any = {
    client: null,
    joined: false,
    pulished: false,
    localStream: null,
    remoteStream: [],
    params: {},
    localAudioTrack: null,
  };

  let option: any = {
    appId,
    channel: channelName,
    uid: null,
    token: agoraToken,
    key: null,
    secret: null,
  };

  const joinChannel = async (aChName: string, aToken: string) => {
    setChannelName(aChName);
    setAgoraToken(aToken);

    console.log('rtc ??????????', rtc);
    rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on('user-published', async (user: any, mediaType: any) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event
      await rtc.client.subscribe(user, mediaType);
      console.log('subscribe success');
      console.log('subscribe success mediaType', mediaType);
      setConnect(true);

      // If the remote user publishes an audio track.
      if (mediaType === 'audio') {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track.
        remoteAudioTrack.play();
      }

      // Listen for the "user-unpublished" event
      rtc.client.on('user-unpublished', async (user: any) => {
        // Unsubscribe from the tracks of the remote user.
        await rtc.client.unsubscribe(user);
        setConnect(false);
      });
    });

    const uid = await rtc.client.join(appId, aChName, aToken);
    setAgoraUId(uid);
  };

  function leaveEventHost(params: any) {
    rtc.client.unpublish(rtc.localStream, function (err: any) {
      console.log('publish failed');
      console.error(err);
    });
    rtc.client.leave(function (ev: any) {
      console.log(ev);
    });
  }

  function leaveEventAudience(params: any) {
    rtc.client.leave(
      function () {
        console.log('client leaves channel');
        //……
      },
      function (err: any) {
        console.log('client leave failed ', err);
        //error handling
      }
    );
  }

  const leaveChannel = async () => {
    console.log('나가기');
    rtc.localAudioTrack.close();
    // rtc.client.close();

    await rtc.client.leave();
  };

  console.log('isConnect', isConnect);

  const requestAPI = () => {
    const params = {
      set_lang: 'ko',
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
      requestAPI();
      // return requestAPI();
    }
  }, [state]);

  const Item: React.FC<ItemProps> = ({ text }) => {
    return (
      <WhiteText>
        {text.split('\n').map((txt: string, index: number) => (
          <p key={`session_content_${index}`}>
            {txt}
            <br />
          </p>
        ))}
      </WhiteText>
    );
  };

  // 세션 탭(통역, 자료함) 선택 핸들러
  const selectTabHandler = (id: number) => {
    setSelectTabNum(id);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Container>
      <Header title='세션' type='detail' />
      <Wrapper>
        <Margin type='bottom' size={20} />

        {/* 세션 메인 안내 블럭 */}
        <SessionMainInfoBox imageSource={sessionImg}>
          <p className='session_date'>
            <PointText>{sessionDate}</PointText>
          </p>
          <ConferenceTitle>{sessionTitle}</ConferenceTitle>

          <Item text={sessionContent} />
        </SessionMainInfoBox>
        {/* // 세션 메인 안내 블럭 */}

        <Margin type='bottom' size={35} />

        {/* 탭 */}
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
        {/* // 탭 */}

        {/* 통역 탭 선택일 경우  */}
        {selectTabNum === 0 &&
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
        {selectTabNum === 1 &&
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

        {/* 현재 플레이 되고 있는 상태 영역 - 플레이 한 시간 및 볼륨 표시 부분 */}
        {/* <p style={{ textAlign: 'right' }}>0:55</p> */}
        {/* // 현재 플레이 되고 있는 상태 영역 - 플레이 한 시간 및 볼륨 표시 부분 */}
        <Margin type='bottom' size={50} />
        <div onClick={leaveChannel} style={{ cursor: 'pointer' }}>
          <p>나가기</p>
        </div>
        {/* <div id='videos'>
          {users.length &&
            users.map((user: any) => <Video key={user.uid} user={user} />)}
        </div> */}
      </Wrapper>
    </Container>
  );
};

export default SessionDetail;
