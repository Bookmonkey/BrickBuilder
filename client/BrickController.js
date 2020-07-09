// Notes
// Each brick needs to be its own thing.


import state from "./state";

import Brick from "./builder/Brick";

class BrickController {

  get getBrickIndex(){
    return this.bricks.length;
  }

  
  // Only return what is required for the BlockList component.
  get getBricksList() {
    return this.bricks;
  }
    constructor() {
        const canvasElement = document.getElementById('renderCanvas');
        
        this.bricks = [];
        this.engine = new BABYLON.Engine(canvasElement, true);
        // Events
        this.canvas = this.engine.getRenderingCanvas();
        this.scene = new BABYLON.Scene(this.engine);

        this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), this.scene);        
        var ground = new BABYLON.Mesh.CreateGround("ground", 250, 250, 1, this.scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        groundMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#009900");
        ground.material = groundMaterial;

        
        this.gizmoManager = new BABYLON.GizmoManager(this.scene);
        this.gizmoManager.positionGizmoEnabled = true;
        // this.gizmoManager.rotationGizmoEnabled = false;

        this.gizmoManager.gizmos.positionGizmo.onDragEndObservable.add((evt) => {
          let selectedBrick = this.gizmoManager.gizmos.positionGizmo.attachedMesh;
          this.moveBrickUI('log', evt);
          console.log(selectedBrick);
          

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
        // var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);

        // this.highlight = new BABYLON.HighlightLayer("highlight", this.scene);
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString("#87CEEB")

        
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }


    initializeFromState() {
      state.brickState.map(brick => {
        
        let brickElement = state.bricks.filter(ele => ele.id === brick.id)[0];
            
        let box = this.createBox(brick.name, brick.colour, brickElement);
        let positionVector = new BABYLON.Vector3(brick.position.x, brick.position.y, brick.position.z);
        
        box.setPositionWithLocalVector(positionVector);        
        
        let brickDefintion = {
          id: brick.id,
          name: brick.name,
          colour: brick.colour,
          mesh: box,
          open: false
        };

        let newBrick = new Brick(brickDefintion);
        this.bricks.push(newBrick);
      });
    }

    createBox(name, colour, brickElement) {
      let box = BABYLON.MeshBuilder.CreateBox(name, {
        height: brickElement.height,
        width: brickElement.dim_x * 5,
        depth: brickElement.dim_y * 5
      }, this.scene);

      box.material = this.getMaterialColour(colour);      
      box.isPickable = true;      
      box.actionManager = new BABYLON.ActionManager(this.scene);

      box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, ev => {
        this.moveBrickUI(ev);  
        
      }));

      box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ev => {	
        box.material.emissiveColor = this.convertHexToBabylonColour("#999999");
      }));

      box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (ev) => {
        box.material.emissiveColor = this.convertHexToBabylonColour(colour);
      }));
      

      return box;
    }

    addBrick(name, colour, element) {
      
      let box = this.createBox(name, colour, element);  
      

      let brickDefintion = {
        id: element.id,
        name: name,
        colour: colour,
        mesh: box,
        open: false
      };

      let newBrick = new Brick(brickDefintion);
      this.bricks.push(newBrick);
      return newBrick;
    }

    // data.studioId
    // data.type
    // data.name
    // data.value
    updateBrick(data) {
      let brick = this.bricks.filter(ele => ele.name === data.name)[0];

      if(data.type === 'position') {
        let positionVector = new BABYLON.Vector3(data.value.x, data.value.y, data.value.z);
        brick.mesh.setPositionWithLocalVector(positionVector);
      }

      if(data.type === "colour"){        
        this.setMaterialColour(brick.mesh, data.value);
      }
    }

    deleteBrickByName(name){
      this.bricks = this.bricks.filter(ele => {
        if(ele.name !== name) return ele;
        else {
          ele.mesh.dispose();
        }
      });
    }

    updateColour(name, mesh, colour) {
      this.setMaterialColour(mesh, colour);
      state.socket.emit('updateBrick', {
        "studioId": state.studioId,
        "type": "colour",
        "name": name,
        "value": colour
      });
    }

    convertHexToBabylonColour(hexCode) {
      return BABYLON.Color3.FromHexString(hexCode);
    }


    getMaterialColour(colour) {
      var material = new BABYLON.StandardMaterial("ground", this.scene);
    
      material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

      let babylonColour = this.convertHexToBabylonColour(colour);
      material.emissiveColor = babylonColour;
      
      return material;
    }

    setMaterialColour(existingMaterial, newColour){
      console.log(existingMaterial);
      
      existingMaterial.material.emissiveColor = this.convertHexToBabylonColour(newColour);
    }

    moveBrickUI(ev){      
      let brickUI = document.querySelector('.brick-ui');
      brickUI.classList.remove('hidden');
      brickUI.style.top = `${ev.pointerY - 200}px`;
      brickUI.style.left = `${ev.pointerX - 100}px`;     
    }

    // UI related - break this out or redo it
    UItoggleOpen(index){
      let brick = this.bricks[index];
      brick.open = !brick.open;
    }

    UItoggleVisibility(index) {
      let brick = this.bricks[index];
      brick.mesh.isVisible = !brick.mesh.isVisible;
    }

    UIUpdateLight() {
      this.light.setDirectionToTarget(new BABYLON.Vector3(1, 0, 0));
    }

    UIUpdateSkyBoxColour(newHexCode) {
    }

    UIUpdateGroundColour(newHexCode) {

    }

    UIToggleMove() {
      this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled;
    }
    UIToggleRotation() {
      this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled;
    }
}

export default BrickController;