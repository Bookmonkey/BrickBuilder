import * as BABYLON from 'babylonjs';

class Brick {
  get getFormattedPosition() {
    return  [Math.round(this.mesh.position.x, 2), Math.round(this.mesh.position.y, 2), Math.round(this.mesh.position.z, 2) ];      
  }

  /**
   * 
   * @param {*} brick - 
   */
  constructor(brick, ENGINE_SCENE) {
    this.id = brick.definition.id;
    this.name = brick.name;
    this.colour = brick.colour;
    this.definition = brick.definition;

    this.mesh = this.createBrickMesh(ENGINE_SCENE);
  }

  createBrickMesh(ENGINE_SCENE){
    let mesh = BABYLON.MeshBuilder.CreateBox(this.name, {
      height: this.definition.height,
      width: this.definition.dim_x * 5,
      depth: this.definition.dim_y * 5
    }, ENGINE_SCENE);

    mesh.material = this.createMaterial(this.colour, ENGINE_SCENE);      
    mesh.isPickable = true;      
    mesh.actionManager = new BABYLON.ActionManager(ENGINE_SCENE);
    // mesh.showBoundingBox = true;
    mesh.checkCollisions = true;

    return mesh;
  }



  createMaterial(hexcode, ENGINE_SCENE) {
    var material = new BABYLON.StandardMaterial("material", ENGINE_SCENE);    
    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    material.emissiveColor = BABYLON.Color3.FromHexString(hexcode);
    return material;
  }

  setColour(hexcode) {
    this.mesh.material.emissiveColor = BABYLON.Color3.FromHexString(hexcode);
  }

  setPosition(x, y, z) {
    this.mesh.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z)); 
  }

  setMesh(mesh) {
    this.mesh = mesh;
  }

  toggleVisibility(){
    this.mesh.isVisible = !this.mesh.isVisible;
  }
  
}

export default Brick;

