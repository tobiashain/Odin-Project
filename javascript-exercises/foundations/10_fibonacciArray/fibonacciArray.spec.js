const fibonacci = require('./fibonacciArray');

describe('fibonacci', () => {
  test('returns [0] when input is 0', () => {
    expect(fibonacci(0)).toEqual([0]);
  });

  test('returns [0, 1] when input is 1', () => {
    expect(fibonacci(1)).toEqual([0, 1]);
  });

  test('returns the correct Fibonacci sequence for input 2', () => {
    expect(fibonacci(2)).toEqual([0, 1, 1]);
  });

  test('returns the correct Fibonacci sequence for input 7', () => {
    expect(fibonacci(7)).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
  });

  test("doesn't accept negatives", () => {
    expect(fibonacci(-25)).toBe('OOPS');
  });
});
