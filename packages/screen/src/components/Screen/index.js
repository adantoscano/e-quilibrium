import React from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { Stage, Layer, Line, Text } from 'react-konva';
import QRCode from 'qrcode.react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'

class Screen extends React.Component {
  constructor() {
    super()
    this.state = {
      answer: '',
      offer: '',
      dataReceived: '',
      dataToSend: '',
      isConnected: false,
      points: [],
      gData: {
        x: 0,
        y: 0
      },
    }

    this.peer = new Peer({
      initiator: true,
      trickle: false
    });

    this.canvasHeight = window.innerWidth
    this.canvasWidth = window.innerWidth
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
      this.setState({ isConnected: true })
    })

    this.peer.on('data', dataReceived => {
      console.log(`dataReceived: ${dataReceived}`)
      this.setState({ dataReceived })
      const [gamma, beta] = dataReceived.toString().split(',');
      console.log(`gamma: ${gamma}`)
      console.log(`beta: ${beta}`)
      const x = parseFloat(gamma).toPrecision(5);
      const y = parseFloat(beta).toPrecision(5);
      const canvasCenterX = this.canvasHeight/2;
      const canvasCenterY = this.canvasWidth/2;
      const canvasX = Math.abs(x) <= 90 ? parseInt(x*(this.canvasHeight/180)+(canvasCenterX)) : null;
      const canvasY = Math.abs(y) <= 90 ? parseInt(y*(this.canvasWidth/180)+(canvasCenterY)) : null;
      console.log(`canvasHeight: ${this.canvasHeight}`);
      console.log(`canvasWisth: ${this.canvasWidth}`);
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
        <Stage
          height={this.canvasHeight}
          width={this.canvasWidth}
        >
          <Layer>
            <Text text="Just start drawing" x={5} y={30} />
            <Line
              points={this.state.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
            />
          </Layer>
        </Stage>
        <div>
          {this.state.offer}
        </div>
        {this.state.offer && <QRCode value={this.state.offer} />}
        <Form>
          <TextArea placeholder='Send data to peer' onChange={e => this.setState({ dataToSend: e.target.value })} />
          <Button onClick={this.handleSubmitData} />
        </Form>
        {this.state.gData.x} <br />
        {this.state.gData.y} <br />
      </div>
    );
  }
}

export default Screen;
