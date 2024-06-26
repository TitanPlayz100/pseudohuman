import { fetchDataCaseInsensitive, fetchDataFiltered, updateData } from '../database/dbInterface.js';

export async function getQuestion(game_id) {
    const game = await fetchDataFiltered('GamesTable', 'match_NO,questions', 'game_ID', game_id);
    const { questions, match_NO } = game[0];

    // gets the next question based on match_NO
    const question = questions[match_NO - 1].question;
    const answers = questions[match_NO - 1].ai;
    return { question, answers, match_NO };
}

export async function getPlayerData(game_id) {
    const game = await fetchDataFiltered('GamesTable', 'p1_username,p2_username,p1_score,p2_score', 'game_ID', game_id);
    const { p1_username, p2_username, p1_score, p2_score } = game[0];
    return { p1_username, p2_username, p1_score, p2_score };
}

export async function updatePlayerData(info, game_id) {
    await updateData('GamesTable', info, 'game_ID', game_id);
}

export async function updateGameData(game_id, name, newData) {
    let data = (await fetchDataFiltered('GamesTable', name, 'game_ID', game_id))[0][name];
    if (data == null) data = [];
    const newObj = {};

    // merges new data with current data
    // both round_winner and human_responses are arrays, use array merging
    switch (name) {
        case 'round_winner':
        case 'human_responses':
            newObj[name] = [...data, newData];
            break;
        default:
            newObj[name] = data + newData;
            break;
    }

    await updateData('GamesTable', [newObj], 'game_ID', game_id);
    return newObj[name];
}

export async function getWinnerData(game_id) {
    const data = await fetchDataFiltered('GamesTable', 'human_responses', 'game_ID', game_id);
    const response = data[0].human_responses;
    return response[response.length - 1];
}

export async function getPlayerStatus(username) {
    const data = await fetchDataCaseInsensitive('UserTable', 'isPlaying', 'username', username);
    return data[0].isPlaying;
}

export async function updatePlayerStatus(username, newState) {
    await updateData('UserTable', [{ isPlaying: newState }], 'username', username);
}

export async function getAbilityCounts(game_id) {
    const data = await fetchDataFiltered('GamesTable', 'p1_abilities,p2_abilities', 'game_ID', game_id);
    const { p1_abilities, p2_abilities } = data[0];
    return { p1_abilities, p2_abilities };
}

export async function setAbilityCount(game_id, name, count) {
    const newObj = {};
    newObj[name] = count;
    await updateData('GamesTable', [newObj], 'game_ID', game_id);
}