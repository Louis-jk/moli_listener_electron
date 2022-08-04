import React, { useEffect, useRef, useState } from 'react';
import { AudioBarProp } from '../interfaces/components.interface';

const AudioBar: React.FC<AudioBarProp> = ({ vol }) => {
  console.log('AudioBar vol ??', vol);

  const [pidCount, setPidCount] = useState(53);

  // const winWidth = window.innerWidth;
  // console.log('winWidth ??', winWidth);

  // useEffect(() => {
  //   if (winWidth < 380) {
  //     let width = winWidth - 330;
  //     // let addCount = width / 3 + pidCount;

  //     setPidCount((prev) => prev - 1);
  //   } else {
  //     setPidCount(53);
  //   }
  // }, [winWidth]);

  let amountOfPids = 0;

  useEffect(() => {
    console.log('AudioBar prop vol?', vol);

    const pids = document.getElementsByClassName('pid');

    let propVol = vol * 10;
    amountOfPids = Math.round(propVol / (100 / pids.length));
    // let amountOfPids = Math.round(propVol / 10);
    // let elemRange = pids.slice(0, amountOfPids);

    console.log('amountOfPids?', amountOfPids);

    if (propVol > 0) {
      // const pidAnime = setInterval(() => {
      for (var i = 0; i < pids.length; i++) {
        if (amountOfPids > i) {
          pids[i].classList.add('on');
        } else {
          pids[i].classList.remove('on');
        }
      }
      // }, 100);

      // return () => clearInterval(pidAnime);
    } else {
      for (var i = 0; i < pids.length; i++) {
        pids[i].classList.remove('on');
      }
    }
  }, [vol]);

  return (
    <div className='audio-progress'>
      {Array(50)
        .fill(0)
        .map((pid: any, index: number) => (
          <div key={index} className='pid'></div>
        ))}
    </div>
  );
};

export default AudioBar;
