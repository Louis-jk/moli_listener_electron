import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import '../src/styles/global.css';
import Pages from './routes';
import en from './language/en-US';
import ko from './language/ko-KR';
import { useDispatch, useSelector } from 'react-redux';
import { localeUpdate } from './store/localeReducer';
import { RootState } from './store';
import appRuntime from './appRuntime';

function App() {
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const [systemLang, setSystemLang] = useState<string>('');

  // web 테스트시 아래 함수 실행
  // const localeUpdateHandler = () => {
  //   appRuntime.send('lang', null);

  //   const naviLocale = navigator.language;

  //   let filterLocale = naviLocale;
  //   if (naviLocale === 'en-US') {
  //     filterLocale = 'en';
  //   }
  //   dispatch(localeUpdate(filterLocale));
  // };

  // useEffect(() => {
  //   localeUpdateHandler();
  //   return () => localeUpdateHandler();
  // }, []);

  // electron 모드에선 아래 함수 실행
  const localeUpdateHandler = () => {
    let filterLocale = systemLang;
    if (systemLang !== 'ko') {
      filterLocale = 'en';
    }
    dispatch(localeUpdate(filterLocale));
  };

  useEffect(() => {
    appRuntime.send('lang', null);
    return () => appRuntime.send('lang', null);
  }, []);

  useEffect(() => {
    localeUpdateHandler();
    return () => localeUpdateHandler();
  }, [systemLang]);

  appRuntime.on('lang', (event: any, data: any) => {
    // console.log('electron lang event ?', event);
    console.log('electron lang data ?', data);
    setSystemLang(data);
  });

  // console.log('current Locale ?', locale);

  const message = locale === 'ko' ? ko : en;

  return (
    <React.StrictMode>
      <IntlProvider locale={locale} messages={message}>
        <Pages />
      </IntlProvider>
    </React.StrictMode>
  );
}

export default App;
