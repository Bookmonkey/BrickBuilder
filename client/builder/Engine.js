import * as BABYLON from 'babylonjs';
import BrickController from "./BrickController";

import state from "../state";
import Brick from './Brick';

class Engine {

  constructor() {
    this.brickController = new BrickController();


    const canvasElement = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvasElement, true);
    // Events
    this.canvas = this.engine.getRenderingCanvas();
    this.scene = new BABYLON.Scene(this.engine);

    this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), this.scene);        
    this.ground = new BABYLON.Mesh.CreateGround("ground", 250, 250, 1, this.scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    groundMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#009900");
    this.ground.material = groundMaterial;
    
    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    this.gizmoManager.positionGizmoEnabled = true;

    this.gizmoManager.gizmos.positionGizmo.onDragEndObservable.add((evt) => {
      let selectedBrick = this.gizmoManager.gizmos.positionGizmo.attachedMesh;
      state.socket.emit('updateBrick', {
        "studioId": state.studioId,
        "type": "position",
        "name": selectedBrick.name,
        "value": selectedBrick.position
      });
    });


    // initialze the scene
    this.camera.attachControl(this.canvas, true);
    // target the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
    
    this.scene.clearColor = new BABYLON.Color3.FromHexString("#87CEEB");

    
    this.engine.runRenderLoop(() => {
        this.scene.render();
    });
  }

  intializeFromState(brickState) {
    brickState.map(brick => {
      let pos = brick.position;
      let brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(brick.id))[0];  
      
      let newBrick = new Brick({
        name: brick.name,
        colour: brick.colour,
        definition: brickDefinition
      }, this.scene);

      newBrick.setPosition(pos.x, pos.y, pos.z);
      this.brickController.addBrickToState(newBrick);
    });
  }


  getBricksList() {
    return this.brickController.getBricksList();
  }



  /**
   * Creates the Brick mesh and adds to the BrickController
   * @param defintionIndex defines the index of the brick in the BricksDefinition array
   */
  createBrickPiece(defintionIndex) {
    let brickTotal = this.brickController.getIndex;
    let brickName = "brick" + brickTotal++;

    let brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(defintionIndex))[0];
    let brickColour = state.user.colour.hex_code;
  
    let newBrick = new Brick({
      name: brickName,
      colour: brickColour,
      definition: brickDefinition
    }, this.scene);

    newBrick.setPosition(0,2,0);
    this.brickController.addBrickToState(newBrick);
    return newBrick;
  }

  updateBrickPiece(data) {
    let brick = this.brickController.getBrickByName(data.name);

    if(data.type === "position") {
      let pos = data.value;
      brick.setPosition(pos.x, pos.y, pos.z);
    }

    if(data.type === "colour") {
      brick.setColour(data.value);
    }
  }
  
  UISetSkyboxColour(){

  }

  UISetGroundColour() {}
}


export default Engine;