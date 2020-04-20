const express = require('express');
const app = express();

const cors = require("cors");
app.use(cors())
 
const port = 3000;

const rooms = [
  {
    "id": "1a876a",
    "public": true,
    "builders": 2,
  }
];

app.get("/api/rooms", function(req, res) { 
  let getPublicRooms = rooms;
  res.status(200).send(rooms);  
});

app.get("/api/rooms/:id", function() {});
app.post("/api/rooms/create", function() {});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))