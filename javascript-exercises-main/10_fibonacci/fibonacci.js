const fibonacci = function (length) {
  let tempvalue;
  let previousValue = 0;
  let value = 1;
  if (Number(length) === 0) {
    return 0;
  }
  if (length < 0) {
    return 'OOPS';
  }
  for (let i = 1; i < Number(length); i++) {
    tempvalue = value;
    value = previousValue + value;
    previousValue = tempvalue;
  }

  return value;
};

// Do not edit below this line
module.exports = fibonacci;
