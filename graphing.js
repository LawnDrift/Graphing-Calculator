const panelContainer = document.getElementById('graphing-panel');
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
const step = 40;

canvas.width = panelContainer.offsetWidth;
canvas.height = panelContainer.offsetHeight;

ctx.beginPath();
ctx.lineWidth = 1;
ctx.strokeStyle = '#171717';

//draw Vertical Lines

for (let x = 0; x <= canvas.width; x += step) {
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.clientHeight);
}

//draw Horizontal Lines

for (let y = 0; y <= canvas.height; y+= step) {
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.clientWidth, y);
}

ctx.stroke();