"use strict"

require('dotenv').config();

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = 3002;



//
// JWT Validation
//

var jwt = require('jwt-simple');
var secret = process.env.JWT_SECRET;
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MTY2.u5u4hkvjrDZPcxPXZzFP9i5eRuIoSFv3Z5ofnBucBWo'
var decoded = jwt.decode(token, secret);

// console.log(decoded);



//
// Sockets
//

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("message", function(message) {
    console.log("I received a message", message);
    socket.broadcast.emit("message", message);
  });
});

http.listen(PORT, function() {
  console.log(`Chat server listening on port ${PORT}.`);
});
