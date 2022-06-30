import React from 'react';
import Modal from 'react-modal';
import { FormattedMessage, useIntl } from 'react-intl';
import { theme } from '../../styles/Theme';
import {
  Divider,
  FlexRowSpaceBCenter,
  Margin,
  TextPoint,
  VerticalLine,
} from '../../styles/Common.Styled';
import { LangWrap, ModalButton } from '../../styles/Settings.Styled';
import { useDispatch, useSelector } from 'react-redux';
import { localeUpdate } from '../../store/localeReducer';
import { RootState } from '../../store';

interface LanguageModalProps {
  isOpen: boolean;
  close: () => void;
}
const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, close }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);

  // 언어변경
  const changeLocale = (payload: string) => {
    dispatch(localeUpdate(payload));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
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
        <LangWrap selected={locale === 'ko'} onClick={() => changeLocale('ko')}>
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
        <LangWrap selected={locale === 'en'} onClick={() => changeLocale('en')}>
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
  );
};

export default LanguageModal;
