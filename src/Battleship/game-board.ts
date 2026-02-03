import Ship from './ship';

class GameBoard {
  private currentPlayer: 1 | 2 = 1;

  private playerShips: {
    player1Ships: { ships: Ship[]; destroyed: number };
    player2Ships: { ships: Ship[]; destroyed: number };
  } = {
    player1Ships: { ships: [], destroyed: 0 },
    player2Ships: { ships: [], destroyed: 0 },
  };

  private board: Cell[][] = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      player1Attacked: false,
      player2Attacked: false,
      player1Ship: null,
      player2Ship: null,
    })),
  );

  public getBoard(): Cell[][] {
    return this.board;
  }

  public getCurrentPlayer(): 1 | 2 {
    return this.currentPlayer;
  }

  public getPlayerShips(player: number): { ships: Ship[]; destroyed: number } {
    if (player !== 1 && player !== 2) throw new Error('Invalid Player');
    return player === 1
      ? this.playerShips.player1Ships
      : this.playerShips.player2Ships;
  }

  public changePlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  public placeShip(
    length: number,
    position: { x: number; y: number },
    orientation: string,
  ): boolean {
    const player = this.getCurrentPlayer();

    if (length < 2 || length > 5) throw new Error('Invalid Ship length');
    if (orientation !== 'H' && orientation !== 'V')
      throw new Error('Invalid Ship Orientation');
    if (!this.canPlaceShip(length, position, orientation, player)) {
      throw new Error('Invalid ship placement');
    }

    const ship = new Ship(length);

    if (player === 1) {
      this.playerShips.player1Ships.ships.push(ship);
    } else {
      this.playerShips.player2Ships.ships.push(ship);
    }

    for (let i = 0; i < length; i++) {
      const x = orientation === 'H' ? position.x + i : position.x;
      const y = orientation === 'V' ? position.y + i : position.y;

      if (player === 1) {
        this.board[x]![y]!.player1Ship = ship;
      } else {
        this.board![x]![y]!.player2Ship = ship;
      }
    }

    return true;
  }

  public receiveAttack(position: { x: number; y: number }): boolean {
    const x = position.x;
    const y = position.y;
    const player = this.getCurrentPlayer();
    let hit = false;

    if (x < 0 || x > 9 || y < 0 || y > 9)
      throw new Error('Attack is out of bounds');

    const cell = this.board[x]![y]!;

    const attackedKey = `player${player}Attacked` as const;

    if (cell[attackedKey]) throw new Error('Cell is already hit');

    cell[attackedKey] = true;

    if (player === 1 && cell.player2Ship) {
      cell.player2Ship.hit();
      if (cell.player2Ship.getIsSunken()) {
        this.playerShips.player2Ships.destroyed += 1;
      }

      return true;
    } else if (player === 2 && cell.player1Ship) {
      cell.player1Ship.hit();
      if (cell.player1Ship.getIsSunken()) {
        this.playerShips.player1Ships.destroyed += 1;
      }

      return true;
    }
    return false;
  }

  public checkIfWon(player: 1 | 2) {
    if (player === 1) {
      return this.playerShips.player2Ships.destroyed ===
        this.playerShips.player2Ships.ships.length
        ? true
        : false;
    } else if (player === 2) {
      return this.playerShips.player1Ships.destroyed ===
        this.playerShips.player1Ships.ships.length
        ? true
        : false;
    }
    throw new Error('Invalid Player');
  }

  public clearGame() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        player1Attacked: false,
        player2Attacked: false,
        player1Ship: null,
        player2Ship: null,
      })),
    );

    this.playerShips = {
      player1Ships: { ships: [], destroyed: 0 },
      player2Ships: { ships: [], destroyed: 0 },
    };
  }

  private canPlaceShip(
    length: number,
    position: { x: number; y: number },
    orientation: 'H' | 'V',
    player: 1 | 2,
  ): boolean {
    for (let i = 0; i < length; i++) {
      const x = orientation === 'H' ? position.x + i : position.x;
      const y = orientation === 'V' ? position.y + i : position.y;

      if (x < 0 || x > 9 || y < 0 || y > 9) {
        return false;
      }

      const cell = this.board[x]![y];

      if (
        (player === 1 && cell!.player1Ship) ||
        (player === 2 && cell!.player2Ship)
      ) {
        return false;
      }
    }

    return true;
  }
}

type Cell = {
  player1Attacked: boolean;
  player2Attacked: boolean;
  player1Ship: null | Ship;
  player2Ship: null | Ship;
};

export default GameBoard;
