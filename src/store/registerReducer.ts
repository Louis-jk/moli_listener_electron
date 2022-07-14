import { createSlice } from '@reduxjs/toolkit';
import { RegisterProps } from '../interfaces/store.interfaces';

const initialState: RegisterProps = {
  set_lang: '',
  mt_id: '',
  mt_name: '',
  mt_pwd: '',
  mt_pwd_re: '',
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerUpdate: (state: any, action: any) => {
      const parsePayload = JSON.parse(action.payload);
      const { set_lang, mt_id, mt_name, mt_pwd, mt_pwd_re } = parsePayload;
      state.set_lang = set_lang;
      state.mt_id = mt_id;
      state.mt_name = mt_name;
      state.mt_pwd = mt_pwd;
      state.mt_pwd_re = mt_pwd_re;
    },
  },
});

export const { registerUpdate } = registerSlice.actions;

export default registerSlice.reducer;
