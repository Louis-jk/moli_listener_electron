import { createSlice } from '@reduxjs/toolkit';
import { LoginProps } from '../interfaces/store.interfaces';

const initialState: LoginProps = {
  login_type: null,
  sns_type: '',
  access_token: null,
  mt_idx: 0,
  mt_type: '',
  mt_id: '',
  mt_name: '',
  mt_level: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginUpdate: (state: any, action: any) => {
      const parsePayload = JSON.parse(action.payload);
      const {
        login_type,
        sns_type,
        access_token,
        mt_idx,
        mt_type,
        mt_id,
        mt_name,
        mt_level,
      } = parsePayload;
      state.login_type = login_type;
      state.sns_type = sns_type ? sns_type : '';
      state.access_token = access_token ? access_token : null;
      state.mt_idx = mt_idx;
      state.mt_type = mt_type;
      state.mt_id = mt_id;
      state.mt_name = mt_name;
      state.mt_level = mt_level;
    },
    logout: (state: any, action: any) => {
      state.login_type = null;
      state.sns_type = null;
      state.access_token = null;
      state.mt_idx = '';
      state.mt_type = '';
      state.mt_id = '';
      state.mt_name = '';
      state.mt_level = '';
    },
  },
});

export const { loginUpdate, logout } = loginSlice.actions;

export default loginSlice.reducer;
