import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlexRowSpaceBCenter,
  GoBackBtn,
  SettingBtn,
} from '../styles/Common.Styled';

interface Props {
  title: string;
}
const Header: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate('/code');
  };

  return (
    <FlexRowSpaceBCenter style={{ padding: '1rem 0' }}>
      <GoBackBtn onClick={goBackHandler} />
      <h3>{title}</h3>
      <SettingBtn />
    </FlexRowSpaceBCenter>
  );
};

export default Header;
