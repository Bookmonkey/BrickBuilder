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
  socket.on('disconnect', () => {
    console.log('user disconnected');
    let studioId = socket.handshake.query.studioId;
    let currentStudio = studioController.getStudioById(studioId);    
  });

  socket.on('join', (data) => {
    let currentStudio = studioController.getStudioById(data.studioId);
    
    let builderInfo =   {
      name: data.name,
      address: socket.handshake.address
    }
    currentStudio.addBuilder(builderInfo);
  });

  socket.on("newBrick", data => {
    // let currentStudio = getCurrentStudio(data.studioId);
    
    // currentStudio.brickState.push({
    //   brickId: data.brickId,
    //   brickColour: data.brickColour
    // });
  });

  socket.on("updateBrick", data => {
    
  })
});

app.post("/api/studio/create", async function(req, res) {
  let body = req.body;

  let newStudio = {
    "public": body.public,
    "builders": 0,
    "title": body.title,
    "brickState": [],
  };

  newStudio.id = studioController.newStudio(newStudio);

  res.status(200).send(newStudio.id);
});

app.get("/api/studios/:isPublic", function(req, res) { 
  let studios = studioController.getStudios();
  res.send(JSON.stringify(studios)); 
});

app.get("/api/studio/:id", function(req, res) {
  let studio = studioController.getStudioById(req.params.id);
  res.status(200).send(JSON.stringify(studio));
});