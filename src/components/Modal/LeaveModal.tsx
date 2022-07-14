import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import Modal from 'react-modal';
import { theme } from '../../styles/Theme';
import {
  Divider,
  FlexRowSpaceBCenter,
  Margin,
  TextPoint,
  VerticalLine,
} from '../../styles/Common.Styled';
import { ModalButton } from '../../styles/Settings.Styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LeaveModalProps } from '../../interfaces/components.interface';

const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  close,
  setLeaveMemberSuccess,
  setLeaveMemberError,
  setLeaveResMsg,
}) => {
  const intl = useIntl();
  const { mt_idx, mt_id } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.locale);
  const navigate = useNavigate();

  const leaveMemberHandler = () => {
    const param = {
      set_lang: locale,
      mt_idx,
      mt_id,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/member_retire.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        console.log('회원 탈퇴 res', res);
        if (res.data.result === 'true') {
          setLeaveMemberSuccess(true);
          setLeaveMemberError(false);
          setLeaveResMsg(res.data.msg);
          close();
        } else {
          setLeaveMemberError(true);
          setLeaveMemberSuccess(false);
          setLeaveResMsg(res.data.msg);
          close();
        }
      })
      .catch((err: AxiosError) => {
        console.error('회원 탈퇴 Error', err);
      });
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
        <ModalButton height={45} onClick={leaveMemberHandler}>
          <TextPoint>
            <strong>{intl.formatMessage({ id: 'Withdrawalactive' })}</strong>
          </TextPoint>
        </ModalButton>
        <VerticalLine height={45} />
        <ModalButton height={45} onClick={close}>
          <p>
            <strong>{intl.formatMessage({ id: 'cancel' })}</strong>
          </p>
        </ModalButton>
      </FlexRowSpaceBCenter>
    </Modal>
  );
};

export default LeaveModal;
