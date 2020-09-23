import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react'

class Screen extends React.Component {
  constructor () {
    super()
    this.state = {
      answer: '',
      offer: '',
      dataReceived: '',
      dataToSend: '',
      isConnected: false
    }

    this.peer = new Peer({
      initiator: true,
      trickle: false
    });

    this.peer.on('error', err => console.log('error', err))

    this.peer.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data))
      this.setState({ offer: JSON.stringify(data)})
    })

    this.peer.on('connect', () => {
      console.log('CONNECT')
      this.setState({isConnected: true})
    })

    this.peer.on('data', dataReceived => {
      console.log('dataReceived: ' + dataReceived)
      this.setState({dataReceived})
    })
  }

  handleSubmitAnswer = () => {
    console.log(this.state.answer);
    this.peer.signal(JSON.parse(this.state.answer));
  }

  handleSubmitData = () => {
    console.log(this.state.answer);
    this.peer.send(this.state.dataToSend);
  }

  render() {
    return (
      <div>
        {this.state.isConnected ? 'CONNECTED' : 'OFFLINE'}
        {this.state.offer}
        <Form>
          <TextArea placeholder='paste de answer here' onChange={e=>this.setState({answer: e.target.value})} />
          <Button onClick={this.handleSubmitAnswer}/>
          <TextArea placeholder='Send data to peer' onChange={e=>this.setState({dataToSend: e.target.value})} />
          <Button onClick={this.handleSubmitData}/>
        </Form>
        {this.state.dataReceived}
      </div>
    );
  }
}

export default Screen;
