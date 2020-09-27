import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { Gyroscope } from 'motion-sensors-polyfill';
import QrReader from 'react-qr-reader'
import axios from 'axios';

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
      }
    }

    this.gyroscope = new Gyroscope({ frequency: 60 });

    this.gyroscope.addEventListener('reading', () => {
      console.log("Angular velocity along the X-axis " + this.gyroscope.x);
      console.log("Angular velocity along the Y-axis " + this.gyroscope.y);
      console.log("Angular velocity along the Z-axis " + this.gyroscope.z);
      this.setState({
        gData: {
          x: this.gyroscope.x,
          y: this.gyroscope.y,
          z: this.gyroscope.z
        }
      })
    });

    this.gyroscope.start();

    this.peer = new Peer({
      trickle: false
    });
  }

  componentDidMount() {
    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', async data => {
      console.log('SIGNAL', JSON.stringify(data))
      const res = await axios.post(this.state.qrData, data);
      this.setState({ answer: res.data })
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.peer.send('whatever' + Math.random())
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
    if (data) {
      this.setState({
        qrData: data
      })
      this.peer.signal(await axios(data));
    }
  }

  handleError = err => {
    console.error(err)
  }

  render() {
    return (
      <div>
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
