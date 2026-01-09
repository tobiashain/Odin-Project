const { mergeSort } = require('./mergeSort');

describe('mergeSort', () => {
  test('sorts an array of numbers', () => {
    expect(mergeSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
  });

  test('handles an already sorted array', () => {
    expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  test('handles a reverse-sorted array', () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  test('handles duplicate values', () => {
    expect(mergeSort([3, 1, 2, 3, 1])).toEqual([1, 1, 2, 3, 3]);
  });

  test('handles negative numbers', () => {
    expect(mergeSort([-5, -1, -3, 2, 0])).toEqual([-5, -3, -1, 0, 2]);
  });

  test('handles an empty array', () => {
    expect(mergeSort([])).toEqual([]);
  });

  test('handles a single-element array', () => {
    expect(mergeSort([42])).toEqual([42]);
  });

  test('does not mutate the original array', () => {
    const input = [3, 2, 1];
    const copy = [...input];

    mergeSort(input);

    expect(input).toEqual(copy);
  });
});
