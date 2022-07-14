import React, { useEffect, useRef, useState } from 'react';
import { AudioBarProp } from '../interfaces/components.interface';

const AudioBar: React.FC<AudioBarProp> = ({ vol }) => {
  console.log('vol ??', vol);

  useEffect(() => {
    const pids = document.getElementsByClassName('pid');

    let amountOfPids = Math.round(vol / (100 / pids.length));
    // let elemRange = pids.slice(0, amountOfPids);

    if (vol > 0) {
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
  });

  return (
    <div className='audio-progress'>
      {/* <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div>
      <div className='pid'></div> */}
      {Array(53)
        .fill(0)
        .map((pid: any, index: number) => (
          <div key={index} className='pid'></div>
        ))}
    </div>
  );
};

export default AudioBar;
