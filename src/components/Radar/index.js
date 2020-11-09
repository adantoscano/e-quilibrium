import React from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default function Radar({size = window.innerWidth, points, pointerX, pointerY, maxTilt }) {
  const maxRadius = size/2;

  function fixThreshold(degree) {
    if (degree > maxTilt) return maxTilt;
    if (degree < -maxTilt) return -maxTilt;
    return degree;
  }

  function degreesToCanvas(degree) {
    return parseInt(fixThreshold(degree) * (size / (maxTilt*2)) + (size / 2));
  }

  return (<Stage
    height={size}
    width={size}
  >
    <Layer>
      <Line
        points={points.map(degreesToCanvas)}
        stroke="#df4b26"
        strokeWidth={5}
        tension={1}
        lineCap="round"
        preventDefault={false}
      />
      <Circle x={degreesToCanvas(pointerX)} y={degreesToCanvas(pointerY)} stroke="green" radius={maxRadius/25} preventDefault={false}/>
      <Circle x={size/2} y={size/2} stroke="black" radius={maxRadius} preventDefault={false}/>
      <Circle x={size/2} y={size/2} stroke="black" radius={maxRadius/4*3} preventDefault={false}/>
      <Circle x={size/2} y={size/2} stroke="black" radius={maxRadius/2} preventDefault={false}/>
      <Circle x={size/2} y={size/2} stroke="black" radius={maxRadius/4} preventDefault={false}/>
      <Circle x={size/2} y={size/2} stroke="black" radius={1} preventDefault={false}/>
    </Layer>
  </Stage>)
}
