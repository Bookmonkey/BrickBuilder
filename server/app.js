const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const studioController = require("./controllers/studio");
const socketController = require("./controllers/socket");
const API = require("./api");
const { studios } = require('./controllers/studio');

app.use(cors())
app.use(bodyParser.json())

const port = 3000;

const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
var io = require('socket.io')(server);


io.on('connection', (socket) => {
  console.log(socket.handshake.address);

  // let exists = checkIfStudioExists(socket.handshake.query.studioId);
  // if(!exists){
  //   io.emit("isDead");
  // }
  
  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.handshake.address);
    let studioId = socket.handshake.query.studioId;
  });

  socket.on('requirePassword', async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    socket.emit('requirePasswordResponse', Boolean(currentStudio.password_protected));
  })

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
    await studioController.saveStudioStateById(data.studioId);
    socket.broadcast.emit("addNewBrick", data);
  });

  socket.on("removeBrick", async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    currentStudio.removeBrick(data.brickName);
    await studioController.saveStudioStateById(data.studioId);
    socket.broadcast.emit("removeBrick", data);
  });


  socket.on("updateBrick", async (data) => {
    let currentStudio = await studioController.getStudioById(data.studioId);
    currentStudio.updateBrick(data);
    await studioController.saveStudioStateById(data.studioId);
    socket.broadcast.emit("moveUpdatedBrick", data);
  });
});

app.use('/', express.static(path.join(__dirname, '..', 'dist')))
app.engine("html", require("ejs").renderFile);
app.set("views", __dirname + "/");
app.set("view engine", "ejs"); // set up templates


app.get("/", function (req, res) {
  res.render("../dist/index.html");
});

app.post("/api/studio/create", async function(req, res) {
  let body = req.body;
  let hashedPassword = null;

  console.log(body);

  // double check passwords
  if(body.password_protected) {
    if(body.password === body.password_confirm) {
      hashedPassword = await bcrypt.hash(body.password, 10);    
    }
  }

  let newStudio = {
    "is_public": body.public,
    "builders": 0,
    "title": body.title,
    "colour": body.colour,
    "password_protected": body.password_protected,
    "password": hashedPassword,
    "direction_light": [0, 1, 0],
    "skybox": "#87CEEB",
    "ground": "#009900",
    "brickState": [],
  };

  newStudio.studio_id = await studioController.newStudio(newStudio);

  res.status(200).send(newStudio.studio_id);
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

app.get("/api/studio/:id/saveState", async function(req, res) {
  await studioController.saveStudioStateById(req.params.id);
  res.status(200).send("OK");
});

app.post("/api/studio/:id/saveSettings", async function(req, res) {
  let settings = req.body;
  await studioController.saveStudioSettingsById(req.params.id, settings);
  res.status(200).send("OK");
});

app.get("/api/studio/:id/export", async function(req, res) {
  let studio = await studioController.getStudioById(req.params.id);
  let fileName = path.join("./", "server", "tmp", `${req.params.id}.json`);
  
  fs.writeFile(fileName, JSON.stringify(studio, null, 2), function(err) {
    if(err) throw err;

    let file = path.resolve(fileName);
    res.sendFile(file);
  });
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