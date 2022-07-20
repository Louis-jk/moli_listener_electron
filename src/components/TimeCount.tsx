import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TimeCountProp } from '../interfaces/components.interface';
import { RootState } from '../store';
import {
  joinHoursUpdate,
  joinMinutesUpdate,
  joinSecondsUpdate,
  joinStateUpdate,
} from '../store/joinStateReducer';
import { FlexRowCenterCenter } from '../styles/Common.Styled';

const TimeCount: React.FC<TimeCountProp> = ({ start }) => {
  const dispatch = useDispatch();
  const { isJoin, seconds, minutes, hours } = useSelector(
    (state: RootState) => state.joinState
  );

  useEffect(() => {
    if (!isJoin || undefined) {
      dispatch(joinSecondsUpdate(0));
      dispatch(joinMinutesUpdate(0));
      dispatch(joinHoursUpdate(0));
    } else {
      let myInterval = setInterval(() => {
        dispatch(joinSecondsUpdate(seconds + 1));

        if (seconds === 59) {
          dispatch(joinMinutesUpdate(minutes + 1));
          dispatch(joinSecondsUpdate(0));
        }

        if (minutes === 59) {
          dispatch(joinHoursUpdate(hours + 1));
          dispatch(joinMinutesUpdate(0));
          dispatch(joinSecondsUpdate(0));
        }
      }, 1000);

      return () => {
        clearInterval(myInterval);
      };
    }
  });

  useEffect(() => {
    console.log('isJoin ?', isJoin);
    if (!isJoin) {
      dispatch(joinSecondsUpdate(0));
      dispatch(joinMinutesUpdate(0));
      dispatch(joinHoursUpdate(0));
    }
  }, [isJoin]);

  return (
    <FlexRowCenterCenter>
      {hours > 0 && (
        <>
          <p>{hours < 10 ? `0${hours}` : hours}</p>
          <p>:</p>
        </>
      )}
      <p>{minutes < 10 ? `0${minutes}` : minutes}</p>
      <p>:</p>
      <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
    </FlexRowCenterCenter>
  );
};

export default TimeCount;
