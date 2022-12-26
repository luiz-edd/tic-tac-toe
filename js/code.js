const game = (() => {
  //   const gameBoard = [...Array(9)].map((x) => 0);
  let gameBoard = Array(9);
  const setGameBoard = (index, shape) => {
    gameBoard[index] = shape;

    console.log(gameBoard);
  };

  // game logic
  const verifyWin = (player) => {
    // verify 3 equal shapes in a row
    for (let i = 0; i <= 6; i += 3) {
      if (gameBoard[i] && gameBoard[i] === gameBoard[i + 1] && gameBoard[i] === gameBoard[i + 2]) {
        console.log(`${player.getName()} win`);
        return true;
      }
    }
    // verify 3 equal shapes in a colun
    for (let i = 0; i <= 3; i++) {
      if (gameBoard[i] && gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6]) {
        console.log(`${player.getName()} win`);
        return true;
      }
    }
    // verify 3 equal shapes in a vertical
    if (gameBoard[0] && gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8]) {
      console.log(`${player.getName()} win`);
      return true;
    }
    if (gameBoard[2] && gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6]) {
      console.log(`${player.getName()} win`);
      return true;
    }
  };
  const getGameBoardField = (index) => gameBoard[index];
  const resetGameBoard = () => {
    gameBoard = Array(9);
  };
  const getGameBoard = () => gameBoard;

  return {
    setGameBoard,
    verifyWin,
    getGameBoardField,
    resetGameBoard,
    getGameBoard,
  };
})();

const player = (name, shape) => {
  const player = {
    name,
    score: 0,
    shape,
  };
  const info = () => console.log(player);
  const getShape = () => shape;
  const setShape = (shape2) => (shape = shape2);
  const getName = () => name;

  return {
    info,
    getShape,
    setShape,
    getName,
  };
};

const generateComputerPlayer = (player1) => {
  if (player1.getShape() === 'o') {
    return player('computer', 'x');
  }
  return player('computer', 'o');
};

const displayController = (() => {
  const field = Array.from(document.querySelectorAll('.field'));

  const markShapeOnBoard = (player) => {
    const x = document.createElement('img');
    const o = document.createElement('img');
    x.setAttribute('src', 'img/x.svg');
    o.setAttribute('src', 'img/circle.svg');
    if (player.getShape() === 'x') {
      return x;
    }
    if (player.getShape() === 'o') {
      return o;
    }
  };

  const addEvents = (player) => {
    field.forEach((element, index) => {
      element.addEventListener('click', () => {
        if (!game.getGameBoardField(index)) {
          element.appendChild(markShapeOnBoard(player));
          game.setGameBoard(index, player.getShape());
          const computer = generateComputerPlayer(player);
          // change the shape every move
          // if (player.getShape() === 'x') {
          //   player.setShape('o');
          // } else {
          //   player.setShape('x');
          // }

          // verify if player 1 wins
          if (game.verifyWin(player)) {
            game.resetGameBoard();
            resetDisplay();
          }
          // verify if computer 2 wins
          makeComputerPlay(computer);
          if (game.verifyWin(computer)) {
            game.resetGameBoard();
            resetDisplay();
          }
          // verify tie
          if (!game.getGameBoard().includes(undefined)) {
            game.resetGameBoard();
            resetDisplay();
            console.log('tie');
          }
        }
        // console.log(player.getShape());
      });
    });
  };

  const makeComputerPlay = (player) => {
    let computerPlayIndex;
    do {
      computerPlayIndex = Math.floor(Math.random() * 9);
    } while (game.getGameBoardField(computerPlayIndex));
    console.log(computerPlayIndex);
    game.setGameBoard(computerPlayIndex, player.getShape());
    field[computerPlayIndex].appendChild(markShapeOnBoard(player));
  };

  const resetDisplay = () => {
    field.forEach((element) => {
      if (element.firstChild) {
        element.firstChild.remove();
      }
    });
  };
  return { addEvents, resetDisplay };
})();

const gameFlow = (() => {
  const player1 = player('luiz', 'x');
  displayController.addEvents(player1);
})();
