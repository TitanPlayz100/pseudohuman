const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { start_game, start_match, generate_question, generate_answer, next_round, player1WinsRound, player2WinsRound } = require('./gameFunction');

// SETUP SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: ['http://localhost:3000', 'https://pseudohuman-project.vercel.app'] } });

let matchingUsers = [];
let unique_game_id = 0;
let runningGames = {};

let recievedResults = [];

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {
  socket.on('enter-matchmaking', (username) => {
    console.log(username + " has connected")
    if (matchingUsers.includes(username)) { return; } // prevent duplicate matchmaking

    matchingUsers.push(username);
    const count = matchingUsers.length;
    if (count >= 2) {
      unique_game_id += 1;
      runningGames[unique_game_id] = start_game(matchingUsers);
      start_match(io, unique_game_id, runningGames);

      const player1 = runningGames[unique_game_id].player1;
      const player2 = runningGames[unique_game_id].player2;
      io.emit('update-navbar-' + player1.username, { player1, player2 });
      io.emit('update-navbar-' + player2.username, { player1, player2 });

      setTimeout(() => matchingUsers = [], 1000);
    }
  });

  socket.on('get-question', (gameid) => {
    let current_game = runningGames[gameid];
    if (current_game.question == '') {
      const { question, answers } = generate_question();
      current_game.question = question;
      current_game.answers = answers;
      runningGames[gameid] = current_game;
    }
    io.emit('return-question-' + gameid, current_game);
  });

  socket.on('send-player-answer', (gameid, input) => {
    let current_game = runningGames[gameid];
    runningGames[gameid] = generate_answer(current_game, input);
    io.emit('player-answered-' + gameid, current_game);
  });

  socket.on('guessed-answer', (gameid, playerNo, isCorrect) => {
    current_game = runningGames[gameid];
    // ternary hell - check who won round
    isCorrect ?
      playerNo == 1 ? current_game = player1WinsRound(current_game) : current_game = player2WinsRound(current_game) :
      playerNo == 1 ? current_game = player2WinsRound(current_game) : current_game = player1WinsRound(current_game)

    if (current_game.player1.points >= 3) { current_game.winner = 'player1'; }
    if (current_game.player2.points >= 3) { current_game.winner = 'player2'; }
    runningGames[gameid] = current_game;

    const player1 = runningGames[gameid].player1;
    const player2 = runningGames[gameid].player2;
    io.emit('update-navbar-' + player1.username, { player1, player2 });
    io.emit('update-navbar-' + player2.username, { player1, player2 });

    // Check if game ends
    if (current_game.winner != '') {
      io.emit('end-game-' + gameid);
      return;
    }

    next_round(io, gameid, runningGames[gameid].matchNo);
  });

  socket.on('get-current-winner', (gameid) => {
    const current_winner = runningGames[gameid].who_scored_last;
    if (current_winner == 1) {
      io.emit('got-current-winner-' + gameid, runningGames[gameid].player1.username);
    } else {
      io.emit('got-current-winner-' + gameid, runningGames[gameid].player2.username);
    }
  });

  socket.on('get-results', (gameid, username) => {
    if (recievedResults.includes(username)) { return; } // prevent duplicates
    if (runningGames[gameid] == undefined) { return; } // prevent null from happening
    recievedResults.push(username);

    if (recievedResults.length >= 2) {
      const current_game = runningGames[gameid];
      io.emit('got-results-' + gameid, current_game);
      delete runningGames[gameid];
      setTimeout(() => recievedResults = [], 1000);
    }
  });

  socket.on('user-disconnected', (username) => {
    console.log(username + " has left the game")
    matchingUsers = matchingUsers.filter((item) => { item !== username });

    let gameid = -1;
    const keys = Object.keys(runningGames)
    for (let i = 0; i < keys.length; i++) {
      const currentkey = keys[i];
      const player1 = runningGames[currentkey].player1;
      const player2 = runningGames[currentkey].player2;
      const otherPlayer = (username == player1.username) ? player2.username : player1.username;
      if (player1.username == username || player2.username == username) {
        delete runningGames[gameid];
        io.emit('end-game-dc-' + otherPlayer, username);
      }
    }
  });
});

server.listen(3001, () => { console.log('Server listening on port 3001'); });