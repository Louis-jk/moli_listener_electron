import { configureStore } from '@reduxjs/toolkit';
import frameReducer from './frameControlReducer';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer';
import localeReducer from './localeReducer';
import codeReducer from './codeReducer';
import joinStateReducer from './joinStateReducer';

export const store = configureStore({
  reducer: {
    frame: frameReducer,
    login: loginReducer,
    register: registerReducer,
    locale: localeReducer,
    code: codeReducer,
    joinState: joinStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
