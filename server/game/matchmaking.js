import shuffleArray from 'shuffle-array';
import { fetchData, insertData } from '../database/dbInterface.js';
import { queue, privateQueue, socketIO } from '../server.js';
import { nextRound, updatePlayerNav } from './gameloop.js';
import { splicePrivateQueueID } from './end.js';

export async function enterMatchmaking(username, code) {
    console.info(username + ' has joined');
    let p1, p2, game_id;

    // joining with room code
    if (code != null) {
        const info = splicePrivateQueueID(code);
        if (info == null) return;
        const { player1, game_id: gameid } = info;
        game_id = gameid;
        [p1, p2] = [player1, username];
    } else {
        // joining normal matchmaking
        if (queue.includes(username)) return; // prevent duplicate matchmaking
        queue.push(username);
        socketIO.emit('entered-matching-' + username);
        if (queue.length < 2) return; // not enough players

        [p1, p2] = queue.splice(0, 2); // get 2 players
        game_id = generateGameID(4); // unique game ID
    }

    console.info('game ' + game_id + ' started');
    updatePlayerNav([p1, 0], [p2, 0]);
    socketIO.emit('start-' + p1, game_id, 1, "You will be guessing the other player's response first");
    socketIO.emit('start-' + p2, game_id, 2, 'You will pretend to be an AI first');

    await initGame(p1, p2, game_id);
    await nextRound(game_id, 1);
}

export async function enterMatchmakingPrivate(username) {
    console.info(username + ' has joined the private queue');

    if (privateQueue.some(info => info.player1 == username)) return;

    const game_id = generateGameID(4);
    const info = { player1: username, game_id };
    privateQueue.push(info);

    socketIO.emit('entered-matching-private-' + username, game_id);
}

export async function check_room_id(req, res) {
    const id = req.body.gameid;
    let valid = false;
    privateQueue.forEach(info => {
        if (info.game_id == id) {
            valid = true;
        }
    });
    res.send({ valid });
}

async function initGame(player1, player2, game_ID) {
    const allprompts = await fetchData('PromptsTable', '*');
    const questions = [];

    // generate 6 random questions
    for (let i = 0; i < 6; i++) {
        const { question: que, ai_answers: ans } = allprompts[Math.floor(Math.random() * allprompts.length)];
        shuffleArray(ans);
        const selected = ans.slice(0, 2);
        const obj = { ai: selected, question: que };
        questions.push(obj);
    }

    // set default game info
    const gameinfo = {
        game_ID,
        questions,
        p1_username: player1,
        p2_username: player2,
        match_NO: 1,
        p1_score: 0,
        p2_score: 0,
        human_responses: [],
        status: true,
    };

    await insertData('GamesTable', [gameinfo]);
}

function generateGameID(length) {
    // uses current time and base 16
    return Date.now()
        .toString(16)
        .replace(/\./, '')
        .slice(11 - length);
}
