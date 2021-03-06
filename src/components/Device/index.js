import React from 'react';
import { withRouter } from 'react-router-dom'
import Peer from 'simple-peer';
import { Button, Container, Input } from 'semantic-ui-react';
import QrReader from 'react-qr-reader'
import axios from 'axios';

import Radar from '../Radar';
import Results from '../Results';

class Device extends React.Component {
  constructor(props) {
    super();
    this.state = {
      answer: '',
      data: '',
      dataToSend: '',
      qrData: '',
      orientation: {
        x: 0,
        y: 0
      },
      cob: {
        x: 0,
        y: 0,
      },
      points: [],
      measureFrequency: 50,
      initialTimer: 20,
      timerCount: 20,
      maxTilt: 20,
      showQRScanner: false,
      showResults: false,
      isConnectedToHUD: false,
      isRunningMeasure: false,
    }
  }

  radarSize = Math.min(window.innerHeight, window.innerWidth);

  measureInterval = null;
  counterInterval = null;

  getPointer = event => {
    const { beta, gamma } = event;
    const x = parseFloat(gamma).toPrecision(5);
    const y = parseFloat(beta).toPrecision(5);
    if (x && y) {
      this.setState({
        orientation: {
          x: parseFloat(x - this.state.cob.x).toPrecision(5),
          y: parseFloat(y - this.state.cob.y).toPrecision(5)
        }
      })
    }
  }

  handleGetCenterOfBalance = () => {
    this.setState({ points: [], cob: { x: 0, y: 0 } })
    const interval = setInterval(() => {
      this.setState({
        points: [...this.state.points, this.state.orientation.x, this.state.orientation.y]
      })
    }, parseInt(1000/this.state.measureFrequency));
    setTimeout(() => {
      clearInterval(interval);
      this.getCenterOfBalance();
    }, 3000);
  }

  getCenterOfBalance = () => {
    const { x, y } = this.state.points.reduce((acc, value, index) => {
      return index % 2
        ? {
            x: acc.x,
            y: acc.y + parseFloat(value)
          }
        : {
            x: acc.x + parseFloat(value),
            y: acc.y
          }
      }, {x:0, y:0});
    const cob = {
      x: parseFloat(x/(this.state.points.length/2)).toPrecision(5),
      y: parseFloat(y/(this.state.points.length/2)).toPrecision(5),
    }
    this.setState({
      cob,
      points: []
    })
  }

  componentDidMount() {
    window.addEventListener('deviceorientation', this.getPointer, true);
  }

  componentDidUpdate() {
    if(this.state.isConnectedToHUD) {
      this.peer.send(JSON.stringify(this.state))
    }
  }

  handleError = err => {
    console.error(err)
  }

  handleStartMeasure = () => {
    this.setState({ isRunningMeasure: true })
    if (parseInt(this.state.timerCount) > 0) {
      this.setState({ initialTimer: this.state.timerCount });
      this.counterInterval = setInterval(() => {
        this.setState({ timerCount: this.state.timerCount - 1 })
        if (this.state.timerCount <= 0) {
          this.handleStopMeasure();
          this.setState({ timerCount: this.state.initialTimer })
          clearInterval(this.counterInterval);
        }
      }, 1000);
    }
    this.measureInterval = setInterval(() => {
      this.setState({
        points: [...this.state.points, this.state.orientation.x, this.state.orientation.y]
      })
    }, parseInt(1000/this.state.measureFrequency));
  }

  handleStopMeasure = () => {
    if (this.counterInterval) {
      clearInterval(this.counterInterval)
      this.setState({timerCount: this.state.initialTimer})
    }
    clearInterval(this.measureInterval);
    this.setState({ isRunningMeasure: false, showResults: true })
  }

  handleClearMeasure = () => this.setState({ points: [] })

  handleGetMaxTilt = () => {
    this.setState({ maxTilt: 0 });
    window.addEventListener('deviceorientation', this.getMaxTilt, true);
    setTimeout(() => window.removeEventListener('deviceorientation', this.getMaxTilt, true), 5000);
  }

  getMaxTilt = event => {
    const { beta, gamma } = event;
    const x = parseFloat(gamma).toPrecision(5);
    const y = parseFloat(beta).toPrecision(5);
    this.setState({ maxTilt: Math.max(this.state.maxTilt, Math.sqrt(x*x+y*y)) });
  }

  handleChangeSeconds = e => this.setState({ timerCount: e.target.value });

  handleShowQRScanner = () => {
    this.peer = new Peer({
      trickle: false
    });

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', async data => {
      console.log('SIGNAL', JSON.stringify(data))
      const res = await axios.post(this.state.qrData, data);
      this.setState({ answer: res.data })
    })

    this.peer.on('connect', () => {
      console.log('CONNECT');
      this.setState({isConnectedToHUD: true});
    })

    this.peer.on('close', () => {
      console.log('DISCONNECT');
      this.setState({isConnectedToHUD: false});
    })

    this.peer.on('data', data => {
      const dataJson = JSON.parse(data.toString());
      switch (dataJson.run) {
        case 'startMeasure':
          this.handleStartMeasure();
          break;
        case 'stopMeasure':
          this.handleStopMeasure();
          break;
        case 'getMaxTilt':
          this.handleGetMaxTilt();
          break;
        case 'clearMeasure':
          this.handleClearMeasure();
          break;
        case 'getCoB':
          this.handleGetCenterOfBalance();
          break;
        case 'changeTimer':
          this.setState({timerCount: dataJson.runValue})
          break;
        case 'closeResults':
          this.setState({showResults: false})
          break;
        default:
          break;
      }
    })

    this.setState({ showQRScanner: true });
  }

  handleScan = async data => {
    if(data) {
      this.setState({
        qrData: data,
        showQRScanner: false
      })
      const res = await axios(data);
      this.peer.signal(res.data.offer);
    }
  }

  handleConnectToDevice = () => this.props.history.push('/screen');

  render() {
    return (
      <div>
      { this.state.showQRScanner && <QrReader
        delay={300}
        onError={this.handleError}
        onScan={this.handleScan}
        style={{ width: '100%' }}
        /> }
        <Radar
          pointerX={this.state.orientation.x}
          pointerY={this.state.orientation.y}
          points={this.state.points}
          size={this.radarSize}
          maxTilt={this.state.maxTilt} />
        <Container textAlign='center'>
          { this.state.isRunningMeasure
            ? <Button fluid color='red' onClick={this.handleStopMeasure}>Stop measure</Button>
            : <Button fluid color='green' onClick={this.handleStartMeasure}>Start measure</Button>}
          <Button fluid color='orange' onClick={this.handleGetCenterOfBalance}>Get CoB</Button>
          <Button onClick={() => this.props.history.push('/list')}>List Results</Button>
          <Button onClick={this.handleGetMaxTilt}>Get max tilt</Button>
          <Button onClick={this.handleClearMeasure}>Clear measure</Button>
          <Input placeholder='Time in seconds' onChange={this.handleChangeSeconds} />
          <Button onClick={this.handleShowQRScanner}>Connect with screen</Button>
          <Button onClick={this.handleConnectToDevice}>Connect with device</Button>
          {this.state.timerCount} <br />
          {this.state.orientation.x} <br />
          {this.state.orientation.y} <br />
          {this.state.qrData} <br />
          {this.state.data} <br />
          {this.state.maxTilt} <br />
        </Container>
        {this.state.showResults &&
          <Results
            close={() => this.setState({showResults: false, points: [] })}
            points={this.state.points}
            maxTilt={this.state.maxTilt}
            />}
      </div>
    );
  }
}

export default withRouter(Device);
