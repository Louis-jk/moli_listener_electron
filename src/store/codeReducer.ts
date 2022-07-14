import { createSlice } from '@reduxjs/toolkit';
import { CodeProps } from '../interfaces/store.interfaces';

const initialState: CodeProps = {
  code: '',
};

export const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    codeUpdate: (state: any, action: any) => {
      state.code = action.payload;
    },
  },
});

export const { codeUpdate } = codeSlice.actions;

export default codeSlice.reducer;
