import { fetchDataFiltered, insertData, updateData } from "../database/dbInterface.js";
import { compare, hash } from 'bcrypt';

// AUTH
export async function registerUser(username, password) {
    const hashedPassword = await hash(password, 5);
    return await insertData('UserTable', [{ username, password: hashedPassword, wins: 0, total_games: 0 }])
}

export async function checkUsername(username) {
    const usernames = await fetchDataFiltered('UserTable', 'username', 'username', username)
    if (!username) return null;
    return usernames.length > 0;
}

export async function checkPassword(username, password) {
    const passwordStored = await fetchDataFiltered('UserTable', 'password', 'username', username)
    if (!passwordStored) return null;
    return await compare(password, passwordStored[0].password);
}

export async function addStat(username, statName, amount) {
    const current_amount = await fetchDataFiltered('UserTable', statName, 'username', username)
    if (current_amount == false) return false;
    const new_amount = current_amount[0][statName] + amount;
    return await updateData('UserTable', [{ [statName]: new_amount }], 'username', username)
}
