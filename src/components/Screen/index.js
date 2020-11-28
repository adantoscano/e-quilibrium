import React from 'react';
import { withRouter } from 'react-router-dom'
import Peer from 'simple-peer';
import { Container, Button, Input } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import axios from 'axios';

import Radar from '../Radar';
import Results from '../Results';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'

class Screen extends React.Component {
  constructor(props) {
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
      measureFrequency: 50,
      timerCount: 0,
      showQRScanner: false,
      showResults: false,
      isConnectedToDevice: false,
      isConnectedToHUD: false,
      isRunningMeasure: false,
      maxTilt: 45,
    }
    this.radarSize = Math.min(window.innerHeight, window.innerWidth);
  }

  componentDidMount() {
    this.handleConnectToDevice();
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

    this.peer.on('close', () => {
      console.log('DISCONNECT')
      this.setState({ isConnectedToDevice: false })
      this.handleConnectToDevice();
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
      setTimeout(() => this.getServerAnswer(), 1000);
  }

  handleSendRun(option, value) {
    this.peer.send(JSON.stringify({ run: option, runValue: value }));
  }

  render() {
    return (
      <div>
        {!this.state.offer && <div> Generating data to sync... </div>}
        {this.state.offer && !this.state.isConnectedToDevice && <Container><QRCode value={this.state.offer} includeMargin/></Container>}
        {this.state.isConnectedToDevice &&
          <div>
            <Radar
              pointerX={this.state.orientation.x}
              pointerY={this.state.orientation.y}
              points={this.state.points}
              size={this.radarSize}
              maxTilt={this.state.maxTilt} />

            <Container textAlign='center'>
              { this.state.isRunningMeasure
                ? <Button fluid color='red' onClick={() => this.handleSendRun('stopMeasure')}>Stop measure</Button>
                : <Button fluid color='green' onClick={() => this.handleSendRun('startMeasure')}>Start measure</Button>
              }
              <Button fluid color='orange' onClick={() => this.handleSendRun('getCoB')}>Get CoB</Button>
              <Button onClick={() => this.props.history.push('/list')}>List Results</Button>
              <Button onClick={() => this.handleSendRun('getMaxTilt')}>Get max tilt</Button>
              <Button onClick={() => this.handleSendRun('clearMeasure')}>Clear measure</Button>
              <Input placeholder='Time in seconds' onChange={e => this.handleSendRun('changeTimer', e.target.value)} />
              <Button onClick={() => this.props.history.push('/')}>Connect with screen</Button>
              {this.state.timerCount} <br />
              {this.state.orientation.x} <br />
              {this.state.orientation.y} <br />
              {this.state.qrData} <br />
              {this.state.maxTilt} <br />
            </Container>
            {this.state.showResults &&
          <Results
            close={() => this.handleSendRun('closeResults')}
            points={this.state.points}
            maxTilt={this.state.maxTilt}
            />}
        </div>}
      </div>
    );
  }
}

export default withRouter(Screen);
