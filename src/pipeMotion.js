// ==== initial ====
export function initialPipeTable(row, column) {
  const size = column * row;
  const newPipeTable = Array(size).fill(null);

  for (let i = 0; i < size; i++) {
    newPipeTable[i] = initialPipe(i, row, column);
  }

  return newPipeTable;
}

function initialNullPipe() {
  const newPipe = {
    exist: false,
    id: -1,
    isGreen: false,
    shape: -1,
    direction: -1,
    links: [0, 0, 0, 0],
    out: -1,
    in: -1
  };

  return newPipe;
}

function initialPipe(i, row, column) {
  const newShape = isCorner(i, row, column) ? 0 : initialShape();
  const newDirection = initialDirection(newShape);
  const newLinks = initialLink(newShape, newDirection);

  const newPipe = {
    exist: true,
    id: i,
    isGreen: false,
    shape: newShape,
    direction: newDirection,
    links: newLinks,
    out: -1,
    in: -1
  };

  return newPipe;
}

function initialLink(shape, direction) {
  //const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  const [DL, UL, UR, DR, UD, LR] = [0, 1, 2, 3, 0, 1];
  const [LTYPE, ITYPE, XTYPE] = [0, 1, 2];
  let array = [0, 0, 0, 0];
  switch (shape) {
    case LTYPE:
      switch (direction) {
        case DL:
          array = [0, 0, 1, 1];
          break;

        case UL:
          array = [1, 0, 0, 1];
          break;

        case UR:
          array = [1, 1, 0, 0];
          break;

        case DR:
          array = [0, 1, 1, 0];
          break;

        default:
          console.log(
            "ERROR: initialLink(): Impossible directions. (renderPipe L)"
          );
          break;
      }
      break;

    case ITYPE:
      switch (direction) {
        case UD:
          array = [1, 0, 1, 0];
          break;

        case LR:
          array = [0, 1, 0, 1];
          break;

        default:
          console.log(
            "ERROR: initialLink(): Impossible directions. (renderPipe I)"
          );
          break;
      }
      break;

    case XTYPE:
      array = [1, 1, 1, 1];
      break;

    default:
      console.log("ERROR: initialLink(): Impossible shape.");
      break;
  }
  return array;
}

function initialDirection(shape) {
  const [LTYPE, ITYPE, XTYPE] = [0, 1, 2];
  let direction = -1;
  switch (shape) {
    case LTYPE:
      direction = Math.floor(Math.random() * 4);
      break;
    case ITYPE:
      direction = Math.floor(Math.random() * 2);
      break;
    case XTYPE:
      direction = 4;
      break;

    default:
      break;
  }
  return direction;
}

function initialShape() {
  // 7 : 2 : 1
  let shape = Math.floor(Math.random() * 10);
  if (shape < 7) return 0;
  else if (shape < 9) return 1;
  return 2;
}

function isCorner(i, row, column) {
  const size = row * column;
  if (i === 0 || i === row - 1 || i === size - row || i === size - 1) {
    return true;
  }
  return false;
}

// ==== initial end ===
// ==== check Cycles ====
export function checkCycles(pipes, start, row, column) {
  //const newPipes = this.state.pipes.slice();
  let cycleArray = [];
  let current,
    nextList = null;

  if (pipes[start].shape === 2) {
    return null;
  }

  current = start;
  cycleArray.push(current);
  nextList = findNextLink(pipes, current, row, column);

  while (nextList !== null) {
    let next = nextList[0];
    if (cycleArray[0] === next) {
      // Find cycle
      console.log("Cycle founds(" + cycleArray.length + "): " + cycleArray);
      return cycleArray;
    }
    cycleArray.push(next);
    setLink(pipes, current, next, nextList[1]);
    current = next;
    nextList = findNextLink(pipes, current, row, column);
  }
  // Not find cycle
  freeLink(pipes, row * column);

  return null;
}

