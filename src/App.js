import React from "react";
import "./styles.css";
import { PipeDemo, Pipe } from "./pipe.js";
import {
  initialPipeTable,
  checkCycles,
  rotatePipe,
  clearPipe,
  producePipe,
  movePipeDirection
} from "./pipeMotion.js";
import { NumberBoxPM } from "./toolbox.js";
import { helixFill } from "./mathbox.js";

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideDemo: false
    };
  }

  handleClick() {
    const tmp = !this.state.hideDemo;
    this.setState({ hideDemo: tmp });
  }

  render() {
    if (this.state.hideDemo) {
      return (
        <div className="demo2" onClick={() => this.handleClick()}>
          <PipeDemo shape="7" />
        </div>
      );
    } else {
      return (
        <div className="demo" onClick={() => this.handleClick()}>
          <PipeDemo shape="0" />
          =&gt;
          <PipeDemo shape="1" />
          =&gt;
          <PipeDemo shape="2" />
          =&gt;
          <PipeDemo shape="3" />
          =&gt;
          <PipeDemo shape="0" />
          <PipeDemo shape="7" />
          <PipeDemo shape="4" />
          &lt;=&gt;
          <PipeDemo shape="5" />
          <PipeDemo shape="7" />
          <PipeDemo shape="6" />
        </div>
      );
    }
  }
}

function NewGameField(props) {
  return (
    <div className="newGameField">
      <button onClick={props.onClick}>Restart</button>
      <NumberBoxPM id={props.rowId} max={props.rowMax} value={props.row} />
      <NumberBoxPM
        id={props.columnId}
        max={props.columnMax}
        value={props.column}
      />
      <div className="scoreField" onClick={props.setEditMode}>
        score: {props.score}
      </div>
    </div>
  );
}

function EditMode(props) {
  return (
    <div>
      <input type="checkbox" id="setShape" onClick={props.editShape} />
      <label htmlFor="setShape">setShape</label>
      <div className="editShape" onChange={props.onChangeShape}>
        <input type="radio" id="setShapeL" name="shape" value="0" />
        <label htmlFor="setShapeL">L type</label>
        <br />
        <input type="radio" id="setShapeI" name="shape" value="1" />
        <label htmlFor="setShapeI">I type</label>
        <br />
        <input type="radio" id="setShapeX" name="shape" value="2" />
        <label htmlFor="setShapeX">X type</label>
        <br />
        <input
          type="radio"
          id="setShapeBlank"
          name="shape"
          value="-1"
          defaultChecked="checked"
        />
        <label htmlFor="setShapeBlank">Blank</label>
        <br />
      </div>
      <br />
      <div className="controlPanel">
        <button onClick={props.lightOnBoard}>lightOn</button>
        <br />
        <button onClick={props.movePipeBoard}>move</button>
        <br />
        <button onClick={props.producePipeHelix}>produce</button>
        <br />
        <button onClick={props.clearBoard}>clear</button>
        <br />
      </div>
      <br />
    </div>
  );
}

class Board extends React.Component {
  renderPipe(id) {
    return (
      <Pipe
        key={id}
        exist={this.props.pipes[id].exist}
        isGreen={this.props.pipes[id].isGreen}
        shape={this.props.pipes[id].shape}
        direction={this.props.pipes[id].direction}
        onClick={() => this.props.onClick(id)}
      />
    );
  }

  render() {
    let ListItem = [];
    let ListItem2 = [];
    const row = parseInt(this.props.row, 10);
    const column = parseInt(this.props.column, 10);

    for (let i = 0; i < column; i++) {
      for (let j = 0; j < row; j++) {
        ListItem.push(this.renderPipe(i * row + j));
      }
      ListItem2.push(
        <div key={i} className="pipe-row">
          {ListItem}
        </div>
      );
      ListItem = [];
    }
    return <div className="pipe-board">{ListItem2}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const row = parseInt(this.props.row, 10);
    const column = parseInt(this.props.column, 10);
    const newPipeTable = initialPipeTable(row, column);

    this.state = {
      row: row,
      column: column,
      pipes: newPipeTable,
      score: 0,
      gameOver: false,
      editMode: false,
      editShapeCheck: false,
      setShape: -1
    };
  }

  lightOn(pipes, i) {
    pipes[i].isGreen = true;
  }

  lightOnCycle(pipes, array) {
    for (let i = 0; i < array.length; i++) {
      this.lightOn(pipes, array[i]);
    }
  }

  lightOnBoard(newPipes, row, column) {
    const size = row * column;
    for (let i = 0; i < size; i++) {
      if (newPipes[i].isGreen === false) {
        let newCycleArray = checkCycles(newPipes, i, row, column);
        if (newCycleArray !== null) {
          this.lightOnCycle(newPipes, newCycleArray);
        }
      }
    }

    this.setState({ pipes: newPipes });
  }

  lightOff(pipes, i) {
    pipes[i].isGreen = false;
  }

  lightOffBoard(pipes, size) {
    for (let i = 0; i < size; i++) {
      this.lightOff(pipes, i);
    }
  }

  clearPipeCycle(newPipes, array) {
    for (let i = 0; i < array.length; i++) {
      clearPipe(newPipes, array[i]);
    }

    this.setState({ pipes: newPipes });
  }

