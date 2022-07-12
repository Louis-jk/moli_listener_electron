import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { Container } from '../../../styles/Common.Styled';

const Callback = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('콜백 성공 ?');
  console.log('code ?', code);

  return (
    <Container>
      <Header title='CallBack' type='main' />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#fff',
        }}
      >
        <p style={{ color: '#000' }}>CODE!!!!!</p>
        <p style={{ color: '#000' }}>{code}</p>
      </div>
    </Container>
  );
};
export default Callback;
