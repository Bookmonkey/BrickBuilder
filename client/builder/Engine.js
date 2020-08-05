import * as BABYLON from 'babylonjs';
import BrickController from "./BrickController";

import state from "../state";
import Brick from './Brick';
import {
  PickingInfo
} from 'babylonjs';

class Engine {

  constructor() {
    this.brickController = new BrickController();

    this.mousePosition = {
      x: 0,
      y: 0
    };


    const canvasElement = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(canvasElement, true);
    // Events
    this.canvas = this.engine.getRenderingCanvas();
    this.scene = new BABYLON.Scene(this.engine);

    this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), this.scene);
    this.ground = new BABYLON.Mesh.CreateGround("ground", 250, 250, 1, this.scene, false);
    // this.ground.checkCollisions = true;
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

    this.startingCursorPoint;
    this.selectedBrick;

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);

    this.scene.clearColor = new BABYLON.Color3.FromHexString("#87CEEB");

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  getBricksList() {
    return this.brickController.getBricksList();
  }

  cursorEventDown(evt) {
    this.selectedBrick = evt.source;
    this.startingCursorPoint = this.getGroundPosition();
    

    // detatch the camera rotation whilst moving bricks
    if (this.startingCursorPoint) {
      setTimeout(() => {
        this.camera.detachControl(this.canvas);
      }, 0);
    }
  }

  cursorEventUp() {
    if (this.startingCursorPoint) {
      this.camera.attachControl(this.canvas, true);
      this.startingCursorPoint = null;
      state.socket.emit('updateBrick', {
        "studioId": state.studioId,
        "type": "position",
        "name": this.selectedBrick.name,
        "value": this.selectedBrick.position
      });
      return;

    }
  }

  cursorEventMove(d, s) {
    if (!this.startingCursorPoint) {
      return;
    }

    let current = this.getGroundPosition();

    if (!current) {
      return;
    }

    let diff = current.subtract(this.startingCursorPoint);
    this.selectedBrick.position.addInPlace(diff);
    this.startingCursorPoint = current;
  }

  getGroundPosition() {
    // Use a predicate to get position on the ground
    var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, (mesh) => {
      return mesh == this.ground;
    });

    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }

    return null;
  }

  intializeFromState(brickState) {

    if (brickState === null || brickState === undefined) return;

    brickState.map(brick => {
      let pos = brick.position;
      let brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(brick.id))[0];

      let newBrick = new Brick({
        name: brick.name,
        colour: brick.colour,
        definition: brickDefinition
      }, this.scene);

      this.setMeshPointerEvents(newBrick.mesh, newBrick.colour);
      
      newBrick.setPosition(pos.x, pos.y, pos.z);
      this.brickController.addBrickToState(newBrick);
    });

    this.brickController.brickState.map(ele => {
      let meshesCanCollideWith = this.brickController.getAllBricksButThisOne(ele.name);

      this.setMeshCollision(ele.mesh, meshesCanCollideWith);
    })
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

    this.setMeshPointerEvents(newBrick.mesh, newBrick.colour);

    newBrick.setPosition(0, 2, 0);
    this.brickController.addBrickToState(newBrick);
    return newBrick;
  }

  updateBrickPiece(data) {
    let brick = this.brickController.getBrickByName(data.name);

    if (data.type === "position") {
      let pos = data.value;
      brick.setPosition(pos.x, pos.y, pos.z);
    }

    if (data.type === "colour") {
      brick.setColour(data.value);
    }
  }


  setMeshPointerEvents(mesh, colour) {
    let pointer = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)
    });
    pointer.onDragObservable.add((data, state) => {
      this.cursorEventMove(data, state);
    });

    mesh.addBehavior(pointer);

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (event) => this.cursorEventDown(event)))
    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, (event) => this.cursorEventUp(event)));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ev => {
      let lightenColour = this.LightenDarkenColor(colour, 40);
      mesh.material.emissiveColor = BABYLON.Color3.FromHexString(lightenColour);
    }));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (ev) => {
      mesh.material.emissiveColor = BABYLON.Color3.FromHexString(colour);
    }));

    return mesh;
  }

  setMeshCollision(currentMesh, meshesArray) {
    meshesArray.forEach(element => {
      element.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: currentMesh
      }, () => {
        currentMesh.showBoundingBox = true;

        
        if(this.selectedBrick) {
          let currentPos = this.selectedBrick.position;
          let newYPos = Math.round(Math.ceil(currentMesh.position.y) + 4);
          this.selectedBrick.position.y = newYPos;
        } 

      }));

      element.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
        parameter: currentMesh
      }, () => {
        currentMesh.showBoundingBox = false;
      }));

        
    });
  }


  // checkIfColliding(brick) {
  //   let mesh = brick.mesh;
  //   let meshPoint = new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
  //   // console.log(meshPoint);
  //   let meshes = this.brickController.getBrickMeshes();
  //   meshes.forEach(element => {
  //     if (mesh.intersectsMesh(element)) {
  //       // console.log("collision");
  //     }
  //   });
  //   // this.brickController.getBrickMeshes().map(ele => {
  //   //   if(ele.intersectsMesh(mesh, false)){
  //   //     // mesh.position.y += 8.0;
  //   //   }
  //   //   else {
  //   //     console.log('nothing');
  //   //   }
  //   // });
  // }

  LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  UISetSkyboxColour() {

  }

  UISetGroundColour() {}
}


export default Engine;