const { knightMoves } = require('./knightMoves');

const isKnightMove = (from, to) => {
  const dx = Math.abs(from[0] - to[0]);
  const dy = Math.abs(from[1] - to[1]);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
};

const isValidPath = (path, start, end) => {
  if (!Array.isArray(path)) return false;
  if (path.length === 0) return false;

  expect(path[0]).toEqual(start);
  expect(path[path.length - 1]).toEqual(end);

  for (let i = 0; i < path.length - 1; i++) {
    expect(isKnightMove(path[i], path[i + 1])).toBe(true);
  }
};

describe('knightMoves', () => {
  test('returns direct move when destination is one knight move away', () => {
    const path = knightMoves([0, 0], [1, 2]);

    isValidPath(path, [0, 0], [1, 2]);
    expect(path.length).toBe(2);
  });

  test('returns a shortest path when multiple shortest paths exist (0,0 → 3,3)', () => {
    const path = knightMoves([0, 0], [3, 3]);

    isValidPath(path, [0, 0], [3, 3]);
    expect(path.length).toBe(3);
  });

  test('works symmetrically (3,3 → 0,0)', () => {
    const path = knightMoves([3, 3], [0, 0]);

    isValidPath(path, [3, 3], [0, 0]);
    expect(path.length).toBe(3);
  });

  test('returns a shortest path for longer distances (0,0 → 7,7)', () => {
    const path = knightMoves([0, 0], [7, 7]);

    isValidPath(path, [0, 0], [7, 7]);
    expect(path.length).toBe(7);
  });
});
