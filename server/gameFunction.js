const { prompt } = require('./prompts')

function start_game(matching_users) {
    const current_game = {
        player1: {
            username: matching_users[0],
            points: 0,
        },
        player2: {
            username: matching_users[1],
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

function start_match(server, game_id, running_games) {
    server.emit('setup-' + running_games[game_id].player1.username, { playerNo: 1 })
    server.emit('setup-' + running_games[game_id].player2.username, { playerNo: 2 })
    server.emit('start-game', game_id);
    countdown(10, server, game_id, () => server.emit('ready-' + game_id, running_games[game_id].matchNo)); // change to 5 seconds
}

function next_round(server, game_id, matchNo) {
    server.emit('next-round-' + game_id, '');
    countdown(5, server, game_id, () => server.emit('ready-' + game_id, matchNo));
}

function countdown(seconds, server, game_id, after) {
    for (let i = 0; i < seconds; i++) {
        setTimeout(() => server.emit('countdown-' + game_id, seconds - i), (1 + i) * 1000);
    }
    setTimeout(() => after(), seconds * 1000 + 1000);
}

function generate_question() {
    const obj = prompt;
    const random_num = getRndInteger(0, obj.length - 1);
    const question = obj[random_num].question;
    const answers = obj[random_num].answers;
    return { question, answers };
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_answer(current_game, input) {
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

function player1WinsRound(current_game) {
    current_game.player1.points += 1;
    current_game.matchNo += 1;
    current_game.question = '';
    current_game.answers = [];
    current_game.who_scored_last = 1;
    return current_game;
}

function player2WinsRound(current_game) {
    current_game.player2.points += 1;
    current_game.matchNo += 1;
    current_game.question = '';
    current_game.answers = [];
    current_game.who_scored_last = 2;
    return current_game;
}

module.exports = { start_game, start_match, generate_question, generate_answer, next_round, player1WinsRound, player2WinsRound }