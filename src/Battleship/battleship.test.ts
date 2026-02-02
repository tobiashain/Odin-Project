import Ship from './ship';
import GameBoard from './game-board';

let ship: Ship;

describe('Ship', () => {
  beforeEach(() => {
    ship = new Ship(3);
  });
  test('initialize Ship', () => {
    expect(ship.getLength()).toBe(3);
    expect(ship.getIsSunken()).toBe(false);
    expect(ship.getHits()).toBe(0);
  });

  test('hit function', () => {
    ship.hit();

    expect(ship.getHits()).toBe(1);
    expect(ship.getIsSunken()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.getIsSunken()).toBe(true);
  });
});

let gameBoard: GameBoard;

describe('GameBoard', () => {
  beforeEach(() => {
    gameBoard = new GameBoard();
  });

  test('initialize GameBoard', () => {
    const board = gameBoard.getBoard();
    expect(board[0]![0]).toEqual({
      player1Hit: false,
      player2Hit: false,
      player1Ship: null,
      player2Ship: null,
    });

    expect(board[9]![9]).toEqual({
      player1Hit: false,
      player2Hit: false,
      player1Ship: null,
      player2Ship: null,
    });

    expect(gameBoard.getCurrentPlayer()).toEqual('Player 1');
  });

  test('place Ship on GameBoard', () => {
    expect(() => gameBoard.placeShip(5, { x: -5, y: 7 }, 'H')).toThrow();
    expect(() => gameBoard.placeShip(1, { x: 3, y: 6 }, 'V')).toThrow();
    expect(() => gameBoard.placeShip(3, { x: 7, y: 6 }, 'E')).toThrow();

    gameBoard.placeShip(3, { x: 3, y: 3 }, 'H');
    const board = gameBoard.getBoard();

    const positions = [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ];

    for (const position of positions) {
      expect(board[position.x]![position.y]?.player1Ship).not.toBe(null);
    }

    expect(() => gameBoard.placeShip(3, { x: 4, y: 2 }, 'V')).toThrow();
  });
});
