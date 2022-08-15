import React, { useCallback, useState, useMemo, useEffect } from 'react';

import {
  radToDeg,
  smoothDamp,
  smoothDampVector3,
  lerp,
} from '../../utils/helpers';

import './style.css';

const HALF_PI = Math.PI / 2;

const createData = () => ({
  velocity: 0,
  timestamp: -Infinity,
});

const data = {
  x: createData(),
  y: createData(),
  z: createData(),
};

function LevelMeter(props) {
  const [timestamp, setTimestamp] = useState(0);
  const [read, setRead] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const { x, y, z } = read;

  const handleEvent = useCallback((event) => {
    const accelerationData = event.accelerationIncludingGravity;

    setRead(accelerationData);
  }, [
    setRead,
  ]);

  useEffect(() => {
    window.addEventListener('devicemotion', handleEvent, true);

    return () => {
      window.removeEventListener('devicemotion', handleEvent);
    };
  }, []);

  const roll = Math.atan2(x, y);
  const pitch = -Math.atan2(z, x * Math.sin(roll) + y * Math.cos(roll));

  const meterStyle = {
    transform: `rotate(${radToDeg(roll)}deg)`,
  };

  if (!read) {
    return null;
  }

  const g = 50 + pitch * 10;
  const h = (pitch / HALF_PI) * 50;

  return (
    <>
      <div className='level-meter'>
        <div className='level-meter__meter' style={meterStyle}>
          <svg
            className='level-meter__sky'
            viewBox='0 0 100 100'>
            <path
              d={`M0,${g} c0,${h} 100,${h} 100,0 L100,0 L0,0 z`}
              fill='lightblue'
            />
          </svg>
          <div className='level-meter__ground' />
          <svg
            className='level-meter__ref'
            viewBox='0 0 100 100'>
            <line x1='0' y1='50' x2='50' y2='50' />
            <line x1='100' y1='50' x2='50' y2='50' />
          </svg>
        </div>
        <div className='level-meter__debug'>
          <div>pitch: {pitch.toFixed(3)}</div>
          <div>roll: {roll.toFixed(3)}</div>
          <div>h: {h.toFixed(3)}</div>
          <div>g: {g.toFixed(3)}</div>
          {['x', 'y', 'z'].map((attr) => (
            <div key={attr}>
              {attr}: {(read[attr] || 0).toFixed(3)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

LevelMeter.propTypes = {
  // ...
};

export default LevelMeter;
