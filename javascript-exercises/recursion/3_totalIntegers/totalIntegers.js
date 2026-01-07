const totalIntegers = function (input) {
  if (typeof input !== 'object' || input === null) {
    return undefined;
  }

  if (!Array.isArray(input)) {
    input = Object.values(input);
  }

  let count = 0;
  for (const item of input) {
    if (typeof item === 'object' && item !== null) {
      count += totalIntegers(item);
    } else if (typeof item === 'number' && Number.isInteger(item)) {
      count += 1;
    }
  }

  return count;
};

// Do not edit below this line
module.exports = totalIntegers;
