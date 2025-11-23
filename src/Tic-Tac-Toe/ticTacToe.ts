const gameBoard = (function () {
  const startBoard: undefined[] = new Array(9);
  let board: (undefined | 'X' | 'O')[] = Array.from(startBoard);
  let player1 = true;
  const wins: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function startGame() {
    board = Array.from(startBoard);
    player1 = true;
    document.querySelectorAll<HTMLElement>('.cell').forEach((cell) => {
      cell.innerText = '';
    });
  }

  function makeMove(cell: number): false | 'X' | 'O' {
    if (board[cell] !== undefined) return false;
    board[cell] = player1 ? 'X' : 'O';
    player1 = !player1;
    return board[cell];
  }

  function checkIfWon(): 'X' | 'O' | false {
    for (const [a, b, c] of wins) {
      console.log(board[a], board[b], board[c]);
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return false;
  }

  function checkIfDraw(): undefined[] {
    return board.filter((cell) => cell === undefined);
  }

  return { startGame, checkIfWon, makeMove, checkIfDraw };
})();

const dialog = document.querySelector<HTMLDialogElement>('dialog');

document.querySelectorAll<HTMLElement>('.cell')?.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const target = e.currentTarget as HTMLElement;
    const id = Number(target.id);
    const move = gameBoard.makeMove(id);
    if (!move) {
      console.log('Invalid Move');
      return;
    }
    console.log('Valid Move');
    target.innerText = move;
    const winner = gameBoard.checkIfWon();
    const draw = gameBoard.checkIfDraw();
    console.log(draw);
    if (winner) {
      dialog!.innerText = `${winner} won`;
    } else if (draw.length < 1) {
      dialog!.innerText = 'Draw';
    }

    if (winner || draw.length < 1) {
      dialog?.show();
      setTimeout(() => {
        dialog!.close();
        gameBoard.startGame();
      }, 2000);
    }
  });
});
