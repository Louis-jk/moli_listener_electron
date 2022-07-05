import React, { useEffect, useState } from 'react';

interface AudioBarProp {
  vol: number;
}
const AudioBar: React.FC<AudioBarProp> = ({ vol }) => {
  console.log('vol ??', vol);

  useEffect(() => {
    var bars = document.getElementsByClassName('bar');

    const volCtrl = setInterval(() => {
      for (var i = 0; i < bars.length; i++) {
        if (vol / (100 / bars.length) > i) {
          bars[i].classList.add('on');
        } else {
          bars[i].classList.remove('on');
        }
      }
    }, 800);

    // return () => clearInterval(volCtrl);
  }, [vol]);

  return (
    <div className='audio-progress'>
      {Array(64)
        .fill(0)
        .map((bar: any, index: number) => (
          <div key={index} className='bar'></div>
        ))}
    </div>
  );
};

export default AudioBar;
