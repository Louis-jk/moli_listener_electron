import React, { useRef, useState } from 'react';
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
import { LangWrap, ModalButton } from '../../styles/Settings.Styled';
import { localeUpdate } from '../../store/localeReducer';
import { logout } from '../../store/loginReducer';
import { codeUpdate } from '../../store/codeReducer';

type ModalType = 'lang' | 'leave';

const Settings = () => {
  const intl = useIntl();
  const { mt_id } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.locale);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [langModalIsOpen, setLangModalOpen] = useState<boolean>(false); // 언어 변경 모달 상태
  const [leaveModalIsOpen, setLeaveModalOpen] = useState<boolean>(false); // 회원탈퇴 모달 상태

  // 모달(언어 변경, 회원탈퇴) 닫기 핸들러
  const closeModal = (type: ModalType) => {
    switch (type) {
      case 'lang':
        setLangModalOpen(false);
        break;
      case 'leave':
        setLeaveModalOpen(false);
        break;
      default:
        return false;
    }
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

  // 언어변경
  const changeLocale = (payload: string) => {
    dispatch(localeUpdate(payload));
  };

  // 로그아웃
  const logoutHandler = () => {
    dispatch(logout(true));
    dispatch(codeUpdate(''));
    // dispatch(localeUpdate(''));
    navigate('/login');
  };

  // 비밀번호 변경
  const changePwdHandler = () => {
    navigate('/changePwd');
  };

  return (
    <Container>
      <Modal
        isOpen={langModalIsOpen}
        onRequestClose={() => closeModal('lang')}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 100,
          },
          content: {
            textAlign: 'center',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            minWidth: 300,
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.colors.LIST_WRAP_COLOR,
            border: 'none',
            borderRadius: 7,
          },
        }}
        contentLabel='Example Modal'
        overlayClassName='modal_overay'
        shouldCloseOnOverlayClick={true}
      >
        <h3 style={{ marginBottom: 3 }}>
          {intl.formatMessage({ id: 'selectlangstit' })}
        </h3>
        <p>{intl.formatMessage({ id: 'selectlangsdes' })}</p>
        <Margin type='bottom' size={15} />
        <div>
          <LangWrap
            selected={locale === 'ko'}
            onClick={() => changeLocale('ko')}
          >
            <p>{intl.formatMessage({ id: 'ko' })}</p>
            <img
              src={
                locale === 'ko'
                  ? '/images/ic_check_on.png'
                  : '/images/ic_check_off.png'
              }
              alt={intl.formatMessage({ id: 'ko' })}
              title={intl.formatMessage({ id: 'ko' })}
            />
          </LangWrap>
          <Divider />
          <LangWrap
            selected={locale === 'en'}
            onClick={() => changeLocale('en')}
          >
            <p>{intl.formatMessage({ id: 'en' })}</p>
            <img
              src={
                locale === 'en'
                  ? '/images/ic_check_on.png'
                  : '/images/ic_check_off.png'
              }
              alt={intl.formatMessage({ id: 'en' })}
              title={intl.formatMessage({ id: 'en' })}
            />
          </LangWrap>
        </div>
      </Modal>

      <Modal
        isOpen={leaveModalIsOpen}
        onRequestClose={() => closeModal('leave')}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 100,
          },
          content: {
            textAlign: 'center',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            minWidth: 290,
            maxWidth: 300,
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.colors.LIST_WRAP_COLOR,
            border: 'none',
            borderRadius: 7,
            padding: '1.25rem 0 0 0',
          },
        }}
        contentLabel='Example Modal'
        overlayClassName='modal_overay'
        shouldCloseOnOverlayClick={false}
      >
        <h3 style={{ marginBottom: 3 }}>
          {intl.formatMessage({ id: 'Withdrawaltit' })}
        </h3>

        {intl
          .formatMessage({ id: 'Withdrawaldes' })
          .split('\n')
          .map((text: string) => (
            <p>
              {text}
              <br />
            </p>
          ))}

        <Margin type='bottom' size={20} />
        <Divider />
        <FlexRowSpaceBCenter>
          <ModalButton height={45}>
            <TextPoint>
              <strong>{intl.formatMessage({ id: 'Withdrawalactive' })}</strong>
            </TextPoint>
          </ModalButton>
          <VerticalLine height={45} />
          <ModalButton height={45} onClick={() => closeModal('leave')}>
            <p>
              <strong>{intl.formatMessage({ id: 'cancel' })}</strong>
            </p>
          </ModalButton>
        </FlexRowSpaceBCenter>
      </Modal>
      <Header title={intl.formatMessage({ id: 'settings' })} type='session' />
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
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => goLink('terms')}
            >
              <TextWhite>{intl.formatMessage({ id: 'tos' })}</TextWhite>
              <img
                src='/images/arrow.png'
                style={{ width: 10, height: 12, objectFit: 'contain' }}
                alt={intl.formatMessage({ id: 'tos' })}
                title={intl.formatMessage({ id: 'tos' })}
              />
            </FlexRowSpaceBCenter>
            {/* // 이용약관 */}
            <Divider />

            {/* 개인정보 처리방침 */}
            <FlexRowSpaceBCenter
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => goLink('privacy')}
            >
              <TextWhite>
                {intl.formatMessage({ id: 'privacysettitle' })}
              </TextWhite>
              <img
                src='/images/arrow.png'
                style={{ width: 10, height: 12, objectFit: 'contain' }}
                alt={intl.formatMessage({ id: 'privacysettitle' })}
                title={intl.formatMessage({ id: 'privacysettitle' })}
              />
            </FlexRowSpaceBCenter>
            {/* // 개인정보 처리방침 */}
            <Divider />

            {/* 언어 */}
            <FlexRowSpaceBCenter
              style={{ padding: '1.25rem 0', cursor: 'pointer' }}
              onClick={() => setLangModalOpen(true)}
            >
              <TextWhite>{intl.formatMessage({ id: 'lang' })}</TextWhite>
              <img
                src='/images/arrow.png'
                style={{ width: 10, height: 12, objectFit: 'contain' }}
                alt={intl.formatMessage({ id: 'lang' })}
                title={intl.formatMessage({ id: 'lang' })}
              />
            </FlexRowSpaceBCenter>
            {/* // 언어 */}
            <Divider />
          </div>
          <div style={{ width: '100%' }}>
            <Button type='full' onClick={logoutHandler}>
              {intl.formatMessage({ id: 'logout' })}
            </Button>
            <Margin type='top' size={10} />
            <Button type='line' onClick={changePwdHandler}>
              {intl.formatMessage({ id: 'findpwchange' })}
            </Button>
            <Margin type='top' size={10} />
            <Button type='grayLine' onClick={() => setLeaveModalOpen(true)}>
              {intl.formatMessage({ id: 'Withdrawaltit' })}
            </Button>
          </div>
        </FlexColumnSpaceBCenter>
      </Wrapper>
    </Container>
  );
};

export default Settings;
