const panelContainer = document.getElementById('graphing-panel');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;
const BASE_STEP = 20;

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
  //square size for each square in grid
  let step = BASE_STEP * viewportTransform.scale;
  
  const halfWidth = Math.round(canvas.width / 2);
  const halfHeight = Math.round(canvas.height / 2);
  step = halfWidth / Math.round(halfWidth/step);
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#9e9e9e';
  ctx.textAlign = "right";
  ctx.font = "14px Arial";

  //establish offset based on the new viewport
  const offsetX = viewportTransform.x % step;
  const offsetY = viewportTransform.y % step;

  // True center origins of the canvas y and x axis
  // origin moves away as you scroll farther through panning
  // returns horizontal and vertical distances from the center
  const centerH = viewportTransform.x + step * (Math.round((canvas.width / step)/2));
  const centerV = viewportTransform.y + step * (Math.round((canvas.height / step)/2));
  
  console.log(centerH);
  console.log(centerV);
  console.log(canvas.width/2);
  console.log(canvas.height/2);
  console.log('------');
  //draw vertical lines through each unit visible on screen
  for (let x = offsetX + 0.5; x <= canvas.width; x += step) {
    //draw the vertical lines that cover screen
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    
    //draw current coordinate in units
    // "x" is the line position inside the canvas
    // "centerH" is the distance from the origin
    // "x - centerH" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    let currentNum = Math.round((x - centerH) / step);
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


  //draw Horizontal Lines through each unit visible on screen
  for (let y = offsetY + 0.5; y <= canvas.height; y+= step) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);

    //draw current coordinate in units
    // "y" is the line position inside the canvas
    // "centerV" is the distance from the origin
    // "y - centerV" gives how many pixels away is this line from zero
    // dividing by step returns that in units
    let currentNum = -1*Math.round((y - centerV) / step);

    //only show even numbers
    if (currentNum % 2 == 0 && currentNum != 0) {
        ctx.fillText(currentNum, centerH-step/5, y+step/4);
      
      
    }
  }
  
  ctx.stroke();

  drawCenterLines(centerH, centerV);

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

