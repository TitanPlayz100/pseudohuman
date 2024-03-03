const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initGame, startRound, getQuestion, generateAIResponses, nextRound, playerWins } = require('./gameFunction');

// SETUP SERVER
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: ['http://localhost:3000', 'https://pseudohuman-project.vercel.app'] } });

let matchingUsers = [];
let runningGames = {};
let receivedResults = [];

function generateGameID(length) { return Date.now().toString(16).replace(/\./, '').slice(11 - length) }

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {
  socket.on('enter-matchmaking', (username) => {
    console.info(username + ' has joined')
    if (matchingUsers.includes(username)) return; // prevent duplicate matchmaking
    matchingUsers.push(username);
    if (matchingUsers.length < 2) return;

    const game_id = generateGameID(4);
    runningGames[game_id] = initGame(matchingUsers);
    console.info('game ' + game_id + ' started');
    const current_game = runningGames[game_id];
    startRound(io, game_id, current_game);
    io.emit('update-navbar-' + current_game.player1.username, current_game.player1, current_game.player2);
    io.emit('update-navbar-' + current_game.player2.username, current_game.player1, current_game.player2);

    setTimeout(() => matchingUsers.splice(0, 2), 1000);
  });

  socket.on('get-question', (gameid) => {
    let current_game = runningGames[gameid];
    if (current_game.question == '') {
      const { question, answers } = getQuestion();
      current_game.question = question;
      current_game.answers = answers;
      runningGames[gameid] = current_game;
    }
    io.emit('return-question-' + gameid, current_game);
  });

  socket.on('send-player-answer', (gameid, input) => {
    let current_game = runningGames[gameid];
    runningGames[gameid] = generateAIResponses(current_game, input);
    io.emit('player-answered-' + gameid, current_game);
  });

  socket.on('guessed-answer', (gameid, playerNo, isCorrect) => {
    let current_game = runningGames[gameid];
    const winningPlayer = !(playerNo == 1 ^ isCorrect) ? 1 : 2;
    current_game = playerWins(current_game, winningPlayer)

    if (current_game.player1.points >= 3) current_game.winner = 'player1';
    if (current_game.player2.points >= 3) current_game.winner = 'player2';
    runningGames[gameid] = current_game;

    io.emit('update-navbar-' + current_game.player1.username, current_game.player1, current_game.player2);
    io.emit('update-navbar-' + current_game.player2.username, current_game.player1, current_game.player2);

    // Check if game ends
    if (current_game.winner != '') {
      io.emit('end-game-' + gameid);
      return;
    }

    nextRound(io, gameid, runningGames[gameid].matchNo);
  });

  socket.on('get-current-winner', (gameid) => {
    const number = runningGames[gameid].who_scored_last;
    io.emit('got-current-winner-' + gameid, runningGames[gameid]['player' + number].username);
  });

  socket.on('get-results', (gameid, username) => {
    if (receivedResults.includes(username)) return; // prevent duplicates
    if (runningGames[gameid] == undefined) return; // prevent null from happening
    receivedResults.push(username);
    if (receivedResults.length < 2) return;

    const current_game = runningGames[gameid];
    io.emit('got-results-' + gameid, current_game);
    delete runningGames[gameid];
    setTimeout(() => receivedResults = [], 1000);
  });

  socket.on('user-disconnected', (username) => {
    console.info(username + ' has left');
    matchingUsers = matchingUsers.filter(e => e != username);
    let gameID = null;

    Object.keys(runningGames).forEach(key => {
      const player1 = runningGames[key].player1.username;
      const player2 = runningGames[key].player2.username;
      if (player1 == username || player2 == username) {
        gameID = key;
        io.emit('end-game-dc-' + (username == player1) ? player2 : player1, username);
      }
    });

    if (gameID) delete runningGames[gameID];
  });
});

server.listen(3001, () => console.log('Server listening on port 3001'));