import Queue from './queue';
import GameBoard from './game-board';

const board = getElement('#board');
const boards = getElement('#boards');
const field = getElement('#field');
const resetBtn = getElement('#reset');
const shipDragIcon = getElement('#shipDragIcon');
const announcer1 = getElement('#announcer1');
const announcer2 = getElement('#announcer2');
let gameStarted = false;
const gameBoard = new GameBoard();
const ship = getElement('#selectShip') as HTMLSelectElement;
const orientation = getElement('#selectOrientation') as HTMLSelectElement;
let shipValue: number = 5;
let orientationValue: 'H' | 'V' = 'H';

const enemyQueue = new Queue();
const enemyVisited = new Set<string>();
const enemyHitCells = new Set<string>();

ship.selectedIndex = 0;
orientation.selectedIndex = 0;

const fieldRect = field.getBoundingClientRect();

const cellWidth = (fieldRect.width * 5) / 10;
const cellHeight = fieldRect.height / 10;

let gameWon = false;

shipDragIcon.style.width = cellWidth + 'px';
shipDragIcon.style.height = cellHeight + 'px';

type AttackResult = {
  valid: boolean;
  hit: boolean;
  destroyed: boolean;
  positions: {
    x: number;
    y: number;
  }[];
};

resetBtn.addEventListener('click', resetField);

ship.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  shipValue = parseInt(target.value);
});

orientation.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  orientationValue = target.value as 'H' | 'V';
});

field.addEventListener('mouseenter', () => {
  if (!gameStarted) {
    shipDragIcon.style.display = 'block';
  }
});

field.addEventListener('mouseleave', () => {
  shipDragIcon.style.display = 'none';
});

field.addEventListener('mousemove', (e: MouseEvent) => {
  if (!gameStarted) {
    const { singleCellWidth, singleCellHeight } = updateSize();

    if (orientationValue === 'H') {
      shipDragIcon.style.left = e.clientX - singleCellWidth / 2 + 'px';
      shipDragIcon.style.top = e.clientY - singleCellHeight / 2 + 'px';
    } else {
      shipDragIcon.style.left = e.clientX - singleCellWidth / 2 + 'px';
      shipDragIcon.style.top = e.clientY - singleCellHeight / 2 + 'px';
    }
  }
});

function createBoard() {
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    cell.className = 'outerCell';
    cell.style.gridColumnStart = (i + 2).toString();
    cell.textContent = String.fromCharCode(65 + i);
    board?.appendChild(cell);
  }

  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    cell.className = 'outerCell';
    cell.style.gridRowStart = (i + 2).toString();
    cell.textContent = (i + 1).toString();
    board?.appendChild(cell);
  }

  resetField();
}

function resetField() {
  field.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.className = 'innerCell';
      cell.dataset.y = i.toString();
      cell.dataset.x = j.toString();
      cell.addEventListener('click', clickHandler);
      field?.appendChild(cell);
    }
  }

  for (let i = 0; i < ship.options.length; i++) {
    if (ship.options[i]!.disabled) {
      ship.options[i]!.disabled = false;
    }
  }

  ship.selectedIndex = 0;
  shipValue = 5;

  gameStarted = false;
  gameWon = false;

  enemyVisited.clear();

  gameBoard.clearGame();

  announcer1.textContent = '';
  announcer2.textContent = '';

  if (boards.children[1]) {
    boards.children[1].remove();
  }
}

function clickHandler(event: Event) {
  const cell = event.currentTarget as HTMLDivElement;
  if (gameWon) return;
  if (cell.dataset.x && cell.dataset.y) {
    if (gameStarted) {
      let valid = false;
      const result = attack(
        parseInt(cell.dataset.x),
        parseInt(cell.dataset.y),
        gameBoard.getCurrentPlayer(),
      );
      valid = result.valid;
      if (valid) {
        valid = false;
        gameBoard.changePlayer();
        while (!valid) {
          valid = attackEnemy();
        }
        gameBoard.changePlayer();
      }
    } else {
      place(cell);
    }
  }
}

function attack(x: number, y: number, currentPlayer: number): AttackResult {
  try {
    let cell: HTMLDivElement =
      currentPlayer === 1
        ? (field.querySelector(
            `.innerCell[data-x="${x}"][data-y="${y}"]`,
          ) as HTMLDivElement)
        : (boards.children[1]!.querySelector(
            `.innerCell[data-x="${x}"][data-y="${y}"]`,
          ) as HTMLDivElement);

    if (!cell) {
      return { valid: false, hit: false, destroyed: false, positions: [] };
    }

    const data = gameBoard.receiveAttack({ x, y });

    if (data.hit) {
      cell.textContent = 'X';

      if (data.destroyed) {
        data.positions.forEach((pos) => {
          const shipCell =
            currentPlayer === 1
              ? (field.querySelector(
                  `.innerCell[data-x="${pos.x}"][data-y="${pos.y}"]`,
                ) as HTMLDivElement)
              : (boards.children[1]!.querySelector(
                  `.innerCell[data-x="${pos.x}"][data-y="${pos.y}"]`,
                ) as HTMLDivElement);

          shipCell.style.color = 'red';
        });
      }

      if (data.won) {
        gameWon = true;
        announcer1.textContent = `Player ${gameBoard.getCurrentPlayer()} won`;
        announcer2.textContent = '';
      } else if (data.destroyed) {
        if (currentPlayer === 1)
          announcer1.textContent = 'Player 2 ship got destroyed';
        else announcer2.textContent = 'Player 1 ship got destroyed';
      } else {
        if (currentPlayer === 1)
          announcer1.textContent = 'Player 2 ship got hit';
        else announcer2.textContent = 'Player 1 ship got hit';
      }
    } else {
      cell.style.backgroundColor = 'grey';
      if (currentPlayer === 1) announcer1.textContent = 'Player 1 missed';
      else announcer2.textContent = 'Player 2 missed';
    }

    return {
      valid: true,
      hit: data.hit,
      destroyed: data.destroyed,
      positions: data.positions,
    };
  } catch {
    if (currentPlayer === 1) {
      announcer1.textContent = 'Cell already hit';
    }
    return { valid: false, hit: false, destroyed: false, positions: [] };
  }
}

