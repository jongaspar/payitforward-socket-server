"use strict"

require('dotenv').config();

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = 3002;



//
// Sockets
//

io.on("connection", function(socket) {
  const contractId = socket.handshake.query.contractId;
  console.log('CONNECTED: contract#', contractId);

  socket.join(contractId);

  socket.on("message", function(message) {
    console.log("I received a message", message, "contract:", contractId);
    socket.to(contractId).emit("message", message);
  });
});

http.listen(PORT, function() {
  console.log(`Chat server listening on port ${PORT}.`);
});
