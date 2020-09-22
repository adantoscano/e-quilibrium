import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { Gyroscope } from 'motion-sensors-polyfill';

class Device extends React.Component {
  constructor() {
    super()
    this.state = {
      answer: '',
      offer: '',
      data: '',
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

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data))
      this.setState({ answer: JSON.stringify(data) })
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.peer.send('whatever' + Math.random())
    })

    this.peer.on('data', data => {
      console.log('data: ' + data)
      this.setState({ data })
    })
  }

  handleSubmitOffer = () => {
    console.log(this.state.offer);
    this.peer.signal(JSON.parse(this.state.offer));
  }

  render() {
    return (
      <div>
        {this.state.answer}
        <Form>
          <TextArea placeholder='paste de offer here' onChange={e => this.setState({ offer: e.target.value })} />
          <Button onClick={this.handleSubmitOffer} />
        </Form>
        {this.state.data.toString()}
        {this.state.gData.x}
        {this.state.gData.y}
        {this.state.gData.z}
      </div>
    );
  }
}

export default Device;
