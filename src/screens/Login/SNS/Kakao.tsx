import React from 'react';
import { useNavigate } from 'react-router-dom';

const Kakao = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  console.log('code ?', code);

  return <div style={{ backgroundColor: '#fff' }}>{code}</div>;
};
export default Kakao;
