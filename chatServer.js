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

// console.log(decoded);



//
// Helpers
//

function decode(token) {
  return jwt.decode(token, secret);
}



//
// Sockets
//

const rooms = {};

// Client verification:
io.use((socket, next) => {
  const userId = decode(socket.handshake.query.token);
  const otherUserId = Number(socket.handshake.query.otherUserId);
  const contractId = Number(socket.handshake.query.contractId);

  if (!rooms[contractId]) { // If no room yet
    rooms[contractId] = [userId, otherUserId];
    return next();
  } else if (rooms[contractId].indexOf(userId) > -1) { // Returns true if this user is part of the contract/room
    return next();
  } else {
    return next(new Error('authentication error'));
  }
});

io.on("connection", function(socket) {
  const contractId = socket.handshake.query.contractId;

  socket.join(contractId);

  socket.on("message", function(message) {
    if (!message.content) return; // prevents blank messages
    socket.nsp.in(contractId).emit("message", message);
  });
});

http.listen(PORT, function() {
  console.log(`Chat server listening on port ${PORT}.`);
});
