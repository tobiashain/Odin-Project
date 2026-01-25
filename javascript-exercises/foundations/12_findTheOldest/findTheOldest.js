const findTheOldest = function (array) {
  const getAge = (person) => {
    const death = person.yearOfDeath ?? new Date().getFullYear();
    return death - person.yearOfBirth;
  };

  let sorted = array.sort((a, b) => getAge(b) - getAge(a));
  return sorted[0];
};

// Do not edit below this line
module.exports = findTheOldest;
