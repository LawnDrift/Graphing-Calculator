const inputEquation= document.querySelector('.equation');


export const linearFunc = (x) => {
  return x;
}

export const quadraticFunc = (x) => {
  return x*x;
}

export const userEquation = (inputVal) => {
  if (inputVal === "y=x") {
    console.log('good, it works!');
    
  }
}

inputEquation.addEventListener("input", (e) => {

  userEquation(e.target.value);
});