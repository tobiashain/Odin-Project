const pascal = function (length) {
  const newRow = (arr, length) => {
    if (length === 0) return arr;

    let newArray = [];

    for (let i = 0; i <= arr.length; i++) {
      if (i === 0 || i === arr.length) {
        newArray.push(1);
      } else {
        newArray.push(arr[i - 1] + arr[i]);
      }
    }
    return newRow(newArray, length - 1);
  };

  return newRow([], length);
};

// Do not edit below this line
module.exports = pascal;
