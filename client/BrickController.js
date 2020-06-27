import state from "./state";

class BrickController {
    
    set colour(colour) {
      this.brickColour = colour;
    };

    get colour() {
      return this.brickColour;
    }

    // Only return what is required for the BlockList component.
    get getBricksList() {
      return this.bricks;
      // return this.bricks.map(brick => {

      // });
    }

    constructor() {
        const canvasElement = document.getElementById('renderCanvas');
        
        this.bricks = [];

        this.brickColour = "red";
        this.engine = new BABYLON.Engine(canvasElement, true);
        // Events
        this.canvas = this.engine.getRenderingCanvas();
        this.scene = new BABYLON.Scene(this.engine);

        this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), this.scene);        
        var ground = BABYLON.Mesh.CreateGround("ground", 250, 250, 1, this.scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        groundMaterial.specularColor = BABYLON.Color3.Black();
        ground.material = groundMaterial;

        
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
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
        this.scene.clearColor = new BABYLON.Color3.FromHexString("#87CEEB")

        
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    // methods
    addBrick(brickElement) {
      let brickIndex = this.bricks.length;
      let brickName = "brick" + brickIndex++;
      let box = BABYLON.MeshBuilder.CreateBox(brickName, {
        height: 5.0,
        width: brickElement.dims.x * 5,
        depth: brickElement.dims.y * 5
      }, this.scene);
      box.material = this.getMaterialColour();
      box.isPickable = true;

      this.bricks.push({
        name: brickName,
        mesh: box
      });

      return {
        name: brickName,
        position: box.position,
        colour: this.brickColour
      }
    }

    getBabylonColour(colour) {
      let babylonColour;
      switch (colour) {
        case "red":
          babylonColour = BABYLON.Color3.Red();
          break;
        case "green":
          babylonColour = BABYLON.Color3.Green();
          break;
        case "blue":
          babylonColour = BABYLON.Color3.Blue();
          break;
        case "yellow":
          babylonColour = BABYLON.Color3.Yellow();
          break;
        case "black":
          babylonColour = BABYLON.Color3.Black();
          break;
        case "purple":
          babylonColour = BABYLON.Color3.Purple();
          break;
        case "white":
          babylonColour = BABYLON.Color3.White();
          break;
      }
      return babylonColour;
    }


    getMaterialColour() {
      var material = new BABYLON.StandardMaterial("ground", this.scene);
    
      material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

      let babylonColour = this.getBabylonColour(this.brickColour);
      material.emissiveColor = babylonColour;
      
      return material;
    }

    setMaterialColour(existingMaterial, newColour){
      console.log(newColour)
      existingMaterial.material.emissiveColor = this.getBabylonColour(newColour);
    }

    updateBrick(brickInfo) {
        console.log(brickInfo);
    }

    // getters

    get getBrickIndex(){
        return this.bricks.length;
    }
    // setters

}

export default BrickController;