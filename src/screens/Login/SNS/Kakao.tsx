import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import { Container } from '../../../styles/Common.Styled';

const Kakao = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('code ?', code);

  return (
    <Container>
      <Header title='' type='main' />
      <div
        style={{ display: 'flex', height: '100vh', backgroundColor: '#fff' }}
      >
        <p>CODE!!!!!</p>
        <p>{code}</p>
      </div>
    </Container>
  );
};
export default Kakao;