function findNextLink(pipes, id, row, column) {
  // return [nextId,direction];
  const size = row * column;
  const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  let next = [null, null];
  let nextId;
  let linkOutOK, linkInOK;
  let pipeXOutOK;

  // Link up
  if (id >= row) {
    nextId = id - row;
    // Link out
    linkOutOK = pipes[id].links[UP] === 1 && pipes[id].out === -1;
    pipeXOutOK = pipes[id].in === DOWN || pipes[id].in === -1;
    if (pipes[id].shape === 2) linkOutOK = pipeXOutOK;
    // Link in
    linkInOK = pipes[nextId].links[DOWN] === 1 && pipes[nextId].in === -1;
    if (linkOutOK && linkInOK) {
      next = [nextId, UP];
      return next;
    }
  }
  // Link up End

  // Link down
  if (id + row < size) {
    nextId = id + row;
    // Link out
    linkOutOK = pipes[id].links[DOWN] === 1 && pipes[id].out === -1;
    pipeXOutOK = pipes[id].in === UP || pipes[id].in === -1;
    if (pipes[id].shape === 2) linkOutOK = pipeXOutOK;
    // Link in
    linkInOK = pipes[nextId].links[UP] === 1 && pipes[nextId].in === -1;
    if (linkOutOK && linkInOK) {
      next = [nextId, DOWN];
      return next;
    }
  }
  // Link down End

  // Link left
  if (!(id % row === 0)) {
    nextId = id - 1;
    // Link out
    linkOutOK = pipes[id].links[LEFT] === 1 && pipes[id].out === -1;
    pipeXOutOK = pipes[id].in === RIGHT || pipes[id].in === -1;
    if (pipes[id].shape === 2) linkOutOK = pipeXOutOK;
    // Link in
    linkInOK = pipes[nextId].links[RIGHT] === 1 && pipes[nextId].in === -1;
    if (linkOutOK && linkInOK) {
      next = [nextId, LEFT];
      return next;
    }
  }
  // Link left End

  // Link right
  if (!((id + 1) % row === 0)) {
    nextId = id + 1;
    // Link out
    linkOutOK = pipes[id].links[RIGHT] === 1 && pipes[id].out === -1;
    pipeXOutOK = pipes[id].in === LEFT || pipes[id].in === -1;
    if (pipes[id].shape === 2) linkOutOK = pipeXOutOK;
    // Link in
    linkInOK = pipes[nextId].links[LEFT] === 1 && pipes[nextId].in === -1;
    if (linkOutOK && linkInOK) {
      next = [nextId, RIGHT];
      return next;
    }
  }
  // Link right End

  return null;
}

function setLink(pipes, id, nextId, direction) {
  const reverse = (direction + 2) % 4;
  pipes[id].links[direction] = 2;
  pipes[nextId].links[reverse] = 2;
  pipes[id].out = direction;
  pipes[nextId].in = reverse;

  // pipeXcheck
  if (pipes[id].shape === 2 && pipes[id].in !== -1) {
    pipes[id].out = -1;
    pipes[id].in = -1;
  }
}

function freeLink(pipes, size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < 4; j++) {
      if (pipes[i].links[j] === 2) pipes[i].links[j] = 1;
    }
    pipes[i].in = -1;
    pipes[i].out = -1;
  }
}

// ==== check Cycles end====
// ==== rotate ====
export function rotatePipe(pipes, i, shape) {
  let tmp;
  tmp = pipes[i].links[3];
  pipes[i].links[3] = pipes[i].links[2];
  pipes[i].links[2] = pipes[i].links[1];
  pipes[i].links[1] = pipes[i].links[0];
  pipes[i].links[0] = tmp;
  switch (shape) {
    case 0:
      pipes[i].direction = (pipes[i].direction + 1) % 4;
      break;
    case 1:
      pipes[i].direction = (pipes[i].direction + 1) % 2;
      break;
    case 2:
      break;
    case -1:
      break;
    default:
      console.log("ERROR: rotate(): impossible shape.");
      break;
  }
}

// ==== rotate end ===
// ==== produce ====
export function producePipe(pipes, i, row, column, editMode, setShape) {
  const newPipe = initialPipe(i, row, column);
  if (editMode) {
    newPipe.shape = setShape;
    newPipe.direction = initialDirection(newPipe.shape);
    newPipe.links = initialLink(newPipe.shape, newPipe.direction);
  }
  pipes[i] = JSON.parse(JSON.stringify(newPipe));
}

// ==== produce end ====
// ==== clear ====
export function clearPipe(pipes, i) {
  const newPipe = initialNullPipe();
  pipes[i] = JSON.parse(JSON.stringify(newPipe));
}

