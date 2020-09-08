import * as BABYLON from 'babylonjs';

class Brick {
  get getFormattedPosition() {
    return  [Math.round(this.position.x, 2), Math.round(this.position.y, 2), Math.round(this.position.z, 2) ];      
  }

  /**
   * 
   * @param {*} brick - 
   */
  constructor(brick) {
    this.id = brick.definition.id;
    this.name = brick.name;
    this.colour = brick.colour;
    this.definition = brick.definition;

    if(brick.position) {
      this.position = brick.position;
    }
    else {
      this.position = {
        x: 0,
        y: 0,
        z: 0
      };
    }
  }
  

  setPosition(pos) {
    this.position = pos;
  }
}

export default Brick;

