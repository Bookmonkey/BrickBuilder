const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");
const crypto = require('crypto');

const studioController = require("./controllers/studio");
const socketController = require("./controllers/socket");
const API = require("./api");

app.use(cors())
app.use(bodyParser.json())

const port = 3000;

const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
var io = require('socket.io')(server);

io.on('connection', (socket) => {

  let exists = checkIfStudioExists(socket.handshake.query.studioId);
  if(!exists){
    io.emit("isDead");
  }
  
  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.handshake.address);
    let studioId = socket.handshake.query.studioId;
  });

  socket.on('join', async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    let userId;
    let alreadyExists = false;

    if(data.id) {
      userId = data.id;
      alreadyExists = true;
    }
    else {
      userId = await studioController.generateToken();
    }

    let builderInfo = {
      address: socket.handshake.address,
      userId: userId,
    }; 

    
    if(!alreadyExists){
      currentStudio.addBuilder(builderInfo);
    }

    let member = currentStudio.getBuilderById(userId);
    let brickState = currentStudio.getBrickState;


    // get the brick defintion and brick colours
    let brickColours = await API.getBrickColours();
    let bricks = await API.getBricks();    

    let socketData = {
      member: member,
      brickState: brickState,
      colours: brickColours,
      bricks: bricks
    };    

    socket.emit('userJoined', socketData);
  });

  socket.on("newBrick", async (data) => {
      let currentStudio = await studioController.getStudioById(data.studioId);
      currentStudio.addBrick(data);
      socket.broadcast.emit("addNewBrick", data);
  });

  socket.on("updateBrick", async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    currentStudio.updateBrick(data);
    socket.broadcast.emit("moveUpdatedBrick", data);
  });
});

app.post("/api/studio/create", async function(req, res) {
  let body = req.body;

  let newStudio = {
    "is_public": body.public,
    "builders": 0,
    "title": body.title,
    "colour": body.colour,
    "brickState": [],
  };

  newStudio.id = await studioController.newStudio(newStudio);

  res.status(200).send(newStudio.id);
});

app.post("/api/studio/delete", async function(req, res) {
  let body = req.body;

  let deleted = await studioController.deleteStudioById(body.id);

  res.status(200).send();
})

app.get("/api/studios/:isPublic", async function(req, res) { 
  let studios = await studioController.getStudios();
  res.send(JSON.stringify(studios)); 
});

app.get("/api/studio/:id", async function(req, res) {
  let studio = await studioController.getStudioById(req.params.id);
  res.status(200).send(studio);
});

app.get("/api/studio/:id/member/:userId", async function(req, res) {
  let studio = await studioController.getStudioById(req.params.id);
  let userExists = await studio.findBuilderById(req.params.userId);
  
  if(userExists) {
    return res.status(200).send("OK");
  } 
  else {
    return res.status(400).send("User doesnt exist");
  }
});
app.get("/api/studio/:id/member/:userId/getbricks", async function(req, res) {
  let params = req.params;
  let studio = await studioController.getStudioById(params.id);
  let member = await studio.getBuilderById(params.userId);  
  let bricks = member.getMyBricks;
  res.status(200).send(bricks);
});

app.get("/api/studio/:id/member/:userId/addbrick/:brickId", async function(req, res) {
  let params = req.params;
  let studio = await studioController.getStudioById(params.id);
  let member = await studio.getBuilderById(params.userId);
  member.addToMyBricks(params.brickId);

  res.status(200).send("OK");
});

app.get("/api/studio/:id/member/:userId/removebrick/:brickId", async function(req, res) {
  let params = req.params;

  let studio = await studioController.getStudioById(params.id);
  let member = await studio.getBuilderById(params.userId);
  member.removeFromMyBricks(params.brickId);

  res.status(200).send("OK");
});


function checkIfStudioExists(studioId){
  return (studioController.getStudioById(studioId)) ? true : false;
}