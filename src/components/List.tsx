import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  FlexRowStartCenter,
  InfoTitle,
  Margin,
  PointText,
  Wrapper,
} from '../styles/Common.Styled';
import Header from './Header';

const List = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header title='행사' />
      <Wrapper>
        <FlexRowStartCenter style={{ width: '100%' }}>
          <InfoTitle style={{ marginRight: 10 }}>세션목록</InfoTitle>
          <p>
            <PointText>4</PointText>
          </p>
        </FlexRowStartCenter>

        <Margin type='bottom' size={20} />

        <div />
      </Wrapper>
    </Container>
  );
};

export default List;
