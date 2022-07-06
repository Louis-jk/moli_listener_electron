import React, { useEffect, useMemo, useState } from 'react';
import { FlexRowCenterCenter } from '../styles/Common.Styled';

interface TimeCountProp {
  start: boolean;
}
const TimeCount: React.FC<TimeCountProp> = ({ start }) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  console.log('====================================');
  console.log('start ??', start);
  console.log('====================================');

  useEffect(() => {
    if (!start || undefined) {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      let myInterval = setInterval(() => {
        setSeconds(seconds + 1);

        if (seconds === 59) {
          setMinutes(minutes + 1);
          setSeconds(0);
        }

        if (minutes === 59) {
          setHours(hours + 1);
          setMinutes(0);
          setSeconds(0);
        }
      }, 1000);

      return () => {
        clearInterval(myInterval);
      };
    }
  });

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
