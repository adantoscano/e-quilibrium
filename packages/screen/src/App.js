import React, { useState } from 'react';
import { Button } from 'semantic-ui-react'
import Screen from './components/Screen'
import Device from './components/Device'
import './App.css';

function App() {
  const [isScreen, setScreen] = useState(false);
  const [isDevice, setDevice] = useState(false);

  const handleScreenButton = () => setScreen(true);
  const handleDeviceButton = () => setDevice(true);

  return (
    <div className="App">
      {
        (!isScreen && !isDevice) && <div> <Button onClick={handleScreenButton}>Screen</Button><Button onClick={handleDeviceButton}>Device</Button> </div>
      }
      { isScreen && <Screen /> }
      { isDevice && <Device /> }
    </div >
  );
}

export default App;