function place(cell: HTMLDivElement) {
  if (cell.dataset.x && cell.dataset.y) {
    try {
      const shipPositions = gameBoard.placeShip(
        shipValue,
        {
          x: parseInt(cell.dataset.x),
          y: parseInt(cell.dataset.y),
        },
        orientationValue,
      );

      const index = ship.selectedIndex;
      ship.options[index]!.disabled = true;

      let allPlaced = true;
      for (let i = 0; i < ship.options.length; i++) {
        if (!ship.options[i]!.disabled) {
          ship.selectedIndex = i;
          allPlaced = false;
          break;
        }
      }

      ship.dispatchEvent(new Event('change', { bubbles: true }));

      shipPositions.forEach((pos) => {
        const shipCell = document.querySelector(
          `.innerCell[data-x="${pos.x}"][data-y="${pos.y}"]`,
        ) as HTMLDivElement;
        shipCell.style.backgroundColor = 'lightgrey';
      });

      if (allPlaced) {
        gameStarted = true;
        const boardClone = board.cloneNode(true) as HTMLElement;
        boardClone.id = 'board2';
        boardClone.children[0]!.id = 'field2';
        boards.appendChild(boardClone);

        field.dispatchEvent(new Event('mouseleave', { bubbles: true }));
        const cellArray = Array.from(field.children) as HTMLElement[];
        cellArray.forEach((cell) => {
          cell.style.backgroundColor = 'transparent';
        });

        placeEnemyShips();
      }

      announcer1.textContent = 'Ship placed successfully';
    } catch (err) {
      announcer1.textContent = 'Invalid ship placement';
    }
  }
}

function attackEnemy() {
  let target: { x: number; y: number } | undefined;

  while (enemyQueue.size > 0) {
    const next = enemyQueue.dequeue();
    if (!enemyVisited.has(key(next.x, next.y))) {
      target = next;
      break;
    }
  }

  if (!target) {
    target = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
  }

  const targetKey = key(target.x, target.y);
  enemyVisited.add(targetKey);

  const result = attack(target.x, target.y, gameBoard.getCurrentPlayer());
  if (!result.valid) return false;

  if (result.hit) {
    enemyHitCells.add(targetKey);
    enqueueNeighbors(target.x, target.y);

    if (result.destroyed) {
      const destroyedKeys = new Set(result.positions.map((p) => key(p.x, p.y)));

      let hitAnotherShip = false;
      for (const hit of enemyHitCells) {
        if (!destroyedKeys.has(hit)) {
          hitAnotherShip = true;
          break;
        }
      }

      for (const k of destroyedKeys) {
        enemyHitCells.delete(k);
      }

      if (!hitAnotherShip) {
        enemyQueue.clear();
      }
    }
  }

  return true;
}

function enqueueNeighbors(x: number, y: number) {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (const d of dirs) {
    const nx = x + d.x;
    const ny = y + d.y;

    if (nx < 0 || ny < 0 || nx >= 10 || ny >= 10) continue;

    const k = key(nx, ny);
    if (!enemyVisited.has(k)) {
      enemyQueue.enqueue({ x: nx, y: ny });
    }
  }
}

function key(x: number, y: number) {
  return `${x},${y}`;
}

function placeEnemyShips() {
  gameBoard.changePlayer();
  const lengths = [5, 4, 3, 3, 2];

  lengths.forEach((length) => {
    let placed = false;

    while (!placed) {
      try {
        const direction = Math.floor(Math.random() * 2) === 0 ? 'H' : 'V';
        const pos = gameBoard.placeShip(
          length,
          {
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
          },
          direction,
        );
        placed = true;
      } catch (error) {
        // Failed placement, retry
      }
    }
  });
  gameBoard.changePlayer();
}

function updateSize() {
  const fieldRect = field.getBoundingClientRect();

  const singleCellWidth = fieldRect.width / 10;
  const singleCellHeight = fieldRect.height / 10;

  if (orientationValue === 'H') {
    shipDragIcon.style.width = singleCellWidth * shipValue + 'px';
    shipDragIcon.style.height = singleCellHeight + 'px';
  } else {
    shipDragIcon.style.width = singleCellWidth + 'px';
    shipDragIcon.style.height = singleCellHeight * shipValue + 'px';
  }

  return { singleCellWidth, singleCellHeight };
}

export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string,
): T {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return el as T;
}

createBoard();
