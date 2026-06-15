import { yEqualX } from "./input.js";


const panelContainer = document.getElementById('graphing-panel');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const homeBtn = document.getElementById('home');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;
const BASE_STEP = 30;

//update panelContainer whenever window is resized
window.addEventListener('resize', () => {
  canvas.width = panelContainer.offsetWidth;
  canvas.height = panelContainer.offsetHeight;
  render();
})

const viewportTransform = {
  x: 0,
  y: 0,
  scale: 1,
  numScale: 1,
  stepsCount: 5,
  pattern: [2.5, 2, 2], // change coordinates when zooming to follow these patterns
  patternIndex: 0
};




const drawGrid = () => {
  // horizontal and vertical center on the screen
  const centerH = viewportTransform.x + canvas.width/2;
  const centerV = viewportTransform.y + canvas.height/2;
  
  //square size for each square in grid, changes with zooming
  let step = BASE_STEP * viewportTransform.scale;
  //counter of steps starting from either y or x-axis
  // at any direction (left/right or up/down)
  let counter = 0;
  
  
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#c1c1c1';

  // Vertical lines to the right of y-axis
  for (let x = centerH; x <= canvas.width; x += step) {
    //draw minor vertical gridlines
    ctx.moveTo(x+0.5, 0);
    ctx.lineTo(x+0.5, canvas.height);

    //draw major Gridlines
    if (counter % viewportTransform.stepsCount == 0) {
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#626262';
      ctx.moveTo(x+0.5, 0);
      ctx.lineTo(x+0.5, canvas.height);
      ctx.stroke();
      ctx.beginPath();
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#c1c1c1';
    counter++;
  }

  counter = 1;
  // Vertical lines to the left of y-axis
  for (let x = centerH - step; x >= 0; x -= step) {
    //draw minor vertical gridlines
    ctx.moveTo(x+0.5, 0);
    ctx.lineTo(x+0.5, canvas.height);
    
    //draw major Gridlines
    if (counter % viewportTransform.stepsCount == 0) {
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#626262';
      ctx.moveTo(x+0.5, 0);
      ctx.lineTo(x+0.5, canvas.height);
      ctx.stroke();
      ctx.beginPath();
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#c1c1c1';
    counter++;
  }

  counter = 0;
  //Horizontal lines below x-axis
  for (let y = centerV; y <= canvas.height; y += step) {
    //draw minor horizontal gridlines
    ctx.moveTo(0, y+0.5);
    ctx.lineTo(canvas.width, y+0.5);

    //draw major Gridlines
    if (counter % viewportTransform.stepsCount == 0) {
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#626262';
      ctx.moveTo(0, y+0.5);
      ctx.lineTo(canvas.width, y+0.5);
      ctx.stroke();
      ctx.beginPath();
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#c1c1c1';
    counter++;
  }
  
  counter = 1;
  //Horizontal lines above x-axis
  for (let y = centerV - step; y >= 0; y -= step) {
    //draw minor horizontal gridlines
    ctx.moveTo(0, y+0.5);
    ctx.lineTo(canvas.width, y+0.5);

    //draw major Gridlines
    if (counter % viewportTransform.stepsCount == 0) {
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#626262';
      ctx.moveTo(0, y+0.5);
      ctx.lineTo(canvas.width, y+0.5);
      ctx.stroke();
      ctx.beginPath();
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#c1c1c1';
    counter++;
  }

  ctx.stroke();
  
  drawCenterLines(centerH, centerV);
  drawCoordinates(centerH, centerV, step);
  drawEdgeCoordinates(centerH, centerV, step);
}

const formatNum = (value) => {
  // convert number to scientific notation for tiny values
  if (Math.abs(value) > 0 && Math.abs(value) < 0.00001) {
    return value.toExponential(2);
  }
  //convert number to scientific notation if it's too big
  else if (Math.abs(value) > 1000000000) {
    return value.toExponential(2);
  }
  
  return Number(value.toFixed(5));
};

const drawCoordinates = (centerH, centerV, step) => {
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  

  const numScale = viewportTransform.numScale;
  
  // Vertical lines to the right of y-axis
  for (let x = centerH; x <= canvas.width; x += step) {
    //draw current coordinate in units
    // "x" is the line position inside the canvas
    // "centerH" is the distance from the origin
    // "x - centerH" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    const currentNum = Math.round((x - centerH) / step);
    //final Num scaled after zooming in our out
    const finalNum = formatNum(currentNum*numScale);

    //only show num after 5 square coordinates
    if (currentNum % 5 == 0) {
      //show x-coord 0 behind the y-axis
      if (currentNum == 0) {
        ctx.fillText(currentNum, x-step/3, centerV+step/1.5);
      }
      else {
        ctx.fillText(finalNum, x, centerV+step/1.5);
      }
    }
  }
  // Vertical lines to the left of y-axis
  for (let x = centerH - step; x >= 0; x -= step) {
    const currentNum = Math.round((x - centerH) / step);
    //final Num scaled after zooming in our out
    const finalNum = formatNum(currentNum*numScale);

    if (currentNum % 5 == 0) {
      ctx.fillText(finalNum, x, centerV+step/1.5);
    }
  }
  ctx.textAlign = "right";
  // Horizontal lines below x-axis
  for (let y = centerV; y <= canvas.height; y += step) {
    //draw current coordinate in units
    // "y" is the line position inside the canvas
    // "centerV" is the distance from the origin
    // "y - centerV" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    const currentNum = -1*Math.round((y - centerV) / step);
    //final Num scaled after zooming in our out
    const finalNum = formatNum(currentNum*numScale);

    //only show num after 5 square coordinates
    if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, centerH-step/5, y+step/4);
    }
  }

  //Horizontal lines above x-axis
  for (let y = centerV - step; y >= 0; y -= step) {
    const currentNum = -1*Math.round((y - centerV) / step);
    //final Num scaled after zooming in our out
    const finalNum = formatNum(currentNum*numScale);

    if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, centerH-step/5, y+step/4);
    }
  }
  ctx.stroke();
}


