const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { check_username, check_password, add_user } = require('./loginFunction');

// SETUP SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// MATCHMAKING ARRAY
let matchingUsers = [];
let unique_game_id = 0;

// GAME LOGIC
let runningGames = {};

function start_game() {
  unique_game_id += 1;
  const current_game = {
    player1: {
      username: matchingUsers[0],
      points: 0,
    },
    player2: {
      username: matchingUsers[1],
      points: 0,
    }
  }
  runningGames[unique_game_id] = current_game;
  matchingUsers = [];
  gameid = unique_game_id;
  return gameid;
}

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {
  socket.on('check-user', (username) => {
    let result = check_username(username);
    io.emit('checked-username-' + username, { valid: result, user: username });
  });

  socket.on('check-password', (userobj) => {
    let username = userobj.username;
    let password = userobj.password;
    let result = check_password(username, password);
    io.emit('checked-password-' + username, result);
  });

  socket.on('register-user', (userobj) => {
    let username = userobj.username;
    let password = userobj.password;
    add_user(username, password);
    io.emit('registered-user-' + username, true);
  });

  socket.on('enter-matchmaking', (username) => {
    matchingUsers.push(username);
    const count = matchingUsers.length;
    if (count >= 2) {
      setTimeout(() => {
        gameid = start_game();
        io.emit('start-game', gameid);
        io.emit('setup-' + runningGames[gameid].player1.username, { playerNo: 1 })
        io.emit('setup-' + runningGames[gameid].player2.username, { playerNo: 2 })

        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            io.emit('countdown-' + gameid, 5 - i);
          }, (1 + i) * 1000);
        }

        setTimeout(() => {
          io.emit('ready-' + gameid, 'Start')
        }, 6000);
      }, 1000);
    }
  });

  socket.on('disconnect', () => { });

});

server.listen(3001, () => { console.log('Server listening on port 3001'); });