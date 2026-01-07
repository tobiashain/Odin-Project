const sumAll = function(start, end) {
  if(typeof start === "number" && typeof end === "number"){
    let sum = 0;
    if(start < 0 || end < 0 || (start - Math.floor(start)) !== 0 || (end - Math.floor(end)) !== 0 ){
      return "ERROR";
    }
    if(start > end){
      let temp = start;
      start = end;
      end = temp;
    }
    for(i = start; i <= end; i++){
      sum += i; 
    }
    return sum;
  }
  return "ERROR";
  

};

// Do not edit below this line
module.exports = sumAll;
