import React from "react";

import pipeDL from "./img/1_24_80.png";
import pipeDR from "./img/1_26_80.png";
import pipeUR from "./img/1_68_80.png";
import pipeUL from "./img/1_48_80.png";
import pipeUD from "./img/1_28_80.png";
import pipeLR from "./img/1_46_80.png";
import pipeCross from "./img/1_cross_80.png";
import pipeDLg from "./img/1_24_80_g.png";
import pipeDRg from "./img/1_26_80_g.png";
import pipeURg from "./img/1_68_80_g.png";
import pipeULg from "./img/1_48_80_g.png";
import pipeUDg from "./img/1_28_80_g.png";
import pipeLRg from "./img/1_46_80_g.png";
import pipeCrossg from "./img/1_cross_80_g.png";
import pipeBlank from "./img/1_blank_80.png";
import pipeGray from "./img/1_gray_80.png";

function findImgSrc(exist, shape, direction, isGreen) {
  //const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
  const [DL, UL, UR, DR, UD, LR] = [0, 1, 2, 3, 0, 1];
  const [LTYPE, ITYPE, XTYPE] = [0, 1, 2];
  let src = null;
  if (!exist) {
    src = pipeGray;
    return src;
  }
  switch (shape) {
    case LTYPE:
      switch (direction) {
        case DL:
          src = !isGreen ? pipeDL : pipeDLg;
          break;
        case UL:
          src = !isGreen ? pipeUL : pipeULg;
          break;
        case UR:
          src = !isGreen ? pipeUR : pipeURg;
          break;
        case DR:
          src = !isGreen ? pipeDR : pipeDRg;
          break;
        default:
          console.log("ERROR: Impossible direction. (pipeL)");
          break;
      }
      break;
    case ITYPE:
      switch (direction) {
        case UD:
          src = !isGreen ? pipeUD : pipeUDg;
          break;
        case LR:
          src = !isGreen ? pipeLR : pipeLRg;
          break;
        default:
          console.log("ERROR: Impossible direction. (pipeI)");
          break;
      }
      break;
    case XTYPE:
      src = !isGreen ? pipeCross : pipeCrossg;
      break;
    default:
      console.log("ERROR: findImgSrc(): Impossible shape.");
      break;
  }

  return src;
}

export class Pipe extends React.Component {
  render() {
    const exist = this.props.exist;
    const shape = parseInt(this.props.shape, 10);
    const direction = parseInt(this.props.direction, 10);
    const isGreen = this.props.isGreen;
    let URL = findImgSrc(exist, shape, direction, isGreen);
    switch (shape) {
      case 0:
        return <PipeL URL={URL} onClick={this.props.onClick} />;
      case 1:
        return <PipeI URL={URL} onClick={this.props.onClick} />;
      case 2:
        return <PipeX URL={URL} onClick={this.props.onClick} />;
      default:
        break;
    }
    return <PipeBlank URL={URL} onClick={this.props.onClick} />;
  }
}

function PipeL(props) {
  return (
    <input
      type="image"
      className="pipe pipeL"
      src={props.URL}
      alt="PipeL"
      onClick={props.onClick}
    />
  );
}

function PipeI(props) {
  return (
    <input
      type="image"
      className="pipe pipeI"
      src={props.URL}
      alt="PipeI"
      onClick={props.onClick}
    />
  );
}

function PipeX(props) {
  return (
    <input
      type="image"
      className="pipe pipeX"
      src={props.URL}
      alt="PipeX"
      onClick={props.onClick}
    />
  );
}

function PipeBlank(props) {
  return (
    <input
      type="image"
      className="pipe pipeBlank"
      src={props.URL}
      alt="PipeBlank"
      onClick={props.onClick}
    />
  );
}

export function PipeDemo(props) {
  const shape = parseInt(props.shape, 10);
  switch (shape) {
    case 0:
      return <img className="pipeDemo pipeDL" src={pipeDL} alt="PipeDL" />;
    case 1:
      return <img className="pipeDemo pipeUL" src={pipeUL} alt="PipeUL" />;
    case 2:
      return <img className="pipeDemo pipeUR" src={pipeUR} alt="PipeUR" />;
    case 3:
      return <img className="pipeDemo pipeDR" src={pipeDR} alt="PipeDR" />;
    case 4:
      return <img className="pipeDemo pipeUD" src={pipeUD} alt="PipeUD" />;
    case 5:
      return <img className="pipeDemo pipeLR" src={pipeLR} alt="PipeLR" />;
    case 6:
      return (
        <img className="pipeDemo pipeCross" src={pipeCross} alt="PipeCross" />
      );
    case 7:
      return <img className="pipe-blank" src={pipeBlank} alt="PipeBlank" />;
    default:
      console.log("PipeDemo ERROR.");
      return null;
  }
}
