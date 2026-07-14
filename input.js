import { setCurrentFunction } from "./state.js";
import { render } from "./graphing.js";
const inputEquation= document.querySelector('.equation');


export const linearFunc = (x) => {
  return x;
}

export const quadraticFunc = (x) => {
  return x*x;
}

export const userEquation = (inputVal) => {
  //remove spaces
  let expr = inputVal.replace(/\s/g, "");
  if (expr.slice(1)[0] == "=") {
    expr = expr.slice(2);
    //convert ^ symbol to actual exponentiation
    expr = expr.replace(/\^/g, "**");
    //convert "sqrt" to actual symbol
    
    const f = new Function("x", `return ${expr};`);
    return f;
  }
  
}
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  e.returnValue = '';
});

window.onload = () => {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => input.value = "");
};

inputEquation.addEventListener("input", (e) => {
  const f = userEquation(e.target.value);
  setCurrentFunction(f);
  render();
});

