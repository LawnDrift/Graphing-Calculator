export const yEqualX = () => {
  const coordinates = [];
  for (let i = -100; i <= 100; i+=5) {
    const xVal = i;
    const yVal = i;
    coordinates.push({'x': xVal, 'y': yVal});
  }
  return coordinates;
}


