import { useNavigate } from 'react-router-dom';
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

const Login = () => {
  const navigate = useNavigate();

  const goEmailLogin = () => {
    navigate('/emailLogin');
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

          <Button type='full' onClick={goEmailLogin}>
            이메일 로그인
          </Button>
          <Margin type='bottom' size={10} />
          <Button type='line'>이메일 계정 만들기</Button>
        </FlexColumnCenterCenter>

        <FlexColumnCenterCenter style={{ width: '100%' }}>
          <TextWhite style={{ marginBottom: 5 }}>
            <strong>SNS 게정으로 로그인</strong>
          </TextWhite>
          <p>SNS 게정으로 간편하게 로그인 하세요</p>
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
