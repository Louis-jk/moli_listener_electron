import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { AxiosError, AxiosResponse } from 'axios';
import QueryString from 'qs';
import Header from '../../components/Header';
import { RootState } from '../../store';
import { Container, Wrapper } from '../../styles/Common.Styled';

const TermsOfUse = () => {
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.locale);
  const [termsTxt, setTermsTxt] = useState<string>(''); // 이용약관

  // 이용약관
  const getAPI = () => {
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

  useEffect(() => {
    getAPI();
    return () => getAPI();
  }, []);

  return (
    <Container>
      <Header title={intl.formatMessage({ id: 'tos' })} type='general' />
      <Wrapper className='no_drag'>
        <div style={{ padding: '1rem' }}>
          <p dangerouslySetInnerHTML={{ __html: `${termsTxt}` }}></p>
        </div>
      </Wrapper>
    </Container>
  );
};

export default TermsOfUse;
