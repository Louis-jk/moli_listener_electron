import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexColumnCenterCenter,
  FlexColumnSpaceBCenter,
  FlexColumnSpaceECenter,
  FlexRowCenterCenter,
  FlexRowSpaceBCenter,
  Margin,
  TextWhite,
} from '../../styles/Common.Styled';
import { SnsLoginButton } from '../../styles/Login.Styled';

type LoginButtonType = 'login' | 'register';

const Login = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const onPressHandler = (type: LoginButtonType) => {
    if (type === 'login') {
      navigate('/emailLogin');
    } else {
      navigate('/terms');
    }
  };

  return (
    <Container>
      <Header title='' type='not' />
      <FlexColumnSpaceECenter style={{ height: '100%' }}>
        <FlexColumnCenterCenter style={{ width: '90%' }}>
          <img
            src='images/login_img.png'
            alt='MOLI 로고'
            title='MOLI 로고'
            style={{ width: '13vh' }}
          />
          <Margin type='bottom' size={80} />

          <Button type='full' onClick={() => onPressHandler('login')}>
            {intl.formatMessage({ id: 'emailLogin' })}
          </Button>
          <Margin type='bottom' size={10} />
          <Button type='line' onClick={() => onPressHandler('register')}>
            {intl.formatMessage({ id: 'emailSign' })}
          </Button>
        </FlexColumnCenterCenter>

        <FlexColumnCenterCenter style={{ width: '100%' }}>
          <TextWhite style={{ marginBottom: 5 }}>
            <strong>{intl.formatMessage({ id: 'snsLogintxt' })}</strong>
          </TextWhite>
          <p>{intl.formatMessage({ id: 'snsLoginDes' })}</p>
          <Margin type='bottom' size={30} />
          <FlexRowSpaceBCenter style={{ width: '70%' }}>
            <SnsLoginButton>
              <img
                src='images/btn_kakao.png'
                alt='MOLI 로고'
                title='MOLI 로고'
              />
            </SnsLoginButton>
            <SnsLoginButton>
              <img
                src='images/btn_naver.png'
                alt='MOLI 로고'
                title='MOLI 로고'
              />
            </SnsLoginButton>
            <SnsLoginButton>
              <img
                src='images/btn_google.png'
                alt='MOLI 로고'
                title='MOLI 로고'
              />
            </SnsLoginButton>
            <SnsLoginButton>
              <img
                src='images/btn_facebook.png'
                alt='MOLI 로고'
                title='MOLI 로고'
              />
            </SnsLoginButton>
          </FlexRowSpaceBCenter>
        </FlexColumnCenterCenter>
      </FlexColumnSpaceECenter>
    </Container>
  );
};

export default Login;
