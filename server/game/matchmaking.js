import shuffleArray from 'shuffle-array';
import { fetchDataRandom, insertData } from '../database/dbInterface.js';
import { queue, privateQueue, socketIO } from '../server.js';
import { nextRound, updatePlayerNav } from './gameloop.js';
import { disconnectGame, splicePrivateQueueID } from './end.js';
import { getPlayerStatus, updatePlayerStatus } from './gamedata.js';

export async function enterMatchmaking(username, code) {
    // prevent same player playing 2 games at once
    if ((await getPlayerStatus(username)) == true) {
        console.log(username + ' is already ingame');
        socketIO.emit('already-ingame-' + username);
        setTimeout(() => disconnectGame(username), 200);
        return;
    }

    // if they entered with a room code use private rooms, else chech normal queue
    code != null ? joinPrivateRoom(username, code) : joinQueue(username);
}

async function joinPrivateRoom(username, code) {
    const info = splicePrivateQueueID(code);
    updatePlayerStatus(username, true);
    console.info(username + ' has joined');
    if (info == null) return; // incase game suddenly disappears

    const { player1, game_id } = info;
    const [p1, p2] = [player1, username];

    await initGame(p1, p2, game_id);
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
}

export async function createPrivateRoom(username) {
    console.info(username + ' has joined the private queue');

    // check if player has already joined a private
    if (privateQueue.some(info => info.player1 == username)) return;
    setTimeout(() => updatePlayerStatus(username, true), 100);

    const game_id = generateGameID(4);
    const info = { player1: username, game_id };
    privateQueue.push(info);

    socketIO.emit('entered-matching-private-' + username, game_id);
}

// check if room id is valid
export async function check_room_id(req, res) {
    const id = req.body.gameid;

    // loop through each private room and check if game id matches
    const valid = privateQueue.some(room => room.game_id == id);
    res.send({ valid });
}

async function initGame(player1, player2, game_id) {
    updatePlayerNav([player1, 0], [player2, 0]);
    socketIO.emit('start-' + player1, game_id, 1, "You will be guessing the other player's response first");
    socketIO.emit('start-' + player2, game_id, 2, 'You will pretend to be an AI first');

    // generates all the questions
    const questions = await generateQuestions();

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
        p1_abilities: 1,
        p2_abilities: 1
    };

    await insertData('GamesTable', [gameinfo]);
    console.info('game ' + game_id + ' started');

    await nextRound(game_id, 1);
}

async function generateQuestions() {
    const randomPrompts = await fetchDataRandom();
    const questions = [];

    randomPrompts.forEach((prompt) => {
        // get a random ai answer from 5 options, if its null fallback to default answers
        const randAnswerSet = Math.floor(Math.random() * 5);
        let ans = prompt[`ai_answers_${randAnswerSet}`];
        if (ans == null) {
            ans = prompt['ai_answers'];
        }

        // limit to one sentence
        ans = ans.map((aiAnswer) => aiAnswer.split('. ')[0]);

        shuffleArray(ans);
        const limited = ans.slice(0, 2);
        const obj = { ai: limited, question: prompt.question };
        questions.push(obj);
    })
    return questions;
}

function generateGameID(length) {
    // uses current time and converts to base 16 so that there is minimal chance for game ids to match
    // (most games run very close to each other)
    return Date.now()
        .toString(16)
        .replace(/\./, '')
        .slice(11 - length);
}
