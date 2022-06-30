import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import Header from '../../components/Header';
import {
  Button,
  Container,
  FlexRowSpaceBCenter,
  Margin,
  Wrapper,
} from '../../styles/Common.Styled';
import {
  TermsCheckBox,
  TermsInnerWrap,
  TermsWrap,
} from '../../styles/Register.Styled';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Terms = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { locale } = useSelector((state: RootState) => state.locale);

  const [termsTxt, setTermsTxt] = useState<string>(''); // 이용약관
  const [privacyTxt, setPrivacyTxt] = useState<string>(''); // 개인정보 수집 및 동의
  const [marketingTxt, setMarketingTxt] = useState<string>(''); // 마케팅 활용동의
  const [checkTerms, setCheckTerms] = useState<boolean>(false); // 이용약관 check
  const [checkPrivacy, setCheckPrivacy] = useState<boolean>(false); // 개인정보 수집 및 동의 check
  const [checkMarketing, setCheckMarketing] = useState<boolean>(false); // 마케팅 활용동의 check

  // 이용약관
  const termsAPI = () => {
    const param = {
      set_lang: locale,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/agree1.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        if (res.data.result === 'true') {
          setTermsTxt(res.data.data);
        }
        console.log('이용약관 res', res);
      })
      .catch((err: AxiosError) => console.error('이용약관 error: ', err));
  };

  // 개인정보 수집 및 동의
  const privacyAPI = () => {
    const param = {
      set_lang: locale,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/agree2.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        if (res.data.result === 'true') {
          setPrivacyTxt(res.data.data);
        }
        console.log('이용약관 res', res);
      })
      .catch((err: AxiosError) => console.error('이용약관 error: ', err));
  };

  // 마케팅 활용동의
  const marketingAPI = () => {
    const param = {
      set_lang: locale,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/agree3.php`,
      data: QueryString.stringify(param),
    })
      .then((res: AxiosResponse) => {
        if (res.data.result === 'true') {
          setMarketingTxt(res.data.data);
        }
        console.log('이용약관 res', res);
      })
      .catch((err: AxiosError) => console.error('이용약관 error: ', err));
  };

  useEffect(() => {
    termsAPI();
    privacyAPI();
    marketingAPI();
  }, []);

  const goRegister = () => {
    if (!checkTerms) {
      alert(intl.formatMessage({ id: 'toserror' }));
    } else if (!checkPrivacy) {
      alert(intl.formatMessage({ id: 'privacyerror' }));
    } else if (!checkMarketing) {
      alert(intl.formatMessage({ id: 'marketingerror' }));
    } else {
      navigate('/register');
    }
  };

  const checkHandler = (type: string) => {
    switch (type) {
      case 'terms':
        setCheckTerms((prev: boolean) => !prev);
        break;
      case 'privacy':
        setCheckPrivacy((prev: boolean) => !prev);
        break;
      case 'market':
        setCheckMarketing((prev: boolean) => !prev);
        break;
      default:
        return false;
    }
  };

  return (
    <Container>
      <Header
        title={intl.formatMessage({ id: 'seviceagree' })}
        type='general'
      />
      <Wrapper>
        {/* 이용약관 */}
        <TermsWrap>
          <FlexRowSpaceBCenter>
            <h3>{intl.formatMessage({ id: 'tos' })}</h3>
            <TermsCheckBox
              checked={checkTerms}
              onClick={() => checkHandler('terms')}
            />
          </FlexRowSpaceBCenter>
          <Margin type='bottom' size={10} />
          <TermsInnerWrap>
            <p dangerouslySetInnerHTML={{ __html: `${termsTxt}` }}></p>
          </TermsInnerWrap>
        </TermsWrap>
        {/* // 이용약관 */}

        {/* 개인정보 수집 및 동의 */}
        <TermsWrap>
          <FlexRowSpaceBCenter>
            <h3>{intl.formatMessage({ id: 'privacy' })}</h3>
            <TermsCheckBox
              checked={checkPrivacy}
              onClick={() => checkHandler('privacy')}
            />
          </FlexRowSpaceBCenter>
          <Margin type='bottom' size={10} />
          <TermsInnerWrap>
            <p dangerouslySetInnerHTML={{ __html: `${privacyTxt}` }}></p>
          </TermsInnerWrap>
        </TermsWrap>
        {/* // 개인정보 수집 및 동의 */}

        {/* 마케팅 활용동의 */}
        <TermsWrap>
          <FlexRowSpaceBCenter>
            <h3>{intl.formatMessage({ id: 'marketing' })}</h3>
            <TermsCheckBox
              checked={checkMarketing}
              onClick={() => checkHandler('market')}
            />
          </FlexRowSpaceBCenter>
          <Margin type='bottom' size={10} />
          <TermsInnerWrap>
            <p dangerouslySetInnerHTML={{ __html: `${marketingTxt}` }}></p>
          </TermsInnerWrap>
        </TermsWrap>
        {/* // 마케팅 활용동의 */}
        <Margin type='top' size={10} />
        <Button type='full' onClick={goRegister}>
          {intl.formatMessage({ id: 'next' })}
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Terms;
