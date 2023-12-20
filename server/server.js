const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io')

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let messageArray = ['test1', 'test2'];

io.on('connection', (socket) => {

  console.log("user joined");
  io.emit('send-message', messageArray);

  socket.on('sent-message', (message) => {
    messageArray = [...messageArray, message]
    io.emit('send-message', messageArray);
  })

  socket.on('disconnect', () => {
  })
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});