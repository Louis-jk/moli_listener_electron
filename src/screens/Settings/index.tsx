import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { RootState } from '../../store';
import {
  Button,
  Container,
  Divider,
  FlexColumnSpaceBCenter,
  FlexRowSpaceBCenter,
  Margin,
  TextPoint,
  TextWhite,
  VerticalLine,
  Wrapper,
} from '../../styles/Common.Styled';
import { theme } from '../../styles/Theme';
import {
  LangWrap,
  ModalButton,
  SettingArrowImg,
} from '../../styles/Settings.Styled';
import { localeUpdate } from '../../store/localeReducer';
import { logout } from '../../store/loginReducer';
import { codeUpdate } from '../../store/codeReducer';
import LeaveModal from '../../components/Modal/LeaveModal';
import LanguageModal from '../../components/Modal/LanguageModal';
import { CustomNotify } from '../../styles/Login.Styled';
import Loading from '../../components/Loading';
import { SnsType } from '../../types';

const LOGOUT_REDIRECT_URI = 'https://change-all.com/listen_auth_callback';

const Settings = () => {
  const intl = useIntl();
  const { mt_id, login_type, sns_type, access_token } = useSelector(
    (state: RootState) => state.login
  );
  const { locale } = useSelector((state: RootState) => state.locale);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState<boolean>(true);

  const [langModalIsOpen, setLangModalOpen] = useState<boolean>(false); // 언어 변경 모달 상태
  const [leaveModalIsOpen, setLeaveModalOpen] = useState<boolean>(false); // 회원탈퇴 모달 상태

  const [isLeaveMemberSuccess, setLeaveMemberSuccess] =
    useState<boolean>(false);
  const [isLeaveMemberError, setLeaveMemberError] = useState<boolean>(false);
  const [isLeaveResMsg, setLeaveResMsg] = useState<string>('');
  const [isNotifyMsgVisible, setNotifyMsgVisible] = useState<boolean>(false);

  console.log('현재 유저의 로그인 타입 및 제반사항', [
    login_type,
    sns_type,
    access_token,
  ]);

  const notifyMsgVisibleHandler = () => {
    if (isLeaveMemberSuccess) {
      setNotifyMsgVisible(true);

      setTimeout(() => {
        setNotifyMsgVisible(false);
        dispatch(codeUpdate(''));
        dispatch(logout(true));
        navigate('/login');
      }, 2000);
    }

    if (isLeaveMemberError) {
      setNotifyMsgVisible(true);
      setTimeout(() => {
        setNotifyMsgVisible(false);
      }, 2000);
    }
  };

  useEffect(() => {
    notifyMsgVisibleHandler();
    return () => notifyMsgVisibleHandler();
  }, [isLeaveMemberSuccess, isLeaveMemberError]);

  // console.log('isLeaveMember ?', isLeaveMemberSuccess);
  // console.log('isNotifyMsgVisible ?', isNotifyMsgVisible);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [locale]);

  // 언어 변경 모달 닫기
  const closeLanguageModal = () => {
    setLangModalOpen(false);
  };

  // 회원탈퇴 모달 닫기
  const closeLeaveModal = () => {
    setLeaveModalOpen(false);
  };

  // 이용약관, 개인정보 처리방침 이동
  const goLink = (type: string) => {
    switch (type) {
      case 'terms':
        navigate('/termsOfUse');
        break;
      case 'privacy':
        navigate('/privacyPolicy');
        break;
      default:
        return;
    }
  };

  // SNS 계정 로그아웃 처리
  const snsLogoutHandler = (type: SnsType) => {
    if (type === 'kakao') {
      // fetch(`https://kapi.kakao.com/v1/user/logout`, {
      //   method: 'post',
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // })
      fetch(
        `https://kapi.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID_REST}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`,
        {
          method: 'get',
        }
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(logout(true));
          dispatch(codeUpdate(''));
          navigate('/login');
        })
        .catch((err) => console.error('kakao error', err));
    }

    if (type === 'naver') {
      console.log('naver logout');
    }

    if (type === 'google') {
      console.log('google logout');
    }

    if (type === 'facebook') {
      console.log('facebook logout');
    }

    dispatch(logout(true));
    dispatch(codeUpdate(''));
    navigate('/login');
  };

  // 로그아웃
  const logoutHandler = () => {
    if (login_type === 'email') {
      dispatch(logout(true));
      dispatch(codeUpdate(''));
      navigate('/login');
    } else {
      snsLogoutHandler(sns_type);
    }
  };

  // 비밀번호 변경
  const changePwdHandler = () => {
    navigate('/changePwd');
  };

  return isLoading ? (
    <Loading isTransparent={true} />
  ) : (
    <Container>
      {/* 언어 변경 모달 */}
      <LanguageModal isOpen={langModalIsOpen} close={closeLanguageModal} />
      {/* // 언어 변경 모달 */}

      {/* 회원탈퇴 모달 */}
      <LeaveModal
        isOpen={leaveModalIsOpen}
        close={closeLeaveModal}
        setLeaveMemberSuccess={setLeaveMemberSuccess}
        setLeaveMemberError={setLeaveMemberError}
        setLeaveResMsg={setLeaveResMsg}
      />
      {/* // 회원탈퇴 모달 */}

      <Header title={intl.formatMessage({ id: 'settings' })} type='general' />
      <Wrapper style={{ height: '100%' }}>
        <FlexColumnSpaceBCenter style={{ height: '100%' }}>
          <div style={{ width: '100%' }}>
            {/* 이메일 */}
            <FlexRowSpaceBCenter style={{ padding: '1.25rem 0' }}>
              <TextWhite>{intl.formatMessage({ id: 'email' })}</TextWhite>
              <small>{mt_id}</small>
            </FlexRowSpaceBCenter>
            {/* // 이메일 */}
            <Divider />

            {/* 이용약관 */}
            <FlexRowSpaceBCenter
              className='no_drag'
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => goLink('terms')}
            >
              <TextWhite>{intl.formatMessage({ id: 'tos' })}</TextWhite>
              <SettingArrowImg />
            </FlexRowSpaceBCenter>
            {/* // 이용약관 */}
            <Divider />

            {/* 개인정보 처리방침 */}
            <FlexRowSpaceBCenter
              className='no_drag'
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => goLink('privacy')}
            >
              <TextWhite>
                {intl.formatMessage({ id: 'privacysettitle' })}
              </TextWhite>
              <SettingArrowImg />
            </FlexRowSpaceBCenter>
            {/* // 개인정보 처리방침 */}
            <Divider />

            {/* 언어 */}
            <FlexRowSpaceBCenter
              className='no_drag'
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => setLangModalOpen(true)}
            >
              <TextWhite>{intl.formatMessage({ id: 'lang' })}</TextWhite>
              <SettingArrowImg />
            </FlexRowSpaceBCenter>
            {/* // 언어 */}
            <Divider />
          </div>
          <div style={{ width: '100%' }}>
            <Button type='full' onClick={logoutHandler}>
              {intl.formatMessage({ id: 'logout' })}
            </Button>
            <Margin type='top' size={10} />
            {login_type !== 'sns' && (
              <Button type='line' onClick={changePwdHandler}>
                {intl.formatMessage({ id: 'findpwchange' })}
              </Button>
            )}
            {login_type !== 'sns' && <Margin type='top' size={10} />}

            <Button type='grayLine' onClick={() => setLeaveModalOpen(true)}>
              {intl.formatMessage({ id: 'Withdrawaltit' })}
            </Button>
          </div>
        </FlexColumnSpaceBCenter>
      </Wrapper>

      <CustomNotify visible={isNotifyMsgVisible} error={isLeaveMemberError}>
        <TextWhite>{isLeaveResMsg}</TextWhite>
      </CustomNotify>
    </Container>
  );
};

export default Settings;
