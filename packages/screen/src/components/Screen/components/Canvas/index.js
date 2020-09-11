import React, { useRef, useEffect } from 'react';

// Scaling Constants for Canvas
const canvasWidth = window.innerWidth * .5;
const canvasHeight = window.innerHeight * .5;

function drawCircles(ctx){
    console.log("attempting to draw circles")
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
};

function Canvas() {
    const canvasRef = useRef(null);

    useEffect(()=>{
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext('2d');
        // clear the canvas area before rendering the coordinates held in state
        ctx.clearRect( 0,0, canvasWidth, canvasHeight );
        drawCircles(ctx)
    });

    return (
        <canvas
          className="App-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight} />
    );
  }

export default Canvas;
