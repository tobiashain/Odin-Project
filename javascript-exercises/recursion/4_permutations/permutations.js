const permutations = function (arr) {
  if (!arr.length) return [[]];

  let result = [];

  for (const item of arr) {
    const remainingArray = arr.filter((it) => {
      return it !== item;
    });
    const subPermutations = permutations(remainingArray);

    for (const permutation of subPermutations) {
      const temp = [item, ...permutation];
      result.push(temp);
    }
  }

  return result;
};

/*
Start with arr = [1,2].
First iteration picks item = 1.
remainingArray = [2].
Recurse: getPermutations([2]).
Inside that recursion:
Pick item = 2.
remainingArray = [].
Recurse: getPermutations([]) → returns [[]] (base case).
Prepend 2 to each sub-permutation → [2].
Return [ [2] ] to previous level.
Back at the top level, prepend 1 to each [2] → [1,2]. Push into result.
*/

// Do not edit below this line
module.exports = permutations;
