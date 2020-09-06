import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import Brick from "./Brick";
import state from "../state";


const Engine = {
  debug: false,
  scene: null,
  camera: null,
  renderer: null,
  raycaster: null,
  mouse: new THREE.Vector2(),
  controls: null,

  grid: null,

  ground: null,
  directionalLight: null,

  selectedColour: null,


  brickGeometry: null,
  brickMaterial: null,

  hoverBrickGeometry: null,
  hoverBrickMaterial: null,
  hoverBrickMesh: null,
  brickDefinition: [], // leave it as an array, this causes rendering issues with inputs without 

  selectedBrick: null,
  objects: [],

  init(brickState) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(500, 800, 1300);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('skyblue');

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // create the grid 
    this.grid = new THREE.GridHelper(1000, 20);
    this.grid.name = "grid";
    this.scene.add(this.grid);

    this.createGroundPlane();

    this.createLighting();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("renderCanvas")
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.controls.dampingFactor = 0.05;

    this.controls.screenSpacePanning = false;

    this.controls.minDistance = 100;
    this.controls.maxDistance = 1000;

    this.controls.maxPolarAngle = Math.PI / 2;

    document.addEventListener("mousedown", (event) => this.onMouseDown(event), false);
    document.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    document.addEventListener('mouseup', (event) => this.onMouseUp(event), false);
    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    document.getElementById("renderCanvas").addEventListener('wheel', (event) => this.onWheelEvent(event));

    window.addEventListener('resize', (event) => this.onResize(event), false);


    // define the default cude geo and material
    this.brickGeometry = new THREE.BoxBufferGeometry(50, 50, 50);
    this.brickMaterial = new THREE.MeshLambertMaterial({
      color: 0x0000FF
    });

    // // hover over brick

    this.hoverBrickGeometry = new THREE.BoxBufferGeometry(50, 50, 50);
    this.hoverBrickMaterial = new THREE.MeshBasicMaterial({
      name: 'mouseBrick',
      color: 0xff0000,
      opacity: 0.5,
      transparent: true
    });

    this.hoverBrickMesh = new THREE.Mesh(this.hoverBrickGeometry, this.hoverBrickMaterial);

    this.hoverBrickMesh.name = "hoverBrickMesh";
    this.hoverBrickMesh.visible = false;

    this.scene.add(this.hoverBrickMesh);

    if(brickState) {
      if(brickState.length > 0) {
        this.initializeFromState(brickState);
      }
    }


    this.render();
    document.getElementById("renderCanvas").focus();
  },


  render(from) {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (this.debug) {
      console.log(from);
    }
  },

  getBrickList: () => {

  },

  initializeFromState: () => {},



  createGroundPlane() {
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshLambertMaterial({
      name: "groundMaterial",
      color: 0x007b28,
      side: THREE.DoubleSide
    });

    this.ground = new THREE.Mesh(geometry, material);
    this.scene.add(this.ground);

    // add an object
    this.ground = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      name: 'ground',
      visible: false
    }));

    this.objects.push(this.ground);

    this.scene.add(this.ground);

  },


  setBrickColour(colour) {

    // delete old material colour
    this.brickMaterial.dispose();

    this.brickMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(colour.hex_code)
    });

    // we dont need to dispose of the hover, just update its reference
    this.hoverBrickMaterial.color = new THREE.Color(colour.hex_code);

    state.user.colour = colour;
  },

  setBrickDefinition(brickIndex) {
    this.brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(brickIndex))[0];
    let newGeometry = new THREE.BoxBufferGeometry(this.brickDefinition.dim_x, this.brickDefinition.dim_y, this.brickDefinition.height);
    this.hoverBrickMesh.geometry = newGeometry;
    this.brickGeometry = newGeometry;

    this.hoverBrickMesh.visible = true;


    state.ui.mode = 'add';

    this.render();
  },

  updateGroundColour() {
    this.ground.material.color = new THREE.Color('yellow');
  },


  createLighting() {
    const light = new THREE.AmbientLight(0x606060);
    this.scene.add(light);


    // create the directional light 
    this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    this.directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(this.directionalLight);

  },

  correctlyPositionBrick(mesh, intersect) {
    mesh.position.copy(intersect.point).add(intersect.face.normal);
    if ((this.brickDefinition.dim_x % 100) === 0) {
      mesh.position.divideScalar(25).floor().multiplyScalar(25).addScalar(25).divideScalar(50).floor().multiplyScalar(50);
      mesh.position.z += 25;
      mesh.position.y += this.brickDefinition.dim_y / 2;
    } else {
      mesh.position.divideScalar(this.brickDefinition.dim_x).floor().multiplyScalar(this.brickDefinition.height).addScalar(this.brickDefinition.dim_y / 2);
    }

    return mesh;
  },


  setMode(mode) {
    state.ui.mode = mode;
  },

  deselect() {
    this.hoverBrickMesh.visible = false;
    this.brickDefinition = [];
    this.selectedBrick = [];

    state.ui.mode = '';
    state.ui.navigation = 'menu';
  },


  initializeFromState(brickState) {
    brickState.map(brick => {
      let position = brick.position;
      let brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(brick.id))[0];
      if(brickDefinition) {
        
        let newBrick = new Brick({
          id: brick.id,
          name: brick.name,
          colour: brick.colour,
          definition: brickDefinition
        });
        
        
        var voxel = new THREE.Mesh(this.brickGeometry, ...[this.brickMaterial]);
        voxel.name = brick.name;
        voxel.position.x = position.x;
        voxel.position.y = position.y;
        voxel.position.z = position.z;
        
        newBrick.setPosition(voxel.position);
        
        this.scene.add(voxel);
        
        this.objects.push(voxel);
        state.brickController.addBrickToState(newBrick);
      }
    })
  },



  addBrick(intersect) {
    let brickTotal = state.brickController.getIndex;
    let brickName = "brick" + brickTotal++;

    let newBrick = new Brick({
      name: brickName,
      colour: this.selectedColour,
      definition: this.brickDefinition
    });


    var voxel = new THREE.Mesh(this.brickGeometry, ...[this.brickMaterial]);
    voxel.name = brickName;

    voxel = this.correctlyPositionBrick(voxel, intersect);
    newBrick.setPosition(voxel.position);

    state.brickController.addBrickToState(newBrick);
    this.scene.add(voxel);
    this.objects.push(voxel);


    let socketData = {
      studioId: state.studioId,
      brickId: newBrick.id,
      name: newBrick.name,
      position: newBrick.position,
      colour: newBrick.colour
    };

    state.socket.emit("newBrick", socketData);

  },

  // this function must only be used on the move event.
  // it creates a new brick but will update the exsiting brick controller item
  updateBrick(intersect, brickName) {
    var voxel = new THREE.Mesh(this.brickGeometry, ...[this.brickMaterial]);
    voxel.name = brickName;
    voxel = this.correctlyPositionBrick(voxel, intersect);
    this.scene.add(voxel);
    this.objects.push(voxel);


    let brick = state.brickController.getBrickByName(brickName);
    brick.setPosition(voxel.position);

    state.socket.emit('updateBrick', {
      "studioId": state.studioId,
      "type": "position",
      "name": brick.name,
      "value": brick.position
    });

    this.render();
  },


  // only deletes from the render, not the brick controller at this stage
  removeBrick(intersect) {
    if (intersect !== null && intersect.object !== this.ground) {
      this.scene.remove(intersect.object);
      this.objects.splice(this.objects.indexOf(intersect.object), 1);
    }
  },

  onMouseDown(event) {
    event.preventDefault();

    // Break out if there is no brick selected
    if (!this.brickDefinition) return;

    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.objects);

    if (event.which === 1) {
      if (intersects.length > 0) {
        var intersect = intersects[0];
        if (state.ui.mode === 'add') {
          this.addBrick(intersect);
        }

        console.log(intersect);

        if (state.ui.mode === 'move') {
          
          if (intersect.object !== this.ground) {
            
            this.controls.enabled = false;
            this.hoverBrickMesh.visible = true;
            
            this.selectedBrick = intersect;
            let brickName = this.selectedBrick.object.name;
            let brick = state.brickController.getBrickByName(brickName);
            this.brickDefinition = brick.definition;
            this.selectedBrick.object.material.opacity = 0.4;
            this.selectedBrick.object.material.transparent = true;
          }

          this.removeBrick(this.selectedBrick);
        }

        if (state.ui.mode === 'remove') {
          this.removeBrick(intersect);
        }
      }
    }

    this.render();
  },

  onMouseMove(event) {
    event.preventDefault();
    // Break out if there is no brick selected
    if (!this.brickDefinition) return;

    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.objects);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      if (state.ui.mode === 'add' || state.ui.mode === 'move') {
        this.hoverBrickMesh = this.correctlyPositionBrick(this.hoverBrickMesh, intersect);
      }
    }
    this.render();
  },

  onMouseUp(event) {
    event.preventDefault();
    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    if (state.ui.mode === 'move' && this.selectedBrick.object) {

      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = this.raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {
        var intersect = intersects[0];
            
          this.selectedBrick.object.material.opacity = 0;
          this.selectedBrick.object.material.transparent = false;
          
          
          this.updateBrick(intersect, this.selectedBrick.object.name);
          this.removeBrick(this.selectedBrick);
          
          this.hoverBrickMesh.visible = false;
      }


      this.controls.enabled = true;
      this.selectedBrick = [];

      this.render();
    }
  },

  onWheelEvent(event) {
    event.preventDefault();
    this.render();
  },

  onKeyDown(event) {

    let key = event.keyCode;
    if (key === 37 || key === 38 || key === 39 || key === 40) {
      event.preventDefault();
    }

    if (key === 27) {
      if (this.brickDefinition) {
        this.deselect();
      }
    }
    this.render();

  },

  onResize(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render('window_resize');
  },


  getBrickList() {
    return state.brickController.getBricksList();
  }
};

export default Engine;