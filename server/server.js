import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initGame, startRound, getQuestion, generateAIResponses, nextRound, playerWins } from './gameFunction.js';
import { registerUser, checkUsername, checkPassword, addStat } from './supabaseDB.js';

// SERVER CONNECTIONS
const corsURLS = { origin: ['http://localhost:3000', 'https://pseudohuman-project.vercel.app'] }

const app = express();
app.use(express.json());
app.use(cors(corsURLS));
const server = createServer(app);
const io = new Server(server, { cors: corsURLS });

io.on('connection', (socket) => {
  socket.on('enter-matchmaking', enterMatchmaking);
  socket.on('get-question', sendQuestion);
  socket.on('send-player-answer', sendAnswer);
  socket.on('guessed-answer', guessedAnswer);
  socket.on('get-current-winner', getWinner);
  socket.on('get-results', finishGame);
  socket.on('user-disconnected', disconnectGame);
});

app.post('/check_username', check_username);
app.post('/check_password', check_password);
app.post('/register', register);
app.post('/change_stat', change_stat);

server.listen(3001, () => console.log('Server listening on port 3001'));

// AUTHENTICATION
async function check_username(req, res) {
  const username = req.body.username;
  const valid = await checkUsername(username);
  res.send({ valid });
}

async function check_password(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const valid = await checkPassword(username, password);
  res.send({ valid });
}

async function register(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const processed = await registerUser(username, password);
  res.send({ processed });
}

async function change_stat(req, res) {
  const username = req.body.username;
  const stat = req.body.stat;
  const value = req.body.value;
  const processed = await addStat(username, stat, value)
  res.send({ processed });
}

// GAME FUNCTIONS
let matchingUsers = [];
let runningGames = {};
let receivedResults = [];
let aiUses = 0

function generateGameID(length) { return Date.now().toString(16).replace(/\./, '').slice(11 - length) }

function enterMatchmaking(username) {
  console.info(username + ' has joined');
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
};

async function sendQuestion(gameid) {
  let current_game = runningGames[gameid];
  if (current_game.question == '') {
    if (aiUses > 5) {
      console.log('Too many API uses');
      return;
    }
    const { question, answers } = await getQuestion();
    aiUses++; setTimeout(() => aiUses--, 12000);
    current_game.question = question;
    current_game.answers = answers;
    runningGames[gameid] = current_game;
  }
  io.emit('return-question-' + gameid, current_game);
};

function sendAnswer(gameid, input) {
  let current_game = runningGames[gameid];
  runningGames[gameid] = generateAIResponses(current_game, input);
  io.emit('player-answered-' + gameid, current_game);
};

function guessedAnswer(gameid, playerNo, isCorrect) {
  let current_game = runningGames[gameid];
  const winningPlayer = !(playerNo == 1 ^ isCorrect) ? 1 : 2;
  current_game = playerWins(current_game, winningPlayer);

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
};

function getWinner(gameid) {
  const number = runningGames[gameid].who_scored_last;
  io.emit('got-current-winner-' + gameid, runningGames[gameid]['player' + number].username);
};

function finishGame(gameid, username) {
  if (receivedResults.includes(username)) return; // prevent duplicates
  if (runningGames[gameid] == undefined) return; // prevent null from happening
  receivedResults.push(username);
  if (receivedResults.length < 2) return;

  const current_game = runningGames[gameid];
  io.emit('got-results-' + gameid, current_game);
  delete runningGames[gameid];
  setTimeout(() => receivedResults = [], 1000);
};

function disconnectGame(username) {
  console.info(username + ' has left');
  matchingUsers = matchingUsers.filter(e => e != username);
  let gameID = null;

  Object.keys(runningGames).forEach(key => {
    const player1 = runningGames[key].player1.username;
    const player2 = runningGames[key].player2.username;
    if (player1 == username || player2 == username) {
      gameID = key;
      io.emit('end-game-dc-' + player1);
      io.emit('end-game-dc-' + player2);
    }
  });

  if (gameID != null) delete runningGames[gameID];
};