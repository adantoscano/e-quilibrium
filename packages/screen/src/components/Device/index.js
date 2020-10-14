import React from 'react';
import Peer from 'simple-peer';
import { Button, Input } from 'semantic-ui-react';
import QrReader from 'react-qr-reader'
import axios from 'axios';

import Radar from '../Radar';


class Device extends React.Component {
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
      showQRScaner: false,
    }

    this.radarSize = Math.min(window.innerHeight, window.innerWidth);

    this.getPointer = event => {
      const { beta, gamma } = event;
      const { x, y } = this.parseDegreesToCanvas(gamma, beta);
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

    this.peer = new Peer({
      trickle: false
    });

    this.sendOrientation = event => {
      const { beta, gamma } = event;
      this.peer.send([gamma, beta]);
    }
  }

  componentDidMount() {

    window.addEventListener('deviceorientation', this.getPointer, true);

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', async data => {
      console.log('SIGNAL', JSON.stringify(data))
      const res = await axios.post(this.state.qrData, data);
      this.setState({ answer: res.data })
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      window.addEventListener('deviceorientation', this.sendOrientation, true);
    })

    this.peer.on('data', data => {
      console.log('data: ' + data)
      this.setState({ data: JSON.stringify(data) })
    })
  }

  handleSubmitData = () => {
    this.peer.send(this.state.dataToSend);
  }

  handleScan = async data => {
    if (!this.state.qrData && data) {
      this.setState({
        qrData: data,
        showQRScaner: false
      })
      const res = await axios(data);
      this.peer.signal(res.data.offer);
    }
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

  handleStopMeasure = () => {
    window.removeEventListener('deviceorientation', this.startMeasure, true);
  }

  startMeasure = event => {
    const { beta, gamma } = event;
    const { x, y } = this.parseDegreesToCanvas(gamma, beta);
    if (x && y) {
      this.setState({
        points: [...this.state.points, parseInt(x), parseInt(y)]
      })
    }

  }

  parseDegreesToCanvas = (gamma, beta) => {
    const x = parseFloat(gamma).toPrecision(5);
    const y = parseFloat(beta).toPrecision(5);
    const canvasCenter = this.radarSize / 2;
    const canvasX = Math.abs(x) <= 90 ? parseInt(x * (this.radarSize / 180) + (canvasCenter)) : null;
    const canvasY = Math.abs(y) <= 90 ? parseInt(y * (this.radarSize / 180) + (canvasCenter)) : null;
    return { x: canvasX, y: canvasY };
  }

  render() {
    return (
      <div>
        { this.state.showQRScaner && <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
        /> }
        <Radar
          x={this.state.orientation.x}
          y={this.state.orientation.y}
          points={this.state.points}
          size={this.radarSize} />
        <Button onClick={this.handleStartMeasure}>Start measure</Button>
        <Button onClick={this.handleStopMeasure}>Stop measure</Button>
        <Button onClick={() => this.setState({ points: [] })}>Clear measure</Button>
        <Button onClick={() => this.setState({ showQRScaner: true })}>Connect with screen</Button>
        <Input placeholder='Time in seconds' onChange={e => this.setState({ timerCount: e.target.value })} />
        {this.state.timerCount} <br />
        {this.state.orientation.x} <br />
        {this.state.orientation.y} <br />
        {this.state.qrData} <br />
      </div>
    );
  }
}

export default Device;
