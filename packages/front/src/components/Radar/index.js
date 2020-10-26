import React from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default function Radar({size, points, pointerX, pointerY}) {
  const canvasSize = size || window.innerWidth;
  const maxRadius = canvasSize/2;
  const maxDegree = 17;

  function fixThreshold(degree) {
    if (degree > maxDegree) return maxDegree;
    if (degree < -maxDegree) return -maxDegree;
    return degree;
  }

  function degreesToCanvas(degree) {
    return parseInt(fixThreshold(degree) * (canvasSize / (maxDegree*2)) + (canvasSize / 2))
  }

  return (<Stage
    height={canvasSize}
    width={canvasSize}
  >
    <Layer>
      <Line
        points={points.map(degreesToCanvas)}
        stroke="#df4b26"
        strokeWidth={5}
        tension={1}
        lineCap="round"
      />
      <Circle x={degreesToCanvas(pointerX)} y={degreesToCanvas(pointerY)} stroke="green" radius={maxRadius/25} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/4*3} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/2} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/4} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={1} />
    </Layer>
  </Stage>)
}
