import { fetchDataFiltered, updateData } from "../database/dbInterface.js";

export async function get_question(game_id) {
    const game = await fetchDataFiltered('GamesTable', 'match_NO,questions', 'game_ID', game_id);
    const { questions, match_NO } = game[0];

    const question = questions[match_NO - 1].question;
    const answers = questions[match_NO - 1].ai;
    return { question, answers };
}

export async function get_human_response(game_id) {
    const game = await fetchDataFiltered('GamesTable', 'human_responses', 'game_ID', game_id);
    const { human_responses } = game[0];
    return human_responses;
}

export async function getPlayerData(game_id) {
    const game = await fetchDataFiltered('GamesTable', 'p1_username,p2_username,p1_score,p2_score', 'game_ID', game_id);
    const { p1_username, p2_username, p1_score, p2_score } = game[0];
    return { p1_username, p2_username, p1_score, p2_score };
}

export async function updateGameData(game_id, name, newData) {
    const data = (await fetchDataFiltered('GamesTable', name, 'game_ID', game_id))[0][name]
    const newObj = {}
    switch (name) {
        case 'human_responses': newObj[name] = [...data, newData]; break;
        default: newObj[name] = data + newData; break;
    }

    await updateData('GamesTable', [newObj], 'game_ID', game_id);
    return newObj[name];
}
