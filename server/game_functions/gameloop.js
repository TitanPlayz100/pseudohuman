import shuffleArray from "shuffle-array";
import { updateData } from "../database/dbInterface.js";
import { socketIO } from "../server.js";
import { getPlayerData, get_human_response, get_question, updateGameData } from "./gamedata.js";
import { endGame } from "./end.js";

export async function sendQuestion(game_id) {
    const { question, answers } = get_question(game_id)
    socketIO.emit('return-question-' + game_id, question, answers);
};

export async function sendAnswer(game_id, input) {
    // set answer in database
    updateGameData(game_id, 'human_responses', input);

    // send answer and input in random order
    let { question, answers } = await get_question(game_id);
    answers.push(input);
    shuffleArray(answers);
    socketIO.emit('player-answered-' + game_id, question, answers);
};

export async function guessedAnswer(game_id, playerNo, selectedAnswer) {
    // get game info
    const responses = await get_human_response(game_id);
    const players = await getPlayerData(game_id);
    const matchNo = await updateGameData(game_id, 'match_NO', 1);

    // get winner of round
    const correct = responses[responses.length - 1] == selectedAnswer;
    const winnerNum = correct ^ playerNo == 1 ? "p2" : "p1";
    const winnerUsername = players[winnerNum + "_username"]

    // update score
    players[winnerNum + "_score"] = players[winnerNum + "_score"] + 1;
    await updateData('GamesTable', [players], 'game_ID', game_id);
    const p1data = { username: players.p1_username, points: players.p1_score };
    const p2data = { username: players.p2_username, points: players.p2_score };
    socketIO.emit('update-navbar-' + players.p1_username, p1data, p2data);
    socketIO.emit('update-navbar-' + players.p2_username, p1data, p2data);

    // check if game is over
    if (players[winnerNum + "_score"] >= 3) {
        const pointDifference = Math.abs(players.p1_score - players.p2_score)
        endGame(players, winnerUsername, pointDifference, winnerNum, game_id);
        return;
    }

    // next round
    socketIO.emit('next-round-' + game_id, winnerUsername);
    const questions = await get_question(game_id)
    countdown(5, game_id, () => socketIO.emit('ready-' + game_id, matchNo, questions));
};

export function countdown(seconds, game_id, after) {
    for (let i = 0; i < seconds; i++) {
        setTimeout(() => socketIO.emit('countdown-' + game_id, seconds - i), (1 + i) * 1000);
    }
    setTimeout(() => after(), seconds * 1000 + 1000);
}