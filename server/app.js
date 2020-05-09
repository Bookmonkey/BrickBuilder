const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");

const crypto = require('crypto');

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
    let currentStudio = getCurrentStudio(studioId);

    if(currentStudio){
      currentStudio.builders--;
    }
    
  });

  socket.on('join', (data) => {
    let currentStudio = getCurrentStudio(data.studioId);
    currentStudio.builders++;
  });

  socket.on("newBrick", data => {
    let currentStudio = getCurrentStudio(data.studioId);
    
    currentStudio.brickState.push({
      brickId: data.brickId,
      brickColour: data.brickColour
    });
  });

  socket.on("updateBrick", data => {
    
  })
});

app.post("/api/studio/create", async function(req, res) {
  let body = req.body;

  function generateToken() {
    return new Promise(function(resolve, reject) {
      crypto.randomBytes(12, (err, buffer) => {
        if (err) {
          reject("error generating token");
        }
        const token = buffer.toString('hex');
        resolve(token);
      });
    });
  }

  let token = await generateToken();
  console.log(token);

  let newStudio = {
    "id": token,
    "public": body.public,
    "builders": 0,
    "title": body.title,
    "brickState": [],
  };

  studios.push(newStudio);
  res.status(200).send(newStudio.id);
});

app.get("/api/studios/:isPublic", function(req, res) { 
  console.log(studios);
  res.send(JSON.stringify(studios)); 
});

app.get("/api/studio/:id", function(req, res) {
  let studio = studios.filter(ele=> ele.id = req.params.id);
  res.status(200).send(studio);
});


function getCurrentStudio(studioId){
  let currentStudio = studios.filter(ele => ele.id === studioId);
  return currentStudio[0];
}