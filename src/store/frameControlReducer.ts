import { createSlice } from '@reduxjs/toolkit';

interface FrameConditional {
  isMin: boolean;
}
const initialState: FrameConditional = {
  isMin: false,
};

export const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    toggle: (state: any, action: any) => {
      state.isMin = action.payload;
    },
  },
});

export const { toggle } = frameSlice.actions;

export default frameSlice.reducer;
