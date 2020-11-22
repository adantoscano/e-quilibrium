import React from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'
import Radar from '../Radar';

function Results(props) {
  return (
    <Modal
      onClose={() => props.close()}
      defaultOpen
    >
      <Modal.Header>Select a Photo</Modal.Header>
      <Modal.Content image>
        <Radar
          pointerX={props.points[props.points.length - 2]}
          pointerY={props.points[props.points.length - 1]}
          points={props.points}
          size={props.size}
          maxTilt={props.maxTilt}
          />
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <p>
            We've found the following gravatar image associated with your e-mail
            address.
          </p>
          <p>Is it okay to use this photo?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => props.close()}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition='right'
          icon='checkmark'
          onClick={() => props.close()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default Results
