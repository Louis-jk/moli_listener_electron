import { configureStore } from '@reduxjs/toolkit';
import frameReducer from './frameControlReducer';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import localeReducer from './localeReducer';
import codeReducer from './codeReducer';

export const store = configureStore({
  reducer: {
    frame: frameReducer,
    login: loginReducer,
    register: registerReducer,
    locale: localeReducer,
    code: codeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
