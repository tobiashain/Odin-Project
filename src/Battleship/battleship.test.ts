import Ship from './ship';
import GameBoard from './game-board';

let ship: Ship;
let gameBoard: GameBoard;

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

describe('GameBoard', () => {
  beforeEach(() => {
    gameBoard = new GameBoard();
  });

  test('initialize GameBoard', () => {
    const board = gameBoard.getBoard();
    expect(board[0]![0]).toEqual({
      player1Attacked: false,
      player2Attacked: false,
      player1Ship: null,
      player2Ship: null,
    });

    expect(board[9]![9]).toEqual({
      player1Attacked: false,
      player2Attacked: false,
      player1Ship: null,
      player2Ship: null,
    });

    expect(gameBoard.getCurrentPlayer()).toEqual(1);
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
    expect(gameBoard.getPlayerShips(1).ships.length).toBe(1);
  });

  test('clearGame', () => {
    gameBoard.placeShip(2, { x: 4, y: 3 }, 'H');
    gameBoard.placeShip(3, { x: 4, y: 5 }, 'H');
    gameBoard.changePlayer();
    gameBoard.placeShip(2, { x: 4, y: 3 }, 'H');
    gameBoard.placeShip(3, { x: 4, y: 5 }, 'H');

    gameBoard.receiveAttack({ x: 4, y: 3 });

    gameBoard.clearGame();

    const clearedBoard = gameBoard.getBoard();
    const clearedPlayerShips = gameBoard.getPlayerShips(1);

    const expectedBoard = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        player1Attacked: false,
        player2Attacked: false,
        player1Ship: null,
        player2Ship: null,
      })),
    );

    const expectedPlayerShips = { ships: [], destroyed: 0 };

    expect(clearedBoard).toEqual(expectedBoard);
    expect(clearedPlayerShips).toEqual(expectedPlayerShips);
  });

  describe('changePlayer', () => {
    test('changePlayer switches to player 2', () => {
      gameBoard.changePlayer();
      expect(gameBoard.getCurrentPlayer()).toBe(2);
    });

    test('ships are placed on the current player board', () => {
      gameBoard.placeShip(3, { x: 3, y: 3 }, 'H');
      expect(gameBoard.getPlayerShips(1).ships.length).toBe(1);

      gameBoard.changePlayer();
      gameBoard.placeShip(3, { x: 3, y: 3 }, 'H');
      expect(gameBoard.getPlayerShips(2).ships.length).toBe(1);

      gameBoard.changePlayer();
      expect(gameBoard.getPlayerShips(1).ships.length).toBe(1);
    });
  });

  describe('receiveAttack', () => {
    beforeEach(() => {
      gameBoard.placeShip(2, { x: 4, y: 3 }, 'H');
      gameBoard.placeShip(3, { x: 4, y: 5 }, 'H');
      gameBoard.changePlayer();
      gameBoard.placeShip(2, { x: 4, y: 3 }, 'H');
      gameBoard.placeShip(3, { x: 4, y: 5 }, 'H');
    });

    test('throws on out-of-bounds attack', () => {
      expect(() => gameBoard.receiveAttack({ x: 12, y: 5 })).toThrow();
    });

    test('registers a hit and prevents duplicate attacks', () => {
      expect(gameBoard.receiveAttack({ x: 4, y: 3 })).toBe(true);
      expect(() => gameBoard.receiveAttack({ x: 4, y: 3 })).toThrow();

      const ship = gameBoard.getPlayerShips(1).ships[0];
      expect(ship!.getHits()).toBe(1);
      expect(ship!.getIsSunken()).toBe(false);
    });

    test('sinks a ship and increments destroyed count', () => {
      gameBoard.receiveAttack({ x: 4, y: 3 });
      gameBoard.receiveAttack({ x: 5, y: 3 });

      const ship = gameBoard.getPlayerShips(1).ships[0];
      expect(ship!.getHits()).toBe(2);
      expect(ship!.getIsSunken()).toBe(true);
      expect(gameBoard.getPlayerShips(1).destroyed).toBe(1);
    });

    test('does not affect other ships or other player', () => {
      gameBoard.receiveAttack({ x: 4, y: 3 });

      expect(gameBoard.getPlayerShips(1).ships[1]!.getHits()).toBe(0);
      expect(gameBoard.getPlayerShips(2).ships[0]!.getHits()).toBe(0);
    });

    test('registers a miss correctly', () => {
      expect(gameBoard.receiveAttack({ x: 0, y: 0 })).toBe(false);
    });
  });
});
