const contains = function (foo, search) {
  if (typeof foo !== 'object' || foo === null) {
    if (Number.isNaN(foo) && Number.isNaN(search)) return true;
    return foo === search;
  }

  if (foo === search) return true;

  const values = Object.values(foo);

  for (const item of values) {
    if (contains(item, search)) {
      return true;
    }
  }

  return false;
};

// Do not edit below this line
module.exports = contains;
