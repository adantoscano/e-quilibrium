import React from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';

export default function Radar(props) {
  const canvasSize = props.size || window.innerWidth;
  const maxRadius = canvasSize/2;

  return (<Stage
    height={canvasSize}
    width={canvasSize}
  >
    <Layer>
      <Line
        points={props.points}
        stroke="#df4b26"
        strokeWidth={5}
        tension={0.5}
        lineCap="round"
      />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/4*3} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/2} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={maxRadius/4} />
      <Circle x={canvasSize/2} y={canvasSize/2} stroke="black" radius={1} />
    </Layer>
  </Stage>)
}
