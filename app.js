"use strict";

/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)

*/

const Gameboard = function () {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell());
      // board[i].push("cell");
    }
  }

  const getBoard = () => board;

  const drawMarker = (column, player) => {
    const availableCells = board
      .filter((row) => !row[column].getValue())
      .map((row) => row[column]);

    if (!availableCells.length) return;
    availableCells[row][column].addMarker(player.marker);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };
  return {
    getBoard,
    drawMarker,
    printBoard,
  };
};

function Cell() {
  let value;

  const addMarker = (playerMarker) => {
    value = playerMarker;
  };

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = () => {
    board.drawMarker(getActivePlayer().marker);

    /*  This is where we would check for a winner and handle that logic, such as a win message. */

    switchPlayerTurn();
    printNewRound();
  };
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // render board squares
    board.forEach((row) => {
      row.forEach((cell) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // // Create a data attribute to identify the column
        // // This makes it easier to pass into our `playRound` function
        // cellButton.dataset.column = index;
        // cellButton.textContent = cell.getValue();
        // boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedCell = e.target;
    game.playRound(selectedCell);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // initial render
  updateScreen();

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();
