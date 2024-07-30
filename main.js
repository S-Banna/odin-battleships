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
}
