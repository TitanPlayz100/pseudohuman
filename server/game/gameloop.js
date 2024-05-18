import shuffleArray from "shuffle-array";
import { fetchDataFiltered, updateData } from "../database/dbInterface.js";
import { socketIO } from "../server.js";
import { getPlayerData, getQuestion, updateGameData } from "./gamedata.js";
import { endGame } from "./end.js";

export async function sendQuestion(game_id) {
    const { question, answers } = getQuestion(game_id);
    socketIO.emit('return-question-' + game_id, question, answers);
};

export async function sendAnswer(game_id, input) {
    await updateGameData(game_id, 'human_responses', input); // save response to db
    let { question, answers, match_NO } = await getQuestion(game_id);
    answers.push(input); // add response to outdated array
    shuffleArray(answers);
    socketIO.emit('player-answered-' + game_id, question, answers);
    const playerNo = (match_NO % 2 == 0) ? 2 : 1 // who's turn it is

    if (input == 'timed out') {
        guessedAnswer(game_id, playerNo, 'timed out');
    } else {
        // countdown for other player to pick answer
        clearCountdown(game_id)
        countdown(20, game_id, () => {
            guessedAnswer(game_id, playerNo, 'timed out');
        });
    }
};

export async function guessedAnswer(game_id, playerNo, answer) {
    clearCountdown(game_id)
    const players = await getPlayerData(game_id);
    const matchNo = await updateGameData(game_id, 'match_NO', 1);
    const { winnerNum, winnerUsername } = await getWinner(game_id, playerNo, answer, players);
    const winScore = winnerNum + "_score";

    // update game with new score
    players[winScore] += 1;
    updatePlayerNav([players.p1_username, players.p1_score], [players.p2_username, players.p2_score]);
    await updateData('GamesTable', [players], 'game_ID', game_id);
    await updateGameData(game_id, 'round_winner', winnerUsername);

    // check for winner
    if (players[winScore] >= 3) {
        const pointDifference = Math.abs(players.p1_score - players.p2_score);
        endGame(players, winnerUsername, pointDifference, game_id);
    } else {
        socketIO.emit('next-round-' + game_id, winnerUsername);
        nextRound(game_id, matchNo);
    }
};

export async function nextRound(game_id, num) {
    const questions = await getQuestion(game_id);
    // countdown for starting next round
    countdown(4, game_id, () => {
        socketIO.emit('ready-' + game_id, num, questions);
        // countdown for player to write answer
        countdown(45, game_id, () => {
            sendAnswer(game_id, 'timed out');
        });
    });
}

function countdown(seconds, game_id, after) {
    const timers = [];
    for (let i = 0; i < seconds; i++) {
        timers.push(setTimeout(() => {
            // new timer with 1 sec delay
            socketIO.emit('countdown-' + game_id, seconds - i, seconds);
        }, (1 + i) * 1000))
    }
    timers.push(setTimeout(() => after(), seconds * 1000 + 1000));
    countdown[game_id] = timers;
}

function clearCountdown(game_id) {
    countdown[game_id].forEach(id => clearTimeout(id));
}

async function getWinner(game_id, player, ans, players) {
    const data = await fetchDataFiltered('GamesTable', 'human_responses', 'game_ID', game_id);
    const response = data[0].human_responses;
    // check if selected answer matches other user's answer
    const correct = response[response.length - 1] == ans;
    const winnerNum = correct ^ player == 1 ? "p2" : "p1";
    const winnerUsername = players[winnerNum + "_username"];
    return { winnerNum, winnerUsername };
}

export function updatePlayerNav([p1user, p1score], [p2user, p2score]) {
    const p1Info = { username: p1user, points: p1score };
    const p2Info = { username: p2user, points: p2score };
    setTimeout(() => {
        socketIO.emit('update-navbar-' + p1user, p1Info, p2Info);
        socketIO.emit('update-navbar-' + p2user, p1Info, p2Info);
    }, 100);
}

