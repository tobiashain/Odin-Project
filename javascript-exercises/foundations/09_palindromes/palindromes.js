const palindromes = function (string) {
  let arr = string.split('');
  arr.reverse();
  arr = arr.join('');
  return arr.toUpperCase() === string.toUpperCase();
};

// Do not edit below this line
module.exports = palindromes;
