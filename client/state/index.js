import BrickController from "../builder/BrickController";

let state = {
  studioId: null,

  studioInfo: {
    title: "",
    direction_light: "",
    skybox: "",
    ground: "",

    groundSize: {
      x: 0,
      y: 0,
    }
  },

  user: {
    bricks: [],
    name: null,
    id: null,
    
    colour: {
      name: "Bright Red",
      hex_code: "#ff0000"
    }
  },

  bricks: [],
  colors: [],

  brickController: new BrickController(),

  selectedBrick: {
    name: ''
  },
  ui: {
    navigation: 'menu',
    mode: '',
    showBrickList: false,
    playSoundEffects: false,
    debugMode: true,
  },
  socket: null,
};

export default state;