const drawEdgeCoordinates = (centerH, centerV, step) => {
  ctx.beginPath();
  ctx.textAlign = "center";
  ctx.font = "14px Arial";
  ctx.fillStyle = "rgb(122, 122, 122)";
  
  const numScale = viewportTransform.numScale;
  const edgePadding = 30;
  const hNumsTopPadding = 70;
  const hNumsBottomPadding = 10;
  const vNumsPadding = 10;


  // VERTICAL EDGE COORDINATES, Y VALUES

  // if went off to the right, then show edge coordinates
  // at the left edge
  // else if went off to the left, show edge coordinates
  // at the right edge
  if (centerH < 0) {
    //alignment so that numbers don't go offscreen
    ctx.textAlign = "left";
    for (let y = centerV; y <= canvas.height; y += step) {
      const currentNum = -1*Math.round((y - centerV) / step);
      const finalNum = formatNum(currentNum*numScale);

      //only show num after 5 square coordinates
      if (currentNum % 5 == 0 && currentNum != 0) {
          ctx.fillText(finalNum, vNumsPadding, y+step/4);
      }
      if (currentNum == 0) {
          ctx.fillText(finalNum, vNumsPadding, y+step/1.5);
      }
    }

    for (let y = centerV - step; y >= 0; y -= step) {
      const currentNum = -1*Math.round((y - centerV) / step);
      const finalNum = formatNum(currentNum*numScale);

      if (currentNum % 5 == 0 && currentNum != 0) {
          ctx.fillText(finalNum, vNumsPadding, y+step/4);
      }
    }
  }
  else if (centerH > canvas.width) {
    //alignment so that numbers don't go offscreen
    ctx.textAlign = "right";
    for (let y = centerV; y <= canvas.height; y += step) {
      const currentNum = -1*Math.round((y - centerV) / step);
      const finalNum = formatNum(currentNum*numScale);

      //only show num after 5 square coordinates
      if (currentNum % 5 == 0 && currentNum != 0) {
          ctx.fillText(finalNum, canvas.width-vNumsPadding, y+step/4);
      }
      if (currentNum == 0) {
          ctx.fillText(finalNum, canvas.width-vNumsPadding, y+step/1.5);
      }
    }

    for (let y = centerV - step; y >= 0; y -= step) {
      const currentNum = -1*Math.round((y - centerV) / step);
      const finalNum = formatNum(currentNum*numScale);

      if (currentNum % 5 == 0 && currentNum != 0) {
          ctx.fillText(finalNum, canvas.width-vNumsPadding, y+step/4);
      }
    }
  }


  // HORIZONTAL EDGE COORDINATES , X VALUES

  ctx.textAlign = "center";
  if (centerV < edgePadding) {
    for (let x = centerH; x <= canvas.width; x += step) {
      const currentNum = Math.round((x - centerH) / step);
      const finalNum = formatNum(currentNum*numScale);

      //only show num after 5 square coordinates
      if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, x, hNumsTopPadding);
      }
    }
    // Vertical lines to the left of y-axis
    for (let x = centerH - step; x >= 0; x -= step) {
      const currentNum = Math.round((x - centerH) / step);
      const finalNum = formatNum(currentNum*numScale);

      if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, x, hNumsTopPadding);
      }
    }
  }
  else if (centerV > canvas.height) {
    for (let x = centerH; x <= canvas.width; x += step) {
      const currentNum = Math.round((x - centerH) / step);
      const finalNum = formatNum(currentNum*numScale);

      //only show num after 5 square coordinates
      if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, x, canvas.height-hNumsBottomPadding);
      }
    }
    // Vertical lines to the left of y-axis
    for (let x = centerH - step; x >= 0; x -= step) {
      const currentNum = Math.round((x - centerH) / step);
      const finalNum = formatNum(currentNum*numScale);

      if (currentNum % 5 == 0 && currentNum != 0) {
        ctx.fillText(finalNum, x, canvas.height-hNumsBottomPadding);
      }
    }
  }
  ctx.stroke();
}

