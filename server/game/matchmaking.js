import shuffleArray from "shuffle-array";
import { fetchData, insertData } from "../database/dbInterface.js";
import { queue, socketIO } from "../server.js";
import { nextRound, updatePlayerNav } from "./gameloop.js";

export async function enterMatchmaking(username) {
    console.info(username + ' has joined');
    if (queue.includes(username)) return; // prevent duplicate matchmaking
    queue.push(username);
    socketIO.emit('entered-matching-' + username);
    if (queue.length < 2) return; // not enough players

    const [p1, p2] = queue.splice(0, 2);
    const game_id = generateGameID(4);

    console.info('game ' + game_id + ' started');
    updatePlayerNav([p1, 0], [p2, 0]);
    socketIO.emit('start-' + p1, game_id, 1, "You will be guessing the other player's response first");
    socketIO.emit('start-' + p2, game_id, 2, "You will pretend to be an AI first");

    await initGame(p1, p2, game_id);
    await nextRound(game_id, 1);
};

async function initGame(player1, player2, game_ID) {
    const allprompts = await fetchData('PromptsTable', '*');
    const questions = [];

    for (let i = 0; i < 6; i++) {
        const { question: q, ai_answers: a } = allprompts[Math.floor(Math.random() * allprompts.length)];
        shuffleArray(a);
        const selected = a.slice(0, 2);
        const obj = { 'ai': selected, 'question': q };
        questions.push(obj);
    }

    const gameinfo = {
        game_ID,
        questions,
        p1_username: player1,
        p2_username: player2,
        match_NO: 1,
        p1_score: 0,
        p2_score: 0,
        human_responses: [],
        status: true
    };

    await insertData('GamesTable', [gameinfo]);
}

function generateGameID(length) {
    return Date.now().toString(16).replace(/\./, '').slice(11 - length);
}