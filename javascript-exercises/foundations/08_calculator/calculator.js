const add = function (num1, num2) {
  return num1 + num2;
};

const subtract = function (num1, num2) {
  return num1 - num2;
};

const sum = function (arr) {
  let value = 0;
  arr.forEach((item) => {
    value += item;
  });

  return value;
};

const multiply = function (arr) {
  let value = 1;
  arr.forEach((item) => {
    value *= item;
  });
  return value;
};

const power = function (num1, num2) {
  return num1 ** num2;
};

const factorial = function (num) {
  if (num === 0) return 1;
  let value = 1;
  for (i = num; i > 0; i--) {
    value *= i;
  }
  return value;
};

// Do not edit below this line
module.exports = {
  add,
  subtract,
  sum,
  multiply,
  power,
  factorial,
};
