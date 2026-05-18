const panelContainer = document.getElementById('graphing-panel');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;

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
  const step = 30;

  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#9e9e9e';
  ctx.font = "10px Arial";

  //establish offset based on the new viewport
  const offsetX = viewportTransform.x % step;
  const offsetY = viewportTransform.y % step;

  //draw Vertical Lines
  for (let x = offsetX + 0.5; x <= canvas.width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.clientHeight);

  }


  //draw Horizontal Lines
  for (let y = offsetY + 0.5; y <= canvas.height; y+= step) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.clientWidth, y);
  }
  
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#3a3a3a';
  // multiply step distance times number of squares in canvas horizontally divided by 2 to get to center
  const centerH = viewportTransform.x + step * (parseInt((canvas.width / step)/2));
  // multiply step distance times number of squares in canvas vertically divided by 1.9 to get to center
  const centerV = viewportTransform.y + step * (parseInt((canvas.height / step)/1.9))
  
  ctx.moveTo(centerH, 0);
  ctx.lineTo(centerH, canvas.height);

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
  const oldScale = viewportTransform.scale;
  const oldX = viewportTransform.x;
  const oldY = viewportTransform.y;

  const localX = e.clientX;
  const localY = e.clientY;

  const previousScale = viewportTransform.scale;

  const newScale = (viewportTransform.scale += e.deltaY * -0.01);

  const newX = localX - (localX - oldX) * (newScale / previousScale);
  const newY = localY - (localY - oldY) * (newScale / previousScale);

  viewportTransform.x = newX;
  viewportTransform.y = newY;
  viewportTransform.scale = newScale;
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
canvas.addEventListener('wheel', onMouseWheel);


render();