// ==== clear end ====
// ==== move ====
export function movePipeDirection(newPipes, row, column, direction) {
  const semiRow = Math.floor(row / 2);
  const semiColumn = Math.floor(column / 2);
  const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];

  switch (direction) {
    case 0:
    case "UP":
      movePipeG(newPipes, row, 0, row, 0, column, UP);
      break;
    case 1:
    case "DOWN":
      movePipeG(newPipes, row, 0, row, 0, column, DOWN);
      break;
    case 2:
    case "LEFT":
      movePipeG(newPipes, row, 0, row, 0, column, LEFT);
      break;
    case 3:
    case "RIGHT":
      movePipeG(newPipes, row, 0, row, 0, column, RIGHT);
      break;
    case 4:
    case "CENTER":
      let boxRow, boxColumn;
      let rMin = row,
        rMax = 0,
        cMin = column,
        cMax = 0;
      for (let i = 0; i < column; i++) {
        for (let j = 0; j < row; j++) {
          if (newPipes[i * row + j].exist === true) {
            if (rMin > j) rMin = j;
            if (rMax < j) rMax = j;
            if (cMin > i) cMin = i;
            if (cMax < i) cMax = i;
          }
        }
      }
      boxRow = rMax - rMin;
      boxColumn = cMax - cMin;

      if (boxRow >= boxColumn) {
        movePipeG(newPipes, row, 0, semiRow, 0, column, RIGHT);
        movePipeG(newPipes, row, semiRow - 1, row, 0, column, LEFT);
        movePipeG(newPipes, row, 0, row, 0, semiColumn, DOWN);
        movePipeG(newPipes, row, 0, row, semiColumn - 1, column, UP);
      } else {
        movePipeG(newPipes, row, 0, row, 0, semiColumn, DOWN);
        movePipeG(newPipes, row, 0, row, semiColumn - 1, column, UP);
        movePipeG(newPipes, row, 0, semiRow, 0, column, RIGHT);
        movePipeG(newPipes, row, semiRow - 1, row, 0, column, LEFT);
      }
      break;
    case 5:
    case "AROUND":
      if (row >= column) {
        movePipeG(newPipes, row, 0, semiRow, 0, column, LEFT);
        movePipeG(newPipes, row, semiRow, row, 0, column, RIGHT);
        movePipeG(newPipes, row, 0, row, 0, semiColumn, UP);
        movePipeG(newPipes, row, 0, row, semiColumn, column, DOWN);
      } else {
        movePipeG(newPipes, row, 0, row, 0, semiColumn, UP);
        movePipeG(newPipes, row, 0, row, semiColumn, column, DOWN);
        movePipeG(newPipes, row, 0, semiRow, 0, column, LEFT);
        movePipeG(newPipes, row, semiRow, row, 0, column, RIGHT);
      }
      break;
    default:
      console.log(
        "movePipeDirection(): wrong direction. 0:UP,1:RIGHT,2:DOWN,3:LEFT,4:CENTER,5:AROUND"
      );
      break;
  }
}

export function movePipeG(array, baseRow, rMin, rMax, cMin, cMax, gravity) {
  const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  switch (gravity) {
    case UP:
      for (let j = rMin; j < rMax; j++) {
        for (let i = cMin; i < cMax; i++) {
          let index = i * baseRow + j;
          if (array[index].exist === false) {
            let kMin = i * baseRow + j;
            let kMax = cMax * baseRow + j;
            for (let k = kMin + baseRow; k < kMax; k += baseRow) {
              if (array[k].exist === true) {
                movePipe(array, index, k);
                break;
              }
            }
          }
        }
      }
      break;
    case RIGHT:
      for (let i = cMin; i < cMax; i++) {
        for (let j = rMax - 1; j >= rMin; j--) {
          let index = i * baseRow + j;
          if (array[index].exist === false) {
            let kMax = i * baseRow + j;
            let kMin = i * baseRow + rMin;
            for (let k = kMax - 1; k >= kMin; k--) {
              if (array[k].exist === true) {
                movePipe(array, index, k);
                break;
              }
            }
          }
        }
      }
      break;
    case DOWN:
      for (let j = rMin; j < rMax; j++) {
        for (let i = cMax - 1; i >= cMin; i--) {
          let index = i * baseRow + j;
          if (array[index].exist === false) {
            let kMax = i * baseRow + j;
            let kMin = cMin * baseRow + j;
            for (let k = kMax - baseRow; k >= kMin; k -= baseRow) {
              if (array[k].exist === true) {
                movePipe(array, index, k);
                break;
              }
            }
          }
        }
      }
      break;
    case LEFT:
      for (let i = cMin; i < cMax; i++) {
        for (let j = rMin; j < rMax; j++) {
          let index = i * baseRow + j;
          if (array[index].exist === false) {
            let kMin = i * baseRow + j;
            let kMax = i * baseRow + rMax;
            for (let k = kMin + 1; k < kMax; k++) {
              if (array[k].exist === true) {
                movePipe(array, index, k);
                break;
              }
            }
          }
        }
      }
      break;
    default:
      break;
  }
}

function movePipe(pipes, i, j) {
  // replace i with j
  pipes[i] = JSON.parse(JSON.stringify(pipes[j]));
  // clear old j
  clearPipe(pipes, j);
}

// ==== move end ====
// ==== print ====
export function printPipe(newPipes, i) {
  console.table(newPipes[i]);
}
// ==== print end ====
