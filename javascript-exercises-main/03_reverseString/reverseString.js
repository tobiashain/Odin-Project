const reverseString = function(string) {
  let reverseString = '';
  for(i = 0; i <= string.length; i++){
    reverseString = reverseString + string.charAt(string.length - i);
  }
  return reverseString;
};

// Do not edit below this line
module.exports = reverseString;
