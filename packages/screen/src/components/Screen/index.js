import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'

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
  }

  componentDidMount() {
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
      this.setState({isConnected: true})
    })

    this.peer.on('data', dataReceived => {
      console.log(`dataReceived: ${dataReceived}`)
      this.setState({dataReceived})
    })
  }

  getServerAnswer = async () => {
    console.log('Getting');
    const res = await axios(this.state.offer);
    res.data && res.data.answer ?
      this.peer.signal(res.data.answer) :
      setTimeout(() => this.getServerAnswer(), 1000); 
  }

  handleSubmitData = () => {
    console.log(this.state.answer);
    this.peer.send(this.state.dataToSend);
  }

  render() {
    return (
      <div>
        <div>
        {this.state.isConnected ? 'CONNECTED' : 'OFFLINE'}
        </div>
        <div>
        {this.state.offer}
        </div>
        {this.state.offer && <QRCode value= {this.state.offer}/>}
        <Form>
          <TextArea placeholder='Send data to peer' onChange={e=>this.setState({dataToSend: e.target.value})} />
          <Button onClick={this.handleSubmitData}/>
        </Form>
        {this.state.dataReceived}
      </div>
    );
  }
}

export default Screen;
