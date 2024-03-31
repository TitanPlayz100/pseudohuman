import express from 'express';
import cors from 'cors';
import env from "dotenv"; env.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import { CohereClient } from "cohere-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

import { check_password, check_username, register, change_stat, get_stat } from './auth/endpoints.js';
import { enterMatchmaking } from './game/matchmaking.js';
import { disconnectGame } from './game/end.js';
import { guessedAnswer, sendAnswer } from './game/gameloop.js';

// init ai and database
export const cohereAI = new CohereClient({ token: process.env.AI_API_KEY });
export const geminiAI = (new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY)).getGenerativeModel({ model: "gemini-pro" });
export const supabaseDB = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export const queue = [];
export const countdowns = {};

// server setup
const corsURLS = { origin: ['http://localhost:3000', process.env.SERVER_URL] };
const app = express();
app.use(express.json());
app.use(cors(corsURLS));

// API Endpoints
app.post('/check_username', check_username);
app.post('/check_password', check_password);
app.post('/register', register);
app.post('/change_stat', change_stat);
app.post('/get_stat', get_stat);


// Socket Server
const server = createServer(app);
export const socketIO = new Server(server, { cors: corsURLS });

socketIO.on('connection', (socket) => {
  socket.on('enter-matchmaking', enterMatchmaking);
  socket.on('send-player-answer', sendAnswer);
  socket.on('guessed-answer', guessedAnswer);
  socket.on('user-disconnected', disconnectGame);
});

server.listen(process.env.PORT, () => console.info('Server listening on port ' + process.env.PORT));