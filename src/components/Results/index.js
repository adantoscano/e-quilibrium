import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import localForage from 'localforage';

import Radar from '../Radar';
import Download from './ExcelExport';

async function savePoints(points) {
  try {
    const savedPoints = await localForage.getItem('points')
    await localForage.setItem('points', [...savedPoints, {
      date: new Date(),
      points,
    }]);
    alert('Saved!');
  } catch (error) {
    console.error(error);
  }
}

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
  const desviationSum = magnitudeArr.reduce((acc, value) => acc + Math.sqrt(Math.pow(value - meanDeflection, 2)), 0);
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

function getZonePercentage(points, maxTilt) {
  const pointsPerZone = points.reduce((acc, value, index, arr) => {
    if (!(index % 2)) return acc;
    const magnitude = Math.sqrt(Math.pow(arr[index-1], 2) + Math.pow(arr[index], 2));
    if (magnitude <= maxTilt/4) return Object.assign(acc, { a: acc.a + 1 });
    if (magnitude <= (maxTilt/4)*2) return Object.assign(acc, { b: acc.b + 1 });
    if (magnitude <= (maxTilt/4)*3) return Object.assign(acc, { c: acc.c + 1 });
    return Object.assign(acc, { d: acc.d + 1 });
  }, {a:0,b:0,c:0,d:0});

  return {
    a: parseFloat((pointsPerZone.a*100)/(points.length/2)).toPrecision(3),
    b: parseFloat((pointsPerZone.b*100)/(points.length/2)).toPrecision(3),
    c: parseFloat((pointsPerZone.c*100)/(points.length/2)).toPrecision(3),
    d: parseFloat((pointsPerZone.d*100)/(points.length/2)).toPrecision(3)
  }
}

function getQuadrantPercentage(points) {
  const pointsPerQuadrant = points.reduce((acc, value, index, arr) => {
    if (!(index % 2)) return acc;
    if (arr[index-1] < 0 && arr[index] < 0) return Object.assign(acc, { a: acc.a + 1 });
    if (arr[index-1] > 0 && arr[index] < 0) return Object.assign(acc, { b: acc.b + 1 });
    if (arr[index-1] < 0 && arr[index] > 0) return Object.assign(acc, { c: acc.c + 1 });
    return Object.assign(acc, { d: acc.d + 1 });
  }, {a:0,b:0,c:0,d:0});

  return {
    a: parseFloat((pointsPerQuadrant.a*100)/(points.length/2)).toPrecision(3),
    b: parseFloat((pointsPerQuadrant.b*100)/(points.length/2)).toPrecision(3),
    c: parseFloat((pointsPerQuadrant.c*100)/(points.length/2)).toPrecision(3),
    d: parseFloat((pointsPerQuadrant.d*100)/(points.length/2)).toPrecision(3)
  }
}

function Results({points, size, maxTilt, close}) {
  const zonePercentage = getZonePercentage(points, maxTilt);
  const quadrantPercentage = getQuadrantPercentage(points);
  const results = {
    osi: getOveralStabilityIndex(points),
    osd: getOveralStabilityDesviation(points),
    api: getPosteriorStabilityIndex(points),
    apd: getPosteriorStabilityDesviation(points),
    mli: getLateralStabilityIndex(points),
    mld: getLateralStabilityDesviation(points),
    zpA: zonePercentage.a,
    zpB: zonePercentage.b,
    zpC: zonePercentage.c,
    zpD: zonePercentage.d,
    qpI: quadrantPercentage.a,
    qpII: quadrantPercentage.b,
    qpIII: quadrantPercentage.c,
    qpIV: quadrantPercentage.d
  }
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
      </Modal.Content>
      <Modal.Description>
        <p>Overal Stability Index: {results.osi}</p>
        <p>Overal Stability Desviation: {results.osd}</p>
        <p>Antero/Posterior Stability Index: {results.api}</p>
        <p>Antero/Posterior Stability Desviation: {results.apd}</p>
        <p>Medial/Lateral Stability Index: {results.mli}</p>
        <p>Medial/Lateral Stability Desviation: {results.mld}</p>
        <p>Zone Percentage: A{zonePercentage.a}% B{zonePercentage.b}% C{zonePercentage.c}% D{zonePercentage.d}%</p>
        <p>Quadrant Percentage: I{quadrantPercentage.a}% II{quadrantPercentage.b}% III{quadrantPercentage.c}% IV{quadrantPercentage.d}%</p>
      </Modal.Description>
      <Modal.Actions>
        <Download results={results} points={points} button={<Button> Export </Button>}/>
        <Button color='black' onClick={() => close()}>
          Close
        </Button>
        <Button
          content='Save'
          labelPosition='right'
          icon='save'
          onClick={() => savePoints(points)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default Results