const drawCenterLines = (centerH, centerV) => {
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#232323';
  
  ctx.moveTo(centerH, 0);
  ctx.lineTo(centerH, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerV);
  ctx.lineTo(canvas.width, centerV);
  ctx.stroke();
}

const drawPoint = (xVal, yVal) => {
  const centerH = viewportTransform.x + canvas.width/2;
  const centerV = viewportTransform.y + canvas.height/2;

  let step = BASE_STEP * viewportTransform.scale;
  const xDistance = step * xVal;
  const yDistance = -(step * yVal);

  ctx.beginPath();
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.strokeStyle = 'rgb(205, 5, 5)';
  ctx.arc(centerH + xDistance, centerV + yDistance, 3, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
}
// the parameters are objects with x and y coords, ex: {x: 1, y: 4}
const drawLine = (firstPoint, lastPoint) => {
  const centerH = viewportTransform.x + canvas.width/2;
  const centerV = viewportTransform.y + canvas.height/2;

  let step = BASE_STEP * viewportTransform.scale;
  
  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ff0000';
  const x1 = firstPoint.x*step;
  const y1 = -(firstPoint.y*step);
  const x2 = lastPoint.x*step;
  const y2 = -(lastPoint.y*step);
  
  ctx.moveTo(centerH+x1, centerV+y1);
  ctx.lineTo(centerH+x2, centerV+y2);
  ctx.stroke();
}


//keep track of previous mouse position for later
let previousX = 0;
let previousY = 0;

const updatePanning = (e) => {
  //set current x and y coordinates
  const localX = e.clientX;
  const localY = e.clientY;

  //move viewport by the difference between current
  // coordinates and previous coordinates
  viewportTransform.x += localX - previousX;
  viewportTransform.y += localY - previousY;

  //update previous coordinates for next time
  previousX = localX;
  previousY = localY;
}

const updateNumberScale = () => {
  const step = BASE_STEP * viewportTransform.scale;


  if (step >= 50) {
    const divisor = viewportTransform.pattern[viewportTransform.patternIndex];

    viewportTransform.numScale /= divisor;
    viewportTransform.patternIndex++;

    if (viewportTransform.patternIndex >= viewportTransform.pattern.length) {
      viewportTransform.patternIndex = 0;
    }
    // reset grid size to keep zooming in
    viewportTransform.scale = 1;
  }

  else if (step <= 20) {
    viewportTransform.patternIndex--;
    
    
    if (viewportTransform.patternIndex < 0) {
      viewportTransform.patternIndex = viewportTransform.pattern.length - 1;
    }

    const multiplier = viewportTransform.pattern[viewportTransform.patternIndex];
    viewportTransform.numScale *= multiplier;
    // reset grid size to keep zooming in
    viewportTransform.scale = 1;
  }
}

const updateZooming = (e) => {
  e.preventDefault();
  const zoom = Math.exp(-e.deltaY * 0.0005);
  viewportTransform.scale *= zoom;  

  updateNumberScale();
  
}

const render = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  drawGrid();
  const point1 = yEqualX()[0];
  const point2 = yEqualX()[yEqualX().length-1];

  for (let i = 0; i < yEqualX().length; i++) {
    drawPoint(yEqualX()[i].x, yEqualX()[i].y);
  }
  drawLine(point1, point2);
  
  ctx.setTransform(
    viewportTransform.scale,
    0,
    0,
    viewportTransform.scale,
    viewportTransform.x,
    viewportTransform.y
  );

}

const onMouseMove = (e) => {
  updatePanning(e);
  render();
}

const onMouseWheel = (e) => {
  updateZooming(e);
  render();

}

/* Event Listeners */

canvas.addEventListener('mousedown', (e) => {
  previousX = e.clientX;
  previousY = e.clientY;

  canvas.addEventListener('mousemove', onMouseMove);
})
canvas.addEventListener('mouseup', (e) => {
  canvas.removeEventListener('mousemove', onMouseMove);
})
canvas.addEventListener('wheel', onMouseWheel, {passive: false});

zoomInBtn.addEventListener('click', () => {
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -800,
      bubbles: true,
      cancelable: true
    });

    canvas.dispatchEvent(wheelEvent);
});

zoomOutBtn.addEventListener('click', () => {
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: 800,
      bubbles: true,
      cancelable: true
    });

    canvas.dispatchEvent(wheelEvent);
});

homeBtn.addEventListener('click', () => {
  viewportTransform.x = 0;
  viewportTransform.y = 0;
  viewportTransform.scale = 1;
  viewportTransform.numScale = 1;
  viewportTransform.patternIndex = 0;
  render();
});

render();

