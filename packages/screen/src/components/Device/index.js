import React, { useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { Button, Form, TextArea } from 'semantic-ui-react'

function Device() {
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
      setAnswer(JSON.stringify(data))
    })

    p.on('connect', () => {
      console.log('CONNECT')
      p.send('whatever' + Math.random())
    })

    p.on('data', data => {
      console.log('data: ' + data)
    })
  }, [])

  const handleSubmitOffer = () => {
    p.signal(JSON.parse(offer))
  }

  return (
    <div>
      {answer}
      <Form>
        <TextArea placeholder='paste de offer here' onChange={e=>setOffer(e.value)} />
        <Button onClick={handleSubmitOffer}/>
      </Form>
    </div>);
}

export default Device;
