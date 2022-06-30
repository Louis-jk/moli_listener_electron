import { createSlice } from '@reduxjs/toolkit';

interface LoginProps {
  mt_idx: number;
  mt_type: string;
  mt_id: string;
  mt_name: string;
  mt_level: string | number;
}

const initialState: LoginProps = {
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
      const { mt_idx, mt_type, mt_id, mt_name, mt_level } = parsePayload;
      state.mt_idx = mt_idx;
      state.mt_type = mt_type;
      state.mt_id = mt_id;
      state.mt_name = mt_name;
      state.mt_level = mt_level;
    },
    logout: (state: any, action: any) => {
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
