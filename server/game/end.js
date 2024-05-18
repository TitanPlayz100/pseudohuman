import { queue, privateQueue, socketIO } from "../server.js";
import { fetchDataFiltered, updateData } from "../database/dbInterface.js";
import { addStat } from "../auth/useractions.js";

export async function endGame(players, winner, pointDiff, game_id) {
    await updateData('GamesTable', [{ status: false }], 'game_ID', game_id);
    socketIO.emit('end-game-' + game_id, winner, pointDiff);
    await addStat(winner, 'wins', 1);
    await addStat(players.p1_username, 'total_games', 1);
    await addStat(players.p2_username, 'total_games', 1);
    console.info('Game ' + game_id + ' ended');
}

export async function disconnectGame(username) {
    console.info(username + ' has left');
    queue.splice(queue.indexOf(username), 1);
    splicePrivateQueue(username);

    const data = await getOtherUser(username);
    if (data == null) return;
    const [otherUser, game_id] = data;

    socketIO.emit('end-game-dc-' + username);
    socketIO.emit('end-game-dc-' + otherUser);
    updateData('GamesTable', [{ status: false }], 'game_ID', game_id);
};

function splicePrivateQueue(username) {
    let index = null;
    privateQueue.forEach((info, idx) => {
        if (info.player1 == username) {
            index = idx;
        }
    })
    if (index == null) return;
    privateQueue.splice(index, 1);
}

export function splicePrivateQueueID(gameid) {
    let index = null;
    privateQueue.forEach((info, idx) => {
        if (info.game_id == gameid) {
            index = idx;
        }
    })
    if (index == null) return null;
    const info = privateQueue.splice(index, 1);
    return info[0];
}

async function getOtherUser(username) {
    const running = await fetchDataFiltered('GamesTable', 'p1_username,p2_username,game_ID', 'status', true);
    if (running.length < 1) return null;

    const p1 = running[0].p1_username;
    const p2 = running[0].p2_username;
    const game_id = running[0].game_ID;

    if (p1 == username) return [p2, game_id];
    if (p2 == username) return [p1, game_id];
}

