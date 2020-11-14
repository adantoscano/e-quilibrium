import React from 'react';
import Peer from 'simple-peer';
import { Button, Input } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import axios from 'axios';

import Radar from '../Radar';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'

class Screen extends React.Component {
  constructor() {
    super()
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

    this.handleError = err => {
      console.error(err)
    }

    this.sendOrientation = event => {
      const { beta, gamma } = event;
      this.peer.send([gamma, beta]);
    }
  }

  componentDidMount() {
    this.peer = new Peer({
      initiator: true,
      trickle: false
    });

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', async data => {
      console.log('SIGNAL', JSON.stringify(data))
      const res = await axios.post(apiUrl, data);
      console.log('SIGNAL', JSON.stringify(res));
      this.setState({ offer: res.data });
      this.getServerAnswer();
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.setState({ isConnectedToDevice: true })
    })

    this.peer.on('data', dataReceived => {
      this.setState(JSON.parse(dataReceived.toString()));
    });
  }

  handleStartMeasure = () => {
    this.peer.send(JSON.stringify({
      startMeasure: true
    }));
  }

  handleStopMeasure = () => {
    this.setState({ startMeasure: false })
  }

  handleConnectToDevice = () => {
    this.peer = new Peer({
      initiator: true,
      trickle: false
    });

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', async data => {
      console.log('SIGNAL', JSON.stringify(data))
      const res = await axios.post(apiUrl, data);
      console.log('SIGNAL', JSON.stringify(res));
      this.setState({ offer: res.data });
      this.getServerAnswer();
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.setState({ isConnectedToDevice: true })
    })

    this.peer.on('data', dataReceived => {
      this.setState(JSON.parse(dataReceived.toString()));
    });
  }

  getServerAnswer = async () => {
    console.log('Getting');
    const res = await axios(this.state.offer);
    res.data && res.data.answer ?
      this.peer.signal(res.data.answer) :
      setTimeout(() => this.getServerAnswer(), 5000);
  }

  render() {
    return (
      <div>
        {!this.state.offer && <div> Generating data to sync... </div>}
        {this.state.offer && !this.state.isConnectedToDevice && <QRCode value={this.state.offer} includeMargin/>}
        {this.state.isConnectedToDevice &&
          <div>
          <Radar
            pointerX={this.state.orientation.x}
            pointerY={this.state.orientation.y}
            points={this.state.points}
            size={this.radarSize}
            maxTilt={this.state.maxTilt} />
          <Button onClick={this.handleStartMeasure}>Start measure</Button>
          <Button onClick={this.handleStopMeasure}>Stop measure</Button>
          <Button onClick={this.handleGetMaxTilt}>Get max tilt</Button>
          <Button onClick={() => this.setState({ points: [] })}>Clear measure</Button>
          <Input placeholder='Time in seconds' onChange={e => this.setState({ timerCount: e.target.value })} />
          <Button onClick={this.handleShowQRScanner}>Connect with screen</Button>
          <Button onClick={this.handleConnectToDevice}>Connect with device</Button>
          {this.state.timerCount} <br />
          {this.state.orientation.x} <br />
          {this.state.orientation.y} <br />
          {this.state.qrData} <br />
          {this.state.maxTilt} <br />
        </div>}
      </div>
    );
  }
}

export default Screen;
