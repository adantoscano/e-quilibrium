import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react';
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
      gData: {
        x: 0,
        y: 0,
        z: 0
      },
      points: []
    }

    this.radarSize = Math.min(window.innerHeight, window.innerWidth);

    this.handleOrientation = event => {
      const { absolute, alpha, beta, gamma } = event;
      console.log({ absolute, alpha, beta, gamma })
      const x = parseFloat(gamma).toPrecision(5);
      const y = parseFloat(beta).toPrecision(5);
      const canvasCenterX = this.radarSize/2;
      const canvasCenterY = this.radarSize/2;
      const canvasX = Math.abs(x) <= 90 ? parseInt(x*(this.radarSize/180)+(canvasCenterX)) : null;
      const canvasY = Math.abs(y) <= 90 ? parseInt(y*(this.radarSize/180)+(canvasCenterY)) : null;
      console.log(`canvasHeight: ${this.radarSize}`);
      console.log(`canvasWisth: ${this.radarSize}`);
      console.log(`canvasX: ${canvasX}`);
      console.log(`canvasY: ${canvasY}`);
      if (canvasX && canvasY){
        this.setState({
          gData: {
            x,
            y
          },
          points: [...this.state.points, parseInt(canvasX), parseInt(canvasY)]
        })
      }
      console.log(this.state.points);
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
    window.addEventListener('deviceorientation', this.handleOrientation, true);

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
      this.setState({data: JSON.stringify(data)})
    })
  }

  handleSubmitData = () => {
    this.peer.send(this.state.dataToSend);
  }

  handleScan = async data => {
    if (!this.state.qrData && data) {
      this.setState({
        qrData: data
      })
      const res = await axios(data);
      this.peer.signal(res.data.offer);
    }
  }

  render() {
    return (
      <div>
        <Radar
          x={this.state.points[this.state.points.length - 2]}
          y={this.state.points[this.state.points.length - 1]}
          points={this.state.points}
          size={this.radarSize} />
        {this.state.answer}
        <Form>
          <TextArea placeholder='Send to Peer' onChange={e => this.setState({ dataToSend: e.target.value })} />
          <Button onClick={this.handleSubmitData}/>
        </Form>
        {this.state.data.toString()} <br />
        {this.state.gData.x} <br />
        {this.state.gData.y} <br />
        {this.state.gData.z} <br />
        {this.state.qrData} <br />
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
        />
      </div>
    );
  }
}

export default Device;
