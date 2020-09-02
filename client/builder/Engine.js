import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';


const Engine = {
  scene: null,
  camera: null,
  renderer: null,
  raycaster: null,
  mouse: null,
  controls: null,

  ground: null,
  directionalLight: null,

  selectedColour: null,

  init() {
    console.log("initi");

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(500, 800, 1300);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('skyblue');

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // create the grid 
    const grid = new THREE.GridHelper(1000, 20);
    this.scene.add(grid);


    this.createGroundPlane();

    this.createLighting();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("renderCanvas")
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this.updateGroundColour();


    
  },

  render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  },

  getBrickList: () => {
    console.log("get bricks");
  },

  initializeFromState: () => {},



  createGroundPlane() {
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.rotateX(-Math.PI/2);

    const material = new THREE.MeshBasicMaterial({
      name: "ground",
      color: 0x007b28,
      side: THREE.DoubleSide
    });

    console.log(material.name);

    this.ground = new THREE.Mesh(geometry, material);
    this.scene.add(this.ground);

    // add an object
    const groundObject = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      visible: false
    }));

    this.scene.add(groundObject);

  },

  updateGroundColour(){
    this.ground.material.color = new THREE.Color('yellow');
  },


  createLighting(){
    const light = new THREE.AmbientLight(0x606060);
    this.scene.add(light);


    // create the directional light 
    this.directionalLight = new THREE.DirectionalLight(0x000000);
    this.directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(this.directionalLight);
  }
};

export default Engine;