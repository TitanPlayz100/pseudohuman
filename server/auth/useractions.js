import { fetchDataCaseInsensitive, insertData, updateData } from '../database/dbInterface.js';
import { compare, hash } from 'bcrypt';

// AUTH
export async function registerUser(username, password) {
    // hash +salt function from external library used
    const hashedPassword = await hash(password, 5);
    return await insertData('UserTable', [{ username, password: hashedPassword, wins: 0, total_games: 0 }]);
}

export async function checkUsername(username) {
    const usernames = await fetchDataCaseInsensitive('UserTable', 'username', 'username', username);
    if (!username || username.length < 1) return null;
    return usernames.length > 0;
}

export async function checkPassword(username, password) {
    const passwordStored = await fetchDataCaseInsensitive('UserTable', 'password', 'username', username);
    if (!passwordStored || passwordStored.length < 1) return null;
    return await compare(password, passwordStored[0].password);
}

export async function getStat(username, stat) {
    const data = await fetchDataCaseInsensitive('UserTable', stat, 'username', username);
    if (!data || data.length < 1) return null;
    return data[0][stat];
}

export async function addStat(username, statName, amount) {
    const current_amount = await fetchDataCaseInsensitive('UserTable', statName, 'username', username);
    if (!current_amount || current_amount.length < 1) return false;
    const new_amount = current_amount[0][statName] + amount;
    return await updateData('UserTable', [{ [statName]: new_amount }], 'username', username);
}
