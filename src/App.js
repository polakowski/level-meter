import React, { useState, useEffect } from 'react';
import { useLifecycles } from 'react-use';

import logo from './logo.svg';
import LevelMeter from './components/LevelMeter';

import './App.css';

const STATUS_PENDING = 'pending';
const STATUS_GRANTED = 'granted';
const STATUS_DENIED = 'denied';

function App() {
  const [appState, setAppState] = useState(STATUS_PENDING);

  useLifecycles(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'gyroscope' }).then((result) => {
        setAppState(result.state === 'granted' ? STATUS_GRANTED : STATUS_DENIED);
      });
    } else {
      alert('Permissions API not enabled');
      setAppState(STATUS_DENIED);
    }
  }, []);

  if (appState === STATUS_PENDING) {
    return null;
  }

  return (
    <div className="App">
      {
        appState === STATUS_GRANTED
          ? <LevelMeter />
          : <div>Gyroscope not supported or access was denied</div>
      }
    </div>
  );
}

export default App;
