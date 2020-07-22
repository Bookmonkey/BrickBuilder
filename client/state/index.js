let state = {
  studioId: null,

  user: {
    bricks: [],
    name: null,
    id: null,
    colour: {
      name: "Bright Red",
      hex_code: "#ff0000"
    }
  },

  engine: null,

  brickController: [],

  bricks: [],
  colors: [],

  selectedBrick: {
    name: ''
  },
  ui: {
    navigation: 'bricks',
    blockList: true,
  },
  socket: null,
};

export default state;