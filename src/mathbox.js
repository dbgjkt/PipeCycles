// ==== simple math ====
export function getRandomInt(max) {
  // return an integer between 0 to max-1
  return Math.floor(Math.random() * max);
}

// ==== simple math end ====
// ==== Array fill ====
export function zeroFill(row, column) {
  return Array(row * column).fill(0);
}

export function normalFill(row, column) {
  const newArray = Array(row * column).fill(0);
  let index = 0;
  for (let i = 0; i < column; i++) {
    for (let j = 0; j < row; j++) {
      index = i * row + j;
      newArray[index] = index;
    }
  }

  return newArray;
}

export function snakeFill(row, column) {
  const newArray = Array(row * column).fill(0);
  let index, value;
  for (let i = 0; i < column; i++) {
    for (let j = 0; j < row; j++) {
      value = i * row + j;
      index = i % 2 === 0 ? value : (i + 1) * row - j - 1;
      newArray[index] = value;
    }
  }

  return newArray;
}

function go(now, row, direction) {
  const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  const n = parseInt(now, 10);
  const r = parseInt(row, 10);
  switch (direction) {
    case UP:
      return n - r;
    case RIGHT:
      return n + 1;
    case DOWN:
      return n + r;
    case LEFT:
      return n - 1;
    default:
      return -1;
  }
}

export function helixFill(row, column) {
  const newArray = Array(row * column).fill(0);
  const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  let index, value;
  let direction = UP;
  let [now, next] = [row * column - 1, null];
  let borderUp = 0,
    borderRight = row - 2,
    borderDown = column - 1,
    borderLeft = 0;
  let [ci, cj] = [column - 1, row - 1];
  for (let i = 0; i < column; i++) {
    for (let j = 0; j < row; j++) {
      value = i * row + j;
      index = now;
      newArray[index] = value;
      if (direction === RIGHT && cj === borderRight) {
        //console.log("value: " + value + " turn down");
        direction = UP;
        borderRight--;
      } else if (direction === DOWN && ci === borderDown) {
        //console.log("value: " + value + " turn left");
        direction = RIGHT;
        borderDown--;
      } else if (direction === LEFT && cj === borderLeft) {
        //console.log("value: " + value + " turn up");
        direction = DOWN;
        borderLeft++;
      } else if (direction === UP && ci === borderUp) {
        //console.log("value: " + value + " turn right");
        direction = LEFT;
        borderUp++;
      } else {
        // Do nothing
      }
      switch (direction) {
        case UP:
          ci--;
          break;
        case RIGHT:
          cj++;
          break;
        case DOWN:
          ci++;
          break;
        case LEFT:
          cj--;
          break;
        default:
          break;
      }
      next = go(now, row, direction);
      now = next;
    }
  }

  return newArray;
}

// ==== Array fill end ====
// ==== Array sort/reorder ====
export function shuffle(array) {
  // return a random ordered array
  for (let i = array.length - 1; i > 0; i--) {
    let j = getRandomInt(i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ==== Array sort/reorder end ====
