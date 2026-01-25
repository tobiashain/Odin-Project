const repeatString = function(string, amount) {
  let newString = '';
  if(amount < 0) return 'ERROR';
  for(i = 0; i < amount; i++){
    newString = newString + string;
  }
  return newString;
};

// Do not edit below this line
module.exports = repeatString;
