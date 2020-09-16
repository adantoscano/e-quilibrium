import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react'

class Device extends React.Component {
  constructor () {
    super()
    this.state = {
      answer: '',
      offer: '',
      data: ''
    }

    this.peer = new Peer({
      trickle: false
    });

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data))
      this.setState({ answer: JSON.stringify(data)})
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.peer.send('whatever' + Math.random())
    })

    this.peer.on('data', data => {
      console.log('data: ' + data)
      this.setState({data})
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
          <TextArea placeholder='paste de offer here' onChange={e=>this.setState({offer: e.target.value})} />
          <Button onClick={this.handleSubmitOffer}/>
        </Form>
        {this.state.data}
      </div>
    );
  }
}

export default Device;
