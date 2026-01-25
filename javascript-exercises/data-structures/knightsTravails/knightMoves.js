const { Queue } = require('./queue');

function knightMoves(start, end) {
  const knightOffsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  const visited = new Set();
  const q = new Queue();

  q.enqueue({ pos: start, path: [start] });
  visited.add(start.toString());

  const recurse = () => {
    if (q.length() === 0) return null;

    const { pos, path } = q.dequeue();

    if (pos[0] === end[0] && pos[1] === end[1]) {
      return path;
    }

    for (const [dx, dy] of knightOffsets) {
      const x = pos[0] + dx;
      const y = pos[1] + dy;

      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        const next = [x, y];
        const key = next.toString();

        if (!visited.has(key)) {
          visited.add(key);
          q.enqueue({ pos: next, path: [...path, next] });
        }
      }
    }

    return recurse();
  };

  return recurse();
}

module.exports = { knightMoves };
