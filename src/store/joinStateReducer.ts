import { createSlice } from '@reduxjs/toolkit';
import { JoinStateProps } from '../interfaces/store.interfaces';

const initialState: JoinStateProps = {
  isJoin: false,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const joinStateSlice = createSlice({
  name: 'joinState',
  initialState,
  reducers: {
    joinStateUpdate: (state: any, action: any) => {
      state.isJoin = action.payload;
    },
    joinSecondsUpdate: (state: any, action: any) => {
      state.seconds = action.payload;
    },
    joinMinutesUpdate: (state: any, action: any) => {
      state.minutes = action.payload;
    },
    joinHoursUpdate: (state: any, action: any) => {
      state.hours = action.payload;
    },
  },
});

export const {
  joinStateUpdate,
  joinSecondsUpdate,
  joinMinutesUpdate,
  joinHoursUpdate,
} = joinStateSlice.actions;

export default joinStateSlice.reducer;
