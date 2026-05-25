const panelContainer = document.getElementById('graphing-panel');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;
const BASE_STEP = 40;

//update panelContainer whenever window is resized
window.addEventListener('resize', () => {
  canvas.width = panelContainer.offsetWidth;
  canvas.height = panelContainer.offsetHeight;
  render();
})

const viewportTransform = {
  x: 0,
  y: 0,
  scale: 1
};



const drawGrid = () => {
  // horizontal and vertical center on the screen
  const centerH = viewportTransform.x + canvas.width/2;
  const centerV = viewportTransform.y + canvas.height/2;
  
  //square size for each square in grid, changes with zooming
  const step = BASE_STEP * viewportTransform.scale;
  
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#9e9e9e';
  

 
  console.log('------');
  // Vertical lines to the right of y-axis
  for (let x = centerH; x <= canvas.width; x += step) {
    //draw the vertical lines that cover screen
    ctx.moveTo(x+0.5, 0);
    ctx.lineTo(x+0.5, canvas.height);
  }

  // Vertical lines to the left of y-axis
  for (let x = centerH - step; x >= 0; x -= step) {
    //draw the vertical lines that cover screen
    ctx.moveTo(x+0.5, 0);
    ctx.lineTo(x+0.5, canvas.height);
  }


  //Horizontal lines below x-axis
  for (let y = centerV; y <= canvas.height; y += step) {
    ctx.moveTo(0, y+0.5);
    ctx.lineTo(canvas.width, y+0.5);
  }
  
  //Horizontal lines above x-axis
  for (let y = centerV - step; y >= 0; y -= step) {
    ctx.moveTo(0, y+0.5);
    ctx.lineTo(canvas.width, y+0.5);
  }

  ctx.stroke();
  
  drawCenterLines(centerH, centerV);
  drawCoordinates(centerH, centerV, step);
}

const drawCoordinates = (centerH, centerV, step) => {
  ctx.beginPath();
  ctx.textAlign = "right";
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";

  const numScale = Math.round(viewportTransform.scale);
  
  // Vertical lines to the right of y-axis
  for (let x = centerH; x <= canvas.width; x += step) {
    //draw current coordinate in units
    // "x" is the line position inside the canvas
    // "centerH" is the distance from the origin
    // "x - centerH" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    const currentNum = Math.round((x - centerH) / step) * numScale;
    //only show even numbers
    if (currentNum % 2 == 0) {
      //show x-coord 0 behind the y-axis
      if (currentNum == 0) {
        ctx.fillText(currentNum, x-step/4, centerV+step/2);
      }
      else {
        ctx.fillText(currentNum, x, centerV+step/2);
      }
    }
  }
  // Vertical lines to the left of y-axis
  for (let x = centerH - step; x >= 0; x -= step) {
    const currentNum = Math.round((x - centerH) / step) * numScale;
    if (currentNum % 2 == 0) {
      ctx.fillText(currentNum, x, centerV+step/2);
    }
  }

  // Horizontal lines below x-axis
  for (let y = centerV; y <= canvas.height; y += step) {
    //draw current coordinate in units
    // "y" is the line position inside the canvas
    // "centerV" is the distance from the origin
    // "y - centerV" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    const currentNum = -1*Math.round((y - centerV) / step) * numScale;
    //only show even numbers
    if (currentNum % 2 == 0 && currentNum != 0) {
        ctx.fillText(currentNum, centerH-step/5, y+step/4);
    }
  }

  //Horizontal lines above x-axis
  for (let y = centerV - step; y >= 0; y -= step) {
    const currentNum = -1*Math.round((y - centerV) / step) * numScale;
    if (currentNum % 2 == 0 && currentNum != 0) {
        ctx.fillText(currentNum, centerH-step/5, y+step/4);
    }
  }

  ctx.stroke();
}

const drawCenterLines = (centerH, centerV) => {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#555555';
  
  ctx.moveTo(centerH, 0);
  ctx.lineTo(centerH, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerV);
  ctx.lineTo(canvas.width, centerV);
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

const updateZooming = (e) => {
  e.preventDefault();
  const zoom = Math.exp(-e.deltaY * 0.001);

  viewportTransform.scale *= zoom;

}

const render = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  drawGrid();

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


render();

