const Gameboard = (() => {
  const board = Array(9).fill('');

  const getBoard = () => board;

  const updateBoard = (position, marker) => {
    if (board[position] === '') {
      board[position] = marker;
      return true;
    } else {
      return false;
    }
  };

  const resetBoard = () => board.fill('');

  return {
    getBoard,
    updateBoard,
    resetBoard,
  };
})();

const Player = (name, marker) => {
  return {
    name: name,
    marker: marker,
  };
};

const GameController = (() => {
  const playerOne = Player('Player 1', 'X');
  const playerTwo = Player('Player 2', 'O');
  let currentPlayer = playerOne;
  let gameOver = false;
  const message = document.querySelector('.gameboard__message-text');

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getPlayer = () => {
    return {
      playerOne: playerOne,
      playerTwo: playerTwo,
    };
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    updateMessage(`It's your turn, ${currentPlayer.name}!`);
  };

  const checkWinner = (marker) => {
    return winningCombinations.some((combinations) =>
      combinations.every((index) => Gameboard.getBoard()[index] === marker),
    );
  };

  const ifTie = () => Gameboard.getBoard().every((cell) => cell !== '');

  const playRound = (position) => {
    if (gameOver) return;

    if (!Gameboard.updateBoard(position, currentPlayer.marker)) return;

    if (checkWinner(currentPlayer.marker)) {
      updateMessage(`Congratulations, ${currentPlayer.name}! You win! 🎉`);
      gameOver = true;
      return;
    }

    if (ifTie()) {
      updateMessage("It's a tie! No more moves left. 🤝");
      gameOver = true;
      return;
    }

    switchPlayer();
  };

  const updateMessage = (text) => {
    message.textContent = text;
  };

  const resetGame = () => {
    gameOver = false;
    currentPlayer = playerOne;
    updateMessage('');
    Gameboard.resetBoard();
  };

  updateMessage('Player 1, Start Your Game!');

  return {
    getPlayer,
    playRound,
    resetGame,
  };
})();

const DisplayController = (() => {
  const getPlayer = GameController.getPlayer();
  const getGameboard = Gameboard.getBoard();
  const cells = document.querySelectorAll('.gameboard__cell');
  const playerOneName = document.querySelector(
    '.player__info-name--player-one .player__info-name-text',
  );
  const playerTwoName = document.querySelector(
    '.player__info-name--player-two .player__info-name-text',
  );

  const displayPlayerInfo = () => {
    playerOneName.textContent = getPlayer.playerOne.name;
    playerTwoName.textContent = getPlayer.playerTwo.name;
  };

  const renderBoard = () => {
    cells.forEach((cell, index) => {
      cell.textContent = getGameboard[index];
      cell.className = 'gameboard__cell';
      if (getGameboard[index] === 'X') {
        cell.classList.add('x-marker');
      } else if (getGameboard[index] === 'O') {
        cell.classList.add('o-marker');
      }
    });
  };

  const clickCellListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const position = cell.dataset.index;
        GameController.playRound(position);
        renderBoard();
      });
    });
  };

  const restartGame = () => {
    const restartBtn = document.getElementById('restart-button');
    restartBtn.addEventListener('click', () => {
      GameController.resetGame();
      renderBoard();
    });
  };

  return {
    displayPlayerInfo,
    renderBoard,
    clickCellListeners,
    restartGame,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  DisplayController.displayPlayerInfo();
  DisplayController.renderBoard();
  DisplayController.clickCellListeners();
  DisplayController.restartGame();
});
