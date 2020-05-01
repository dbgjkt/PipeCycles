import React from "react";

export function initialObj() {
  const newObj = {
    exist: true,
    value: 1
  };
  return newObj;
}

export function initialNullObj() {
  const nullObj = {
    exist: false,
    value: 0
  };
  return nullObj;
}

export function clearObj(array, i) {
  let tmp = initialNullObj();
  array[i] = JSON.parse(JSON.stringify(tmp));
}

export function copyObj(array, i, j) {
  array[j] = JSON.parse(JSON.stringify(array[i]));
}

export function moveObj(array, i, j) {
  // replace i with j
  copyObj(array, j, i);
  // clear old j
  clearObj(array, j);
}

export function swapObj(array, i, j) {
  let tmp = JSON.parse(JSON.stringify(array[i]));
  copyObj(array, i, j);
  array[j] = JSON.parse(JSON.stringify(tmp));
}

export function move2DGravity(array, baseRow, rMin, rMax, cMin, cMax, gravity) {
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
                moveObj(array, index, k);
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
                moveObj(array, index, k);
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
                moveObj(array, index, k);
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
                moveObj(array, index, k);
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

// ==== NumberBox+- ====
export class NumberBoxPM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: parseInt(this.props.value, 10)
    };
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  stepPlus(i) {
    const value = parseInt(this.state.value, 10);
    if ((value < this.props.max && i > 0) || (value > 1 && i < 0)) {
      const newValue = value + parseInt(i, 10);
      this.setState({ value: newValue });
    }
  }

  keepPlus(i) {
    this.timerIDPlus = setInterval(() => this.stepPlus(i), 100);
  }

  stopPlus() {
    clearInterval(this.timerIDPlus);
  }

  render() {
    return (
      <div className="numberBoxPM">
        <NumberBox
          id={this.props.id}
          max={this.props.max}
          value={this.state.value}
          onChange={e => this.onChange(e)}
        />
        <ButtonPlus
          onClick={() => this.stepPlus(1)}
          onMouseDown={() => this.keepPlus(1)}
          onMouseUp={() => this.stopPlus()}
        />
        <ButtonMinus
          onClick={() => this.stepPlus(-1)}
          onMouseDown={() => this.keepPlus(-1)}
          onMouseUp={() => this.stopPlus()}
        />
      </div>
    );
  }
}

function NumberBox(props) {
  return (
    <input
      className="numberBox"
      id={props.id}
      type="number"
      min="1"
      max={props.max}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

function ButtonPlus(props) {
  return (
    <button
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      +
    </button>
  );
}

function ButtonMinus(props) {
  return (
    <button
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      -
    </button>
  );
}

// ==== NumberBox+- end ====
