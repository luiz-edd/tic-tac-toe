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
        animation.displayWinner(player);
        animation.blinkWinner([i], [i + 1], [i + 2]);
        return true;
      }
    }
    // verify 3 equal shapes in a colun
    for (let i = 0; i <= 3; i++) {
      if (gameBoard[i] && gameBoard[i] === gameBoard[i + 3] && gameBoard[i] === gameBoard[i + 6]) {
        animation.displayWinner(player);
        animation.blinkWinner([i], [i + 3], [i + 6]);
        return true;
      }
    }
    // verify 3 equal shapes in a vertical
    if (gameBoard[0] && gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8]) {
      animation.displayWinner(player);
      animation.blinkWinner([0], [4], [8]);
      return true;
    }
    if (gameBoard[2] && gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6]) {
      animation.displayWinner(player);
      animation.blinkWinner([2], [4], [6]);
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
const computerMechanics = (() => {
  const createComputerMoveAndReturnIndex = (player) => {
    let computerPlayIndex;
    do {
      computerPlayIndex = Math.floor(Math.random() * 9);
    } while (game.getGameBoardField(computerPlayIndex));
    console.log(computerPlayIndex);
    game.setGameBoard(computerPlayIndex, player.getShape());
    return computerPlayIndex;
  };

  const generateComputerPlayer = (player1) => {
    if (player1.getShape() === 'o') {
      return player('Computer', 'x');
    }
    return player('Computer', 'o');
  };
  const generatePlayer2 = (player1) => {
    if (player1.getShape() === 'o') {
      return player('Player 2', 'x');
    }
    return player('Player 2', 'o');
  };
  return {
    generateComputerPlayer,
    createComputerMoveAndReturnIndex,
    generatePlayer2,
  };
})();

const displayController = (() => {
  const field = Array.from(document.querySelectorAll('.field'));
  const shape = Array.from(document.querySelectorAll('input[name="shape"]'));
  const opponent = Array.from(document.querySelectorAll('input[name="opponent"]'));

  const returnShapeElement = (player) => {
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
        if (document.querySelector('input[name="opponent"]:checked').value === 'computer') {
          gameFlow.playRound(player, element, index, field);
        } else {
          gameFlow.playRoundAgainstFriend(player, element, index, field);
        }
      });
    });
    shape.forEach((element) => {
      element.addEventListener('click', () => {
        gameFlow.resetGame();
        player.setShape(element.value);
      });
    });
    opponent.forEach((element) => {
      element.addEventListener('click', () => {
        gameFlow.resetGame();
      });
    });
  };

  const resetDisplay = () => {
    field.forEach((element) => {
      if (element.firstChild) {
        element.firstChild.remove();
      }
    });
  };
  return { addEvents, resetDisplay, returnShapeElement };
})();

const gameFlow = (() => {
  let turn = true;
  const playRound = (player, element, index, field) => {
    // verify if the position on game is empty
    if (!game.getGameBoardField(index)) {
      const computer = computerMechanics.generateComputerPlayer(player); // generate a computer
      game.setGameBoard(index, player.getShape()); // add the movement to the gameBoard
      element.appendChild(displayController.returnShapeElement(player)); // add the movement to the display
      // verify if player 1 wins
      if (game.verifyWin(player)) resetGame();
      // verify tie
      if (!game.getGameBoard().includes(undefined)) {
        resetGame();
        console.log('tie');
      }
      if (document.querySelector('input[name="opponent"]:checked').value === 'computer') {
        // make computer movement
        field[computerMechanics.createComputerMoveAndReturnIndex(computer)].appendChild(
          displayController.returnShapeElement(computer),
        );
      }
      // verify if computer win
      if (game.verifyWin(computer)) {
        resetGame();
      }
      // verify tie again
      if (!game.getGameBoard().includes(undefined)) {
        resetGame();
        console.log('tie');
      }
    }
  };

  const playRoundAgainstFriend = (player1, element, index, field) => {
    const player2 = computerMechanics.generatePlayer2(player1);

    const playerMove = (player) => {
      // verify if the position on game is empty
      if (!game.getGameBoardField(index)) {
        game.setGameBoard(index, player.getShape()); // add the movement to the gameBoard
        element.appendChild(displayController.returnShapeElement(player)); // add the movement to the display
        // verify if player 1 wins
        if (game.verifyWin(player)) resetGame();
        // verify tie
        if (!game.getGameBoard().includes(undefined)) {
          resetGame();
          console.log('tie');
        }
        turn = !turn;
      }
    };

    turn ? playerMove(player1) : playerMove(player2);
  };

  // const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const resetGame = async () => {
    // await delay(5000);
    game.resetGameBoard();
    displayController.resetDisplay();
  };

  const playerShape = document.querySelector('input[name="shape"]:checked').value;
  const newPlayer = player('Player 1', playerShape);
  displayController.addEvents(newPlayer);

  return { playRound, resetGame, playRoundAgainstFriend };
})();

const animation = (() => {
  const field = Array.from(document.querySelectorAll('.field'));

  const winner = document.querySelector('.winner');
  const displayWinner = (player) => {
    winner.textContent = `${player.getName()} win!`;
  };
  const resetDisplay = () => {
    winner.textContent = '';
  };

  const blinkWinner = async (position1, position2, position3) => {
    field[position1].firstElementChild.classList.add('blink');
    field[position2].firstElementChild.classList.add('blink');
    field[position3].firstElementChild.classList.add('blink');
  };
  return { displayWinner, resetDisplay, blinkWinner };
})();
