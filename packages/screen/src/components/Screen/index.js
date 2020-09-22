import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react'

class Screen extends React.Component {
  constructor () {
    super()
    this.state = {
      answer: '',
      offer: '',
      data: ''
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
      this.peer.send('whatever' + Math.random())
    })

    this.peer.on('data', data => {
      console.log(data)
      this.setState({data})
    })
  }

  handleSubmitAnswer = () => {
    console.log(this.state.answer);
    this.peer.signal(JSON.parse(this.state.answer));
  }

  render() {
    return (
      <div>
        {this.state.offer}
        <Form>
          <TextArea placeholder='paste de answer here' onChange={e=>this.setState({answer: e.target.value})} />
          <Button onClick={this.handleSubmitAnswer}/>
        </Form>
        {this.state.data.toString()}
      </div>
    );
  }
}

export default Screen;
