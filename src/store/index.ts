import { configureStore } from '@reduxjs/toolkit';
import frameReducer from './frameControlReducer';
import loginReducer from './loginReducer';

export const store = configureStore({
  reducer: {
    frame: frameReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
