import React, { useState } from 'react';
import { Button } from 'semantic-ui-react'
import Canvas from './components/Canvas';
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
      { isScreen && <Canvas /> }
      { isDevice && 'Soy un móvil' }
    </div >
  );
}

export default App;
