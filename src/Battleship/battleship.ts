import '../shared';
import GameBoard from './game-board';

const board = getElement('#board');
const field = getElement('#field');
const shipDragIcon = getElement('#shipDragIcon');
const announcer = getElement('#announcer');
const gameStarted = false;
const gameBoard = new GameBoard();
const ship = getElement('#selectShip');
const orientation = getElement('#selectOrientation');
let shipValue: number = 5;
let orientationValue: 'H' | 'V' = 'H';

const fieldRect = field.getBoundingClientRect();

const cellWidth = (fieldRect.width * 5) / 10;
const cellHeight = fieldRect.height / 10;

shipDragIcon.style.width = cellWidth + 'px';
shipDragIcon.style.height = cellHeight + 'px';

field.addEventListener('mouseenter', () => {
  shipDragIcon.style.display = 'block';
});

field.addEventListener('mouseleave', () => {
  shipDragIcon.style.display = 'none';
});

field.addEventListener('mousemove', (e: MouseEvent) => {
  const { singleCellWidth, singleCellHeight } = updateSize();

  if (orientationValue === 'H') {
    shipDragIcon.style.left = e.clientX - singleCellWidth / 2 + 'px';
    shipDragIcon.style.top = e.clientY - singleCellHeight / 2 + 'px';
  } else {
    shipDragIcon.style.left = e.clientX - singleCellWidth / 2 + 'px';
    shipDragIcon.style.top = e.clientY - singleCellHeight / 2 + 'px';
  }
});

ship.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  shipValue = parseInt(target.value);
});

orientation.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  orientationValue = target.value as 'H' | 'V';
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
  if (field) {
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
  }
}

function clickHandler(event: Event) {
  const cell = event.currentTarget as HTMLDivElement;
  if (cell.dataset.x && cell.dataset.y) {
    if (gameStarted) {
      const hit = gameBoard.receiveAttack({
        x: parseInt(cell.dataset.x),
        y: parseInt(cell.dataset.y),
      });
      if (hit) {
        cell.textContent = 'X';
      } else {
        cell.style.backgroundColor = 'grey';
      }
      cell.removeEventListener('click', clickHandler);
    } else {
      try {
        const shipPositions = gameBoard.placeShip(
          shipValue,
          {
            x: parseInt(cell.dataset.x),
            y: parseInt(cell.dataset.y),
          },
          orientationValue,
        );

        shipPositions.forEach((pos) => {
          const shipCell = document.querySelector(
            `.innerCell[data-x="${pos.x}"][data-y="${pos.y}"]`,
          ) as HTMLDivElement;
          shipCell.style.backgroundColor = 'lightgrey';
        });

        announcer.textContent = 'Ship placed successfully';
      } catch (error) {
        if (error instanceof Error) {
          announcer.textContent = error.message;
        }
      }
    }
  }
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

createBoard();

export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string,
): T {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return el as T;
}
