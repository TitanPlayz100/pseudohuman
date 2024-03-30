import { checkUsername, checkPassword, registerUser, addStat, getStat } from "./useractions.js";

export async function check_username(req, res) {
    const username = req.body.username;
    const valid = await checkUsername(username);
    res.send({ valid });
}

export async function check_password(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const valid = await checkPassword(username, password);
    res.send({ valid });
}

export async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const processed = await registerUser(username, password);
    res.send({ processed });
}

export async function change_stat(req, res) {
    const username = req.body.username;
    const stat = req.body.stat;
    const value = req.body.value;
    const processed = await addStat(username, stat, value);
    res.send({ processed });
}

export async function get_stat(req, res) {
    const username = req.body.username;
    const stat = req.body.stat;
    const processed = await getStat(username, stat);
    res.send({ processed });
}
