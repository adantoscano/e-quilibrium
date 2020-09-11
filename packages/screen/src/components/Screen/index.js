import React, { useEffect, useState } from 'react';
import Peer from 'simple-peer';

function Screen() {
  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');

  const p = new Peer({
    initiator: true,
    trickle: false
  })

  useEffect(() => {

    p.on('error', err => console.log('error', err))

    p.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data))
      setOffer(JSON.stringify(data))
    })

    p.on('connect', () => {
      console.log('CONNECT')
      p.send('whatever' + Math.random())
    })

    p.on('data', data => {
      console.log('data: ' + data)
    })
  },[])

  const handleSubmitAnswer = () => {
    p.signal(JSON.parse(answer))
  }

return (<div>{offer}</div>);
}

export default Screen;
