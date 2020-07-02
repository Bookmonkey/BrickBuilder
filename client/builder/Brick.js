class Brick {
  get getFormattedPosition() {
    return {
      x: Math.round(this.mesh.position.x, 2),
      y: Math.round(this.mesh.position.y, 2),
      z: Math.round(this.mesh.position.z, 2) 
    }
  }


  constructor(brick) {
    this.id = brick.id;
    this.name = brick.name;
    this.colour = brick.colour;
    this.mesh = brick.mesh;
    this.open = brick.open;
  }
}

export default Brick;

