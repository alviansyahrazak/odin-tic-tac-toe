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
      gameOver = true;
      return `Congratulations, ${currentPlayer.name}! You win! 🎉`;
    }

    if (ifTie()) {
      gameOver = true;
      return "It's a tie! No more moves left. 🤝";
    }

    switchPlayer();
    return `It's your turn, ${currentPlayer.name}!`;
  };

  const resetGame = () => {
    gameOver = false;
    currentPlayer = playerOne;
    Gameboard.resetBoard();
    return 'Player 1, Start Your Game!';
  };

  return {
    getPlayer,
    playRound,
    resetGame,
  };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll('.gameboard__cell');
  const playerOneName = document.querySelector('.player__info-name--player-one .player__info-name-text');
  const playerTwoName = document.querySelector('.player__info-name--player-two .player__info-name-text');
  const message = document.querySelector('.gameboard__message-text');

  const updatePlayerName = () => {
    const { playerOne, playerTwo } = GameController.getPlayer();
    playerOneName.textContent = playerOne.name;
    playerTwoName.textContent = playerTwo.name;
  };

  const updateMessage = (text) => {
    message.textContent = text;
  };

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.className = 'gameboard__cell';
      if (board[index] === 'X') {
        cell.classList.add('x-marker');
      } else if (board[index] === 'O') {
        cell.classList.add('o-marker');
      }
    });
  };

  const clickCellListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const position = cell.dataset.index;
        const roundResult = GameController.playRound(position);
        if (roundResult) updateMessage(roundResult);
        renderBoard();
      });
    });
  };

  const restartGame = () => {
    const restartBtn = document.getElementById('restart-button');
    restartBtn.addEventListener('click', () => {
      const initialMessage = GameController.resetGame();
      updateMessage(initialMessage);
      renderBoard();
    });
  };

  const init = () => {
    updatePlayerName();
    updateMessage(GameController.resetGame());
    renderBoard();
    clickCellListeners();
    restartGame();
  };

  init();
})();
