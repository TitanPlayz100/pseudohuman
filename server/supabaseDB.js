import env from "dotenv";
import { compare, hash } from 'bcrypt';

env.config();
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// DB
async function fetchData(table, columns) {
    const { data, error } = await supabase
        .from(table)
        .select(columns)

    if (error) { console.error(error); return false; }
    return data;
}

async function fetchDataFiltered(table, columns, filterColumn, filter) {
    const { data, error } = await supabase
        .from(table)
        .select(columns)
        .eq(filterColumn, filter)

    if (error) { console.error(error); return false; }
    return data;
}

async function insertData(table, items) {
    const { error } = await supabase
        .from(table)
        .insert(items)
        .select()

    if (error) { console.error(error); return false; }
    return true;
}

async function updateData(table, items, column, filter) {
    const { error } = await supabase
        .from(table)
        .update(items)
        .eq(column, filter)
        .select()

    if (error) { console.error(error); return false; }
    return true;
}

// PROMPTS
export async function getRandomPrompt() {
    const questions = await fetchData('PromptsTable', '*')
    if (!questions) return false;
    const { question, ai_answers, user_answers } = questions[Math.floor(Math.random() * questions.length)]
    return [question, ai_answers, user_answers]
}

export async function addNewQuestion(question, ai_answers, user_answers) {
    return await insertData('PromptsTable', [{ question, ai_answers, user_answers }])
}

export async function addAnswer(question, ai_answers_new, user_answers_new) {
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question)
    if (!data) return false;
    let { ai_answers, user_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new]
    user_answers = [...user_answers, ...user_answers_new]
    const response = await updateData('PromptsTable', [{ ai_answers }], 'question', question)
    const response2 = await updateData('PromptsTable', [{ user_answers }], 'question', question)
    return [response, response2]
}

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