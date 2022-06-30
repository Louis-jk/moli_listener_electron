import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import '../src/styles/global.css';
import Pages from './routes';
import en from './language/en-US';
import ko from './language/ko-KR';
import { useDispatch, useSelector } from 'react-redux';
import { localeUpdate } from './store/localeReducer';
import { RootState } from './store';

function App() {
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);

  const message = locale === 'ko' ? ko : en;

  const localeUpdateHandler = () => {
    const naviLocale = navigator.language;

    let filterLocale = naviLocale;
    if (naviLocale === 'en-US') {
      filterLocale = 'en';
    }
    dispatch(localeUpdate(filterLocale));
  };

  useEffect(() => {
    localeUpdateHandler();
    return () => localeUpdateHandler();
  }, []);

  return (
    <React.StrictMode>
      <IntlProvider locale={locale} messages={message}>
        <Pages />
      </IntlProvider>
    </React.StrictMode>
  );
}

export default App;
