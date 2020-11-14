import React from 'react';
import {withRouter} from 'react-router-dom'
import Peer from 'simple-peer';
import { Button, Input } from 'semantic-ui-react';
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react';
import axios from 'axios';

import Radar from '../Radar';

class Device extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      answer: '',
      offer: '',
      data: '',
      dataToSend: '',
      qrData: '',
      orientation: {
        x: 0,
        y: 0
      },
      points: [],
      timerCount: 0,
      showQRScanner: false,
      isConnectedToDevice: false,
      isConnectedToHUD: false,
      maxTilt: 45,
    }

    this.radarSize = Math.min(window.innerHeight, window.innerWidth);

    this.getPointer = event => {
      const { beta, gamma } = event;
      const x = parseFloat(gamma).toPrecision(5);
      const y = parseFloat(beta).toPrecision(5);
      if (x && y) {
        this.setState({
          orientation: {
            x,
            y
          }
        })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('deviceorientation', this.getPointer, true);
  }

  componentDidUpdate() {
    if(this.state.isConnectedToHUD) {
      this.peer.send(JSON.stringify({
        orientation: this.state.orientation,
        points: this.state.points,
        timerCount: this.state.timerCount
      }))
    }
  }

  sendOrientation = event => {
    const { beta, gamma } = event;
    this.peer.send([gamma, beta]);
  }

  handleError = err => {
    console.error(err)
  }

  handleStartMeasure = () => {
    if (parseInt(this.state.timerCount) > 0) {
      const initialTimer = this.state.timerCount;
      const interval = setInterval(() => {
        this.setState({ timerCount: this.state.timerCount - 1 })
        if (this.state.timerCount <= 0) {
          this.handleStopMeasure();
          this.setState({ timerCount: initialTimer })
          clearInterval(interval);
        }
      }, 1000);
    }
    window.addEventListener('deviceorientation', this.startMeasure, true);
  }

  startMeasure = event => {
    const { beta, gamma } = event;
    const x = parseFloat(gamma).toPrecision(5);
    const y = parseFloat(beta).toPrecision(5);
    if (x && y) {
      this.setState({
        points: [...this.state.points, x, y]
      })
    }
  }

  handleStopMeasure = () => {
    window.removeEventListener('deviceorientation', this.startMeasure, true);
    this.setState({ startMeasure: false })
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
    this.setState({ maxTilt: Math.max(this.state.maxTilt, Math.abs(x), Math.abs(y)) });
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
        case 'changeTimer':
          this.handleClearMeasure();
          this.setState({timerCount: dataJson.runValue})
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

  handleConnectToDevice = () => this.props.history.push('/screen')

  getServerAnswer = async () => {
    console.log('Getting');
    const res = await axios(this.state.offer);
    res.data && res.data.answer ?
      this.peer.signal(res.data.answer) :
      setTimeout(() => this.getServerAnswer(), 1000);
  }

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
        {this.state.offer && <QRCode value={this.state.offer} includeMargin/>}
        <Button onClick={this.handleStartMeasure}>Start measure</Button>
        <Button onClick={this.handleStopMeasure}>Stop measure</Button>
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
      </div>
    );
  }
}

export default withRouter(Device);
