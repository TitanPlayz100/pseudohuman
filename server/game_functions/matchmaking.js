import shuffleArray from "shuffle-array";
import { fetchData, insertData } from "../database/dbInterface.js";
import { matchingUsers, socketIO } from "../server.js";
import { get_question } from "./gamedata.js";
import { countdown } from "./gameloop.js";

export async function enterMatchmaking(username) {
    console.info(username + ' has joined');
    if (matchingUsers.includes(username)) return; // prevent duplicate matchmaking
    matchingUsers.push(username);
    socketIO.emit('entered-matching-' + username);
    if (matchingUsers.length < 2) return;

    const p1 = matchingUsers[0];
    const p2 = matchingUsers[1];
    const game_id = generateGameID(4);

    console.info('game ' + game_id + ' started');

    socketIO.emit('update-navbar-' + p1, { username: p1, points: 0 }, { username: p2, points: 0 });
    socketIO.emit('update-navbar-' + p2, { username: p1, points: 0 }, { username: p2, points: 0 });
    socketIO.emit('start-' + p1, game_id, 1);
    socketIO.emit('start-' + p2, game_id, 2);
    await initGame(p1, p2, game_id);
    const questions = await get_question(game_id);
    countdown(10, game_id, () => socketIO.emit('ready-' + game_id, 1, questions));

    setTimeout(() => matchingUsers.splice(0, 2), 1000);
};

async function initGame(player1, player2, game_ID) {
    const allprompts = await fetchData('PromptsTable', '*')
    const questions = []

    for (let i = 0; i < 6; i++) {
        const { question: q, ai_answers: a } = allprompts[Math.floor(Math.random() * allprompts.length)]
        shuffleArray(a);
        const selected = a.slice(0, 2);
        const obj = { 'ai': selected, 'question': q }
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
    }

    await insertData('GamesTable', [gameinfo]);
}

function generateGameID(length) {
    return Date.now().toString(16).replace(/\./, '').slice(11 - length)
}
