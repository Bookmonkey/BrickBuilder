import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

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
  hoverBrickMaterial:null,
  hoverBrickMesh: null,
  brickDefinition: null,
  objects: [],

  init() {
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
    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    document.addEventListener('wheel', (event) => this.onWheelEvent(event));
    
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
    this.hoverBrickMesh.visible = true;

    this.scene.add(this.hoverBrickMesh);

    this.render();
    document.getElementById("renderCanvas").focus();
  },

  render(from) {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    
    if(this.debug) {
      console.log(from);      
    }
  },

  getBrickList: () => {
    
  },

  initializeFromState: () => {},



  createGroundPlane() {
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshLambertMaterial ({
      name: "ground",
      color: 0x007b28,
      side: THREE.DoubleSide
    });

    this.ground = new THREE.Mesh(geometry, material);
    this.scene.add(this.ground);

    // add an object
    const groundObject = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial ({
      visible: false
    }));

    this.objects.push(groundObject);

    this.scene.add(groundObject);

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

  setBrickDefinition(brickIndex){
    this.brickDefinition = state.bricks.filter(ele => parseInt(ele.id) === parseInt(brickIndex))[0];        
    let newGeometry = new THREE.BoxBufferGeometry(this.brickDefinition.dim_x, this.brickDefinition.dim_y, this.brickDefinition.height);
    this.hoverBrickMesh.geometry = newGeometry;
    this.brickGeometry = newGeometry;

    this.hoverBrickMesh.visible = true;
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

  onMouseDown(event) {
    event.preventDefault();
    
    // Break out if there is no brick selected
    if(!this.brickDefinition) return;

    // left click
    if(event.which === 1) {
      this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
  
      this.raycaster.setFromCamera(this.mouse, this.camera);
  
      var intersects = this.raycaster.intersectObjects(this.objects);
      
      if (intersects.length > 0) {  
          var intersect = intersects[0];
          var voxel = new THREE.Mesh(this.brickGeometry, ...[this.brickMaterial]);
          voxel.position.copy(intersect.point).add(intersect.face.normal);
          if((this.brickDefinition.dim_x % 100) === 0) {        
            voxel.position.divideScalar( 25 ).floor().multiplyScalar( 25 ).addScalar( 25 ).divideScalar( 50 ).floor().multiplyScalar( 50 );
            voxel.position.z += 25;
            voxel.position.y += this.brickDefinition.dim_y / 2;
          }
          else {
            voxel.position.divideScalar(this.brickDefinition.dim_x).floor().multiplyScalar(this.brickDefinition.height).addScalar(this.brickDefinition.dim_y / 2);
          }
  
          this.scene.add(voxel);
          this.objects.push(voxel);

        }
      }
      this.render('mousedown');
  },

  onMouseMove(event) {
    event.preventDefault();

    // Break out if there is no brick selected
    if(!this.brickDefinition) return;

    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.objects);
    if (intersects.length > 0) {

      var intersect = intersects[0];
      
      this.hoverBrickMesh.position.copy(intersect.point).add(intersect.face.normal);
      if((this.brickDefinition.dim_x % 100) === 0) {        

        this.hoverBrickMesh.position.divideScalar( 12.5 ).floor().multiplyScalar( 12.5 ).addScalar( 12.5 ).divideScalar( 50 ).floor().multiplyScalar( 50 );
        this.hoverBrickMesh.position.z += 25;
        this.hoverBrickMesh.position.y += this.brickDefinition.dim_y / 2;
      }
      else {
        this.hoverBrickMesh.position.divideScalar(this.brickDefinition.dim_x).floor().multiplyScalar(this.brickDefinition.height).addScalar(this.brickDefinition.dim_y / 2);
      }

    }

    this.render('mousemove');
  },

  onWheelEvent(event) {
    // event.preventDefault();
    this.render();
    console.log('wheel moved');
  },

  onKeyDown(event) {
    
    // this.render();
    let key = event.keyCode;
    if(key === 37 || key === 38 || key === 39 ||  key === 40) {
      event.preventDefault();
      this.render();
    }

    // if(key === 40) {
    // }
    // this.render();

    // // zoom in and out
    // if(key === 109 || key === 173) {
    //   this.camera.position.z += theta;
    // }

    // if(key === 107 || key === 61) {
    //   this.camera.position.z -= theta;
    // }

    // this.render();
  },

  onResize(event){
    this.camera.aspect = window.innerWidth / window.innerHeight;  
    this.camera.updateProjectionMatrix();
  
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render('window_resize');
  }
};

export default Engine;