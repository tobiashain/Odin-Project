const fibonacci = function (length, arr = [0]) {
  if (length < 0) {
    return 'OOPS';
  }
  if (!length) {
    return arr;
  }

  if (arr.length === 1) {
    arr.push(1);
    return fibonacci(length - 1, arr);
  }

  arr.push(arr[arr.length - 1] + arr[arr.length - 2]);

  return fibonacci(length - 1, arr);
};

// Do not edit below this line
module.exports = fibonacci;
