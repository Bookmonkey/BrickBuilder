let state = {
  studioId: null,
  user: {
    bricks: [],
    name: null,
    id: null
  },
  engine: [],

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