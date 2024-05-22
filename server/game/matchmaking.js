import shuffleArray from 'shuffle-array';
import { fetchData, insertData } from '../database/dbInterface.js';
import { queue, privateQueue, socketIO } from '../server.js';
import { nextRound, updatePlayerNav } from './gameloop.js';
import { disconnectGame, splicePrivateQueueID } from './end.js';
import { getPlayerStatus, updatePlayerStatus } from './gamedata.js';

export async function enterMatchmaking(username, code) {
    if ((await getPlayerStatus(username)) == true) {
        socketIO.emit('already-ingame-' + username); // prevent same player playing 2 games at once
        setTimeout(() => disconnectGame(username), 100);
        return;
    }

    code != null ? joinPrivate(username, code) : joinQueue(username);
}

async function joinPrivate(username, code) {
    const info = splicePrivateQueueID(code);
    updatePlayerStatus(username, true);
    console.info(username + ' has joined');
    if (info == null) return; // incase game suddenly disappears :shrug:

    const { player1, game_id } = info;
    const [p1, p2] = [player1, username];

    await initGame(p1, p2, game_id);
    await nextRound(game_id, 1);
}

async function joinQueue(username) {
    // joining normal matchmaking
    if (queue.includes(username)) return; // prevent duplicate matchmaking
    queue.push(username);
    socketIO.emit('entered-matching-' + username);
    setTimeout(() => updatePlayerStatus(username, true), 100);
    console.info(username + ' has joined');

    if (queue.length < 2) return; // not enough players
    const [p1, p2] = queue.splice(0, 2); // get 2 players
    const game_id = generateGameID(4); // unique game ID

    await initGame(p1, p2, game_id);
    await nextRound(game_id, 1);
}

export async function createPrivateRoom(username) {
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

async function initGame(player1, player2, game_id) {
    updatePlayerNav([player1, 0], [player2, 0]);
    socketIO.emit('start-' + player1, game_id, 1, "You will be guessing the other player's response first");
    socketIO.emit('start-' + player2, game_id, 2, 'You will pretend to be an AI first');

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
        game_ID: game_id,
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
    console.info('game ' + game_id + ' started');
}

function generateGameID(length) {
    // uses current time and base 16
    return Date.now()
        .toString(16)
        .replace(/\./, '')
        .slice(11 - length);
}