  clearAllLights(newPipes, size) {
    for (let i = 0; i < size; i++) {
      if (newPipes[i].isGreen === true) {
        clearPipe(newPipes, i);
      }
    }

    this.setState({ pipes: newPipes });
  }

  clearBoard(newPipes, size) {
    for (let i = 0; i < size; i++) {
      clearPipe(newPipes, i);
    }

    this.setState({ pipes: newPipes, gameOver: false });
  }

  movePipeBoard(newPipes, row, column) {
    movePipeDirection(newPipes, row, column, 4);

    this.setState({ pipes: newPipes });
  }

  producePipeHelix(newPipes, row, column) {
    const size = row * column;
    const helixBoard = helixFill(row, column);

    if (this.state.gameOver === true) {
      return;
    }

    let max = -1,
      hMax = -1;
    for (let i = 0; i < size; i++) {
      if (newPipes[i].exist === false && hMax < helixBoard[i]) {
        max = i;
        hMax = helixBoard[i];
      }
    }
    if (max === -1) {
      console.log("====GAME OVER====: No space produce pipe.");
      this.setState(state => ({ gameOver: true }));
    } else {
      producePipe(newPipes, max, row, column, false, 0);
    }

    this.setState({ pipes: newPipes });
  }

  countScore(array) {
    return (array.length - 3) * (array.length - 3);
  }

  handleClick(i) {
    const row = this.state.row;
    const column = this.state.column;
    const size = row * column;
    const newPipes = this.state.pipes.slice();
    const editShapeCheck = this.state.editShapeCheck;
    const setShape = this.state.setShape;
    let newScore = this.state.score;

    if (this.state.gameOver === true) {
      return;
    }

    if (editShapeCheck) {
      // Click to edit
      if (setShape === -1) {
        clearPipe(newPipes, i);
      } else {
        producePipe(newPipes, i, row, column, editShapeCheck, setShape);
      }
      this.setState({ pipes: newPipes });
      return;
    } else {
      // Normal play
      if (!newPipes[i].exist) {
        producePipe(newPipes, i, row, column, editShapeCheck, setShape);
      } else {
        rotatePipe(newPipes, i, newPipes[i].shape);
      }
    }

    let newCycleArray = checkCycles(newPipes, i, row, column);
    if (newCycleArray !== null) {
      newScore += this.countScore(newCycleArray);
      // Light on cycles
      this.lightOnCycle(newPipes, newCycleArray);
      // Wait for 1 sec & clear cycle
      //setTimeout(() => this.clearPipeCycle(newPipes, newCycleArray), 2000);
      //  Wait for 1 sec & move
      //setTimeout(() => this.movePipeBoard(newPipes, row, column), 4000);
      // ===== Test Promise =====

      // ===== Test promise end =====
    } else {
      this.lightOffBoard(newPipes, size);
    }

    this.setState({ pipes: newPipes, score: newScore });
  }

  // new game field -------------------------------------
  newGame() {
    const row = parseInt(document.getElementById("selectRow").value, 10);
    const column = parseInt(document.getElementById("selectColumn").value, 10);
    const size = row * column;
    const newPipeTable = initialPipeTable(row, column);
    this.clearBoard(newPipeTable, size);
    for (let i = 0; i < size; i++) {
      this.producePipeHelix(newPipeTable, row, column);
    }

    this.setState({
      row: row,
      column: column,
      pipes: newPipeTable,
      score: 0,
      gameOver: false
    });
  }
  // new game field end ---------------------------------

  // editMode field -------------------------------------
  editMode() {
    const tmp = !this.state.editMode;
    const tmpSC = tmp && this.state.editShapeCheck;
    this.setState({ editMode: tmp, editShapeCheck: tmpSC });
  }

  editShapeCheck() {
    const tmp = !this.state.editShapeCheck;
    this.setState({ editShapeCheck: tmp });
  }

  onChangeShape(event) {
    const tmp = parseInt(event.target.value, 10);
    this.setState({ setShape: tmp });
  }

  // editMode field end ---------------------------------

  render() {
    const row = this.state.row;
    const column = this.state.column;
    const pipes = this.state.pipes.slice();
    const score = this.state.score;
    const editMode = this.state.editMode;
    return (
      <div className="App">
        <h1 className="gameTitle" onClick={() => this.editMode()}>
          Pipe Cycles
        </h1>
        <Demo />
        <div className="gameTable">
          <div className="gameInfo">
            <NewGameField
              row={row}
              rowId="selectRow"
              rowMax={40}
              column={column}
              columnId="selectColumn"
              columnMax={40}
              onClick={() => this.newGame()}
              score={score}
            />
          </div>
          <div className="gameBase">
            <div className="gameBoard">
              <Board
                row={row}
                column={column}
                onClick={i => this.handleClick(i)}
                pipes={pipes}
              />
            </div>
            {!editMode ? (
              <div />
            ) : (
              <div className="editMode">
                <EditMode
                  editShape={() => this.editShapeCheck()}
                  onChangeShape={e => this.onChangeShape(e)}
                  lightOnBoard={() => this.lightOnBoard(pipes, row, column)}
                  movePipeBoard={() => this.movePipeBoard(pipes, row, column)}
                  producePipeHelix={() =>
                    this.producePipeHelix(pipes, row, column)
                  }
                  clearBoard={() => this.clearBoard(pipes, row * column)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default function App() {
  return <Game row={8} column={8} />;
}
