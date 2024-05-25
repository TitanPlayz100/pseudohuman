import { queue, privateQueue, socketIO } from '../server.js';
import { fetchDataFiltered, updateData } from '../database/dbInterface.js';
import { addStat } from '../auth/useractions.js';
import { updatePlayerStatus } from './gamedata.js';
import { clearCountdown } from './gameloop.js';

export async function endGame(players, winner, pointDiff, game_id) {
    socketIO.emit('end-game-' + game_id, winner, pointDiff);

    // updating database info
    await updateData('GamesTable', [{ status: false }], 'game_ID', game_id);
    await addStat(winner, 'wins', 1);
    await addStat(players.p1_username, 'total_games', 1);
    await addStat(players.p2_username, 'total_games', 1);
    updatePlayerStatus(players.p1_username, false);
    updatePlayerStatus(players.p2_username, false);
    console.info('Game ' + game_id + ' ended');
}

export async function disconnectGame(username) {
    // remove player from queue
    spliceQueue(username);
    splicePrivateQueue(username);
    updatePlayerStatus(username, false);

    // find other user
    const data = await getOtherUser(username);
    if (data == null) return;
    const [otherUser, game_id] = data;

    // end currently running game
    socketIO.emit('end-game-dc-' + username);
    socketIO.emit('end-game-dc-' + otherUser);
    spliceQueue(otherUser);
    updatePlayerStatus(otherUser, false);
    updateData('GamesTable', [{ status: false }], 'game_ID', game_id);
    clearCountdown(game_id);
    console.info('Game ' + game_id + ' ended');
}

function spliceQueue(username) {
    const ind = queue.indexOf(username);
    if (ind == -1) return;
    queue.splice(ind, 1);
}

function splicePrivateQueue(username) {
    // get index of username
    let index = null;
    privateQueue.forEach((info, idx) => {
        if (info.player1 == username) {
            index = idx;
        }
    });
    if (index == null) return;
    privateQueue.splice(index, 1);
}

export function splicePrivateQueueID(gameid) {
    // get index of username
    let index = null;
    privateQueue.forEach((info, idx) => {
        if (info.game_id == gameid) {
            index = idx;
        }
    });
    if (index == null) return null;
    const info = privateQueue.splice(index, 1);
    return info[0];
}

async function getOtherUser(username) {
    // get all games with status true and username in it
    const running = await fetchDataFiltered('GamesTable', 'p1_username,p2_username,game_ID', 'status', true);
    if (running.length < 1) return null;

    for (let i = 0; i < running.length; i++) {
        const p1 = running[i].p1_username;
        const p2 = running[i].p2_username;
        const game_id = running[i].game_ID;

        if (p1 == username) return [p2, game_id];
        if (p2 == username) return [p1, game_id];
    }

    return null;
}
