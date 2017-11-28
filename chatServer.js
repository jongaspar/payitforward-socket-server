const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3002;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('message', function(message) {
    console.log('I received a message', message)
  });
});

http.listen(PORT, function(){
  console.log(`Chat server listening on port ${PORT}.`);
});