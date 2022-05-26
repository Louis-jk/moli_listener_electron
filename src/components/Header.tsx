import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Divider,
  FlexRowSpaceBCenter,
  GoBackBtn,
  SettingBtn,
  Wrapper,
} from '../styles/Common.Styled';

type HeaderType = 'main' | 'detail';
interface Props {
  type: HeaderType;
  title: string;
}
const Header: React.FC<Props> = ({ type, title }) => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <header>
      <Wrapper>
        <FlexRowSpaceBCenter style={{ padding: '0.75rem 0' }}>
          <GoBackBtn onClick={goBackHandler} />
          <h3>{title}</h3>
          {type !== 'detail' ? <SettingBtn /> : <div style={{ width: 30 }} />}
        </FlexRowSpaceBCenter>
      </Wrapper>
      <Divider />
    </header>
  );
};

export default Header;
