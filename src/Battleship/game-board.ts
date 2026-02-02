import Ship from './ship';

class GameBoard {
  private player1Turn: boolean = true;

  private board: Cell[][] = Array.from({ length: 10 }, () =>
    Array(10).fill({
      player1Hit: false,
      player2Hit: false,
      player1Ship: null,
      player2Ship: null,
    }),
  );

  public getBoard(): Cell[][] {
    return this.board;
  }

  public getCurrentPlayer(): string {
    return this.player1Turn ? 'Player 1' : 'Player 2';
  }

  public placeShip(
    length: number,
    position: { x: number; y: number },
    orientation: string,
  ) {
    if (length < 2 || length > 5) throw new Error('Invalid Ship length');
    if (orientation !== 'H' && orientation !== 'V')
      throw new Error('Invalid Ship Orientation');
    this.canPlaceShip(length, position, orientation);

    const ship = new Ship(length);

    for (let i = 0; i < length; i++) {
      let x = position.x;
      let y = position.y;

      if (orientation === 'H') x += i;
      else y += i;

      if (this.player1Turn) this.board[x]![y]!.player1Ship = ship;
      else this.board[x]![y]!.player2Ship = ship;
    }
  }

  private canPlaceShip(
    length: number,
    position: { x: number; y: number },
    orientation: string,
  ) {
    for (let i = 0; i < length; i++) {
      let x = position.x;
      let y = position.y;

      if (orientation === 'H') x += i;
      else y += i;

      if (x < 0 || x > 9 || y < 0 || y > 9)
        throw new Error('Ship Placed out of Bounds');

      if (this.player1Turn) {
        if (this.board[x]![y]!.player1Ship)
          throw new Error('Ship already placed here');
      } else {
        if (this.board[x]![y]!.player2Ship)
          throw new Error('Ship already placed here');
      }
    }
  }
}

type Cell = {
  player1Hit: boolean;
  player2Hit: boolean;
  player1Ship: null | Ship;
  player2Ship: null | Ship;
};

export default GameBoard;
