import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircleBtnNext,
  Container,
  FlexColumnCenterCenter,
  FlexColumnSpaceBCenter,
  InfoDesc,
  InfoTitle,
  InputBox,
  InputWrapper,
  Margin,
  PointText,
} from '../styles/Common.Styled';

const Code = () => {
  const navigate = useNavigate();

  console.log('navigate', navigate);

  const nextHandler = () => {
    navigate('/list');
  };

  return (
    <Container>
      <FlexColumnCenterCenter style={{ height: '100%' }}>
        <InfoTitle>코드입력</InfoTitle>
        <Margin type='bottom' size={10} />
        <InfoDesc>코드를 입력해주세요</InfoDesc>

        <Margin type='bottom' size={50} />

        <InputWrapper>
          <InputBox type='text' placeholder='HO-DDD-45465' />
        </InputWrapper>

        <Margin type='bottom' size={10} />

        <p>
          <PointText>코드입력 후 아래 버튼을 눌러주세요</PointText>
        </p>

        <Margin type='bottom' size={100} />

        <CircleBtnNext onClick={nextHandler}>
          <img
            src='/assets/images/code_btn.png'
            alt='다음 버튼'
            title='다음 버튼'
          />
          <p>다음</p>
        </CircleBtnNext>
      </FlexColumnCenterCenter>
    </Container>
  );
};

export default Code;
