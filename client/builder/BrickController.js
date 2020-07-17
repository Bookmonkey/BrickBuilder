// All brick sockets should emit from within this class
class BrickController {

  get getIndex() {
    return this.brickState.length;
  }
  constructor() {
    this.brickState = [];
  }

  /**
   * Adds the brick and its mesh to the BrickState
   * @param name defines the name of the brick
   * @param options defines the colour of the brick
   * @param scene defines the hosting scene
   */
  addBrickToState(brick) {
    this.brickState.push(brick);
  }


  getBrickByName(name) {
    return this.brickState.filter(ele => ele.name === name)[0];
  }
}

export default BrickController;