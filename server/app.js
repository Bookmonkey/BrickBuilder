const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");
const crypto = require('crypto');

const studioController = require("./StudioController");

app.use(cors())
app.use(bodyParser.json())

const port = 3000;

let studios = [];

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
    let currentStudio = await studioController.getStudioById(studioId);

    if(currentStudio){
      currentStudio.removeBuilderByIp(socket.handshake.address); 
      
    }
  });

  socket.on('join', async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    let builderInfo =   {
      name: data.name,
      address: socket.handshake.address
    }; 

    currentStudio.addBuilder(builderInfo);
  });

  socket.on("newBrick", async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    currentStudio.addBrick(data);
    
    // currentStudio.brickState.push({
    //   brickId: data.brickId,
    //   brickColour: data.brickColour
    // });
  });

  socket.on("updateBrick", async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    currentStudio.updateBrick(data);
  })
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
  res.status(200).send(JSON.stringify(studio));
});


function checkIfStudioExists(studioId){
  return (studioController.getStudioById(studioId)) ? true : false;
}