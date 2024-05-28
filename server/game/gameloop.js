import shuffleArray from 'shuffle-array';
import { updateData } from '../database/dbInterface.js';
import { countdowns, socketIO, timeToAnswer } from '../server.js';
import { getPlayerData, getQuestion, getWinnerData, updateGameData } from './gamedata.js';
import { endGame } from './end.js';

export async function sendAnswer(game_id, input, timer) {
    // save response to db
    await updateGameData(game_id, 'human_responses', input);
    timeToAnswer[game_id] = timer;

    // shuffle player and ai answers together
    let { question, answers, match_NO } = await getQuestion(game_id);
    answers.push(input);
    shuffleArray(answers);
    socketIO.emit('player-answered-' + game_id, question, answers);

    // who's turn it is
    const playerNo = match_NO % 2 == 0 ? 2 : 1;

    if (input == 'timed out') {
        guessedAnswer(game_id, playerNo, 'timed out', 20);
    } else {
        // countdown for other player to pick answer
        clearCountdown(game_id);
        countdown(20, game_id, () => {
            guessedAnswer(game_id, playerNo, 'timed out', 0);
        });
    }
}

export async function guessedAnswer(game_id, playerNo, answer, timer) {
    clearCountdown(game_id);

    const { question, answers } = await getQuestion(game_id);
    const players = await getPlayerData(game_id);
    const matchNo = await updateGameData(game_id, 'match_NO', 1);
    const { winnerNum, winnerUsername } = await getWinner(game_id, playerNo, answer, players);
    const winScore = winnerNum + '_score';

    // calculate points gained
    const timePercent = winnerNum == playerNo ? timer / 20 : timeToAnswer[game_id] / 45;
    const cost = calculateCost(question, answers, timePercent);

    // update game with new score
    players[winScore] += cost;
    updatePlayerNav([players.p1_username, players.p1_score], [players.p2_username, players.p2_score]);
    await updateData('GamesTable', [players], 'game_ID', game_id);
    await updateGameData(game_id, 'round_winner', winnerUsername);

    // check for winner
    if (players[winScore] >= 3000 || matchNo > 6) {
        // calculate point difference
        const pointDifference = Math.abs(players.p1_score - players.p2_score);
        endGame(players, winnerUsername, pointDifference, game_id);
    } else {
        // next round
        socketIO.emit('next-round-' + game_id, winnerUsername, cost);
        nextRound(game_id, matchNo);
    }
}

export async function nextRound(game_id, num) {
    const questions = await getQuestion(game_id);

    // countdown for starting next round
    countdown(5, game_id, () => {
        socketIO.emit('ready-' + game_id, num, questions);

        // countdown for player to write answer
        countdown(45, game_id, () => {
            sendAnswer(game_id, 'timed out', 0);
        });
    });
}

function countdown(seconds, game_id, after) {
    const timers = [];

    // generate new timers with +1 second delay
    for (let i = 0; i < seconds; i++) {
        // stores each timer to array
        timers.push(
            setTimeout(() => {
                // new timer with 1 sec delay
                socketIO.emit('countdown-' + game_id, seconds - i, seconds);
            }, (1 + i) * 1000)
        );
    }

    // command to run after all timers are done
    timers.push(setTimeout(() => after(), (seconds + 1) * 1000));

    // stores array of timer to global array for later use
    countdowns[game_id] = timers;
}

export function clearCountdown(game_id) {
    // finds array of timers and ends them
    countdowns[game_id].forEach(id => clearTimeout(id));
    countdowns[game_id] = [];
}

async function getWinner(game_id, player, ans, players) {
    const response = await getWinnerData(game_id);

    // determine who won based on response and player number
    const winnerNum = (response == ans) ^ (player == 1) ? 'p2' : 'p1';
    const winnerUsername = players[winnerNum + '_username'];
    return { winnerNum, winnerUsername };
}

export function updatePlayerNav([p1user, p1score], [p2user, p2score]) {
    // formats scores to send to client
    const p1Info = { username: p1user, points: p1score };
    const p2Info = { username: p2user, points: p2score };

    setTimeout(() => {
        socketIO.emit('update-navbar-' + p1user, p1Info, p2Info);
        socketIO.emit('update-navbar-' + p2user, p1Info, p2Info);
    }, 100);
}

function calculateCost(question, answers, time) {
    // different factors in determining points gained
    let cost = 400 +
        question.split(' ').length * 20 +
        answers[0].length * 1.4 +
        answers[1].length * 1.4 +
        time * 200;

    // limit by 700 < cost < 1300
    if (cost < 700) cost = 700;
    if (cost > 1300) cost = 1300;

    return Math.round(cost);
}