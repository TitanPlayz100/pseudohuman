const { prompt } = require('./prompts')

function initGame(players) {
    const current_game = {
        player1: {
            username: players[0],
            points: 0,
        },
        player2: {
            username: players[1],
            points: 0,
        },
        matchNo: 1,
        question: '',
        answers: [],
        correctanswer: 0,
        who_scored_last: 0,
        winner: ''
    };
    return current_game
}

function startRound(server, game_id, current_game) {
    server.emit('start-' + current_game.player1.username, game_id, 1);
    server.emit('start-' + current_game.player2.username, game_id, 2);
    countdown(10, server, game_id, () => server.emit('ready-' + game_id, current_game.matchNo));
}

function nextRound(server, game_id, matchNo) {
    server.emit('next-round-' + game_id, '');
    countdown(5, server, game_id, () => server.emit('ready-' + game_id, matchNo));
}

function countdown(seconds, server, game_id, after) {
    for (let i = 0; i < seconds; i++) {
        setTimeout(() => server.emit('countdown-' + game_id, seconds - i), (1 + i) * 1000);
    }
    setTimeout(() => after(), seconds * 1000 + 1000);
}

function getQuestion() {
    const obj = JSON.parse(JSON.stringify(prompt));
    const random_num = getRndInteger(0, obj.length - 1);
    const question = obj[random_num].question;
    const answers = obj[random_num].answers;
    return { question, answers };
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAIResponses(current_game, input) {
    current_game.answers.push(input);

    // SHUFFLE THE ANSWERS
    let unshuffled = current_game.answers;
    let shuffled = unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    current_game.answers = shuffled;

    current_game.correctanswer = current_game.answers.indexOf(input) + 1
    return current_game;
}

function playerWins(current_game, playerNo) {
    current_game["player" + playerNo].points += 1;
    current_game.matchNo += 1;
    current_game.question = '';
    current_game.answers = [];
    current_game.who_scored_last = playerNo;
    return current_game;
}

module.exports = { initGame, startRound, getQuestion, generateAIResponses, nextRound, playerWins }