class GameBoard {
  constructor() {
    this.board = new Map();
    this.failState = 0;
    this.fillMap();
  }

  fillMap() {
    for (let i = 0; i < 49; i++) {
      this.board.set(i, "empty");
    }
    this.placeOne();
    this.placeOne();
    this.placeOne();
    this.placeMultiple(2);
    this.placeMultiple(2);
    this.placeMultiple(3);
    this.placeMultiple(4);
  }

  getRandomEmptyPosition() {
    let num;
    do {
      num = Math.floor(Math.random() * 49);
    } while (this.board.get(num) != "empty");
    return num;
  }

  placeOne() {
    this.board.set(this.getRandomEmptyPosition(), "full");
  }

  placeMultiple(count) {
    let direction = Math.floor(Math.random() * 4);
    let startPos = this.getRandomEmptyPosition();
    let positions = [startPos];
    let valid = true;

    switch (direction) {
      case 0: // Up
        for (let i = 1; i < count; i++) {
          let newPos = startPos - i * 7;
          if (newPos < 0 || (startPos % 7) - (i - 1) < 0) {
            valid = false;
            break;
          }
          positions.push(newPos);
        }
        break;
      case 1: // Down
        for (let i = 1; i < count; i++) {
          let newPos = startPos + i * 7;
          if (newPos >= 49 || (startPos % 7) + (i - 1) >= 7) {
            valid = false;
            break;
          }
          positions.push(newPos);
        }
        break;
      case 2: // Right
        for (let i = 1; i < count; i++) {
          let newPos = startPos + i;
          if (newPos % 7 === 0 || newPos >= 49) {
            valid = false;
            break;
          }
          positions.push(newPos);
        }
        break;
      case 3: // Left
        for (let i = 1; i < count; i++) {
          let newPos = startPos - i;
          if (newPos % 7 === 6 || newPos < 0) {
            valid = false;
            break;
          }
          positions.push(newPos);
        }
        break;
    }

    if (valid && positions.every((pos) => this.board.get(pos) === "empty")) {
      positions.forEach((pos) => this.board.set(pos, "full"));
    } else {
      this.placeMultiple(count);
    }
  }

  attack(num) {
    if (this.board.get(num) == "empty") {
      this.board.set(num, "hitEmpty");
      return "continue";
    } else if (
      this.board.get(num) == "hitEmpty" ||
      this.board.get(num) == "hitShip"
    ) {
      return;
    } else if (this.board.get(num) == "full") {
      this.board.set(num, "hitShip");
      this.failState++;
      return "continue";
    }
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.board = new GameBoard();
  }

  attack(num) {
    this.board.attack(num);
  }

  checkEnd() {
    if (this.board.failState == 14) {
      return "gameOver";
    }
    return "continue";
  }

  resetBoard() {
    this.board.fillMap();
  }
}

class Game {
  constructor() {
    this.player = new Player("Player");
    this.computer = new Player("Computer");
    this.turn = true;
    this.gameOver = false;
    this.initialize();
  }

  initialize() {
    this.player.resetBoard();
    this.computer.resetBoard();
    this.updateDOM();
    this.turn = true;
    this.player.board.failState = 0;
    this.computer.board.failState = 0;
    this.gameOver = false;
    currentState.innerText = "Player Turn";
  }

  updateDOM() {
    updateBoard(this.player.board.board, "", "P");
    updateBoard(this.computer.board.board, "computer", "C");
  }

  playTurn(position) {
    if (this.gameOver == true) {
      currentState.textContent = "Game is over! Please reset.";
      return;
    }
    if (this.turn) {
      this.computer.board.attack(position);
      this.updateDOM();
      if (this.computer.checkEnd() == "gameOver") {
        this.gameOver = true;
        currentState.innerText = "Player Wins!";
        return;
      }
      this.turn = false;
      this.computerTurn();
    }
  }

  computerTurn() {
    if (this.gameOver) {
      return;
    }

    currentState.innerText = "Computer Turn";

    let position;
    let validPositionFound = false;

    while (!validPositionFound) {
      position = Math.floor(Math.random() * 49);
      if (
        this.player.board.board.get(position) === "empty" ||
        this.player.board.board.get(position) === "full"
      ) {
        validPositionFound = true;
      }
    }
    this.player.board.attack(position);
    this.updateDOM();
    if (this.player.checkEnd() === "gameOver") {
      this.gameOver = true;
      currentState.innerText = "Computer Wins!";
      return;
    }
    this.turn = true;
    currentState.innerText = "Player Turn";
  }
}

// DOM handling

let currentState = document.getElementById("state");
let reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  game.initialize();
});

function updateTile(tileID, state, team) {
  let tile = document.getElementById(tileID);
  switch (state) {
    case "empty":
      tile.style.backgroundColor = "white";
      break;
    case "full":
      if (team == "P") {
        tile.style.backgroundColor = "grey";
      } else {
        tile.style.backgroundColor = "white";
      }
      break;
    case "hitEmpty":
      tile.style.backgroundColor = "black";
      break;
    case "hitShip":
      tile.style.backgroundColor = "red";
      break;
  }
}

function updateBoard(board, prefix, team) {
  for (let i = 0; i < 49; i++) {
    let tileID = `${prefix}Tile${i}`;
    updateTile(tileID, board.get(i), team);
  }
}

document.querySelectorAll("#computerBoard div").forEach((tile) => {
  tile.addEventListener("click", (event) => {
    let position = parseInt(event.target.id.replace("computerTile", ""));
    if (!game.gameOver && game.turn) {
      game.playTurn(position);
    }
  });
});

const game = new Game();
