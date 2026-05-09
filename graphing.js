const panelContainer = document.getElementById('graphing-panel');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;

const viewportTransform = {
  x: 0,
  y: 0,
  scale: 1
};

const drawRect = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
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

const render = () => {

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.setTransform(
    viewportTransform.scale,
    0,
    0,
    viewportTransform.scale,
    viewportTransform.x,
    viewportTransform.y
  );

  drawRect(0, 50, 100, 100, 'red');
  drawRect(200, 200, 100, 100, 'blue');
}

const onMouseMove = (e) => {
  updatePanning(e);
  render();
  console.log(e);
}

canvas.addEventListener('mousedown', (e) => {
  previousX = e.clientX;
  previousY = e.clientY;

  canvas.addEventListener('mousemove', onMouseMove);
})

canvas.addEventListener('mouseup', (e) => {
  canvas.removeEventListener('mousemove', onMouseMove);
})


// const step = 30;

// ctx.beginPath();
// ctx.lineWidth = 0.5;
// ctx.strokeStyle = '#9e9e9e';

// //draw Vertical Lines

// for (let x = 0.5; x <= canvas.width; x += step) {
//   ctx.moveTo(x, 0);
//   ctx.lineTo(x, canvas.clientHeight);
// }

// //draw Horizontal Lines

// for (let y = 0.5; y <= canvas.height; y+= step) {
//   ctx.moveTo(0, y);
//   ctx.lineTo(canvas.clientWidth, y);
// }

// ctx.stroke();




