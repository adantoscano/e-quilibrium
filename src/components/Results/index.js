import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import Radar from '../Radar';

function getOveralStabilityIndex(points) {
  // points = [x1,y1,x2,y2,...]
  const { x, y } = points.reduce((acc, value, index) => {
    return index % 2
      ? {
          x: acc.x,
          y: acc.y + Math.pow(0-parseFloat(value), 2)
        }
      : {
          x: acc.x + Math.pow(0-parseFloat(value), 2),
          y: acc.y
        }
    }, {x:0, y:0});
  return Math.sqrt((x+y)/(points.length/2)).toPrecision(5) // points.length/2 = number of samples, sample = x1,y1
}

function getOveralStabilityDesviation(points) {
  // points = [x1,y1,x2,y2,...]
  const magnitudeArr = points.reduce((acc, value, index, arr) => {
    return index % 2
      ? [...acc, Math.sqrt(Math.pow(arr[index-1],2)+Math.pow(arr[index],2))]
      : acc
    }, []);
  const magnitudeSum = magnitudeArr.reduce((acc, value) => acc + value, 0);
  const meanDeflection = magnitudeSum / magnitudeArr.length;
  const desviationSum = magnitudeArr.reduce((acc, value) => acc + Math.sqrt(Math.pow(value - meanDeflection, 2)));
  return parseFloat(desviationSum / magnitudeArr.length).toPrecision(5);
}

function getPosteriorStabilityIndex(points) {
  // points = [x1,y1,x2,y2,...]
  const y = points.reduce((acc, value, index) => index % 2 ? acc + Math.pow(0 - parseFloat(value), 2) : acc, 0);
  return Math.sqrt(y/(points.length/2)).toPrecision(5) // points.length/2 = number of samples, sample = x1,y1
}

function getPosteriorStabilityDesviation(points) {
  // points = [x1,y1,x2,y2,...]
  const meanSum = points.reduce((acc, value, index) => index % 2 ? acc + parseFloat(value) : acc, 0);
  const meanDeflection = meanSum / (points.length / 2);
  const desviationSum = points.reduce((acc, value, index) => index % 2 ? acc + Math.sqrt(Math.pow(parseFloat(value) - meanDeflection, 2)) : acc, 0);
  return parseFloat(desviationSum/(points.length/2)).toPrecision(5) // points.length/2 = number of samples, sample = x1,y1
}

function getLateralStabilityIndex(points) {
  // points = [x1,y1,x2,y2,...]
  const x = points.reduce((acc, value, index) => index % 2 ? acc : acc + Math.pow(0 - parseFloat(value), 2), 0);
  return Math.sqrt(x/(points.length/2)).toPrecision(5) // points.length/2 = number of samples, sample = x1,y1
}

function getLateralStabilityDesviation(points) {
  // points = [x1,y1,x2,y2,...]
  const meanSum = points.reduce((acc, value, index) => index % 2 ? acc : acc + parseFloat(value), 0);
  const meanDeflection = meanSum / (points.length / 2);
  const desviationSum = points.reduce((acc, value, index) => index % 2 ? acc : acc + Math.sqrt(Math.pow(parseFloat(value)-meanDeflection, 2)), 0);
  return parseFloat(desviationSum/(points.length/2)).toPrecision(5) // points.length/2 = number of samples, sample = x1,y1
}

function Results({points, size, maxTilt, close}) {
  return (
    <Modal
      onClose={() => close()}
      defaultOpen
    >
      <Modal.Header>Results</Modal.Header>
      <Modal.Content image>
        <Radar
          pointerX={points[points.length - 2]}
          pointerY={points[points.length - 1]}
          points={points}
          size={size}
          maxTilt={maxTilt}
          />
        <p>Overal Stability Index: {getOveralStabilityIndex(points)}</p>
        <p>Overal Stability Desviation: {getOveralStabilityDesviation(points)}</p>
        <p>Antero/Posterior Stability Index: {getPosteriorStabilityIndex(points)}</p>
        <p>Antero/Posterior Stability Desviation: {getPosteriorStabilityDesviation(points)}</p>
        <p>Medial/Lateral Stability Index: {getLateralStabilityIndex(points)}</p>
        <p>Medial/Lateral Stability Desviation: {getLateralStabilityDesviation(points)}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => close()}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition='right'
          icon='checkmark'
          onClick={() => close()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default Results
