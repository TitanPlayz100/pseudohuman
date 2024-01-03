const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { check_username, check_password, add_user } = require('./loginFunction');
const { start_game, start_match, generate_question, generate_answer, next_round, player1WinsRound, player2WinsRound } = require('./gameFunction');
const cors = require('cors')

// SETUP SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

let matchingUsers = [];
let unique_game_id = 0;
let runningGames = {};

let previousMatch = '';
let previousMatch2 = '';
let recievedResults = [];

// HTTP REQUESTS
app.use(express.json(), cors());
app.post('/api/check-user', (req, res) => {
  const { username } = req.body;
  const valid = check_username(username);
  res.send({ valid });
});
app.post('/api/check-password', async (req, res) => {
  const { username, password } = req.body;
  const result = await check_password(username, password);
  res.send({ result })
});
app.post('/api/register-user', (req, res) => {
  const { username, password } = req.body;
  add_user(username, password);
  res.send({ valid: true })
});

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {
  socket.on('enter-matchmaking', (username) => {
    if (username == previousMatch) { return; } // Prevent duplicate calls from 1 user
    previousMatch = username;

    matchingUsers.push(username);
    const count = matchingUsers.length;
    if (count >= 2) {
      unique_game_id += 1;
      runningGames[unique_game_id] = start_game(matchingUsers);
      matchingUsers = [];
      previousMatch = '';
      start_match(io, unique_game_id, runningGames);
    }
  });

  socket.on('get-question', (gameid) => {
    let current_game = runningGames[gameid];
    if (current_game.question === '') {
      current_game.question, current_game.answers = generate_question();
      runningGames[gameid] = current_game;
    }
    io.emit('return-question-' + gameid, current_game)
  });

  socket.on('send-player-answer', (infoObj) => {
    let current_game = runningGames[infoObj.gameid];
    runningGames[infoObj.gameid] = generate_answer(current_game, infoObj.input);
    io.emit('player-answered-' + infoObj.gameid, current_game);
  });

  socket.on('user-disconnected', (username) => {
    console.log("User " + username + " has left matchmaking");
    matchingUsers = matchingUsers.filter((item) => { item !== username });
  });

  socket.on('guessed-answer', ({ gameid, playerNo, isCorrect }) => {
    current_game = runningGames[gameid];
    // ternary hell - check who won round
    isCorrect ?
      playerNo == 1 ? current_game = player1WinsRound(current_game) : current_game = player2WinsRound(current_game) :
      playerNo == 1 ? current_game = player2WinsRound(current_game) : current_game = player1WinsRound(current_game)

    if (current_game.player1.points >= 3) { current_game.winner = 'player1'; }
    if (current_game.player2.points >= 3) { current_game.winner = 'player2'; }
    runningGames[gameid] = current_game;

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

  socket.on('first-navbar-update', (gameid) => {
    if (runningGames[gameid] == undefined) { return; }
    const player1 = runningGames[gameid].player1;
    const player2 = runningGames[gameid].player2;
    io.emit('update-navbar-' + gameid, { player1, player2 })
  });

  socket.on('get-results', (gameid, username) => {
    if (username == previousMatch2) { return; }
    previousMatch2 = username;
    recievedResults.push(username);
    const current_game = runningGames[gameid];
    io.emit('got-results-' + gameid, current_game);

    if (recievedResults.length >= 2) {
      delete runningGames[gameid];
      recievedResults = [];
      previousMatch2 = '';
    }
  });
});

server.listen(3001, () => { console.log('Server listening on port 3001'); });