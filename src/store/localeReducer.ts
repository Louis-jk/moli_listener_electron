import { createSlice } from '@reduxjs/toolkit';

interface LocaleProps {
  locale: string;
}

const initialState: LocaleProps = {
  locale: '',
};

export const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    localeUpdate: (state: any, action: any) => {
      state.locale = action.payload;
    },
  },
});

export const { localeUpdate } = localeSlice.actions;

export default localeSlice.reducer;
